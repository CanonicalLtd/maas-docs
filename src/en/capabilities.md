### Navigation

-   [next](getting-help.html "Getting help")
-   [previous](maascli.html "Command Line Interface") |
-   [MAAS 1.8 documentation](index.html) »

Capabilities[¶](#capabilities "Permalink to this headline")
===========================================================

MAAS publishes a special view at `.../api/1.0/version/`{.docutils
.literal} that returns a list of the server’s capabilities. It’s
transferred as a JSON document:

    {"capabilities": ["name-of-capability", ...]}

List of capabilities[¶](#list-of-capabilities "Permalink to this headline")
---------------------------------------------------------------------------

Check for the following strings in the capabilities list to see what
features the MAAS server supports. Use these in preference to gating on
the version when creating a client application.

`networks-management`{.docutils .literal}
:   Passive modelling of the network environment that cluster
    controllers nodes are in, including network interfaces, subnets,
    VLAN tags, and connectivity between them. See
    [*Networks*](networks.html#networks) for more information.

`static-ipaddresses`{.docutils .literal}
:   Static IP address allocation to nodes, including user-reserved IPs
    and admin- allocated ‘sticky’ IPs. Available since version 1.6. See
    [*Static IPs*](static-ips.html#static-ips) for more information.

`ipv6-deployment-ubuntu`{.docutils .literal}
:   Deploy Ubuntu nodes with IPv6 networking enabled. See [*Managing
    IPv6 Networks*](ipv6.html#ipv6) for more about this feature.

`devices-management`{.docutils .literal}
:   Management of devices (non-installable nodes). Available since
    version 1.8. See [*Devices*](devices.html#devices) for more about
    this feature.

[![MAAS
logo](_static/maas-logo-200.png)](index.html "MAAS Documentation Homepage")

MAAS {style="text-align:center;"}
----

Metal As A Service.

\
 \

-   [Capabilities](#)
    -   [List of capabilities](#list-of-capabilities)

### Related Topics

-   [Documentation overview](index.html)
    -   Previous: [Command Line
        Interface](maascli.html "previous chapter")
    -   Next: [Getting help](getting-help.html "next chapter")

### This Page

-   [Show Source](_sources/capabilities.txt)

### Quick search

Enter search terms or a module, class or function name.

### Navigation

-   [next](getting-help.html "Getting help")
-   [previous](maascli.html "Command Line Interface") |
-   [MAAS 1.8 documentation](index.html) »

© Copyright 2012-2015, MAAS Developers. Ubuntu and Canonical are
registered trademarks of [Canonical Ltd](http://canonical.com).

Revision 4036 (2015-08-05 16:30:57 +0000). Documentation generation
date: 2015-08-12 22:30:33 +0100.
