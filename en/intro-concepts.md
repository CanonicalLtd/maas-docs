Title: Concepts and Terms
TODO:  Consider CLI commands for every node action and link from the action section
       QA node actions
table_of_contents: True


# Concepts and Terms

Here are some common terms that are essential to grasp in order to fully enjoy
MAAS, not to mention the rest of this documentation.


## Nodes

A *node* is a general term that refers to multiple, more specific objects.
Nodes are managed by MAAS through a life cycle, from adding and enlistment into
MAAS, through commissioning, allocation and deployment. Nodes are then either
released back into the pool of nodes or retired.

Nodes include:

- Controllers
- Machines
- Devices

See [Node actions][node-actions] below for an overview of a node's life cycle.

### Controllers

There are two types of controllers: a *region controller* and a *rack
controller*. The region controller deals with operator requests while one or
more rack controllers provide the high-bandwidth services to multiple server
racks, as typically found in a data centre.

A region controller consists of:

- REST API server (TCP port 5240)
- PostgreSQL database
- DNS
- caching HTTP proxy
- web UI

A region controller can be thought of as being responsible for a data centre,
or a single region. Multiple *fabrics* are used by MAAS to accommodate
subdivisions within a single region, such as multiple floors in a data centre. 

A rack controller provides:

- DHCP
- TFTP
- HTTP (for images)
- power management

A rack controller is attached to each "fabric". As the name implies, a common
setup is to have a rack controller in each data centre server rack. The rack
controller will cache large items for performance, such as operating system
install images, but maintains no exclusive state other than the credentials
required to talk to the region controller.

Both the region controller and the rack controller can be scaled-out as well
as made highly available. See [MAAS HA][maas-ha] for high availability.


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


## Composable hardware

Composable hardware is based on an architecture that allows for the dynamic
composition of machines from a pool of hardware resources (e.g. disk space,
memory, cores). See [Composable hardware][composable-hardware] for details.


## Zones

A *physical zone*, or just *zone*, is an organizational unit that contains
nodes where each node is in one, and only one, zone. Later, while in
production, a node can be taken (allocated) from a specific zone (or not from a
specific zone). Since zones, by nature, are custom-designed (with the exception
of the 'default' zone), they provide more flexibility than a similar feature
offered by a public cloud service (ex: availability zones).

Some prime examples of how zones can be put to use include fault-tolerance,
service performance, and power management. See [Zone examples][zone-examples]
for an elaboration.

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

A *fabric* could be described as a VLAN namespace mechanism. It's a switch or a
combination of switches that use trunking to provide the same VLANs. A
default fabric ('fabric-0') is created for each detected subnet when MAAS is
installed.

The following conceptual diagram shows two fabrics in the same data
centre or region, each using distinct VLAN ranges and their associated subnets:

![fabrics and spaces][img__fabrics-spaces]


## Spaces

A *space* is a logical grouping of VLANs whose subnets are able to communicate
with one another. VLANs within each space need not belong to the same fabric.
A default space is not created when MAAS is installed.

A space's main purpose is to facilitate machine acquisition for
[Juju][about-juju]. Specifically, see [Juju network spaces][juju-network-spaces].


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

### IP ranges

IP addresses can be reserved by adding one or more reserved ranges to a
subnet configuration. There are two types of ranges that can be defined:

- **Reserved range**  
  Mode operates differently depending on whether the subnet is managed or
  unmanaged:
    - **Managed (subnet)**:
      MAAS will never assign IP addresses inside this range. They can be
      used for anything (e.g. infrastructure systems, network hardware,
      external DHCP, or the namespace for an OpenStack cloud you will be building).
    - **Unmanaged (subnet)**:
      MAAS will only assign IP addresses inside this range.
- **Reserved dynamic range**  
  An IP range that MAAS will use for enlisting, commissioning and, if
  MAAS-managed DHCP is enabled on the node's VLAN during commissioning,
  deploying. An initial range is created as part of the DHCP enablement process
  if done with the web UI. For an unmanaged subnet, this range is never used.

See [IP ranges][ip-ranges] for how these ranges get created and 
[Commission nodes][post-commission-configuration] for how they get used and
[Subnet management][subnet-management] for information on managed vs. unmanaged
subnets.

For details on how IP range terminology has changed since MAAS 1.9, see
[Upgrade from 1.9 to 2.x][upgrade-maas].

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


## DHCP relay

A DHCP relay, or relay agent, is a network device that forwards requests and
replies between a DHCP client and a DHCP server when both are not on the same
physical subnet.

Two common software implementations are [isc-dhcp-relay][isc-dhcp-relay] and 
[dhcp-helper][dhcp-helper].


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


## Machine actions

Machine *actions* are essentially: "things you can do with nodes". They can be
triggered via the web UI or the MAAS CLI. With the former, they are managed
with the 'Take action' button in the top right corner. An action usually
changes the *status* (see next section) of a node. Below is the full list of
possible actions and their meaning, arranged alphabetically.

### Abort
Abort any action that can be retried. This currently applies to Commission and
Deploy.

### Acquire
Allocates (reserves) a node to the MAAS user performing the action (and
currently logged in). Changes a node's status from 'Ready' to 'Allocated'.

With the CLI, it is necessary to perform this action prior to deploying. With
the web UI it is done automatically for the user. Acquiring in the web UI is
used for machine reservation.

### Commission
Commissions a node. Changes a node's status from 'New' to 'Commissioning' to
'Ready'.

