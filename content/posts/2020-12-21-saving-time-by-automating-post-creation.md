---
template: post
title: Saving Time By Automating Post Creation
date: '2020-12-21'
slug: saving-time-by-automating-post-creation
draft: false
tags:
  - blog
  - javascript
description: How I wrote a script which simplifies creating new posts for this site
socialImage: /profile-photo.jpg
---

![Generating Post Demo](/media/posts/saving-time-by-automating-post-creation/generating-post-demo.gif)


Setting up a new file to begin writing posts was tedious and time consuming. In this post you'll learn how I automated generating new content pages for my
posts and TILs. You can find [the script here](https://github.com/sunnymis/sunnymistry.dev/blob/master/generate/blogPost.js) 

An important part of how content on this site is generated is the front matter
YAML config. Front matter is the metadata at the top of the markdown file where
details about the post live. When Gatsby generates the content, it pulls the
front matter data using GraphQL and it injects it into the content template to
build the page. 

Here is how the front matter for this article looks

```yaml
---
template: post
title: Saving Time By Automating Post Creation
date: '2020-12-21'
slug: saving-time-by-automating-post-creation
draft: false
tags:
  - blog
  - javascript
description: How I wrote a script which simplifies creating new posts for this site
socialImage: /profile-photo.jpg
---

```

To start writing a new article, I would create a new file, name the file in a
specific format, open an older post, copy the front matter, paste it into the
new file, edit the YAML, and then begin writing. The steps were the same every
time, so I decided to automate it.

## Requirements 

There are 3 main pieces of functionality to achieve what I wanted. A command
line utility to guide me through creating a new post, creating a file, and
saving the data I entered as YAML in the newly created file. 

## The Command Line Program 

To create the command line prompt, I used the library [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/). This library makes it incredibly easy to build interactive command line interfaces to gather input from the user. The shell of an Inquirer program looks like this

```javascript
const inquirer = require('inquirer');

inquirer
  .prompt([
    // List of questions go here
  ])
  .then(answers => {
    // Do something wth the answers
  })
  .catch(error => {
    // Do something if there are any issues
  });
```

I won't go over all of the questions I added (you can find the full list
[here](https://github.com/sunnymis/sunnymistry.dev/blob/master/generate/blogPost.js)), but I'll highlight the unique ones. Since this website consists of 2 different kinds of posts (posts and TILs), I need to determine what template to use.

```javascript
// A list question
{
  type: 'list',
  name: "template",
  message: 'What type of post?',
  choices: ['Post', 'TIL'],
  filter: (val) => val.toLowerCase()
}
```

Inquirer has a specific data structure required for its questions. 

* `type` determines what kind of question format to use. 
* `name` is the name of the field in the `answers` object
* `message` is the text to display to the user
* `choices` is available if the `type` is `list`. It contains the possible
    values
* `filter` is a function which is given the users input and the answers object.
    You can manipulate the data here and the returned value is saved in the
    `answers` object

This question will present the user with a prompt where they must select either a `Post` or a `TIL`. After selecting a choice we further process the answer by transforming it to lowercase. See below for additional questions

```javascript
{
  type: "input",
  name: "title",
  message: "Post Title"
},
{
  type: "input",
  name: "slug",
  message: "Slug",
  default: (answers) => _.kebabCase(answers.title)
},
{
  type: "input",
  name: "tags",
  message: "Tags (comma separated list)",
  default: []
}
```
The `title` question is pretty straightforward. It just accepts any input from the user. The second `slug` question is a bit more interesting. We have a `default` property set to be the value of the `title` question transformed into kebab case. This is helpful because I usually make the slugs for each page the kebab case of the title. Instead of having to type it out, Inquier will present me with a correctly formatted slug. All I have to do is hit enter to confirm. In the third question I need to provide a list of tags. Intead of having to remember the correct format the script requires, I can just provide a hint `comma separated list`. 


## Converting Input to YAML

Once all the questions have been answered, the data is available inside of the callback function in the promise `.then` function. Using the `js-yaml` library I can transform the `answers` javascript object to YAML. 

```javascript
const yaml = require('js-yaml');

inquirer
  .prompt([
    // questions
  ])
  .then(answers => {
    const frontmatter = yaml.safeDump(answers)
    const formattedFrontmatter = `---\n${frontmatter}---`
  });
```

## Write YAML to a File

Now that we have the correctly formatted frontmatter, we can create a file and write the contents to it. I used Node's `fs` library to handle this filesystem manipulation. 

```javascript
const fs = require('fs');

const filename = `${getFormattedDate()}-${_.kebabCase(title)}.md`
const dir = answers.template === 'post' ? 'posts' : 'til'
const filepath = `content/${dir}/${filename}`

fs.appendFile(filepath, formattedFrontmatter, (err) => {
  if (err) { throw err; }
  console.log(`Successfully created file at ${filepath}`);
});

```

In the above code, I figure out what the file name should be based off the date and title and which directory to put the file in depending on the type of post. Then we can pass in the file path and formatted frontmatter into `appendFile`. `appendFile` will create a file if it doesn't already exist and then insert the data into the file. 

## Summary

This script only took an hour to write (this includes the time it took to
research which libraries are available) but will now save me from having to
perform tedious actions to begin writing. There's many more things I can
automate in my life, but this is a great first step. 
