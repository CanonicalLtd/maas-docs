Title: Writing Guide
table_of_contents: True


# Writing Guide

This page contains detailed information on how to become a successful MAAS
documentation writer. Welcome to the club.


## Contribution overview

An individual doc contribution ends up as a *PR* (pull request) on GitHub. The
process involved in producing one is described on the
[Working with Git and GitHub][contributing-git] page.

Prior to submitting a PR the contributor must verify that the HTML is good. See
[Building the docs][contributing-build] for how to do this.

A Documentation team member will review your PR, suggest improvements, and
eventually merge it with the appropriate branch (series). Publication to the
website is a separate step (performed internally), so it can be a few days
before the changes actually show up. Please be patient!


## Style and language

Please follow these guidelines for style and language:

- Use a spell checker.
- Resist being overly formal.
- Verify hyperlinks and examples.
- Target audience: intermediate system administrator, not a developer.
- Use British English (en-GB). See [language details][contributing-en-gb],
  including a comparison with American English (en-US).
- Use a maximum of 79 columns for files. Here are instructions for the
  [vim][vim-eighty-columns] editor.
- An exception to the above is a hyperlink. Never break one with a carriage
  return. This includes the `[text][label]` and `[label]: destination`
  combinations. See [hyperlinks][anchor__hyperlinks].


## GitHub Flavored Markdown

This documentation is written in GitHub Flavored Markdown. GFM conventions
have been added to support features such as [*foldouts*][anchor__foldouts] and
[*admonishments*][anchor__admonishments].

GFM is very easy to write with. Get started by looking over the below
resources:

- [askubuntu.com][gfm-cheatsheet-askubuntu]
- [github.com][gfm-cheatsheet-github]


## Metadata

Metadata can be included in any file. Currently, this is used for:

- title element
- TODO list (file improvements)
- table of contents

This information is written as key:value pairs **at the very top** of the
page. For example:

```no-highlight
Title: Install from ISO
TODO: images need updating when Ubuntu 17.04 is released
      check for changes to bug https://pad.lv/1625211 and modify text accordingly
table_of_contents: True

# Title of document

Text goes here blah blah blah
```

- The TODO items must be left-aligned as shown above.
- The table of contents will contain only level 2 headers.
- The metadata section is terminated by a blank line.


## Headers

Headers are simple to create:

    # Top level header (typically the same as the Title element)
    ## Second level header
    ### Third level header


## Code blocks

A code block is enclosed by three backticks and includes the *type* of code:

    ```bash
    maas command do something
    maas command do something else
    ```

The most common types used are: `bash`, `yaml`, `json`, and `no-highlight`.
The last is like a miscellaneous type. It is often used to display command
output.


## Inline code

Use a backtick to `inline filenames and other literals` like this:

```no-highlight
Use a backtick to `inline filenames and other literals`.
```


## Admonishments

An admonishment distinguishes information from the rest of the text. The syntax
begins with 3 exclamation points:

```no-highlight
!!! [admonishment-type] "[title]": 
    [aligned text]
```

Where:

- `admonishment-type` can be 'Note', 'Warning', 'Positive', or 'Negative'.
- `title` is an optional title (visible in HTML)
- `aligned text` is the text

When a value for 'title' is omitted, the default will be the type itself. If
the 'title' has a null value (i.e. "") then no title will be displayed.

### Admonishment examples

A standard 'Note' type admonishment:

```no-highlight
!!! Note: 
    If KVM-backed nodes are used, ensure that the 'maas' user on the rack
    controller can connect to the KVM host using a passphraseless private SSH
    key.
```

A standard 'Warning' type admonishment:

```no-highlight
!!! Warning: 
    Data will be lost unless you do the right thing.
```

A 'Positive' type admonishment with title:

```no-highlight
!!! Positive "High score":
    A positive note that should include a title.
```

A 'Negative' type admonishment with title:

```no-highlight
!!! Negative "Game over": 
    A negative note that should include a title.
```

A 'Positive' type admonishment with no title:

```no-highlight
!!! Positive "": 
    I'm done, and I feel fine.
```

The above examples will appear as:

!!! Note: 
    If KVM-backed nodes are used, ensure that the 'maas' user on the rack
    controller can connect to the KVM host using a passphraseless private SSH
    key.

!!! Warning: 
    Data will be lost unless you do the right thing.

!!! Positive "High score":
    A positive note that should include a title.

!!! Negative "Game over": 
    A negative note that should include a title.

!!! Positive "": 
    I'm done, and I feel fine.


## Comments

Occasionally it may be appropriate to include a comment to explain or organize
some text. This ends up as an HTML comment which can be read online so take it
seriously:

```no-highlight
<!--
The below text may be removed soon.
-->
```


## Foldouts

When a page contains a lot of extraneous information such as walkthroughs
containing many images or reference tables, a *foldout* can be used. This will
create a collapsed header which, when clicked, will expand to display all the
content below it.

```no-highlight
^# Header
  Content can be multi-paragraphed and will be sent through the Markdown parser

  as long as content is continually indented under the header.
```


## Hyperlinks

Links to internal files or external URLs use the following format:

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

The visible text should use an active style as opposed to a passive style. For
instance, try to avoid:

```no-highlight
A [proxy][maas-proxy] can optionally be configured.
```

Notes:

- An internal page is referred to by its source filename (i.e. `.md` not
  `.html`).
- Try to use the same `label:destination` pair throughout the documentation.


## Images

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

### Central images directory

For publication (on the web site), all branch series use the `media` directory
in the 'master' branch. This means:

- You must be very careful when renaming or removing an image in master as it
  will affect all non-master branches.
- Any image introduced in a non-master branch must be *forward-ported* to the
  master branch.


## Filenames

The naming of a file is based upon its location in the menu (see below). This
makes it easier for the reader and the writer to build up a mental model of how
the set of pages is structured. For example, the page corresponding to file
`installconfig-network-dhcp.md` is found under 'Install & Configure' and then
'Networking'.


## Capitalization

Do not use a "Caps Everywhere" style. It is only used in level one headers and
the title metadata. References (visible text) to these page titles (including
the navigation) should just capitalize the first letter. Obviously, this does
not pertain to words that should always be capitalized according to basic
grammar rules (e.g. acronyms, proper nouns).


## Navigation menu

Adding a page (file) to the documentation may require the altering of
`metadata.yaml`. Doing so will insert an entry into the left navigation pane
(the menu) on the website. This is considered a major change so ensure your PR
includes a comment highlighting this change and why it is needed.


<!-- LINKS -->

[anchor__hyperlinks]: #hyperlinks
[anchor__foldouts]: #foldouts
[anchor__admonishments]: #admonishments

[maas-docs]: https://docs.ubuntu.com/maas
[gfm-cheatsheet-askubuntu]: http://askubuntu.com/editing-help
[gfm-cheatsheet-github]: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
[contributing-en-gb]: contributing-en-GB.md
[contributing-git]: contributing-git.md
[contributing-build]: contributing-build.md
[vim-eighty-columns]: http://stackoverflow.com/questions/3033423/vim-command-to-restructure-force-text-to-80-columns
