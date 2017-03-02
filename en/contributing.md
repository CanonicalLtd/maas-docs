Title: Contributing to Documentation | MAAS
TODO: update corresponding file for Juju docs
      add an image of the example admonishment when it does more than just embolden 'Note:'
      can add more user-friendly instructions on setting up nginx
table_of_contents: True


# Contributing to Documentation

MAAS documentation is hosted on [GitHub][upstream-github] and published on
[https://docs.ubuntu.com/maas][maas-docs]. Its source documents are written in
standard [GitHub Flavored Markdown][github-gfm] (GFM) format, which is very
easy to work with. Conventions have been added to support features such as
*foldouts* and *admonishments* (explained below).

Here are a few GFM cheat sheets:

- http://askubuntu.com/editing-help
- https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet


## Documentation bugs

Bugs for documentation issues are submitted here:

https://github.com/CanonicalLtd/maas-docs/issues/new

and listed here:

https://github.com/CanonicalLtd/maas-docs/issues


## Contributing to a web page

Here is an overview of what's involved in getting a change published on the website:

1. [Fork][github-help-fork] the
   [MAAS documentation repository][github-maas-docs]
1. Clone that fork on your local system
1. Create a branch from your local fork/clone
1. Enter that branch and edit the source documents
1. View the HTML locally
1. Push your branch to your fork (on GitHub)
1. [Create a Pull Request][github-help-pr] for that branch

A Documentation team member will review your work, suggest improvements, and
eventually merge it with the appropriate branch (series). Publication to the
website is a separate step (performed internally), so it can be a few days
before the changes actually show up. Please be patient!

### Metadata

Metadata can be included in any file. Currently, this is used for:

- title element
- todo list (file improvements)
- table of contents

This information is written as key:value pairs **at the very top** of the
page. For example:

```no-highlight
Title: Install from ISO | MAAS
TODO: images need updating when Ubuntu 17.04 is released
      check for changes to bug https://pad.lv/1625211 and modify text accordingly
table_of_contents: True

# Title of document

Text goes here blah blah blah
```

- The TODO items must be left-aligned as shown above.
- The table of contents will contain only level 2 headers.
- The metadata section is terminated by a blank line.

### Sections

Text is organised into sections. These are auto-generated, there is nothing
extra you need to do:

    # Top level header (typically the same as the Title element)
    ## Second level header
    ### Third level header

### Code blocks

Code blocks are created using the code-fencing markup of three backticks,
followed by the type of code:

    ```bash
    maas command do something
    maas command do something else
    ```

The most common *types* used are: `bash`, `yaml`, `json`, and `no-highlight`.

### Inline code

Use a backtick to `inline filenames and other literals` like this:

```no-highlight
Use a backtick to `inline filenames and other literals`.
```

### Admonishments

Admonishments are used to notify the user of additional information or warn them of
potential pitfalls.

To implement an admonishment, use the following syntax:

```no-highlight
!!! Note: To get syntax help for the 'maas' command add the '-h' switch.
```

### Foldouts

When a page contains a lot of extraneous information such as walkthroughs
containing many images or reference tables, a *foldout* can be used. This will
create a collapsed header which, when clicked, will expand to display all the
content below it.

```no-highlight
^# Header
  Content can be multi-paragraphed and will be sent through the Markdown parser

  as long as content is continually indented under the header.
```


### Hyperlinks

Link to an internal file or an external URL using the following format:

```no-highlight
[visible text][label]
```

The `visible text` is what will appear on the web page. The `label` is used to
refer to the destination, which is placed at the bottom of the file:

```
<!-- LINKS -->

[label]: destination
```

For example:

```no-highlight
- For more on this topic see [DHCP][dhcp].
- To understand haproxy, see the [upstream configuration manual][upstream-haproxy-manual].

...

[dhcp]: installconfig-networking-dhcp.md
[upstream-haproxy-manual]: http://cbonte.github.io/haproxy-dconv/1.6/configuration.html
```

Notes:

- An internal page is referred to by its source filename.
- Try to use the same label:destination pair throughout the documentation.


### Images

An image should not be overly cropped - allow for context. When ready, place
the image file in the `media` directory.

In terms of linking, they are managed very similarly to hyperlinks. However,
they are placed on their own line; are preceded by an exclamation point; and
both the label and destination have a specific naming convention:

```no-highlight
![alt attribute][img__webui_descriptor]
```

The bottom of the file will look like:

```no-highlight
[img__webui_descriptor]: ../media/filename__webui_descriptor.png
```

Explanation:

- `filename`: name of file containing the image (omit the extension '.md')
- `webui`: version of MAAS corresponding to the image of the web UI
- `alt attribute`: text that is shown in place of the image if the latter
  cannot be displayed for some reason
- `descriptor`: a short description of the image (e.g. 'enable-dhcp')

For example:

```no-highlight
![enable dhcp][img__2.1_enable-dhcp]
![enable fire alarm][img__enable-fire-alarm]

...

[img__2.1_enable-dhcp]: ../media/installconfig-networking-dhcp__2.1_enable-dhcp.png
[img__enable-fire-alarm]: ../media/installconfig-networking-dhcp__enable-fire-alarm.png
```

If the image is not of the MAAS web UI then simply omit the version part, like
in the second image above.

**Important**: All branch series use the same central location for images
(`media`). You must therefore be very careful when renaming or removing an
image for a PR affecting a single branch as it will affect the other branches
as well.


## Filenames

The naming of a file is based upon its location in the menu (see below). This
makes it easier for the reader and the writer to build up a mental model of how
everything is structured.

For example, the file `installconfig-networking-dhcp.md` is found under
'Install & Configure' and then 'Networking'.


## Navigation menu

Adding a page (file) to the documentation may require the altering of
`metadata.yaml`. Doing so will insert an entry into the left navigation pane
(the menu) on the website.

This is considered a major change so ensure your PR (pull request) includes a
comment highlighting this change and why it is needed.


## Build and view the HTML

First install the builder. On Ubuntu 16.04 LTS:

```bash
sudo snap install documentation-builder
```

To build the HTML, while in the root of the MAAS docs repository:

```bash
/snap/bin/documentation-builder
```

See the [documentation-builder GitHub project][github-documentation-builder]
for details.

You will now need a web server. See the
[Ubuntu Server Guide][ubuntu-serverguide-apache] for instructions on setting up
Apache. The DocumentRoot should be the `build` directory. To test, point your
browser at:

```no-highlight
http://127.0.0.1/en/contributing.html
```

Alternatively, you can use Python to start a simple HTTP server (port 8000).
While in the `build` directory run:

```bash
python -m SimpleHTTPServer
```

With Python 3:

```bash
python3 -m http.server
```


## Style and language

Please follow these guidelines for style and language:

- Resist being overly formal.
- Remember that the average reader is a user, not a developer.
- Use a spell checker.
- Use British English (en-GB). See
  [language details][contributing-en-gb], including a comparison with American
  English (en-US).
- If including links or examples, ensure they actually work.
- Use a maximum of 80 columns for files. Here are instructions for the
  [vim][vim-eighty-columns] and [emacs][emacs-eighty-columns] editors.
- An exception to the above is a link. __Never break a link with a carriage
  return__. This includes the `[text][label]` and `[label]: destination`
  combinations.


<!-- LINKS -->

[upstream-github]: http://github.com
[maas-docs]: https://docs.ubuntu.com/maas
[github-gfm]: https://help.github.com/articles/getting-started-with-writing-and-formatting-on-github
[github-maas-docs]: http://github.com/CanonicalLtd/maas-docs
[github-help-fork]: https://help.github.com/articles/fork-a-repo
[github-help-pr]: https://help.github.com/articles/creating-a-pull-request
[github-documentation-builder]: https://github.com/CanonicalLtd/documentation-builder
[ubuntu-serverguide-apache]: https://help.ubuntu.com/lts/serverguide/httpd.html
[contributing-en-gb]: contributing-en-GB.md
[vim-eighty-columns]: http://stackoverflow.com/questions/3033423/vim-command-to-restructure-force-text-to-80-columns
[emacs-eighty-columns]: http://www.emacswiki.org/emacs/EightyColumnRule
