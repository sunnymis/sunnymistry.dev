---
title: Element.scrollIntoView()
date: "2020-03-13"
template: "til"
draft: false
slug: "element-scroll-into-view"
tags:
  - "javascript"
---

`scrollIntoView()` is a function that exists on
[Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) [Elements](https://developer.mozilla.org/en-US/docs/Web/API/Element).
It provides the ability to scroll to the provided element's parent container. 


```javascript
let elem = document.getElementById('title');

elem.scrollIntoView();
```

It takes in a few optional parameters that you can use to configure the scroll alignment and transition. 

```javascript
elem.scrollIntoView({ behavior: 'smooth' });
```

[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)

