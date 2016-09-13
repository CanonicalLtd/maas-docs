Title: MAAS CLI | DHCP snippets
TODO:  Include non-trivial examples of DHCP snippets


# CLI DHCP Snippet Management

This is a list of DHCP snippet management tasks to perform with the MAAS CLI.
See [MAAS CLI](./manage-cli.html) on how to get started.

See [DHCP](./installconfig-dhcp.html#dhcp-snippets) for an overview of DHCP snippets.


## Create a snippet

To create a global snippet:

```bash
maas $PROFILE dhcpsnippets create name=$DHCP_SNIPPET_NAME \
	value=$DHCP_CONFIG description=$DHCP_SNIPPET_DESCRIPTION \
	global_snippet=true
```

To create a snippet for a subnet:

```bash
maas $PROFILE dhcpsnippets create name=$DHCP_SNIPPET_NAME \
	value=$DHCP_CONFIG description=$DHCP_SNIPPET_DESCRIPTION \
	subnet=$SUBNET_ID
```

A subnet given in CIDR format can also be used in place of the subnet ID.

To create a snippet for a node:

```bash
maas $PROFILE dhcpsnippets create name=$DHCP_SNIPPET_NAME \
	value=$DHCP_CONFIG description=$DHCP_SNIPPET_DESCRIPTION \
	node=$NODE_ID
```

A hostname can also be used in place of the node ID.


## Enable or disable a snippet

DHCP Snippets can be turned off by passing `false` to the enabled flag option
as follows:

```bash
maas $PROFILE dhcpsnippets create name=$DHCP_SNIPPET_NAME value=$DHCP_CONFIG enabled=false
```

## List snippets

To list all snippets in the MAAS:

```bash
maas $PROFILE dhcpsnippets read
```

To list a particular DHCP Snippet use the following command.:

```bash
maas $PROFILE dhcpsnippet read <DHCP Snippet id or name>
```

## Update a snippet

$PROFILEistrators can update the DHCP Snippet attributes using the following
command:

```bash
maas $PROFILE dhcpsnippet update <DHCP Snippet id or name> <options>
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
maas $PROFILE dhcpsnippet revert <DHCP Snippet id or name> to=<value id or negative number>
```

## Delete a snippet

$PROFILEistrators can delete a DHCP Snippet using the following command:

```bash
maas $PROFILE dhcpsnippet delete <DHCP Snippet id or name>
```
