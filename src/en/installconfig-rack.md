Title: Rack Controller Configuration
TODO:  Needs splitting, a re-write and re-organising within wider context of MAAS docs (see #24)


# Rack Controller Configuration

Managing a VLAN normally means that MAAS will serve DHCP from the rack
controller, for the purpose of providing IP address to machines that are being
enlisted or commissioned. Also, any other DHCP client that is on the VLAN will
obtain a dynamic IP address from the MAAS DHCP server.

**Do this only on a network that was set up with this in mind**. Enabling your
own DHCP server that competes with an existing one that's being managed by
MAAS can cause serious disruption, and it can be hard for administrator to
track the source of the problem. Worse, the problems may not become
immediately noticeable. Make sure you understand the implications of running a
DHCP server before doing this. If MAAS detects any DHCP servers already
running on these networks, it will show them on the rack's configuration page.


## Network Requirements

The rack controller manages DHCP for subnet(s) in the VLAN(s) that it is
connected to via one of its interfaces defined in MAAS. rack controller
interfaces are discovered automatically when MAAS is installed and any
future changes are automatically communicated to the region.

When a rack controller manages machines on the network through one of the
VLANs it is connected to, the machines must be in the same subnet as the Rack
Controller interface connected to that VLAN. This is because:

If the VLAN that the rack controller is connected to is configured to
provide DHCP, the nodes must be able to configure their own network
interfaces using MAAS's DHCP server. This means that either they must be
on the same subnet, or that DHCP packets are being specially routed
between the machine's subnet and MAAS' DHCP server.


## Registration

If your rack controller is installed on the same system as your region
controller, as is the case when you install the full "maas" Ubuntu package, it
will be automatically accepted by default (but not yet configured, see below).

Any other rack controllers you set up will show up automatically after they
have been manually added to MAAS by running the following command:

```bash
sudo dpkg-reconfigure maas-rack-controller
```

You will first be asked for the IP address or hostname of your region
controller, followed by a prompt for the 'shared secret'. The shared secret can
be found within the `/var/lib/maas/secret` file held on the region controller.

![reconfigure rack](./media/install_cluster-config.png)

Once these two details have been entered, the rack controller configuration
will be complete.


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

In order for MAAS to be able to manage a machine throughout its lifecycle, it
needs to provide DHCP for at least one subnet, by configuring the corresponding
VLAN to which the rack controller is connected to.


## Providing DHCP

In order for MAAS to be able to manage machines on the network, and more
specifically, in order to be able to enlist, commission and deploy machines it
needs to provide and manage DHCP. As such, rack controller(s) can provide DHCP
on the different VLANs it is connected to.

### Dynamic IP ranges

A dynamic IP range is needed in order for MAAS to be able to provide
DHCP for machines. Addresses in the range get assigned to machines that are
being:

- auto-registered (also called enlisted)
- commissioned

Deployed machines will obtain IP addresses from the part of the subnet that is
*not* included in the above dynamic range. Such a "deployment IP range" does
not need to be specified. These addresses will remain allocated to machines
throughout their deployment lifecycle.

### Enabling DHCP

In order for machines to PXE boot, a requirement for MAAS provisioning, DHCP
must be enabled on at least one untagged VLAN. DHCP servicing deployed machines,
however, can use a tagged VLAN. Below, enable DHCP for your desired scenario.

Under the 'Networks' tab choose a VLAN and enable DHCP:

1. Under the 'Take action' button select 'Provide DHCP'. A new window will
appear.
1. Select the primary rack controller. For DHCP HA, select both the primary
and the secondary.
1. Create a dynamic IP range. Fill in the fields 'Dynamic range start IP' and
'Dynamic range end IP'.
1. Configure a default gateway. Fill in the field 'Gateway IP'.
1. Apply your changes with the 'Provide DHCP' button.

![image](./media/vlan_provide_dhcp.png)

See [MAAS CLI](./manage-cli-common.html#enable-dhcp) for doing this with the CLI.

If necessary, it is possible to add further portions of the subnet to the
dynamic IP range (see
[Reserved IP addresses](./installconfig-network-static.html#reserved-ip-addresses)
). Furthermore, since DHCP is enabled on a VLAN basis and a VLAN can contain
multiple subnets, it is possible to add a portion from those subnets as well.
Just select the subnet under the 'Networks' tab and reserve a dynamic range.
DHCP will be enabled automatically.


## Multiple Networks

A single rack controller can be connected to more than one VLAN, each from a
different rack controller interface. This allows one rack controller to manage
different subnets to help scale your rack controller or to satisfy your
network architecture.
