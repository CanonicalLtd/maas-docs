Title: Configure Networking
TODO: 	Write new 'Configure Nodes for Networking' section (see issue #33)
	Split and update this document
	Write details for performing the same tasks from within the GUI

# Configure Networking

At a high level, MAAS supports the following networking concepts:

### Fabrics

A fabric is a set of interconnected VLANs that are capable of mutual
communication. A fabric can be thought of as a logical grouping in which VLANs
can be considered unique.

For example, a distributed network may have a fabric in London containing VLAN
100, while a separate fabric in San Francisco may contain a VLAN 100, whose
attached subnets are completely different and unrelated.

A "Default Fabric" is created when MAAS is installed (or upgraded).

### Subnets

A subnet is a "layer 3" network defined by a particular network prefix, plus a
network mask length (in bits). This notation is also referred to as a *CIDR*.

MAAS supports IPv4 and IPv6 subnets.

Examples:

```no-highlight
    10.0.0.0/8
    172.16.0.0/12
    192.168.0.0/16
    2001:db8:4d41:4153::/64
```

Subnets can be annotated with a descriptive name, their default gateway,
and/or their DNS server(s).

A subnet can be in a single space.

Subnets are considered managed if a cluster interface specifies the cluster
network range.

### VLANs

VLANs (Virtual LANs) are a common way to create logically separate networks
using the same physical infrastructure.

Managed switches can assign VLANs to each port in either a "tagged" or an
"untagged" manner. A VLAN is said to be "untagged" on a particular port when
it is the default VLAN for that port, and requires no special configuration in
order to access.

"Tagged" VLANs (traditionally used by network administrators in order to
aggregate multiple networks over inter-switch "trunk" lines) can also be used
with nodes in MAAS. That is, if a switch port is configured such that "tagged"
VLAN frames can be sent and received by a MAAS node, that MAAS node can be
configured to automatically bring up VLAN interfaces, so that the deployed
node can make use of them.

A "Default VLAN" is created for every Fabric, to which every new VLAN-aware
object in the fabric will be associated to by default (unless otherwise
specified).

### Spaces

A Space is a logical grouping of subnets that should be able to communicate
with each other. Subnets within each space need not belong to the same fabric.
For example, you may have a "DMZ" space in both your London and San Francisco
fabrics, and a "Storage" space to indicate subnets attached to your storage
network.

A "space-0" is created when MAAS is installed (or upgraded), which every
subnet will belong to by default (unless otherwise specified).

### Interfaces

**Physical**

After a node is commissioned, MAAS discovers its physical interfaces. In
addition, devices are created with physical interfaces.

Prior to deployment, a MAAS administrator can specify additional interfaces to
be configured on the node, including one or more of the below types.

**Bond**

A bond interface is capable of aggregating two or more physical interfaces
into a single logical interface. Bonds can be used in conjunction with a
managed switch (using Link Aggregation and Control Protocol, or LACP), or
independently (software bonds).

**VLAN**

A VLAN interface can be used to connect to a tagged VLAN, if the switch port
the node is connected to is authorized to access it.

**Unknown**

Unknown interfaces cannot be created by users.

Sometimes, *unknown* interfaces are discovered by MAAS. (For example, when
MAAS learns of a new DHCP lease that is not associated with any known node or
device.)
