---
title: Remove Tracked Files From Git
date: "2020-01-11"
template: "til"
draft: false
slug: "remove-tracked-file-from-git"
category: ""
tags:
  - "git"
---

This has happened to me multiple times, especially with the dreaded `.DS_Store` file. I'll stage all
of the files that have changed (`git add .`) and, without noticing, also add in the `.DS_Store`. 
Adding this file to `.gitignore` will still cause it to be tracked because git cached it. 
You can stop these kinds of files from being tracked with the following command: 

```
git rm --cached <file>
```

