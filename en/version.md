Title: Version
table_of_contents: True

# Version

MAAS publishes a special view at `.../api/1.0/version/` that returns the
version of the MAAS server and the list of the server's capabilities. When
programmatically probing a MAAS installation, use only the `capabilities` list.
Avoid using `version` and `subversion` for anything other than informational
purposes. It's transferred as a JSON document:

```yaml
{
  "subversion": "bzr4001",
  "version": "1.8.0",
  "capabilities": [
    "name-of-capability-1",
      "name-of-capability-2"
  ]
}
```

## List of capabilities

Check for the following strings in the capabilities list to see what features
the MAAS server supports. Use these in preference to gating on the version when
creating a client application.

**networks-management**: Passive modelling of the network environment that
cluster controllers nodes are in, including network interfaces, subnets, VLAN
tags, and connectivity between them. See networks for more information.

**static-ipaddresses**: Static IP address allocation to nodes, including
user-reserved IPs and admin-allocated 'sticky' IPs. Available since version
1.6. See static-ips for more information.

**ipv6-deployment-ubuntu**: Deploy Ubuntu nodes with IPv6 networking enabled.
See ipv6 for more about this feature.

**devices-management**: Management of devices (non-installable nodes).
Available since version 1.8. See devices for more about this feature.

**storage-deployment-ubuntu**: Deploy nodes with custom storage layout and
configuration. Available since version 1.9 on Ubuntu deployments. See storage
for more about this feature.

**network-deployment-ubuntu**: Deploy nodes with custom network layout and
configuration. Available since version 1.9 on Ubuntu deployments. See
networking for more about this feature.
