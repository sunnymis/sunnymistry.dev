const inquirer = require('inquirer');
const fs = require('fs');
const yaml = require('js-yaml');
const _ = require('lodash')

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const date = today.getDate();
  const month = today.getMonth() + 1;

  return  `${year}-${month}-${date}`
}

inquirer
  .prompt([
    {
      type: 'list',
      name: "template",
      message: 'What type of post?',
      choices: ['Post', 'TIL'],
      filter: (val) => val.toLowerCase()
    },
    {
      type: "input",
      name: "title",
      message: "Post Title"
    },
    {
      type: "input",
      name: "date",
      message: "Date ",
      suffix: "YYYY-MM-DD",
      default: getFormattedDate(),
    },
    {
      type: "input",
      name: "slug",
      message: "Slug",
      default: (answers) => _.kebabCase(answers.title)
    },
    {
      type: "confirm",
      name: "draft",
      message: "Draft",
      default: false
    },
    {
      type: "input",
      name: "tags",
      message: "Tags (comma separated list)",
      default: []
    },
    {
      type: "input",
      name: "description",
      message: "Description?"
    }
  ])
  .then(answers => {
    const { title } = answers;
    const filename = `${getFormattedDate()}-${_.kebabCase(title)}.md`

    if (!_.isEmpty(answers.tags)) {
      answers.tags = answers.tags.split(',').map(t => _.kebabCase(t))
    }

    const frontMatter = {
      ...answers,
      socialImage: "/profile-photo.jpg"
    }

    try {
      const content = yaml.safeDump(frontMatter)
      const formattedPost = `---\n${content}---`
      const dir = answers.template === 'post' ? 'posts' : 'til'
      const filepath = `content/${dir}/${filename}`

      fs.appendFile(filepath, formattedPost, (err) => {
        if (err) { throw err; }
        console.log(`Successfully created file at ${filepath}`);
      });
    } catch (e) {
      console.log("Error generating YAML from answer object", e);
    }
  })
  .catch(error => {
    if(error.isTtyError) {
      console.log("Prompt couldn't be rendered in the current environment")
    } else {
      console.log("Error with inquirer", error)
    }
  });
