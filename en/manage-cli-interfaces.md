Title: CLI Interface Management
table_of_contents: True


# CLI Interface Management

This is a list of interface management tasks to perform with the MAAS CLI. See
[MAAS CLI][manage-cli] on how to get started.

See [Networking][networking] for an overview of networking and 
[Commission Nodes][commission-nodes] for more details on managing interfaces. 


## Create a Bond interface

A *bond interface* is used to aggregate two more more physical interfaces into
a single logical interface. A bond can be created with the following command:

```bash
maas $PROFILE interfaces create-bond $SYSTEM_ID name=$BOND_NAME \
parents=$IFACE1_ID mac_address=$MAC_ADDR \ 
parents=$IFACE2_ID bond_mode=$BOND_MODE \
bond_downdelay=$BOND_DOWN bond_updelay=$BOND_UP mtu=$MTU
```

Use `maas $PROFILE interfaces read $SYSTEM_ID` to retrieve identifiers for
a node's interfaces.

The following is an example of *create-bond* in action:

```bash
maas admin interfaces create-bond 4efwb4 name=gmbond0 parents=4 \
mac_address=52:52:00:00:00:00 parents=15 bond_mode=802.3ad bond_downdelay=200 \
bond_updelay=200 mtu=9000
```

See [Bond interfaces][commission-nodes-bond] for details on supported bond
modes and their actions.

## Delete an interface

```bash
maas admin interface delete 4efwb4 17

```


## Create a VLAN interface

To create a VLAN interface, use the following syntax:

```bash
maas $PROFILE vlans create $FABRIC_ID name=$NAME vid=$VLAN_ID
```

For example, the following command creates a VLAN called '*Storage network*:

```bash
maas admin vlans create 0 name="Storage network" vid=100
```

The above command generates the following output:

```no-output
Success.
Machine-readable output follows:
{
    "vid": 100,
    "mtu": 1500,
    "dhcp_on": false,
    "external_dhcp": null,
    "relay_vlan": null,
    "name": "Storage network",
    "space": "undefined",
    "fabric": "fabric-0",
    "id": 5004,
    "primary_rack": null,
    "fabric_id": 0,
    "secondary_rack": null,
    "resource_uri": "/MAAS/api/2.0/vlans/5004/"
}
```

Be aware that the $VLAN_ID parameter does not indicate a VLAN ID that
corresponds to the VLAN tag. You must first create the VLAN, and then associate
it with the interface:

```bash
maas $PROFILE interfaces create-vlan $SYSTEM_ID vlan=$OUTPUT_VLAN_ID \
parent=$IFACE_ID
```

!!! Note:
    **OUTPUT_VLAN_ID** corresponds to the *id* value output when the vlan was
    created. 

The following example contains values that correspond to the output above:

```bash
maas admin interfaces create-vlan 4efwb4 vlan=5004 parent=4
```

The above command generates the following output:

```no-highlight
Success.
Machine-readable output follows:
{
    "tags": [],
    "type": "vlan",
    "enabled": true,
    "system_id": "4efwb4",
    "id": 21,
    "children": [],
    "mac_address": "52:54:00:eb:f2:29",
    "params": {},
    "vlan": {
        "vid": 100,
        "mtu": 1500,
        "dhcp_on": false,
        "external_dhcp": null,
        "relay_vlan": null,
        "id": 5004,
        "secondary_rack": null,
        "fabric_id": 0,
        "space": "undefined",
        "fabric": "fabric-0",
        "name": "Storage network",
        "primary_rack": null,
        "resource_uri": "/MAAS/api/2.0/vlans/5004/"
    },
    "parents": [
        "ens3"
    ],
    "effective_mtu": 1500,
    "links": [
        {
            "id": 55,
            "mode": "link_up"
        }
    ],
    "discovered": null,
    "name": "ens3.100",
    "resource_uri": "/MAAS/api/2.0/nodes/4efwb4/interfaces/21/"
}
```

## Delete a VLAN interface

The following command outlines the syntax required to delete a VLAN interface
from the command line:

```bash
maas $PROFILE vlan delete $FABRIC__ID $VLAN_ID
```

Using the values from previous examples, this would be executed as:

```bash
maas admin vlan delete 0 100
```

<!-- LINKS -->

[manage-cli]: manage-cli.md
[manage-cli-sysid]: manage-cli-common.md#determine-a-node's-system-id
[networking]: installconfig-networking.md
[commission-nodes]: nodes-commission.md
[commission-nodes-bond]: nodes-commission.md#bond-interfaces
