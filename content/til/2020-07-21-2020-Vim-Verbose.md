---
title: Debug Vim Configs with Verbose 
date: "2020-07-21"
template: "til"
draft: false
slug: "debug-vim-config-with-verbose"
tags:
  - "vim"
---

Have you ever added a new command or option to your `.vimrc` and not see the changes reflected?

The reason might be that the option is being overriden by another plugin. The `verbose` command
in Vim shows you what the current value is as well as where it is being defined. 

```bash
:verbose set conceallevel
```

This outputs:

```
conceallevel=0
Last set from ~/.vim/plugged/vim-devicons/plugin/webdevicons.vim line 326
```
