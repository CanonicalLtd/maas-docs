

# API Client

The `python-libmaas` client library is an asyncio-based client library whose
purpose is to allow developers, integrators and administrators to better
interact with MAAS.

This software is in development and does not yet support all MAAS endpoints
(nor all operations). It currently supports MAAS versions 2.1 and 2.2-beta3.


## Library endpoints

At this time, the client library supports these endpoints:

- account
- boot-sources, boot-resources
- machines, devices, region controllers, rack controllers
- events
- configuration
- tags
- version
- zones

See the below resources to better understand the above terms and how they are
used:

- [Concepts and terms][concepts]
- [MAAS CLI][manage-cli]
- [API documentation][api]


## Installation and usage of python-libmaas

For installation and initial steps, see:

- `https://github.com/maas/python-libmaas`
- `http://maas.github.io/python-libmaas/index.html`

For examples:

- `http://maas.github.io/python-libmaas/client/index.html`
- `http://maas.github.io/python-libmaas/client/nodes/index.html`

For pypi information:

`https://pypi.python.org/pypi/python-libmaas`


<!-- LINKS -->

[manage-cli]: manage-cli.md
[concepts]: intro-concepts.md
[api]: api.md
