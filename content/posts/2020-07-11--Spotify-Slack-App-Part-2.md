---
title: Creating an App with the Spotify API and Slack API Part 2
date: "2020-07-11"
template: "post"
draft: false
slug: "slack-spotify-api-app-part-2"
tags:
  - "javascript"
  - "app"
description: "Building an app to automatically add songs to a Spotify playlist from a Slack message"
socialImage: "/profile-photo.jpg"
---

![Spotify Slack App Demo](/media/posts/spotify-slack-app/demo.gif)

This is Part 2 of my guide to building an app using the Spotify API and Slack API. If you haven't read Part 1 yet, read it [here](https://www.sunnymistry.com/posts/slack-spotify-api-app-part-1). This app lets you create Spotify playlists directly from Slack and add any songs to that playlist when it is sent as messages in Slack.

## Table of Contents

- [Creating a Slack App](#creating-a-slack-app)
  - [Slash Commands](#slash-commands)
  - [Event Subscriptions](#event-subscriptions)
  - [Add the App to Slack](#add-the-app-to-slack)
- [Creating The Slash Command Server](#creating-the-slash-command-server)
- [Creating The Event Subscription Server](#creating-the-event-subscriptions-server)
- [Summary](#summary)
- [Resources](#Resources)

## Creating a Slack App

The first step is to sign up for [Slack](https://slack.com/) and visit the [Slack Apps](https://api.slack.com/apps) page. Click `Create New App` and give it a name.

_Note: The Slack Apps website and the Slack App might have changed since this article was written._

Once the app is created we'll need to grab the `Signing Secret` from the `App Credentials` section. When requests are made from Slack to our server, we need to ensure that not only did the request actually came from Slack, but from our Slack app. Add the secret to either your `.zshrc`, `.bashrc` or `.env.development` file.

There are two features we need to add to the app: `Slash Commands` and `Event Subscriptions`.

### Slash Commands

Find the section for Slash Commands on the Slack apps page and create a new one. For the command, enter `/create-playlist`. The request URL is going to be an `ngrok` URL. See [Part 1](https://www.sunnymistry.com/posts/slack-spotify-api-app-part-1#ngrok) for details on setting up `ngrok`. Add the `ngrok` URL to this form when we set up the server later in this article.

```
https://123abcd.ngrok.io/command

```

Add a description and a hint. For the hint you can enter `name, description` because that will be the format of how the request will be sent.

### Event Subscriptions

Find the section for Event Subscriptions on the Slack apps page and turn it on. Add the `ngrok` URL to the Request URL form field once we create a server later in this post.

We also need to add a bot event. Create a new bot event under the `Subscribe to bot events` section. The event we need to listen to is `message.channels`

### Add the App to Slack

Go to the Slack channel you want to add the app to. Click `Details` and under `More` click `Add apps`. Select your app and give it permission to read messages.

## Creating The Slash Command Server

First, install the necessary dependencies:

```bash
yarn add @slack/events-api body-parser
```

In a new file `src/slack/index.js` add the following:

```js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const portCommands = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(portCommands, () => {
  console.log(`Slack Server started. Listening for slash commands on port ${portCommands}`);
});
```

Here we have an express server running on port 5000.

To start the server use `nodemon` and use `ngrok` to tunnel the request

```bash
nodemon src/slack/index.js

ngrok http 5000
```

Add this URL to the slash command configuration we setup in the first section. The URL should look like:

```bash
https://123abcd.ngrok.io/command
```

Now let's write the code to handle the request:

```js
app.post("/command", async (req, res) => {
  try {
    const { text } = req.body;
    const [name, description] = text.split(",");

    const response = await axios({
      url: `${SPOTIFY_SERVER_URL}/playlists`,
      method: "post",
      data: {
        name,
        description,
      },
    });

    console.log("Successfully created playlist", response);

    const responseJSON = JSON.stringify({
      response_type: "in_channel",
      text: `Here\'s your playlist!\n ${response.data}`,
    });

    res.setHeader("Content-Type", "application/json");
    res.send(responseJSON);
  } catch (error) {
    console.log("Error creating playlist", error);

    res.send("Whoops! Something went wrong creating a playlist", error);
  }
});
```

Let's break down this code line by line. When a `POST` request is made to the `/command` route, we begin by extracting our the message `text` from the request body `req.body`. We then split the text by a comma because our message format is `[playlist name] , [playlist description]`. Now that we have extracted out the name and description we can make a `POST` request to the Spotify server `/playlist` route to create it. Once that request completes, we send back the playlist URL to the slack channel.

When we execute the slash command, Slack will make a `POST` request to our server running on port 5000 at the `/command` path. To execute the command enter this into the Slack chat:

```
/create-playlist my first playlist, made using the Slack & Spotify APIs!
```

The body of the request to our server will contain the text after `/create-playlist`.

## Creating The Event Subscription Server

To keep things simple, we'll add the event subscription server in the same file. We could have just used one server to handle both requests (message events and slash commands). However to make the code easier to read and maintain I made two separate servers.

```js
const { createEventAdapter } = require("@slack/events-api");

const signingSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(signingSecret);
const portEvents = 4000;

(async () => {
  await slackEvents.start(portEvents);
  console.log(`Slack Server started. Listening for message events on port ${portEvents}`);
})();
```

The `@slack/events-api` library makes it easy to connect to events that the Slack app listens to. First, we import the `createEventAdapter` from the library and pass in the signing secret to initialize it. This is crucial because we need to verify that the request we receive is legitimate.

Next we run an immediately invoked function to start the server on port 4000. Now that the server is setup we need to listen for message events. The `@slack/events-api` library makes this super simple for us:

```js
const axios = require("axios");

slackEvents.on("message", async (event) => {
  if (event.text && event.text.includes("https://open.spotify.com/track")) {
    try {
      const response = await axios({
        url: `${SPOTIFY_SERVER_URL}/playlist`,
        method: "post",
        data: {
          song: event.text,
        },
      });

      console.log("Successfully added song", response.status, response.statusText);
    } catch (error) {
      console.log("Error adding song", error);
    }
  }
});
```

The code above listens for the `message` event from Slack. If the message body contains a Spotify URL then it makes a request to the Spotify server we created in [Part 1](https://www.sunnymistry.com/posts/slack-spotify-api-app-part-1#add-songs-to-the-playlist).

Restart the server and run `ngrok` on both ports:

```bash
nodemon src/slack/index.js

ngrok http 4000
ngrok http 5000
```

Copy the `ngrok` URL for port 4000 and add it to the Slack app Event Subscriptions configuration we set up in the previous section.

If you have your Spotify app running and the Slack app added to a channel, sending a Spotify URL should now add the song to a playlist.

### Summary

That's it! We have seen how we can set up a Slack app which listens slash commands and event subscriptions. Using the command we were able to hit a Spotify server we wrote previously to create a playlist. Our Slack server listens to messages so when a Spotify song gets messaged we can hit our Spotify server again with a request to add that song to the playlist.

### Resources

[Slack](https://slack.com/)

[Slack Apps](https://api.slack.com/apps)

[Slack API Node SDK](https://github.com/slackapi/node-slack-sdk/)
