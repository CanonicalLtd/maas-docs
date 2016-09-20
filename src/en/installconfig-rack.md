Title: Rack Controller
TODO:  Link to installing rack via ISO


# Rack Controller

A single rack controller can be connected to more than one VLAN, each from a
different rack controller interface. This allows one rack controller to manage
different subnets to help scale your rack controller or to satisfy your
network architecture.

In regards to region controller and rack controller communication, each rack
controller must be able to:

- Initiate TCP connections (for HTTP) to each region controller on port 80 or
  port 5240, the choice of which depends on the setting of the MAAS URL.
- Initiate TCP connections (for RPC) to each region controller between port
  5250 and 5259 inclusive. This permits up to 10 `maas-regiond` processes on
  each region controller host. At present this is not configurable.


## Install a rack controller

When a rack controller is installed on the same system as the region controller
it will be registered to MAAS automatically. Otherwise it will need to be done
manually.

To install and register a rack controller you can either use the Ubuntu Server
ISO or work from the command line. See
[MAAS CLI](./manage-cli-advanced.html#install-a-rack-controller) on how to do
the latter.

Once registered, if this is an extra rack controller, it will appear
immediately in the web UI and begin to sync with the primary controller:

![add controller](./media/installconfig-rack__add-controller2.png)

One reason to add extra rack controllers is to achieve DHCP high availability
(DHCP HA).

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

![image](./media/rack-interface-edit.png)

-->
