Title: Contributing to MAAS docs  
TODO: update callout graphic
      update corresponding file for Juju docs


# Contributing to MAAS documentation

MAAS documentation is hosted on [GitHub](http://github.com) and published on
[maas.io](http://maas.io/docs). Its source documents are easy to
understand and edit due to the format used: standard
[GitHub Flavored Markdown](https://help.github.com/articles/getting-started-with-writing-and-formatting-on-github/).
Conventions have been added to support doc features such as *foldouts* and
*admonishments* (explained below).

Here are a few [cheat](http://askubuntu.com/editing-help)
[sheets](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for
writing in GFM.


## Documentation bugs

Bugs for documentation issues are submitted here:

https://github.com/CanonicalLtd/maas-docs/issues/new

and listed here:

https://github.com/CanonicalLtd/maas-docs/issues


## How to contribute text

Here are the basic steps necessary to get a change published on the website:

- [Fork the repository](https://help.github.com/articles/fork-a-repo) from
  [github.com/CanonicalLtd/maas-docs](http://github.com/CanonicalLtd/maas-docs)
- Make a local branch from your fork (and enter that branch)
- Edit the source documents
- Push your branch back to your fork on GitHub
- [Submit a Pull Request](https://help.github.com/articles/creating-a-pull-request)

The source documents are located in the `src` directory. From there each
language is separated into its own directory by language code. For instance,
English is under `src/en`.

Once submitted, a Docs team member will review your work, suggest improvements,
and eventually merge it with the master branch. Don't forget to review your
work before submission!

### Metadata

Each file has the potential to include metadata for various purposes. At the
moment this is used to provide a title element, and also to implement a limited
form of todo list items. Metadata is written as _key : value_ pairs AT THE VERY
TOP of the document. E.g.

```
Title: Contributing to MAAS docs
TODO: add section on metadata
      spellcheck everything

# Title of document

Well written text goes here blah blah
```

As you can see, the TODO metadata can have more than one item, as long as
additional items are indented by at least 4 spaces directly after the previous
one. The Metadata section ends immediately there is a blank line, and the
normal document text can begin.

### Sections

All the text is organised into sections. These are auto-generated, there is
nothing extra you need to do:

    # <h1> equivalent
    ## <h2> equivalent
    ### <h3> equivalent

### Code blocks

Create a code block using the code-fencing markup of three backticks,
preferably followed by the type of code:

    ```bash
    maas do something
    maas do something else
    ```

The most common "types" used in this documentation are: `bash`, `yaml`, `json`,
and `no-highlight`.

### Inline code

Use a backtick to `inline commands and other literals`:

### Notes, warnings, callouts, and admonishments

Callouts are used to notify the user of additional information or warn them of
potential pitfalls. This will create a notification resembling the following in
the docs:

![callout](./media/note.png)

To implement this callout, use the following syntax:

```no-highlight
!!! Note: If you want to get more information on what is actually happening, or
to help resolve problems, you can add the `--show-log` switch to the juju
command to get verbose output.
```

### Foldouts

When a page contains a high volume of information that would otherwise require
a table of contents, or similar method of quick navigation, a *foldout* can be
used. This will create a collapsed header which, when clicked, will expand to
display all the content below it.

```
^# Header
  Content can be multi-paragraphed and will be sent through the Markdown parser

  as long as content is continually indented under the header.
```


## Adding pages

Adding a page (file) to the documentation requires the altering of
`src/navigation.tpl`. Doing so will insert an entry into the left navigation
pane which will allow a visitor to discover the new page.

Add the page with the following format:

    <li class="sub"><a href="charms-scaling.html">Scaling Services</a></li>;

in the appropriate section. Please make sure you submit a Pull Request with a
description of the new page and why it is needed!


## Adding screenshots

When adding screenshots place them in `media`. To reference them in
your page use the syntax `![description](./media/picture.png)`


# Testing or deploying locally

First you need to generate the docs from the Markdown. In the root directory
first get the dependencies and make the docs:

```bash
make sysdeps
make
```

!!! Note: You only need to `make sysdeps` once, after that you'll have all the
dependencies you'll need to build the docs going forward.

The documentation makes use of Javascript for some functionality, so in order
to test the docs properly you will need to have a web server set up. See
[Ubuntu and Apache](https://help.ubuntu.com/lts/serverguide/httpd.html). The
DocumentRoot should be the `htmldocs` directory:

```bash
sudo cp -R htmldocs /var/www/htmldocs
```

You can then point your web browser at your local machine (127.0.0.1/htmldocs)
to view the files.

Alternatively, you can use Python to start a simple HTTP server on the docs
directory. Navigate to the `/htmldocs` directory of the docs and run the
following:

```bash
python -m SimpleHTTPServer
```


# Style and language

We are putting together a more comprehensive style guide, but for the moment the
following are good guidelines:

 - Resist being overly formal. 
 - Remember the readers are *users* not necessarily Juju developers.
 - Spell things properly! (see below).
 - We use British English (en-GB). See
   [language details](./contributing-en-GB.html), including a comparison with
   American English (en-US).
 - If including links or examples, double-check they actually work
 - We enforce 80 columns for every text file to keep it readable. Here are
   instructions for the
   [vim](http://stackoverflow.com/questions/3033423/vim-command-to-restructure-force-text-to-80-columns)
   and [emacs](http://www.emacswiki.org/emacs/EightyColumnRule) editors.
