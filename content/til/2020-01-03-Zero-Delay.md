---
title: Zero Delays
date: "2020-01-03"
template: "til"
draft: false
slug: "zero-delays"
category: ""
tags:
  - "javascript"
---

```js
const zeroDelayExample = () => {
  console.log('This will come first');
  
  setTimeout(() => {
    console.log('Zero delay will come third');
  }, 0);

  console.log('This will come second');
}  
```

In the above example, a `setTimeout` doesn't function the way it normally does. That is, it won't execute after 0 milliseconds (or immediately). 

The `0` parameter tells `setTimeout` to only execute after all of the messages in the event loop's queue are finished. 

In this case when `zeroDelayExample` gets called, the first `console.log` will be called, the `setTimeout` will wait for all other events to finish, then the third `console.log` will be called. Finally, the `setTimeout` callback
gets fired. 
