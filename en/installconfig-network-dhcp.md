

# DHCP

MAAS enlists and commissions nodes through the use of its own DHCP server
running on an untagged VLAN. Although this *MAAS-managed DHCP* can also be
part of the deploy phase, an *external DHCP server* can optionally be used
instead for this purpose (on a tagged VLAN). If MAAS detects an external DHCP
server it will display it on the rack controller's page, accessible by
selecting 'Controllers' from the top menu in the web UI.

Normally the machine subnet is on the untagged VLAN, but if this is not the case
then DHCP packets will need to be specially routed between the subnet and the
MAAS-provided DHCP subnet. It is also possible to forward DHCP traffic from one
VLAN to another using an external DHCP relay service.

Using an external DHCP server for enlistment and commissioning may work but
this is not supported. By doing so you also forfeit the IP management ability
of MAAS since synchronization (e.g. notifications that leases should be
squashed when a node is returned to the pool) between it and the DHCP server
will be severed. [High availability][manage-ha] and DHCP relay integration (see
below) are also dependent upon MAAS-managed DHCP.

**This documentation presupposes that MAAS-managed DHCP is used to enlist and
commission nodes.**

Required reading before continuing:

- [Concepts and terms][concepts-ipranges] for an explanation of reserved IP
  ranges
- [Commission nodes][post-commission-configuration] for an explanation of IP
  assignment modes


## Enabling DHCP

A *reserved dynamic IP range* is needed in order for MAAS-managed DHCP to at
least enlist and commission nodes and the creation of such a range is part of
the process of enabling DHCP with the web UI. See [MAAS CLI][cli-enable-dhcp]
for doing this with the CLI.

To enable MAAS-managed DHCP, under the 'Subnets' page select the desired VLAN
and then:

1. Under the 'Take action' button select 'Provide DHCP'. A new window will
appear.
1. Select the primary rack controller. For DHCP HA, select both the primary
and the secondary.
1. Create a reserved dynamic IP range. Fill in the fields 'Dynamic range start
IP' and 'Dynamic range end IP'.
1. Apply your changes with the 'Provide DHCP' button.

![Enable DHCP][img__enable-dhcp]

Now, addresses in this range will get assigned to machines that are being
either enlisted or commissioned.

In addition, if a node being deployed has an interface connected to the
untagged VLAN and it has an IP assignment mode set to 'DHCP' then it will also
get an address in this range.


## Extending a reserved dynamic IP range

If necessary, it is possible to add further portions of the subnet to the
dynamic IP range (see [IP ranges][ipranges]). Furthermore, since DHCP is
enabled on a VLAN basis and a VLAN can contain multiple subnets, it is possible
to add a portion from those subnets as well. Just select the subnet under the
'Subnets' page and reserve a dynamic range. DHCP will be enabled automatically.


## External DHCP and a reserved IP range

If an external DHCP server will be used to deploy machines then a *reserved IP
range* should be created to prevent the address namespace from being corrupted.
For instance, address conflicts may occur if a node's IP assignment mode is set
to 'Auto assign' in the context of an external DHCP server. See
[IP ranges][ip-ranges] to create such a range. It should correspond
to the lease range of the external server.


## DHCP relay

DHCP relaying in MAAS is an advanced feature and should not be implemented
without sufficient planning and study. In particular, MAAS does not provide the
actual relay. It must be set up as an external service by the administrator.
What MAAS does provide is the DHCP configuration that MAAS-managed DHCP
requires in order to satisfy any client requests relayed from another VLAN.

To relay from one VLAN (source) to another VLAN (target):

1.  Ensure the target VLAN has DHCP enabled  

1.  Set up the external relay  
    This is done independently from MAAS. See [DHCP relay][concepts-dhcp-relay]
    for software suggestions.

1.  Configure MAAS-managed DHCP  
    Navigate to the source VLAN page and select the 'Relay DHCP' action. Fill in the
    fields in the resulting form. The crucial setting is the target VLAN ('Relay
    VLAN'). Press the 'Relay DHCP' button to finish. See
    [MAAS CLI][cli-relay-dhcp] for how to do this with the CLI.

![Relay DHCP][img__relay-dhcp]


## DHCP Snippets

When DHCP is managed from within MAAS, it can be customized through the use of
*DHCP snippets*. These are user defined configuration options that can be
applied either globally, per subnet, or per node. A global snippet is applied
to all VLANs, subnets, and nodes. All three types end up in
`/var/lib/maas/dhcpd.conf` or `/var/lib/maas/dhcpd6.conf`. For information on
what options to use refer to the [`dhcpd.conf` man page][dhcpd.conf-man-page].

> ⓘ Modifications made directly to `dhcpd.conf.template` or `dhcpd6.conf.template` are not supported.

To manage snippets, as an admin, open the 'Settings' page and click on the
'DHCP snippets' tab.

For example, to create a new snippet press 'Add custom snippet'. In the
resulting window choose a name and type for it and enter its associated DHCP
configuration. Click 'Save snippet' to apply the change and make sure the
checkbox is activated in the 'Enabled' column of the snippets list.

![Manage DHCP snippets][img__dhcp-snippets]

See [MAAS CLI][cli-dhcp-snippets] for doing this with the CLI.


<!-- LINKS -->

[manage-ha]: manage-ha.md
[ipranges]: installconfig-network-ipranges.md
[concepts-ipranges]: intro-concepts.md#ip-ranges
[concepts-dhcp-relay]: intro-concepts.md#dhcp-relay
[post-commission-configuration]: nodes-commission.md#post-commission-configuration
[dhcpd.conf-man-page]: http://manpages.ubuntu.com/cgi-bin/search.py?q=dhcpd.conf
[cli-enable-dhcp]: manage-cli-common.md#enable-dhcp
[cli-relay-dhcp]: manage-cli-advanced.md#relay-dhcp
[cli-dhcp-snippets]: manage-cli-dhcp-snippets.md

[img__enable-dhcp]: ../media/installconfig-networking-dhcp__2.4_enable-dhcp.png
[img__relay-dhcp]: ../media/installconfig-networking-dhcp__2.4_relay-dhcp.png
[img__dhcp-snippets]: ../media/installconfig-networking-dhcp__2.4_dhcp-snippets.png
