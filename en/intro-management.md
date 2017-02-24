Title: Management Summary | MAAS
TODO:  Add link for CLI docs (authoritative) to navigation when those docs are available and updated


# Management Summary

MAAS can be managed, typically by a systems administrator, in the following
ways:

- Web UI (graphical interface)
- CLI (text-based terminal)
- API (involves programming)

This section will cover each briefly. Details of each will be provided in
future chapters.


## Web UI

The web UI gets installed along with the MAAS software. This documentation
regards the web UI as the primary means for configuring and managing MAAS and
will use it as the preferred method in all instructions and examples. See
[Web UI][webui] once MAAS is installed.

Some advanced functionality is only available with the CLI. See below.


## CLI

The CLI consists of the `maas` wrapper command that interacts with the API. To
get a sense of what is possible with the CLI see [MAAS CLI][manage-cli].


## API

The API is typically reserved for large-scale automization. See
[API documentation][api].


<!-- LINKS -->

[webui]: installconfig-webui.md
[manage-cli]: manage-cli.md
[api]: api.md
