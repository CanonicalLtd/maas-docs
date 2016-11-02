Title: IPv6 | MAAS


# IPv6

Current support for IPv6 in MAAS is similar to support for IPv4 but with the
following caveats:

- MAAS uses IPv4 for its internal operation (adding/deploying nodes).
- IPv6 is only supported on networks where MAAS also manages IPv4 DHCP.
- A node's network interface can be on only a single IPv6 subnet.
- A rack controller's network interface can only manage a single IPv6 subnet.

A rack controller in an IPv6 context needs to have the region API server URL
specified by hostname. See 
[install a rack controller](installconfig-rack.md#install-a-rack-controller)
for details.

The [web UI](installconfig-gui.md) and the [MAAS CLI](manage-cli.md) (logging
in to the API server) can be accessed in the same way on both IPv4 and IPv6.
To use an IPv6 address in a URL surround it with square brackets. For example,
on the local machine (`::1`, the IPv6 equivalent of `localhost`):

```nohighlight
http://[::1]:5240/MAAS/
```

!!! Note: Most BMCs can only be controlled over IPv4.


## Enable IPv6

You enable IPv6 networking in the same way that you enable IPv4 networking:
configure a separate rack controller interface for your IPv6 subnet, in
addition to the one you need for your IPv4 subnet. The IPv6 interface must
define a static address range. Provided that you already have a functioning
IPv6 network, that's all there is to it. The following sections will go into
more detail about what is supported, what is needed, and what to do if you
don't yet have a functioning IPv6 network.

An IPv6 interface can use the same network interface on the rack controller as
an existing IPv4 network interface. It just defines a different subnet, with
IPv6 addressing. A node that's connected to the IPv4 subnet will also be
connected to the IPv6 subnet on the same network segment.

### Configure an IPv6 subnet

Define a reserved static IP range and nodes deployed on the subnet will get a
static address in this range. Since IPv6 networks are normally 64 bits wide you
can be generous with the range size. Leave the netmask and broadcast address
fields blank.

You may want MAAS to manage DHCP and DNS, but it's not required. In fact nodes
do not need a DHCP server at all for IPv6; MAAS configures static IPv6
addresses on a node's network interface while deploying it. A DHCPv6 server
can provide addresses for containers or virtual machines running on the nodes,
as well as devices on the network that are not managed by MAAS, but it is not
needed for the nodes themselves. MAAS will not be aware of any addresses
issued by DHCP, and does not guarantee that they will stay unchanged.

### Routing

In IPv6, clients do not discover routes through DHCP. Routers make themselves
known on their networks by sending out *route advertisements*. These *RAs*
contain other configuration as well: whether clients should statelessly
configure their own unique IP addresses based on their MAC addresses; whether
they should request stateless configuration from a DHCP server; and finally,
whether they should request a stateful IP address from a DHCP server. Since a
network interface can have any number of IPv6 addresses even on a single
subnet, several of these address assignment mechanisms can be combined.

However, when MAAS configures IPv6 networking on a node, it does not rely on
RAs. It statically configures a node's default IPv6 route to use the router
that is configured on the cluster interface, so that the node will know their
default gateway. They do not need DHCP and will not autoconfigure global
addresses.

However, if you are planning to operate DHCPv6 clients as well, e.g. on
machines not managed by MAAS or on virtual machines hosted by MAAS nodes, you
may still want to have RAs configured to make those clients obtain
configuration over DHCP.

If you need RAs but your gateway does not send them, install and configure
`radvd` somewhere on the network to advertise its route.

<!-- LEAVE THIS OUT FOR NOW
### Other installers and operating systems

Static IPv6 addresses are currently only configured on Ubuntu, when installed
using the "fast" installer. Other operating systems, or Ubuntu with the
classic Debian installer, will not have their IPv6 addresses configured. The
same applies when a user manually installs an operating system on a node, or
overwrites its networking configuration: the node will no longer have its
static IPv6 address configured, even if MAAS has allocated it to the node.

However, as long as the address remains allocated to the node, you may still
configure its operating system to use that address. The node can then use that
address as if it had been configured by MAAS.
-->

<!-- LEAVE THIS OUT FOR NOW. I DO NOT SEE THIS OPTION IN THE WEB UI ANYWAY.
## Disable IPv4

For advanced users, there is an experimental capability to deploy nodes with
pure IPv6, with IPv4 networking disabled. To enable this on a node, check the
"Disable IPv4 when deployed" box on the node's Edit page. The process of
managing and deploying the node will still largely work through IPv4, but once
deployed, the node will have IPv6 networking only.

In practice nodes may not be functional without IPv4 networking. A few things
are known to be needed in any case:
-->
