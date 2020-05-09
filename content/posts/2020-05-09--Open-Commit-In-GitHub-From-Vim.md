---
title: Open Commit in GitHub from Vim
date: "2020-05-09"
template: "post"
draft: false
slug: "open-commit-in-github-from-vim"
tags:
  - "vim"
  - "bash"
description: "Vim keybinding + bash script to navigate directly to a commit in GitHub from Vim"
socialImage: "/profile-photo.jpg"
---


![Open Commit from Vim](/media/posts/open-commit-in-github-from-vim/open-commit.gif)

When I'm navigating through code trying to understand what it's doing, I find myself frequently
viewing the git blame. The git blame lets me see who wrote the code, when it was written and most importantly, 
the commit hash. I was previously searching GitHub with the commit hash to pull up the actual commit and pull
request. [Fugitive](https://github.com/tpope/vim-fugitive) for Vim and [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
for Visual Studio Code provide an in-editor experience for viewing git commits and history. However, I prefer
to view the commit on GitHub because it's easier to read and understand.

I wrote the following vim keybinding and bash script to let me open a browser and navigate directly to the 
commit page automatically using two key strokes. 

## The Vim Keybinding

```
nmap <leader>m :!exec ~/Documents/go-to-commit.sh <cword><CR>
```

What is this line of code doing? 

* `nmap` creates a key mapping in normal mode.
* `<leader>m` is whatever you defined your leader key to be followed by the `m` key. For me, leader is `,`. 
* `!` lets us run a unix command directly from the editor.
* `exec` is the unix command we want to run, which will execute a bash script on my local computer.
* `~/Documents/go-to-commit.sh` is the script that will be executed. 
* `<cword>` is a special key in vim that means the "current word" under the cursor. It is being passed as an argument into the `go-to-commit.sh` script
* `<CR>` means "Carrige Return" or the enter key

To put it all together, when I type `,m` Vim will execute the `go-to-commit.sh` script within my Documents folder and pass
in the word under my cursor as an argument to the script. 


For more details on setting up vim configs and what these keys mean check out my post on vim setup


## The Script

_go-to-commit.sh_
```
#!/bin/bash

WORD_UNDER_CURSOR=$1

CURDIR=$(pwd | sed 's/\/Users\/sunnymistry\/Documents\/Code\///' | sed 's/\/.*//')

open "https:://github.com/sunnymis/$CURDIR/commit/$WORD_UNDER_CURSOR"
```

Let's break this down line by line. 

* The first line `#!bin/bash` tells whatever interpreter that is running the script that this code is a bash script. 
* We initialize the variable `WORD_UNDER_CURSOR` to `$1`. `$1` in bash means the first argument that was passed in. The vim command is passing in the curent word under the cursor as the first argument
* We initialize the variable `CURDIR` to the directory name of the GitHub project. For me, all of my GitHub projects live under the `Documents/Code` folder. 
   * `pwd` prints out the current working directory. For example: `/Users/sunnnymistry/Documents/Code/sunnymistry.dev/src/components`
  * `|` is the pipe operator. It lets us send the result of the commnad before it to the command after it. The first pipe takes the result of `pwd` and sends it to the first `sed` command. The second `|` takes the result of that `sed` command and sends it to the second `sed` command
  * `sed 's/\/Users\/sunnymistry\/Documents\/Code\///'` replaces `/Users/sunnymistry/Documents/Code` with an empty string (or nothing). This leaves us with `sunnymistry.dev/src/components`
  * `sed 's/\/.*//'` replaces a slash followed by any character and replaces it with nothing. This leaves us with `sunnymistry.dev`. 
* `open` is the unix command to open files, directories, or URLs in the browser. The string injects the two variables we assigned before. 


To put it all together, we get the word under the cursor that vim sent us, determine what GitHub project we're in by determining what folder we're in, and open the GitHub URL for that specific commit in the project. 

The resulting URL looks like `https:://github.com/sunnymis/sunnymistry.dev/commit/c1eaaf78`


## Future Work

I want to improve upon this by creating a solution that uses only Vim. Vim already provides the ability to open the URL that's under the cursor by typing `gx` in normal mode. This was a quick solution I made in under an hour which will increase my productivity but researching and figuring out how to write a vim plugin could improve this solution!








