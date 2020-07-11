---
title: Creating an App with the Spotify API and Slack API Part 1
date: "2020-07-05"
template: "post"
draft: false
slug: "slack-spotify-api-app-part-1"
tags:
  - "javascript"
  - "app"
description: "Building an app to automatically add songs to a Spotify playlist from a Slack message"
socialImage: "/profile-photo.jpg"
---

![Spotify Slack App Demo](/media/posts/spotify-slack-app/demo.gif)

This is Part 1 of my guide to building an app using the Spotify API and Slack API. This app lets you create Spotify playlists directly from Slack and add any songs to that playlist when it is sent as messages in Slack.

The tech stack:

- Spotify API
- Slack API
- Node.js
- Express
- Redis

## Table of Contents

- [Creating a Simple Server](#creating-a-simple-server)
- [ngrok](#ngrok)
- [Spotify](#spotify)
  - [Initial Setup](#initial-setup)
  - [Creating a Redirect URI](#creating-a-redirect-uri)
  - [Authentication](#authentication)
  - [Redis](#redis)
  - [Wrapping up Authentication](#wrapping-up-authentication)
  - [Creating a Playlist](#creating-a-playlist)
  - [Add Songs to the Playlist](#add-songs-to-the-playlist)
  - [Refresh Tokens](#refresh-tokens)
- [Summary](#summary)
- [Resources](#Resources)

## Creating a Simple Server

Create a new project directory and inside it add the following files `src/index.js` and `package.json` . Install the following dependencies with `yarn`

```bash
yarn add -D nodemon

yarn add axios express redis
```

We will learn why we need each dependency throughout this guide.

The following code creates a server.

```js
const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server started. Listening on http://localhost:${port}`);
});

app.get("/authorized", (req, res) => console.log(req));
```

[express](https://expressjs.com/) is a popular web framework for [Node.js](https://nodejs.org/) applications. It helps us spin up a simple server and endpoints which listen for incoming requests. In this case we started a local server on port 3000. We set up a `GET` route at `/authorized` which will be used by the Spotify API in the following section. When Spotify sends us a request at that URL, we will log the request details into the console.

The dev dependency `nodemon`is a package that will make development faster by restarting your local development servers whenever it detects any file changes. Run your newly created development server with `nodemon` (assuming you put the code in `src/index.js`):

```bash
nodemon src/index.js
```

## ngrok

[ngrok](https://ngrok.com/) is a tool that enables us to create a secure, public facing URL for our local servers. When interacting with APIs which need to send data to your server, the APIs won't be able to connect to servers running locally on your own computer. ngrok will tunnel requests to a public URL to your local computer so the APIs can send you data.

Navigate to the directory ngrok was saved to and run it with the following:

```js
./ngrok http 3000
```

The url that looks like `https://randomNumbersAndLetters.ngrok.io` is your new publicly facing URL. Requests sent to this URL will get sent to the server running on `http://localhost:3000`. Keep the ngrok server running, we will need the URL when setting up Spotify.

## Spotify

### Initial Setup

To start building apps with the Spotify API, you will need to create a [Spotify account](https://www.spotify.com/). Use your login to access the [Developer Dashboard](https://developer.spotify.com/dashboard/) and follow the instructions to create a new app. Once it's created find the `Client ID` and `Client Secret`. We will need these keys to use the API so save them in either the `.bashrc`, `.zshrc` or `.env.development` file.

### Creating a Redirect URI

When you authenticate with the Spotify API, Spotify will send a request to whatever server you want. The request will contain information such as access tokens, refresh tokens and permission scopes.

In the Dashboard, click `Edit Setting` and locate the field asking for a `Redirect URI`. Add the `ngrok` URL we created in the previous section with `/authorized` appended to the end.

```bash
https://123abcd.ngrok.io/authorized
```

Great! Now Spotify can send us a request when we authenticate with them.

### Authentication

Before we can do anything with the API (create playlists, add songs, get artists etc.) we need to authenticate with our Spotify account. For a more in depth look at the flow for authenticating read the [Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/).

The first step is to generate a Spotify authorization URL that we can navigate to in our browsers and sign in.

The URL we need to navigate to is `https://accounts.spotify.com/authorize`. But it requires some query parameters. See the function below which generates this URL

```js
const getAuthorizationUrl = () => {
  const params = {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: 'https://123abcd.ngrok.io/authorized',
    scope: "user-read-private playlist-modify-private playlist-read-collaborative";,
  };

  const encodedQueryParams = encodeQueryParams(params);

  return `https://accounts.spotify.com/authorize?${encodedQueryParams}`;
};

const encodeQueryParams = (obj) => {
  let str = [];
  for (let key in obj)
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
    }
  return str.join("&");
};
```

- `client_id` is the Spotify Client ID from their Developer Dashboard
- `response_type` is always set to "code"
- `redirect_uri` is the ngrok Redirect URI we set up earlier
- `scope` is a string with space separated scopes. These are the permissions that the Spotify App will have. A list of all scopes can be found [here](https://developer.spotify.com/documentation/general/guides/scopes/)

The `encodeQueryParams` method is a simple helper method used to take the `params` object and convert it into URI encoded query parameters. If in the future we need to update the query parameters or add additional ones, all we need to do is edit the `params` object instead of trying to modify a complex URL string.

This function should return a url that looks like

```
https://accounts.spotify.com/authorize?client_id=yourClientId&response_type=code&redirect_uri=https%3A%2F%2F123abcdef.ngrok.io%2Fauthorized&scope=user-read-private%20playlist-modify-private%20playlist-read-collaborative&show_dialog=false
```

#### Retrieve Access Token

Navigate to this URL and follow the steps to authorize your Spotify account. Once the authorization is complete, a request will be made to the local server running on port 3000 and the request should be logged to the console. In this request, there is an authorization code under `request.query.code`. We need to use this to exchange it for an access token.

To retrieve the access token we need to make a request to the `https://accounts.spotify.com/api/token` endpoint. See the function below:

```js
const getAccessToken = (requestCode) => {
  return axios({
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    params: {
      grant_type: "authorization_code",
      code: requestCode,
      redirect_uri: "https://123abcd.ngrok.io/authorized",
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${encodeAuthorizationToBase64()}`,
    },
  });
};
```

Pass in the authorization code that was returned into this `getAccessToken` function. The `Authorization` header contains a Base64 encoded string comprised of the Spotify `Client ID` and `Client Secret`, separated by a `:`

```js
const encodeAuthorizationToBase64 = () => {
  const stringToEncode = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;

  return Buffer.from(stringToEncode).toString("base64");
};
```

At this point your code should look something similar to this:

```js
app.get("/authorized", authCallback);

const authCallback = async (req, res) => {
  const requestCode = req.query.code;
  const response = await getAccessToken(requestCode);

  const accessToken = response.data.access_token;
};
```

After authenticating with Spotify and making the request to `/api/token`, you should receive an access token in the response.

We need a place where we can store this key because it will be used in every request we make to Spotify. Saving it in a global variable wouldn't work because we restart our server every time the file changes. A simple, easy to use, key-value data store is [Redis](https://redis.io/).

### Redis

We already installed the `redis` dependency in the beginning of the guide. To set it up add the following to `src/redis/index.js`

```js
const redis = require("redis");
const client = redis.createClient();
```

...and thats it! With the `client` we can get and set keys. However, the redis API is entirely asynchronous. So to set a key it would look something like:

```js
client.get("key", () => {
  /* callback function */
});
```

To make it simpler to work with we can wrap the client methods with promises. See the updated code below

```js
const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient();

const getValue = promisify(client.get).bind(client);
const setValue = promisify(client.set).bind(client);
```

The above code wraps the redis client's `get` and `set` methods with a promise using `promisify`. Now we can read and write values to redis easily in a single line.

```js
await setValue("accessToken", accessToken)

const token = await getValue("accessToken)

console.log("token", token);
```

### Wrapping up Authentication

Back to our authentication code we can now save the access token into redis for safe keeping.

```js
const response = await getAccessToken(requestCode);
const accessToken = response.data.access_token;

await setValue("accessToken", accessToken);
```

Now that we have our token saved in redis we can begin using the Spotify API to make whatever calls we want!

### Creating a Playlist

```js
const createPlaylist = async (options) => {
  const accessToken = await getValue("accessToken");

  return axios({
    url: `https://api.spotify.com/v1/users/${SPOTIFY_USER}/playlists`,
    method: "post",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    data: {
      public: false,
      collaborative: true,
      ...options,
    },
  });
};
```

The `createPlaylist` function above uses [axios](https://github.com/axios/axios) to make a `POST` request to Spotify to create a playlist. The access token we retrieved from the previous section is used in the `Authorization` header. There are a number of parameters we can pass into the request to configure the playlist. In this example the `public` and `collaborative` flags are defaulted but can always he overridden. Check the [Spotify Web API Reference](<[https://developer.spotify.com/documentation/web-api/reference/playlists/create-playlist/](https://developer.spotify.com/documentation/web-api/reference/playlists/create-playlist/)>) for more details on creating a playlist.

This function above is asynchronous. We can use `await` to wait for the response to come back.

```js
try {
  const response = await spotify.createPlaylist(req.body);
  const playlistId = response.data.id;
  const playlistUrl = response.data.external_urls.spotify

  await setValue("currentPlaylistId", playlistId;

  res.send(playlistUrl);
} catch (error) {
  console.log("Error creating playlist: ", error);

  res.status(500).send("Error creating playlist");
}
```

From the response we can get the the playlist URL, Id and a number of other things. In this example we save the current playlist ID to redis so we can easily access this playlist later. Once the playlist is created successfully, we can send back the URL of it so we can navigate to it.

### Add Songs to the Playlist

In a similar fashion, we can add songs to the playlist we just created. First we need to create a function that makes the `POST` request to Spotify. See the [Spotify Web API Reference](<[https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/](https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/)>) for more details on adding a song.

```js
const addSongToPlaylist = async (songs) => {
  const accessToken = await getValue("accessToken");
  const currentPlaylistId = await getValue("currentPlaylistId");

  return axios({
    url: `https://api.spotify.com/v1/playlists/${currentPlaylistId}/tracks`,
    method: "post",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    data: {
      uris: songs,
    },
  });
};
```

The body of the request is a `data` object containing an array of song URIs. Then we can call this function with the songs we want to add:

```js
app.post("/playlist", () => {
  try {
    const songUri = "spotify:track:5sIx4BlfYGuZeSLF40N9GH";

    const response = await addSongToPlaylist([songUri]);

    res.send(`Successfully added song`);
  } catch (error) {
    console.log("Error adding song: ", error);

    res.status(500).send("Error adding song");
  }
}));
```

### Refresh Tokens

The access token is only available for 1 hour. After that hour, the token expires and we have to reauthenticate with Spotify by navigating to the auth URL in the browser. This can be a pain, so to get around this we can request refresh tokens. A refresh token can be sent to Spotify to obtain a brand new access token which can be used for another hour.

In the callback function for the `/authorized` endpoint we extracted the access token from the data Spotify sent us after authenticating. We can also extract the refresh token:

```js
setValue("refreshToken", response.data.refresh_token);
```

Now, we can define a function to get a new access token from the refresh token

```js
const getNewAccessTokenFromRefreshToken = async () => {
  try {
    const refreshToken = await getValue("refreshToken");

    const response = await axios({
      url: "https://accounts.spotify.com/api/token",
      method: "post",
      params: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth.encodeAuthorizationToBase64()}`,
      },
    });

    const newAccessToken = response.data.access_token;

    await setValue("accessToken", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.log("Error Getting Refreshed Access Token: ", error);
  }
};
```

This is very similar to the request we made earlier to retrieve the original access token. However, `grant_type` is now `refresh_token` and we pass in the refresh token we saved to the `refresh_token` parameter. Once the request succeeds, the new access token is available via the `response.data.access_token` field.

After an hour has passed since we authenticated in the browser, we can no longer use the access token to hit the API. Instead of writing logic to automatically make requests to refresh the token every hour, we can execute this function before making any request to Spotify. This way, no matter how much time has passed, we always ask for a brand new access token and use that to make calls to the API. This is possible because the refresh token we receive never expires.

We can update our function to add a song to the current playlist. The call to `getNewAccessTokenFromRefreshToken` will set a new value in redis for `accessToken` and then we can use that to make an API call.

```js
const addSongToPlaylist = async (songs) => {
  // This line is new
  await spotify.getNewAccessTokenFromRefreshToken();

  const accessToken = await getValue("accessToken");
  const currentPlaylistId = await getValue("currentPlaylistId");

  return axios({
    url: `https://api.spotify.com/v1/playlists/${currentPlaylistId}/tracks`,
    method: "post",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    data: {
      uris: songs,
    },
  });
};
```

## Summary

That's it! We have seen how we can set up a local server which gets pinged when we authenticate our Spotify account. We made requests to retrieve access tokens and use those tokens in requests to create playlists and add songs using the API. We used refresh tokens to receive new access tokens and prevent reauthenticating every hour.

## Resources

[Developer Dashboard](https://developer.spotify.com/dashboard/)

[Web API Reference](https://developer.spotify.com/documentation/web-api/reference/)

[Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/)
