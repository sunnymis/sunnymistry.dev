---
title: Setting Up a Vim Config from Scratch
date: "2020-01-20"
template: "post"
draft: false
slug: "vim-config-from-scratch"
tags:
  - "Development"
  - "Vim"
description: "A walk through of how to set up a Vim config"
socialImage: "/profile-photo.jpg"
---

In this post I am going to walk you through how to configure your Vim using plugins and
built in settings. I'm going to show you the plugins, key mappings, and preferences that I use
but you can choose to configure it however it best fits your workflow. 

## Table of Contents
1. [Installing Vim](#installing-vim)
2. [Installing a Vim Plugin Manager](#install-a-vim-plugin-manager)
3. [Adding Your First Plugin - Color Theme](#adding-your-first-plugin---color-theme)
4. [Uninstalling a Plugin](#uninstalling-a-plugin)
5. [Status Bar](#status-bar)
6. [File Tree](#file-tree)
7. [File Searching](#file-searching)
8. [Git](#git)
9. [Language/Framework Support](#languageframework-support)
10. [General Editing](#plugins-for-general-editing)
11. [Window Navigation](#window-navigation)
12. [Other Settings](#other-settings)
13. [Bonus - Switching to Neovim](#bonus---switching-to-neovim)

## Installing Vim

If you're using a Mac, Vim is already preinstalled. However, it is most likely a much older version and isn't compiled with all of the
options we will need. So let's first install the latest version of Vim.

To check your current version of Vim you can run:

```
vim --version
```

For me this initially said `VIM - Vi IMproved 8.0 (2016 Sep 12, compiled Feb 22 2019 18:22:38)`. 

```
brew install vim
```

Checking the version now should show something more recent. At the time of writing it shows `VIM - Vi IMproved 8.2 (2019 Dec 12, compiled Jan 8 2020 00:57:48)`


### Create the Vim configuration file

```
touch ~/.vimrc
```

This file is where we will put all of our customizations, plugins, and keybindings. 

### Saving Vim Configuration

Whenever an edit is made to the `.vimrc` file, we have to first save the file and then `source` it. Sourcing the file executes the
contents of the file. This will apply all of the changes made to it.

To save the file: 

```
:w
```

To source, run the following from the terminal:

```
source ~/.vimrc
```

or directly from Vim:

```
:source ~/.vimrc
```
___

## Install a Vim Plugin Manager

A plugin manager is useful because it simplifies adding, updating, and removing plugins to your Vim config. There are a number of different
managers to choose from, such as [vim-plug](https://github.com/junegunn/vim-plug), [pathogen](https://github.com/tpope/vim-pathogen), and
[Vundle](https://github.com/VundleVim/Vundle.vim). I personally prefer `vim-plug` and the rest of this walkthrough will assume you're using
that, but you can use whichever one you prefer.

Run this command to install `vim-plug`:

```
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

For more detailed instructions follow the steps [here](https://github.com/junegunn/vim-plug#installation)

___

## Adding Your First Plugin - Color Theme

Writing code in black and white inside your terminal is not fun. Let's add a plugin to install a color theme. 
In your `.vimrc` file add the following block of code:

```rc
call plug#begin('~/.vim/plugged')

 Plug 'mharringon/oceanic-next'

call plug#end()
```

Between the `begin()` and `end()` functions we are going to put a list of all of our plugins we want to install. I like the theme `oceanic-next`.

Color themes are not automatically applied to Vim. You can install as many themes as you like. To set a color scheme add the following 
line: to your `.vimrc`

```
colorscheme OceanicNext
```

Save and source your `.vimrc`.

```bash
:w

:source ~/.vimrc

```

Now that the file is saved and Vim is aware of the new contents of the file, we can install the plugin. Run this command from Vim:

```
:PlugInstall
```

And that's it! It's that easy to install plugins in Vim using vim-plug

![Vim with Color Theme](/media/posts/setting-up-vim-config/vim-with-color-theme.png)

___

## Uninstalling a Plugin


To remove a plugin either comment out or delete the line in the `.vimrc` file. Save, source, and then run this command:

```bash
:PlugClean
```

It will prompt you to confirm that you want to remove the plugin. Enter `y` to remove or `N` to cancel. 
___

## Status Bar

[vim-airline](https://github.com/vim-airline/vim-airline)

[vim-airline-themes](https://github.com/vim-airline/vim-airline-themes)

```bash
Plug 'vim-airline/vim-airline'

Plug 'vim-airline/vim-airline-themes'
```

Vim airline is a status bar at the bottom of your editor. 
The themes plugin provides a collection of airline themes so you can choose whichever one you like best. Once you pick your desired
theme add it to your `.vimrc` with the following line:

```bash
let g:airline_theme='night_owl'
```

![Vim airline](/media/posts/setting-up-vim-config/vim-airline.png)

___

## File Tree

[NERDTree](https://github.com/preservim/nerdtree)

```bash
Plug 'preservim/nerdtree'
```

After installing this plugin, the NERD file tree can be shown and hidden by entering `:NERDTreeToggle`.
But that's pretty annoying to have to keep typing that. It would be much easier to enter a single key that toggles the NERD tree.

This brings us to our first key mapping. To make the NERD tree open and close every time the `\` key is pressed, add the following
to your `.vimrc` file.

```bash
nmap \ :NERDTreeToggle<CR>
```

`nmap` means map the following key in Normal mode. Whenever you are in normal mode, when you press `\` it will be as if you entered
`:NERDTreeToggle` and hit enter. The `<CR>` part means "Carriage Return" and it's as if you hit enter. Save and source the `.vimrc` file
and toggling the tree with `\` should be possible. You can use any character that you like.

### File Colors

To make the file tree easier to scan and navigate, we can update the font color depending on the file extension. 
[This GitHub issue](https://github.com/preservim/nerdtree/issues/433#issuecomment-92590696) demonstrates how to do just that.

Basically, we need to create a function which takes in a file extension and the colors you want it to be. 

```bash
function! NERDTreeHighlightFile(extension, fg, bg, guifg, guibg)
 exec 'autocmd filetype nerdtree highlight ' . a:extension .' ctermbg='. a:bg .' ctermfg='. a:fg .' guibg='. a:guibg .' guifg='. a:guifg
 exec 'autocmd filetype nerdtree syn match ' . a:extension .' #^\s\+.*'. a:extension .'$#'
endfunction
```

Then call this function with all of your file types and the color you want it to be. For example:

```bash
call NERDTreeHighlightFile('js', 'Yellow', 'none', '#ffa500', '#141f23')
call NERDTreeHighlightFile('scss', '205', 'none', 'cyan', '#141f23')
call NERDTreeHighlightFile('Dockerfile', 'lightblue', 'none', '#19B5FE', '#141f23')
```

I only use Vim in the terminal so I only need to update the first and second arguments (extension and fg). You might be wondering
what the color "205" is or how I got "Yellow" and "lightblue". A full list of colors Vim supports in the terminal can be found
[here](https://vim.fandom.com/wiki/Xterm256_color_names_for_console_Vim)


### Adding Icons

[vim-devicons](https://github.com/ryanoasis/vim-devicons)

```bash
Plug 'ryanoasis/vim-devicons'
```

For a more detailed guide on how to install icons in your file tree, follow the instructions [here](https://github.com/ryanoasis/vim-devicons/wiki/Installation)

In short, you will need to install a Nerd Font which can support this icons. If you use iTerm2 you will need to update which font it 
uses under `iTerm2 -> Preferences -> Profiles -> Text -> Font`. For my set up I use the patched [Fira Code Retina Nerd Font](https://github.com/ryanoasis/nerd-fonts/tree/master/patched-fonts/FiraCode/Retina/complete). 

_Note - if the icons aren't working or they are wrapped in brackets, it might be due to your Vim version. Your Vim must be compiled with the `+conceal` flag. Check this with `vim --version`. You can resolve this by installing the latest version with brew._

![NERDTree with colors](/media/posts/setting-up-vim-config/nerd-tree-with-colors.png)

---

## File Searching

[fzf](https://github.com/junegunn/fzf)

[fzf.vim](https://github.com/junegunn/fzf.vim)

```bash
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --no-bash' }
Plug 'junegunn/fzf.vim'
```

```bash
set rtp+=~/.fzf
```

fzf is a fuzzy find searching tool. The installation here is a bit different from the other plugins we've installed. First, fzf.vim is
based off the command line tool fzf. The first line installs fzf in the directory `~/.fzf` and runs its install script. Once that is
installed we can install fzf.vim as we would normally do. `rtp`, or runtime path, must be set to the location of fzf to tell Vim where
it is installed.

To search all files we'll also need to install `the_silver_searcher` plugin

```bash
brew install the_silver_searcher
```

Now that everything is installed let's map some keys to fzf searching commands.

```bash
let mapleader = ","
```

```bash
nmap <silent><leader>f :Files<CR>
nmap <silent><C-P> :History<CR>
nmap <leader>d :Rg <space>
```

`mapleader` defines the leader key for this vim configuration. `<leader>` is a special keyword you can set in Vim to start off a
sequence of key mappings to differentiate from other plugin key mappings. My leader is set to comma.
As we saw earlier `nmap` means map a key when you are in Normal mode. `<silent>` tells Vim to not show any messages at the bottom of the
screen. Usually when you run a command, Vim will display something at the bottom. For this, we don't care about it showing us anything. 
 `<C-P>` means `CTRL P`. To summarize, the first line will execute 
fzf's :Files command when the keys `,f` are pressed.

fzf has a number of different commands but I mainly use 3 in my day to day work. 

* `:Files` - Fuzzy search file name across all files in the current directory
* `:History` - Search from recently accessed files
* `:Rg` - Search a specific keyword in the directory

---

## Git

[vim-fugitive](https://github.com/tpope/vim-fugitive)

[vim-gitgutter](https://github.com/airblade/vim-gitgutter)

```bash
Plug 'tpope/vim-fugitive'
Plug 'airblade/vim-gitgutter'
```

Vim fugitive is a wrapper around git. I do all of my git operations via the command line but
there are two commands that I use regularly within Vim. `:Gblame` opens a blame window to show who
wrote the line, when they wrote it, and what the commit was. I also use `:G` to see the 
`git status` in a new vim buffer. 

Vim git gutter shows the git status of a line in the "gutter", or to the left of the the line.


![Vim git gutter](/media/posts/setting-up-vim-config/vim-git-gutter.png)

---

## Language/Framework Support

[vim-javascript](https://github.com/pangloss/vim-javascript)

[typescript-vim](https://github.com/leafgarland/typescript-vim)

[vim-jsx-pretty](https://github.com/MaxMEllon/vim-jsx-pretty)

[vim-ruby](https://github.com/vim-ruby/vim-ruby)

[vim-rails](https://github.com/tpope/vim-rails)

```bash
Plug 'pangloss/vim-javascript'
Plug 'leafgarland/typescript-vim'
Plug 'MaxMEllon/vim-jsx-pretty'
Plug 'vim-ruby/vim-ruby'
Plug 'tpope/vim-rails'
```

This will depend on which languages you work in but, for me, I'm mostly working with JavaScript, TypeScript, React, and Ruby on Rails. 

--- 

## Plugins for General Editing

### Multiple Cursors

[vim-multiple-cursors](https://github.com/terryma/vim-multiple-cursors)

```bash
Plug 'terryma/vim-multiple-cursors'
```

Having the ability to select the same word across multiple lines and updating them at the same time is an absolute must. 


### Commenting

[NERD Commenter](https://github.com/preservim/nerdcommenter)

```bash
Plug 'preservim/nerdcommenter' 
```

To customize this plugin to toggle commenting single or multiple lines in normal and visual mode
update your key mapping as follows:

```bash
vmap <leader>/ <leader>c<space>
```

### CSS Colors

[vim-css-color](https://github.com/ap/vim-css-color)

```bash
Plug 'ap/vim-css-color'
```

This plugin will highlight a color in CSS with that color. 

![Vim css colors](/media/posts/setting-up-vim-config/vim-css-color.png)

--- 

## Window Navigation

I use the default window navigation provided by Vim. However, by default, to navigate windows 
you have to type `CTRL W` + `CTRL (J/K/L/H)`. I prefer not to type `CTRL W` so I remapped my keys:

```bash
nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H>
```

I split my screen vertically so frequently that it is a pain to type `:vsplit`. I remapped it to:

```
nmap <silent><leader>v :vsplit<CR>
```

--- 

## Other Settings

Vim has some builtin settings you can toggle on and off. Below are a list of the ones I enabled.

```js
set ruler // displays line number and column number in the bottom right corner
set hlsearch // highlight search results when searching with /
set ignorecase // ignore case sensitivity when searching with /
set number // show line numbers
set backspace=indent,eol,start // enables backspace key
set splitbelow // when splitting horizontally, show split window on bottom
set splitright // when splitting vertically, show split window on right
```

## Bonus - Switching to Neovim 

[neo-vim](https://github.com/neovim/neovim)

### Installation

```sh
brew install neovim
```

If you want to try out Neovim, you don't need to redo all of the hard work you put into
creating your vim configuration. You can use that same config for Neovim. Open neovim 
(`nvim`), enter `:help nvim-from-vim`, and follow those instructions.

The `init.vim` file you created can be found at `~/.config/nvim/init.vim`. 

Instead of typing `nvim .` we can alias that command to `vim` to make our lives easier. In
your `.bashrc`, `.zshrc` or whatever shell configuration you use, add the following line:

`alias vim="nvim"`



