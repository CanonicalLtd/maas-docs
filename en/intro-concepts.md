Title: Concepts and Terms | MAAS 
TODO:  Consider CLI commands for every node action and link from here
       QA node actions
table_of_contents: True


# Concepts and Terms

Here are some common terms that are essential to grasp in order to fully enjoy
MAAS, not to mention the rest of this documentation.


## Nodes

A *node* is a general term that refers to multiple, more specific objects.
Basically, it is a networked object that is known to MAAS.

Nodes include:

- Controllers
- Machines
- Devices

### Controllers

There are two types of controllers: a *region controller* and a *rack
controller*.

A region controller consists of:

- REST API server (TCP port 5240)
- PostgreSQL database
- DNS
- caching HTTP proxy
- web UI

A region controller can be thought of as being responsible for a data centre.

A rack controller provides:

- DHCP
- TFTP
- HTTP (for images)
- iSCSI
- power management

A rack controller is attached to each "fabric". As the name implies, a common
setup is to have a rack controller in each data centre server rack.

Both the region controller and the rack controller can be scaled-out as well
as made highly available. See [MAAS HA](manage-maas-ha.md) for high
availability.

### Machines

A *machine* is a node that can be deployed by MAAS.

### Devices

A *device* is a non-deployable node. This entity can be used to track
routers, for example.

Devices can be assigned IP addresses (static or dynamic) and DNS names.

They can also be assigned a parent node and will be automatically deleted
(along with all the IP address reservations associated with it) when the
parent node is deleted or released. This is designed to model and manage the
virtual machines or containers running inside a MAAS-deployed node.


## Zones

A *physical zone*, or just *zone*, is an organizational unit that contains
nodes where each node is in one, and only one, zone. Later, while in
production, a node can be taken (allocated) from a specific zone (or not from a
specific zone). Since zones, by nature, are custom-designed (with the exception
of the 'default' zone), they provide more flexibility than a similar feature
offered by a public cloud service (ex: availability zones).

Some prime examples of how zones can be put to use include fault-tolerance,
service performance, and power management. See
[Zone Examples](intro-concepts-zones.md) for an elaboration.

A newly installed MAAS comes with a default zone, and unless a new zone is
created all nodes get placed within it. You can therefore safely ignore the
entire concept if you're not interested in leveraging zones.

The 'default' zone cannot be removed and its name cannot be edited.


## Regions

A *region* is an organizational unit one level above a zone. It contains all
information of all machines running in any possible zones. In particular, the
PostgreSQL database runs at this level and maintains state for all these
machines.


## Series

A *series* is essentially an operating system version. For Ubuntu, a series
takes into account HWE kernels. In practical terms, a series manifests itself
in the form of install *images* that are used to provision MAAS machines.
Various series are selected by the MAAS administrator.


## Images

An *image* is used to provision a MAAS machine. MAAS images are imported based
on what series have been selected. This is typically done once the install of
MAAS is complete. MAAS only becomes functional once images have been imported.


## Fabrics

A *fabric* is a set of interconnected VLANs that are capable of mutual
communication. A fabric is a logical grouping of unique VLANs. A default fabric
('fabric-0') is created for each detected subnet when MAAS is installed.


## Spaces

A *space* is a logical grouping of subnets that are able to communicate
with each other. Subnets within each space need not belong to the same fabric.
A default space ('space-0') is created when MAAS is installed and includes all
detected subnets.


## Tags

A *tag* (not to be confused with VLAN tags) is user-created and associated with
nodes based on their physical properties. These can then be used to identify
nodes with particular abilities which can be useful during the deployment of
services.


## Subnets

A *subnet* is a "layer 3" network. It is defined by a network address and a
network mask length (in bits) and is usually written in "CIDR" format. MAAS
supports IPv4 and IPv6 subnets. Examples:

```no-highlight
10.0.0.0/8
172.16.0.0/12
192.168.0.0/16
2001:db8:4d41:4153::/64
```

In MAAS, a subnet is always associated with a single space.

### IP ranges

IP addresses can be reserved by adding one or more reserved ranges to a
subnet configuration. There are two types of ranges that can be defined:

- **Reserved range** An IP range that MAAS will never use. You can use it for
  anything you want (e.g. infrastructure systems, network hardware, external
  DHCP, or the namespace for an OpenStack cloud you will be building). For an
  unmanaged subnet, only addresses in this range are used.

- **Reserved dynamic range** An IP range that MAAS will use for enlisting,
  commissioning and, if MAAS-managed DHCP is enabled on the node's VLAN during
  commissioning, deploying. An initial range is created as part of the DHCP
  enablement process if done with the web UI. For an unmanaged subnet, this
  range is never used.

