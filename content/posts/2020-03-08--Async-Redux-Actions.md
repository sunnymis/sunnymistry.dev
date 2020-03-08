---
title: Async Redux Actions
date: "2020-03-08"
template: "post"
draft: false
slug: "async-redux-actions"
tags:
  - "Javascript"
  - "Redux"
description: "Using asynchronous Redux actions"
socialImage: "/profile-photo.jpg"
---

When building an application with [Redux](https://redux.js.org/) there are 3 main parts 
you have to implement: `actions`, `reducers`, and a `store`. For example, clicking a button might fire an 
action that contains a specific type and some data. The reducer analyzes the type of action 
it received and based off that it returns the new state of the application. The state of an 
application is saved in the store. This is redux in a nutshell. Usually in many tutorials
and basic applications everything happens synchronously. What I mean by that is - data is 
being passed around and updated almost instantaneously in the application because there are 
no network requests to wait for. 

## Synchronous Actions

First, let's go through a basic example of using redux with synchronous actions. I usually
begin with creating an action creator:

```js
export const addRestaurant = (payload) => ({
  type: ADD_RESTAURANT,
  payload,
}); 
```

Hypothetically there could be a form in which clicking the submit button could dispatch the event:

```js
dispatch(addRestaurant({ name: 'Rubirosa' }));
```

The reducer receives the dispatched action and returns a new state for the application:

```js
export const restaurantReducer = (state, action) => {
  switch(action.type) {
    case ADD_RESTAURANT:
      return {
        restaurants: [
          ...state.restaurants,
          action.payload,
        ]
      }
    default:
      return state;
  }
}
```

When the reducer sees the action `ADD_RESTAURANT` it creates a new state object where
the `restaurants` array contains all the previous restaurants plus the new one. This
is great but what if we wanted to save the restaurant to a database? We would have to
make a network request and wait for that data to come back before updating our app state.


## Asynchronous Actions

To handle asynchronous actions we can use a library called
[redux-thunk](https://github.com/reduxjs/redux-thunk). This library provides middleware 
for our redux application to enable it to handle asynchronous logic. Before we continue 
here are some definitions:

* _thunk_ - a function that is returned by another function 
* _middleware_ - code that we can run to interact with dispatched actions before they hit
the reducer. It sits in the middle of the dispatcher and the reducer. 

### Setting up redux-thunk

First install the package

```sh
yarn add redux-thunk
```

Import them where you created your store and add it to the store

```js
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

... 

export default createStore(reducers, applyMiddleware(thunkMiddleware));
```

Now you're all set! `thunkMiddleware` allows us to dispatch thunks. What that means is we can
dispatch a function instead of just action creators. The function that we dispatch will contain
all the asynchronous behavior we want to do. When the thunk gets dispatched, `thunkMiddleware`
will receive the function and execute it before the event gets to the reducer. Once the async
request is complete we can dispatch a synchronous action to the reducer to update our state.

In the following example I'm going to be using [Firebase](https://firebase.google.com/) but 
you can use any database or network request. 

Let's start off by creating a thunk: 

```js
const addRestaurant = (restaurant) => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('restaurants/');
      .add({
        ...restaurant
      })
      .then(result => {
        dispatch(receivedRestaurant(restaurant));
      });
  };
};
```

There's a lot going on here so let's break it down. 

* We create a thunk called `addRestaurant`. It takes in a restaurant object and returns a function that
accepts a dispatch function. `thunkMiddleware` will call this returned function and pass in a dispatch
from the store. 
* `firebase.firestore().collection().add()` is how you add an entry into a firebase document
* Once the `.add()` is completed we dispatch the action `receivedRestaurant(restaurant)`
* Note: we can also add a `.catch` after the `.then` and dispatch an error action if we wanted to


Now let's update the synchronous `ADD_RESTAURANT` action we wrote before to be `RECEIVED_RESTAURANT`:

```js
export const receivedRestaurant = (payload) => ({
  type: RECEIVED_RESTAURANT,
  payload,
}); 
```

 Similarly we can now update the `restaurantReducer` we wrote before to handle the new action:

```js
export const restaurantReducer = (state, action) => {
  switch(action.type) {
    case RECEIVED_RESTAURANT:
      return {
        restaurants: [
          ...state.restaurants,
          action.payload,
        ]
      }
    default:
      return state;
  }
}
```

In the hypothetical form submit mentioned earlier it dispatches `addRestaurant` already so we should be good to go.
Everything is wired up so we can make network requests and update our local state to reflect any changes in the UI. 

## Summary 

By default redux stores can only dispatch action objects and perform events synchronously. By using `redux-thunk` the store
can dispatch functions that `thunkMiddleware` executes. These thunk functions can make async network requests and on completion
or error they can dispatch synchronous events to the reducer. The reducer finally updates the state of the app. 

## Helpful Resources
[Redux Async Actions](https://redux.js.org/advanced/async-actions/)

[redux-thunk](https://github.com/reduxjs/redux-thunk)
