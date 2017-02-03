Title: Rack Controller | MAAS
TODO:  Add CLI for deleting a rack controller


# Rack Controller

A rack controller can be connected to multiple VLANs, each from a different
network interface. This provides a scaling factor that can help as a network
architecture grows in size.

In regards to region controller and rack controller communication, each rack
controller must be able to initiate TCP connections:

- for HTTP, to each region controller on port 5240. If
  [high availability](manage-ha.md) is implemented then this will typically
  become port 80.
- for RPC, to each region controller between port 5250 and 5259 inclusive. This
  permits up to 10 `maas-regiond` processes on each region controller host. At
  present this is not configurable.


## Install a rack controller

When a rack controller is installed on the same host as the region API server
it will register itself automatically. Otherwise this will need to be done
manually:

To install and register a rack controller you can either use the
[Ubuntu Server ISO](installconfig-server-iso.md#rack-controller) or the
[MAAS CLI](manage-cli-advanced.md#install-a-rack-controller). Both will
require the URL of the region API server. For nodes on an
[IPv6](installconfig-network-ipv6.md) subnet, the URL must use a hostname
instead of an IP address and it must resolve to both IPv4 and IPv6 addresses,
both on the rack controller and on the nodes.

Once registered, if this is an extra rack controller, it will appear
immediately in the web UI and begin to sync with the primary controller:

![add controller](../media/installconfig-rack__add-controller2.png)

Multiple rack controllers are needed in order to achieve specific types of
[high availability](manage-ha.md).

!!! Note: If you will be using KVM-backed nodes you must ensure that the new
rack controller can communicate with the KVM host. See
[KVM guest nodes](installconfig-add-nodes.md#kvm-guest-nodes).


## Unregister a rack controller

If you ever want to unregister a rack controller, which is probably something
you would only do to an *extra* one you may have added, you will need to
*delete* it from the region API server; there is no 'unregister' command.

To do so, navigate to the 'Nodes' page and then the 'Controller' tab. Enter the
controller's page by clicking on the machine you want to delete and select
'Delete' from the dropdown (and then 'Go'). MAAS will do the right thing if the
controller was used for DHCP HA (i.e. DHCP HA will no longer be enabled since
there is no longer the possibility of having it).

Although similar, this is not conceptually equivalent to deleting a MAAS node.
Here, you are deleting a machine that is a part of MAAS itself.

!!! Note: Unless the software on this machine is removed, rebooting it will
cause the machine to re-instate itself as a rack controller. This behaviour may
change with future versions of MAAS.


<!--

THIS IS MIND-NUMBING. IT READS LIKE DEVELOPERS' NOTES.
LET'S TAKE THIS OUT FOR NOW.


## Interface management

MAAS automatically recognises the network interfaces on each rack controller.
Some (though not necessarily all) of these will be connected to subnets on a
VLAN inside a Fabric. In other words, the rack controllers will be connected
to VLANs, and the subnets being served on these.

Once a new rack controller is connected, it will try to autodetect in what
subnet, VLAN and even fabric the interface is connected to. If these have not
being created, new subnets, VLANs and fabrics and spaces will be created.

If fabrics, VLANs and subnets are already created, once MAAS automatically
recognises the rack controller network interfaces, it will try to determine to
which these are connected to before being able to provide services.

As such, each rack controller interface will determine whether a rack
controller can provide DHCP on an specific VLAN, or for advanced configuration,
a rack controller interface will determine whether a rack controller can be a
primary or backup Rack on an HA configuration.

If for any reason, the rack controller interfaces are mis-identified and are
in the correct fabric, the user can manually change that by editing the Rack
Controller Fabric information:

![image](../media/rack-interface-edit.png)

-->