See
[IP ranges](installconfig-subnets-ipranges.md) for how these ranges get created
and 
[Commission nodes](installconfig-commission-nodes.md#post-commission-configuration)
for how they get used and
[Subnet management](installconfig-network-subnet-management.md) for information
on managed vs. unmanaged subnets.


## VLANs

VLANs (Virtual LANs) are a common way to create logically separate networks
using the same physical infrastructure.

Managed switches can assign VLANs to each port in either a "tagged" or an
"untagged" manner. A VLAN is said to be "untagged" on a particular port when it
is the default VLAN for that port, and requires no special configuration in
order to access it.

"Tagged" VLANs can also be used with nodes in MAAS. That is, if a switch port
is configured such that "tagged" VLAN frames can be sent and received by a MAAS
node, that MAAS node can be configured to automatically bring up VLAN
interfaces, so that the deployed node can make use of them.

A "Default VLAN" is created for every fabric, to which every new VLAN-aware
object in the fabric will be associated with by default (unless specified
otherwise).


## Interfaces

### Physical

After a node is commissioned, MAAS discovers its *physical interfaces*.

A device is always created with at least one physical interface.

Prior to deployment, a MAAS administrator can specify additional interfaces to
be configured on the node, including one or more of the below types.

### Bond

A *bond interface* is capable of aggregating two or more physical interfaces into
a single logical interface. Bonds can be used in conjunction with a managed
switch (using Link Aggregation and Control Protocol, or LACP), or independently
(software bonds).

### VLAN

A *VLAN interface* can be used to connect to a tagged VLAN, if the switch port
the node is connected to is authorized to access it.

### Unknown

*Unknown interfaces* are sometimes discovered by MAAS. For example, a new DHCP
lease that is not associated with any known node or device. Such an interface
cannot be user-created.


## Node statuses

Node *statuses* are labels used to describe the general state of a node as
known to MAAS. A node will undergo various manipulations during their time
spent in MAAS and its status will change accordingly. A status change is
usually caused by an *action* (see next section) that is applied to the node.
Below is the full list of statuses and their meaning, arranged alphabetically.

### Allocated
The node is allocated (reserved) to a MAAS user. See node action 'Acquire'.

### Broken
The node is broken. See node action 'Mark broken'.

### Commissioning
The node is in the process of commissioning. See node action 'Commission'.

### Deployed
The node is deployed. See node action 'Deploy'.

### Deploying
The node is in the process of deploying. See node action 'Deploy'.

### Entering rescue mode
The node is in the process of entering rescue mode. See node action 'Rescue
mode'.

### Exiting rescue mode
The node is in the process of exiting rescue mode. See node action 'Exit rescue
mode'.

### Failed Commissioning
The node failed to commission.

### Failed Deployment
The node failed to deploy.

### New
The first stage of a node's life in MAAS. Typically, a node with this status
has just been added to MAAS.

### Ready
The node has been commissioned and is ready for use.

### Rescue mode
The node is in rescue mode and is ready to accept SSH connections. See node
action 'Rescue mode'.


## Node actions

Node *actions* are essentially: "things you can do with nodes". They can be
triggered via the web UI or the MAAS CLI. With the former, they are managed
with the 'Take action' button in the top right corner. An action usually
changes the *status* (see above section) of a node. Below is the full list of
possible actions and their meaning, arranged alphabetically.

### Abort
Abort any action that can be retried. This currently applies to Commission and
Deploy.

### Acquire
Allocates (reserves) a node to the MAAS user performing the action (and
currently logged in). Changes a node's status from 'Ready' to 'Allocated'.

### Commission
Commissions a node. Changes a node's status from 'New' to 'Commissioning' to
'Ready'.

If unsuccessful, the status becomes 'Failed commissioning'.

Any time a node's underlying networking or disk subsystem has changed it should
be re-commissioned. Typically, you would mark the node as 'Broken' (see below),
implement maintenance, and then Commission.

### Delete
Removes a node from MAAS. The underlying machine remains unaffected.

### Deploy
Deploys a node. Changes a node's status from 'Ready' to 'Deploying' to
'Deployed'. Includes action 'Power on'.

If unsuccessful, the status becomes 'Failed deployment'.

Note that Juju, often used in conjunction with MAAS, also uses the term
"deploy" to mean "deploy an application".

### Exit rescue mode

Changes a node's status from 'Rescue mode' to the 'Exiting rescue mode'
transitory status and then back to its original status when the operation is
complete.

### Mark broken
Marks a node as broken. Changes a node's status to 'Broken'. Includes action
'Power off'.

This can be chosen if any action has failed (such as Commission and Deploy).
Marking it broken guarantees that the node will not get used in any way. This
would normally be followed by some level of investigation so as to determine
the source of the problem.

This action can also be used to indicate that hardware maintenance is being, or
will be, performed that would affect MAAS, such as modifications at the
networking or disk subsystem level.

Finally, some aspects of a node can only be edited when a node's status is
'Broken'. For example, a node's network interface can only be edited via MAAS
if the node has a status of either 'Ready' or 'Broken'.

### Mark fixed
Fixes a broken node. Changes a node's status from 'Broken' to 'New'.

### Power off
Turns a node's underlying machine off.

### Power on
Turns a node's underlying machine on.

### Release
Releases a node back into the pool of available nodes. Changes a node's status
from 'Deployed' (or 'Allocated') to 'Ready'. Includes action 'Power off'.

The user has the opportunity to erase the node's storage (disks) before
confirming the action. A default erasure setting can be configured on the
Settings page. See [Disk erasure](installconfig-storage-erasure.md) for
details.

### Rescue mode

Boot a node ephemerally (Ubuntu running in memory on the underlying machine).
This allows a user SSH to the machine for maintenance purposes. This can be
done for a Deployed or Broken node as well as for a node that failed to deploy.

Authentication and access to the node's storage works the same way it would as
if the node was deployed. The fact that Ubuntu is running ephemerally is
completely transparent to the user.
 
The node status is changed to the 'Entering rescue mode' transitory status and
then to 'Rescue mode' when the operation is complete.

### Set Zone
Puts the node in a specific zone.
