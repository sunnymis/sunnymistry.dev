---
title: Stack OnTop Chrome Extension
date: "2020-07-14"
template: "post"
draft: false
slug: "stack-ontop"
tags:
  - "javascript"
  - "app"
description: "Stop wasting time scrolling to the accepted Stack Overflow answer. See it instantly at the top of the page"
socialImage: "/profile-photo.jpg"
---

![Stack OnTop Logo](/media/posts/stack-ontop/stack-ontop-logo.png)

Stack OnTop is a Chrome extension that helps you quickly find the answers you're looking for. How many times have you clicked a Stack Overflow link, skipped passed the question, and viewed the top, most upvoted question? Think about how much time you're wasting scrolling halfway through the page. Stack OnTop places the accepted answer (or most voted answer if there is no accepted answer) at the top of the page.

![Stack OnTop Logo](/media/posts/stack-ontop/side-by-side-demo.png)

## How does it work?

```javascript
const mainBar = document.querySelector("#mainbar");
const question = document.querySelector(".question");
const answer = document.querySelector(".answer");

if (answer) {
  mainBar.insertBefore(answer, question);
}
```

And...thats it! It's only a few lines of JavaScript. The `mainBar` element is the center column on the page that contains all of the questions and answers. The `question` element is the container with the question. The `answer` element is a bit more complicated. The page can have multiple answers, therefore there can be multiple div elements with the class `.answer` on them. Since Stack Overflow already sorts by accepted answer, then by most voted answer, `querySelector('.answer')` will return the first DOM element which is the correct one we want.

The HTML DOM [insertBefore](https://www.w3schools.com/jsref/met_node_insertbefore.asp) method allows us to insert an HTML element as a child node before a specific node.

![Stack Overflow HTML Code](/media/posts/stack-ontop/stack-overflow-html.png)

Looking at Stack Overflow's HTML code above, we can see that the container element is `mainbar`, it has a `question` div and multiple `answer` divs. In the JavaScript code above, we called `insertBefore` on the `mainbar` container element and inserted the `answer` element before the `question` element.

## How do you use it?

As of writing, this extension is not in the Chrome Web Store. However, you can download the source code and import the extension into Chrome.

1. Clone or download the project from GitHub

```bash
git clone git@github.com:sunnymis/stack-ontop.git
```

2. Open Google Chrome and navigate to `chrome://extensions/`

3. Check the `Developer Mode` checkbox at the top right of the page

4. Click `Load unpacked` button

5. Select the `stack-ontop` directory that you just downloaded in step 1

6. Go to a Stack Overflow post!

## Source Code

Find the source code here:

https://github.com/sunnymis/stack-ontop
