Title: Build the Docs
TODO: can add more user-friendly instructions on setting up local web server
      talk about entr utility


# Build the Docs

Every non-trivial contribution must first have its HTML built and verified
before a pull request (PR) is made from it.

First install the builder. On Ubuntu 16.04 LTS:

```bash
sudo snap install documentation-builder
```

To build the HTML, while in the root of the MAAS docs repository:

```bash
/snap/bin/documentation-builder
```

See the [documentation-builder project][github-documentation-builder] for
details.

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


<!-- LINKS -->

[github-documentation-builder]: https://github.com/CanonicalLtd/documentation-builder
[ubuntu-serverguide-apache]: https://help.ubuntu.com/lts/serverguide/httpd.html