Commissioning enables MAAS to build a detailed inventory of RAM, CPU, storage,
NICs and accelerators like GPUs. These are itemised and usable as constraints
for machine selection. 

If commissioning is unsuccessful, the status becomes 'Failed commissioning'.

Any time a node's underlying networking or disk subsystem has changed it should
be re-commissioned. Typically, you would mark the node as 'Broken' (see below),
implement maintenance, and then Commission.

### Delete
Removes a node from MAAS. The underlying machine remains unaffected. Upon
rebooting it will be enlisted once more (status 'New').

### Deploy
Deploys a node. Changes a node's status from 'Ready' (or 'Allocated') to
a deployed status. Includes action 'Power on'.

During deployment, MAAS turns on the machine and installs a complete server
operating system without manual intervention, configuring network interfaces,
disk partitions and more automatically.

If deployment is unsuccessful, the status becomes 'Failed deployment'.

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
networking or disk subsystem level. In this case, the original status would be
'Deployed'. 

A newly-commissioned node ('Ready') can also be marked broken.

### Mark fixed
Fixes a broken node. Changes a node's status from 'Broken' to 'Ready'.

### Lock
Marks a machine as *locked*. This prevents the user from performing actions on
machines that could change their state. For example, a locked machine cannot be
mistakenly *powered off* or *released*.

A machine in a locked state has a padlock symbol next to its name, both when
selected and within the machine list.

![machine locked state][img__machine-lock]

### Override failed
Allows a machine marked as ‘Failed testing’ to be usable. 

### Power off
Turns a node's underlying machine off.

### Power on
Turns a node's underlying machine on.

### Release
Releases a node back into the pool of available nodes. Changes a node's status
from 'Deployed' (or 'Allocated') to 'Ready'. Includes action 'Power off'.

The user has the opportunity to erase the node's storage (disks) before
confirming the action. A default erasure setting can be configured on the
'Storage' tab of the 'Settings' page. See [Disk erasure][storage-erasure] for
details.

### Rescue mode
Boot a node ephemerally (Ubuntu running in memory on the underlying machine).
This allows a user to SSH to the machine for maintenance purposes. This can be
done for a Deployed or Broken node as well as for a node that failed to deploy.

Authentication and access to the node's storage works the same way it would as
if the node was deployed. The fact that Ubuntu is running ephemerally is
completely transparent to the user.
 
The node status is changed to the 'Entering rescue mode' transitory status and
then to 'Rescue mode' when the operation is complete.

### Set Zone
Puts the node in a specific zone.

### Test hardware
Allows the user to select and run scripts to test a machine's underlying
hardware. See [Hardware testing][hardware-testing] for further details.

### Unlock
Releases a machine from a *locked* state.

## Node statuses

Node *statuses* are labels used to describe the general state of a node as
known to MAAS. A node will undergo various manipulations during their time
spent in MAAS and its status will change accordingly. A status change is
usually caused by an *action* (see above section) that is applied to the node.
Below is the full list of statuses and their meaning, arranged alphabetically.

Some aspects of a node can only be modified when a node has a certain status.
Examples:

- network interfaces cannot be modified without a status of either 'Ready' or
  'Broken'.
- storage cannot be modified without a status of either 'Ready' or 'Allocated'.

### Allocated
The node is allocated (reserved) to a MAAS user. See node action 'Acquire'.

### Broken
The node is broken. See node action 'Mark broken'.

### Commissioning
The node is in the process of commissioning. See node action 'Commission'.

### Deployed
The node is deployed. See node action 'Deploy'.

The visible status will be the name of the chosen OS (e.g. 'Ubuntu 16.04 LTS').

### Deploying
The node is in the process of deploying. See node action 'Deploy'.

The visible status will be *Deploying to 'OS'*, where 'OS' is the name of the
OS being deployed (e.g. 'Deploying to Ubuntu 16.04 LTS').

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

### Locked
It's not strictly a status, but a machine showing a 'padlock' symbol adjacent to its name
is in a *locked* state. 

### New
The first stage of a node's life in MAAS. Typically, a node with this status
has just been added to MAAS.

### Ready
The node has been commissioned and is ready for use.

A node in this state has configured BMC credentials (on IPMI based BMCs) for
ongoing power control, ensuring that MAAS can start or stop the machine and
allocate or (re)deploy it with a fresh operating system.

### Rescue mode
The node is in rescue mode and is ready to accept SSH connections. See node
action 'Rescue mode'.


<!-- IMAGES -->

[img__fabrics-spaces]: ../media/intro-concepts__fabrics-spaces.png
[img__machine-lock]: ../media/intro-concepts__2.4_machine-lock.png

<!-- LINKS -->

[node-actions]: #node-actions
[maas-ha]: manage-ha.md
[zone-examples]: intro-concepts-zones.md
[about-juju]: https://jujucharms.com/docs/stable/about-juju
[juju-network-spaces]: https://jujucharms.com/docs/2.0/network-spaces
[isc-dhcp-relay]: http://packages.ubuntu.com/xenial/isc-dhcp-relay
[dhcp-helper]: http://packages.ubuntu.com/xenial/dhcp-helper
[ip-ranges]: installconfig-network-ipranges.md
[post-commission-configuration]: nodes-commission.md#post-commission-configuration
[subnet-management]: installconfig-network-subnet-management.md
[storage-erasure]: installconfig-storage-erasure.md
[composable-hardware]: nodes-comp-hw.md
[upgrade-maas]: installconfig-upgrade-to-2.md#ip-range-changes
[hardware-testing]: nodes-hw-testing.md
