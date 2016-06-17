Title: Static IPs

# Static IPs

Previously, MAAS relied on the DHCP server to allocate its own IP addresses to
nodes, using the IP range defined on the relevant cluster interface. This was
found to be unreliable since the IPs were only known once the node had booted
and requested an address, and had race conditions when the lease expired and
another machine was looking for its own IP.

MAAS now defines an additional range on the cluster for static IPs that are
allocated by MAAS itself (see [rack-configuration](./installconfig-rack.html)
for more information about this).

In normal operation, MAAS will automatically choose and allocate a static IP
to any node network interfaces where it knows on which cluster interface that
node interface is connected. 

You can choose to change this default behaviour from within the GUI by
selecting a 'Ready' or 'Broken' node from the `Nodes` page, and scrolling down
to the `Interfaces` section. Alongside each interface, in the `IP Address`
column, you can use the drop-down menu to select between `Auto Assign`, `Static
Assign`, `DHCP` and `Unconfigured`. Selecting `Static Assign` will add a new
field beneath the menu where you can enter the IP address you'd like to
allocate to the interface. 

!["static ip"](./media/maas-gui-staticip.png)

## Unmanaged user-allocated IPs

The API allows users to request an IP address for use in any way they
see fit. The IP is not tied to any node in MAAS and is guaranteed not to be in
use by MAAS itself. You can specify either a subnet or a specific IP address
within a subnet. 

To reserve a specific IP address from the command line, enter the following:

```bash
maas admin ipaddresses reserve ip_address=192.168.122.149
```

Successful output would look similar to the following:

```yaml
Success.
Machine-readable output follows:
{
    "created": "2016-06-17T17:44:25.073",
    "resource_uri": "/MAAS/api/2.0/ipaddresses/",
    "subnet": {
        "vlan": {
            "dhcp_on": true,
            "secondary_rack": null,
            "vid": 0,
            "mtu": 1500,
            "fabric": "fabric-0",
            "name": "untagged",
            "external_dhcp": null,
            "resource_uri": "/MAAS/api/2.0/vlans/5001/",
            "primary_rack": "4y3h7n",
            "id": 5001
        },
        "dns_servers": [],
        "cidr": "192.168.122.0/24",
        "name": "192.168.122.0/24",
        "allow_proxy": true,
        "space": "space-0",
        "gateway_ip": "192.168.122.1",
        "resource_uri": "/MAAS/api/2.0/subnets/1/",
        "rdns_mode": 2,
        "id": 1
    },
    "ip": "192.168.122.149",
    "alloc_type": 4
}
```

To remove the IP address, use the `release` operation:

```bash
maas admin ipaddresses release ip=192.168.122.149
```

Further details on assigning and removing IP addresses can be found within the
full [API documentation](https://maas.ubuntu.com/docs/api.html).
