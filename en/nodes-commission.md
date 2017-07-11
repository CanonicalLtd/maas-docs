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
1. initrd mounts a Squashfs image ephemerally over iSCSI
1. cloud-init runs commissioning scripts
1. machine shuts down

The commissioning scripts will talk to the region API server to ensure that
everything is in order and that eventual deployment will succeed.

The image used is, by default, the latest Ubuntu LTS release and should not
require changing. However, it can be configured in the web UI in the 'Settings'
page.

To commission, on the 'Nodes' page, select a node and choose 'Commission' under
the 'Take action' dropdown menu.

![commission][img__2.2_commission]

You have the option of selecting some extra parameters (checkboxes) and
performing hardware tests (see [Hardware testing][hardware-testing]).

![confirm commission][img__2.2_commission-confirm]

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

Click the pencil icon for the interface to be edited:

![edit interface][img__2.2_edit-interface]

The following window will appear:

![configure interface][img__2.2_configure-interface]

There are four modes to choose from that determine how an address on the subnet
gets assigned when the node is eventually deployed:

- **Auto assign** MAAS will assign a random static address (`iface eth0 inet
  static`). The pool of available addresses depends on whether the subnet is
  managed or unmanaged (see [Subnet management][subnet-management]).

- **Static assign** The administrator will specify a static address using a
  secondary field.

- **DHCP** A dynamic address will be leased via either MAAS-managed DHCP or an
  external DHCP server.

- **Unconfigured** The interface will be left unconfigured.

See [Concepts and terms][concepts-ipranges] for the definitions of reserved
range types and [MAAS CLI - advanced tasks][cli-change-ip-assignment-mode] for
changing the mode with the CLI.

Press the 'Save' button to apply the changes.

### Bridge interfaces

A bridge is created by selecting an interface and clicking the now-active
'Create bridge' button. A form will appear that will allow a MAC address, STP,
and a tag to be configured.

![configure bridge][img__2.2_configure-bridge]

Press the 'Save' button when you're done.

!!! Positive "Pro tip":
    A network bridge may be useful if virtual machines or containers are to be
    put on the node. 

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

[img__2.2_commission]: ../media/nodes-commission__2.2_commission.png
[img__2.2_commission-confirm]: ../media/nodes-commission__2.2_commission-confirm.png
[img__2.2_configure-interface]: ../media/nodes-commission__2.2_configure-interface.png
[img__2.2_edit-interface]: ../media/nodes-commission__2.2_edit-interface.png
[img__2.2_configure-bridge]: ../media/nodes-commission__2.2_configure-bridge.png
