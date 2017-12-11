Title: CLI Interface Management
table_of_contents: True


# CLI Interface Management

This is a list of interface management tasks to perform with the MAAS CLI. See
[MAAS CLI][manage-cli] on how to get started.

See [Networking][networking] for an overview of networking and 
[Commission Nodes][commission-nodes] for more details on managing interfaces
from the MAAS web UI.


## Interface identifiers

A numeric interface identifier is used by the MAAS CLI for many interface
operations. Use the following command to retrieve the identifier(s):

```bash
maas $PROFILE interfaces read $SYSTEM_ID
```

Look for either *id* or the number at the end of an interface's resource URI,
such as **15** in the following example output:

```json
"id": 15,
"mac_address": "52:54:00:55:06:40",
...
"name": "ens9",
...
"resource_uri": "/MAAS/api/2.0/nodes/4efwb4/interfaces/15/"
```

## Create a Bond interface

A bond interface is used to aggregate two or more more physical interfaces into
a single logical interface. A bond can be created with the following command:

```bash
maas $PROFILE interfaces create-bond $SYSTEM_ID name=$BOND_NAME \
parents=$IFACE1_ID mac_address=$MAC_ADDR \ 
parents=$IFACE2_ID bond_mode=$BOND_MODE \
bond_downdelay=$BOND_DOWN bond_updelay=$BOND_UP mtu=$MTU
```

Use the 'parents' parameters to define which interfaces form the aggregation.
The following is an example of 'create-bond' in action:

```bash
maas admin interfaces create-bond 4efwb4 name=bond0 parents=4 \
mac_address=52:52:00:00:00:00 parents=15 bond_mode=802.3ad bond_downdelay=200 \
bond_updelay=200 mtu=9000
```

See [Bond interfaces][commission-nodes-bond] for details on supported bond
modes and their actions.

## Create a Bridge interface

A bridge interface is created with the following syntax:

```bash
maas $PROFILE interfaces create-bridge $SYSTEM_ID name=$BRIDGE_NAME \
parent=$IFACE_ID
```

Use 'parent' to define the primary interface used for the bridge:

```bash
maas admin interfaces create-bridge 4efwb4 name=gmbridged0 parent=4
```

## Delete an interface

The 'delete' command can be used to delete a bridge interface, a bond interface
or a physical interface:

```bash
maas $PROFILE interface delete $SYSTEM_ID $IFACE_ID
```

For example:

```bash
maas admin interface delete 4efwb4 15
```

The following is output after the successful deletion of an interface:

```no-highlight
Success.
Machine-readable output follows:

```

!!! Note:
    There is no machine-readable output after the successful execution of the
    delete command.

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
corresponds to the VLAN tag. You must first create the VLAN and then associate
it with the interface:

```bash
maas $PROFILE interfaces create-vlan $SYSTEM_ID vlan=$OUTPUT_VLAN_ID \
parent=$IFACE_ID
```

!!! Note:
    **OUTPUT_VLAN_ID** corresponds to the *id* value output when the VLAN was
    created. 

The following example contains values that correspond to the output above:

```bash
maas admin interfaces create-vlan 4efwb4 vlan=5004 parent=4
```

The above command generates the following output:

```json
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

Using the values from previous examples, this is executed as:

```bash
maas admin vlan delete 0 100
```

<!-- LINKS -->

[manage-cli]: manage-cli.md
[manage-cli-sysid]: manage-cli-common.md#determine-a-node's-system-id
[networking]: installconfig-networking.md
[commission-nodes]: nodes-commission.md
[commission-nodes-bond]: nodes-commission.md#bond-interfaces
