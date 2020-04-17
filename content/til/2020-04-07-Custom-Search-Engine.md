---
title: Custom Search Engines in Chrome
date: "2020-04-07"
template: "til"
draft: false
slug: "custom-search-engines-chrome"
tags:
  - "chrome"
---

![Custom Search Engine Example](/media/til/custom-search-engine/custom-search-engine.gif)

Every day I go to websites where the URLs are the same except for one part of the path. For example GitHub repositories are under structured URLs like
`https://github.com/sunnymis/project1` and `https://github.com/sunnymis/project2 `. Jira tickets are under URLs like 
`https://company.atlassian.net/browse/PROJ-100` and ``https://company.atlassian.net/browse/PROJ-123``. To make it easier to jump directly to
a certain page you can leverage custom search engines in Google Chrome. Custom search engines enable you to type some characters, hit tab, 
and then characters to enter into your URL.  

Steps: 

1. Right click the URL bar
2. Click Edit Search Engines...
3. Next to `Other search engines` click `Add`
4. Enter a name under  `Search engine`
5. `Keyword` is important. This is a shortcut you can type in your browser which will trigger the custom engine. For GitHub you can use `gh`. 
For a Jira project named `PROJ` you can make the keyword `proj`. 
6.  In the URL field enter the URL but add `%s` wherever you want to put your query. For example: `https://github.com/sunnymis/%s`

Thats it! Now you can type `gh`, enter the `tab` key, and type your github repo name and you'll be navigated there. 
