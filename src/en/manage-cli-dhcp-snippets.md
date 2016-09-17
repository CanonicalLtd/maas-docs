Title: MAAS CLI | DHCP snippets
TODO:  Include non-trivial examples of DHCP snippets
       Bug check: https://bugs.launchpad.net/maas/+bug/1623192


# CLI DHCP Snippet Management

This is a list of DHCP snippet management tasks to perform with the MAAS CLI.
See [MAAS CLI](manage-cli.md) on how to get started.

See [DHCP](installconfig-dhcp.md#dhcp-snippets) for an overview of DHCP
snippets.


## Create a snippet

When a snippet is created, it is enabled by default.

To create a **global** snippet:

```bash
maas $PROFILE dhcpsnippets create name=$DHCP_SNIPPET_NAME \
	value=$DHCP_CONFIG description=$DHCP_SNIPPET_DESCRIPTION \
	global_snippet=true
```

To create a **subnet** snippet:

```bash
maas $PROFILE dhcpsnippets create name=$DHCP_SNIPPET_NAME \
	value=$DHCP_CONFIG description=$DHCP_SNIPPET_DESCRIPTION \
	subnet=$SUBNET_ID
```

A subnet given in CIDR format can also be used in place of the subnet ID.

To create a **node** snippet:

```bash
maas $PROFILE dhcpsnippets create name=$DHCP_SNIPPET_NAME \
	value=$DHCP_CONFIG description=$DHCP_SNIPPET_DESCRIPTION \
	node=$NODE_ID
```

A hostname can also be used in place of the node ID.


## List snippets

To list all snippets (and their characteristics) in the MAAS:

```bash
maas $PROFILE dhcpsnippets read
```

To list a specific snippet:

```bash
maas $PROFILE dhcpsnippet read id=$DHCP_SNIPPET_ID
```

The snippet name can also be used instead of its ID:

```bash
maas $PROFILE dhcpsnippet read name=$DHCP_SNIPPET_NAME
```


## Update a snippet

Update a snippet attribute:

```bash
maas $PROFILE dhcpsnippet update $DHCP_SNIPPET_ID <option=value>
```

The snippet name can also be used in place of its ID.


## Enable or disable a snippet

Enabling and disabling a snippet is considered a snippet update and is done via
a boolean option ('true' or 'false'). This is how a snippet is disabled:

```bash
maas $PROFILE dhcpsnippet update $DHCP_SNIPPET_ID enabled=false
```

The disabling of a snippet removes the text that was added to the dhcpd.conf
file when it was created/enabled.

<!--

THE USEFULNESS OF THIS IS QUESTIONABLE. IT MAY BELONG IN THE DEFINITIVE CLI
DOCUMENTATION. LET'S LEAVE THIS OUT FOR NOW.

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

-->

## Delete a snippet

To delete a snippet:

```bash
maas $PROFILE dhcpsnippet delete $DHCP_SNIPPET_ID
```

The snippet name can also be used in place of its ID.
