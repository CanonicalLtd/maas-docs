Title: Commission Nodes
TODO:  Add link to CLI for setting global commissioning kernel
       Explain web UI checkboxes: 'Allow SSH access', 'Retain network configuration' and 'Retain storage configuration'


# Commission Nodes

Once a node is added to MAAS (see [Add nodes][add-nodes]) the next logical
step is to *commission* it.

To commission, the underlying machine needs to be configured to netboot (this
should already have been done during the enlistment stage). Such a machine will
undergo the following process:

1. DHCP server is contacted
1. kernel and initrd are received over TFTP
1. machine boots
1. initrd mounts a Squashfs image ephemerally over HTTP
1. cloud-init runs commissioning scripts
1. machine shuts down

The commissioning scripts will talk to the region API server to ensure that
everything is in order and that eventual deployment will succeed.

The image used is, by default, the latest Ubuntu LTS release and should not
require changing. However, it can be configured in the web UI in the 'Settings'
page.

To commission, on the 'Nodes' page, select a node and choose 'Commission' under
the 'Take action' dropdown menu.

![commission][img__commission]

You have the option of selecting some extra parameters (checkboxes) and
performing hardware tests (see [Hardware testing][hardware-testing]).

![confirm commission][img__commission-confirm]

Finalize the directive by hitting 'Commission machine'.

While a node is commissioning its status will change to *Commissioning*. During
this time the node's network topology will be discovered. This will prompt one
of the node's network interfaces to be connected to the fabric, VLAN, and
subnet combination that will allow it to be configured. By default, a static IP
address will be assigned out of the reserved IP range for the subnet. That is,
an IP assignment mode of 'Auto assign' will be used. See the next section for
details on assignment modes.

See [MAAS CLI][cli-commission-a-node] for how to commission a node with the
CLI.

Once a node is commissioned its status will change to *Ready* and an extra tab
for the node called 'Commissioning' will become available. This tab contains
the results of the scripts executed during the commissioning process.

Now that the node is commissioned you may consider creating or applying a tag
(see [Tags][tags] for more on this).

The next step will be to *deploy* the node. See [Deploy nodes][deploy-nodes].


## Post-commission configuration

Once a node has been commissioned, its network interface(s) can be configured.
Specifically, when a node's status is either 'Ready' or 'Broken', interfaces
can be added/removed, attached to a fabric and linked to a subnet, and provided
an IP assignment mode. Tags can also be assigned to specific network interfaces
(see [Tags for network interfaces][tags-network-interfaces]).

From a node's 'Interfaces' page, click the menu icon for the interface to be
edited and select 'Edit Physical' from the resulting menu:

![edit interface][img__edit-interface]

The following window will appear:

![configure interface][img__configure-interface]

There are four modes to choose from that determine how an address on the subnet
gets assigned when the node is eventually deployed:

- **Auto assign**: MAAS will assign a random static address (`iface eth0 inet
  static`). The pool of available addresses depends on whether the subnet is
  managed or unmanaged (see [Subnet management][subnet-management]).

- **Static assign**: The administrator will specify a static address using a
  secondary field.

- **DHCP**: A dynamic address will be leased via either MAAS-managed DHCP or an
  external DHCP server.

- **Unconfigured**: The interface will be left unconfigured.

See [Concepts and terms][concepts-ipranges] for the definitions of reserved
range types and [MAAS CLI - advanced tasks][cli-change-ip-assignment-mode] for
changing the mode with the CLI.

Press the 'Save' button to apply the changes.

### Bond interfaces

A bond interface is used to aggregate two or more physical interfaces into
a single logical interface. A bond is created by selecting more than one
interface and clicking the now-active 'Create bond' button:

![configure setbond][img__configure-setbond]

After clicking the 'Create bond' button, the bond configuration pane will
appear.

From the bond configuration pane, you can rename the bond, select a bond mode
(see below), assign a MAC address to the aggregate device and attach one or
more tags. 

The interfaces aggregated into the bond interface are listed below the 'Tags'
field. Use the 'Primary' column to select the interface to act as the
primary device.

![configure bond][img__configure-bond]

The following bonding modes can be selected from the 'Bond mode' drop-down
menu:

- **balance-rr**: Transmit packets in sequential order from the first available
  slave through to the last. This mode provides load balancing and fault
  tolerance.

- **active-backup**: Only one slave in the bond is active. A different slave
  becomes active if, and only if, the active slave fails. The bond's MAC
  address is externally visible on only one port (network adapter) to avoid
  confusing the switch.

- **balance-xor**: Transmit based on the selected transmit hash policy. The
  default policy is *simple*. This means packages are selected by an XOR
  operation between the source MAC address and the resultant XOR between the
  destination MAC address the packet type identifier, modulo slave count.

- **broadcast**: Transmit everything on all slave interfaces. This mode
  provides fault tolerance.

- **802.3ad**: Creates aggregation groups that share the same speed and duplex
  settings. Utilises all slaves in the active aggregation according to the IEEE
  802.3ad specification.

- **balance-tlb**: Adaptive transmit load balancing, channel bonding that does
  not require any special switch support.

- **balance-alb**: Adaptive load balancing, includes *balance-tlb* plus
  *receive load balancing* (rlb) for IPV4 traffic. Does not require any special
  switch support. The receive load balancing is achieved by ARP negotiation.

Press the 'Save' button when you're done.

!!! Note: 
    The MAC address defaults to the MAC address of the primary interface.


### Bridge interfaces

A bridge is created by selecting an interface and clicking the now-active
'Create bridge' button. A form will appear that will allow a MAC address, STP,
and a tag to be configured.

![configure bridge][img__configure-bridge]

Press the 'Save' button when you're done.

!!! Positive "Pro tip":
    A network bridge may be useful if virtual machines or containers are to be
    put on the node. 

See [CLI Interface Management][manage-cli-interfaces] for details on how
interfaces can be configured from the command line.

<!--

I'D LIKE TO LEAVE THIS OUT UNTIL A CLI COMMAND IS DOCUMENTED AND THEN LINKED. I
ALSO FIND THIS SENTENCE NEEDS TO BE REWORDED AS IT IS QUITE ABSTRACT AS IS.

Automatic bridge creation on all configured interfaces can also be performed at
allocation time using the API.

-->


<!-- LINKS -->

[add-nodes]: nodes-add.md
[cli-commission-a-node]: manage-cli-common.md#commission-a-node
[tags]: nodes-tags.md
[deploy-nodes]: nodes-deploy.md
[tags-network-interfaces]: nodes-tags.md#tags-for-network-interfaces
[subnet-management]: installconfig-network-subnet-management.md
[concepts-ipranges]: intro-concepts.md#ip-ranges
[hardware-testing]: nodes-hw-testing.md
[cli-change-ip-assignment-mode]: manage-cli-advanced.md#change-the-ip-assignment-mode-of-a-network-interface
[manage-cli-interfaces]: manage-cli-interfaces.md

[img__commission]: ../media/nodes-commission__2.2_commission.png
[img__commission-confirm]: ../media/nodes-commission__2.3_commission-confirm.png
[img__configure-interface]: ../media/nodes-commission__2.3_configure-interface.png
[img__edit-interface]: ../media/nodes-commission__2.3_edit-interface.png
[img__configure-setbond]: ../media/nodes-commission__2.3_configure-setbond.png
[img__configure-bond]: ../media/nodes-commission__2.3_configure-bond.png
[img__configure-bridge]: ../media/nodes-commission__2.3_configure-bridge.png
