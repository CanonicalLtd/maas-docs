Title: Commission Nodes | MAAS
TODO:  Add CLI for IP address assignment methods
       Add CLI for image/kernel to use for commissioning (?)
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
the 'Take action' dropdown menu (orange button).

![commission][img__2.1_commission]

You have the option of selecting some extra parameters (checkboxes). Then
finalize the directive by hitting 'Go'.

![commission go][img__commission-go]

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

!!! Note: 
    If your node has more than one network interface you may need to tell
    MAAS which one to use. Do this by marking it *Broken* (see next section).

Once a node is commissioned its status will change to *Ready*. Consider taking
this time to tag your node (see [Tags][tags]).

The next step will be to *deploy* it. See [Deploy nodes][deploy-nodes].


## Post-commission configuration

Once a node has been commissioned, its network interface(s) can be configured.
Specifically, when a node's status is either 'Ready' or 'Broken', interfaces
can be added/removed, attached to a fabric and linked to a subnet, and provided
an IP assignment mode. Tags can also be assigned to specific network interfaces
(see [Tags for network interfaces][tags-network-interfaces]).

![node interface][img__node-interface-ip]

There are four modes to choose from that determine how an address on the subnet
gets assigned when the node is eventually deployed:

- **Auto assign** MAAS will assign a random static address 
  (`iface eth0 inet static`) from among the addresses that do not fall within a
  *reserved dynamic range* or a *reserved range*.

- **Static assign** The administrator will specify a static address using a
  secondary field.

- **DHCP** A dynamic address will be leased via either MAAS-managed DHCP or an
  external DHCP server.

- **Unconfigured** The interface will be left unconfigured.

See [Concepts and terms][concepts-ipranges] for the definitions of reserved
range types used in MAAS.

### Bridge interfaces

MAAS supports the creation of a bridge interface from a single network
interface. This may be useful if you eventually deploy virtual machines or
containers on the machine. 

A bridge is created by first selecting a single interface followed by clicking
the now-enabled 'Create bridge' button. A new pane will appear where you can
enter a MAC address for the bridge, an optional STP forward delay, and a tag. 

![bridge interface][img__bridge-interface]

Automatic bridge creation on all configured interfaces can also be performed at
allocation time using the API.


<!-- LINKS -->

[add-nodes]: installconfig-add-nodes.md
[cli-commission-a-node]: manage-cli-common.md#commission-a-node
[tags]: installconfig-nodes-tags.md
[deploy-nodes]: installconfig-nodes-deploy.md
[tags-network-interfaces]: installconfig-nodes-tags.html#tags-for-network-interfaces
[subnet-management]: installconfig-network-subnet-management.md
[concepts-ipranges]: intro-concepts.md#ip-ranges

[img__bridge-interface]: ../media/installconfig-commission-nodes__bridge-iface.png
[img__2.1_commission]: ../media/installconfig-nodes-commission-nodes__2.1_commission.png
[img__commission-go]: ../media/installconfig-commission-nodes__commission-go.png
[img__node-interface-ip]: ../media/node-interface-ip.png
