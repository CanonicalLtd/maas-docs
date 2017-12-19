Title: Building the Docs
TODO: can add more user-friendly instructions on setting up local web server
      talk about entr utility
table_of_contents: True


# Building the Docs

Every non-trivial contribution must first have its HTML built and verified
before a pull request (PR) is made from it.

See the [documentation-builder project][github-documentation-builder] for
details of the actual tool.

Related documents:

- [Writing guide][contributing-writing]
- [Working with Git and GitHub][contributing-git]


## Installation

Install the builder. On Ubuntu 16.04 LTS:

```bash
sudo snap install documentation-builder
```

!!! Note:
    You will first need to install package `squashfuse` if you're doing this in
    a LXD container.

To build the HTML, while in the root of the MAAS docs repository:

```bash
documentation-builder
```


## Verification

You can point a web browser at individual HTML files but to make your
verification more conclusive you will need a web server.

### Web server

See the [Ubuntu Server Guide][ubuntu-serverguide-apache] for instructions on
setting up Apache. The DocumentRoot should be the `build` directory. To test,
point your browser at:

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

### Points to consider

Some things to consider during verification:

- A linkchecker (either a system-wide tool or a
  [browser add-on][browser-linkchecker-addon])
- Images should show enough context (surrounding real estate) but not so much
  to make important details illegible.


<!-- LINKS -->

[github-documentation-builder]: https://github.com/CanonicalLtd/documentation-builder
[ubuntu-serverguide-apache]: https://help.ubuntu.com/lts/serverguide/httpd.html
[browser-linkchecker-addon]: https://chrome.google.com/webstore/detail/check-my-links/ojkcdipcgfaekbeaelaapakgnjflfglf
[contributing-writing]: contributing-writing.md
[contributing-git]: contributing-git.md
