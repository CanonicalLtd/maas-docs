Title: CLI DHCP Snippet Management
TODO:  Include non-trivial examples of DHCP snippets
       Bug check: https://bugs.launchpad.net/maas/+bug/1623192
table_of_contents: True


# CLI DHCP Snippet Management

This is a list of DHCP snippet management tasks to perform with the MAAS CLI.
See [MAAS CLI][manage-cli] to get started with the CLI and
[DHCP snippets][dhcp-snippets] for an overview of this topic.


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


## Delete a snippet

To delete a snippet:

```bash
maas $PROFILE dhcpsnippet delete $DHCP_SNIPPET_ID
```

The snippet name can also be used in place of its ID.


<!-- LINKS -->

[manage-cli]: manage-cli.md
[dhcp-snippets]: installconfig-network-dhcp.md#dhcp-snippets
