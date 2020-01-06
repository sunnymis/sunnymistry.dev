---
title: Increase Mac Keyboard Speed
date: "2020-01-05"
template: "til"
draft: false
slug: "increase-mac-keyboard-speed"
category: ""
tags:
  - "mac"
---

First, check what your current keyboard repeat rates are with the following two commands. These values can be used to revert any changes you make.

```
defaults read -g KeyRepeat

defaults read -g InitialKeyRepeat
```

The below two commands update the default keyboard repeat rate to make it blazing fast

```
defaults write -g KeyRepeat -int 1

defaults write -g InitialKeyRepeat -int 15
```
