Title: DHCP
TODO:  Include non-trivial examples of DHCP snippets


# DHCP

In order for MAAS to manage machines, and more specifically, in order to
enlist, commission and deploy machines, it needs to provide DHCP (and PXE
booting) on at least one untagged VLAN. However, an external DHCP instance can
still be used on a tagged VLAN in order to service already deployed machines. 

Normally the machine subnet is on the above VLAN, but if this is not the case
then DHCP packets will need to be specially routed between the subnet and the
MAAS-provided DHCP subnet. 


## Competing DHCP

Enabling your own DHCP server that competes with one that's being managed by
MAAS can cause serious disruption. Make sure you understand the implications of
running a DHCP server before doing this. If MAAS detects external DHCP servers
on its networks, it will show them on the rack controller page in the web UI.


## Dynamic IP ranges

A dynamic IP range is needed in order for MAAS to be able to provide DHCP for
machines. Addresses in the range get assigned to machines that are being:

- auto-registered (also called enlisted)
- commissioned

Deployed machines will obtain IP addresses from the part of the subnet that is
*not* included in the above dynamic range. Such a "deployment IP range" does
not need to be specified. These addresses will remain allocated to machines
throughout their deployment lifecycle.


## Enabling DHCP

Under the 'Networks' tab choose a VLAN and enable DHCP:

1. Under the 'Take action' button select 'Provide DHCP'. A new window will
appear.
1. Select the primary rack controller. For DHCP HA, select both the primary
and the secondary.
1. Create a dynamic IP range. Fill in the fields 'Dynamic range start IP' and
'Dynamic range end IP'.
1. Configure a default gateway. Fill in the field 'Gateway IP'.
1. Apply your changes with the 'Provide DHCP' button.

![image](./media/vlan_provide_dhcp.png)

See [MAAS CLI](./manage-cli-common.html#enable-dhcp) for doing this with the CLI.

If necessary, it is possible to add further portions of the subnet to the
dynamic IP range (see
[Reserved IP addresses](./installconfig-network-static.html#reserved-ip-addresses)
). Furthermore, since DHCP is enabled on a VLAN basis and a VLAN can contain
multiple subnets, it is possible to add a portion from those subnets as well.
Just select the subnet under the 'Networks' tab and reserve a dynamic range.
DHCP will be enabled automatically.


## DHCP Snippets

When DHCP is managed from within MAAS, it can be configured through the use of
*DHCP snippets*. These are user defined configuration options that can be
applied either globally, per subnet, or per node. For information on what
options to use refer to standard
[`dhcpd.conf` documentation](http://manpages.ubuntu.com/cgi-bin/search.py?q=dhcpd.conf).

!!! Note: This feature is available in MAAS versions 2.0 and above.
Modifications made directly to `dhcpd.conf.template` or `dhcpd6.conf.template` are
no longer supported.

### Create a snippet

Administrators can create snippets over the API using the following
command:

```bash
maas admin dhcpsnippets create name=<DHCP Snippet Name> value=<DHCP configuration options>
```

The name of the DHCP snippet will be added to `/var/lib/maas/dhcpd.conf` and
`/var/lib/maas/dhcpd6.conf` as a comment above the value. Optionally a
description can also be specified as such:

```bash
maas admin dhcpsnippets create name=<DHCP Snippet Name> value=<valid DHCP configuration options> description=<DHCP Snippet description>
```

### Global snippets

If no subnet or node is specified, the DHCP Snippet will be considered global.
A global DHCP Snippet is a configuration option which is applied to all VLANS,
subnets, and nodes. The `global_snippet` flag can also be used to force a DHCP
Snippet to be global:

```bash
maas admin dhcpsnippets create name=<DHCP Snippet Name> value=<valid DHCP configuration options> global_snippet=true
```

### Subnet snippets

DHCP Snippets can be applied only to a specific subnet as follows:

```bash
maas admin dhcpsnippets create name=<DHCP Snippet Name> value=<valid DHCP configuration options> subnet=<subnet id or cidr>
```

### Node snippets

DHCP Snippets can be applied only to a specific node. When a node is
specified, each snippet will be added to the host entry for each interface. A
node can be specified as follows:

```bash
maas admin dhcpsnippets create name=<DHCP Snippet Name> value=<valid DHCP configuration options> node=<system_id or hostname>
```

### Snippet enablement

DHCP Snippets can be turned off by passing `false` to the enabled flag option
as follows:

```bash
maas admin dhcpsnippets create name=<DHCP Snippet Name> value=<valid DHCP configuration options> enabled=false
```

## List snippets

To list all DHCP Snippets use the following command:

```bash
maas admin dhcpsnippets read
```

To list a particular DHCP Snippet use the following command.:

```bash
maas admin dhcpsnippet read <DHCP Snippet id or name>
```

## Update a snippet

Administrators can update the DHCP Snippet attributes using the following
command:

```bash
maas admin dhcpsnippet update <DHCP Snippet id or name> <options>
```

## DHCP Snippet value history

MAAS stores the complete history of changes made to the DHCP Snippet's value.
MAAS only uses the latest revision of the value when writing dhcpd.conf.

### Reverting a value

!!! Warning: Reverting a value will result in all later versions being deleted!

The revert operation allows the user to revert to a previous value. When
specifying what to revert to the user can either provide the value id or a
negative number representing how many revisions to go back:

```bash
maas admin dhcpsnippet revert <DHCP Snippet id or name> to=<value id or negative number>
```

## Delete a snippet

Administrators can delete a DHCP Snippet using the following command:

```bash
maas admin dhcpsnippet delete <DHCP Snippet id or name>
```
