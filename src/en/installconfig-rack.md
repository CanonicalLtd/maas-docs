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

1.  If the VLAN that the rack controller is connected to is configured to
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

## Interface Management

MAAS automatically recognises the network interfaces on each rack controller.
Some (though not necessarily all) of these will be connected to subnets on a
VLAN inside a Fabric. In other words, the rack controllers will be connected
to VLANs, and the subnets being served on these.

Once a new rack controller is connected, it will try to autodetect in what
Subnet, VLAN and even Fabric the interface is connected to. If these have not
being created, new Subnets, VLAN's and Fabrics and Spaces will be created.

If Fabrics, VLANs and Subnets are already created, once MAAS automatically
recognises the rack controller network interfaces, it will try to determine to
which these are connected to before being able to provide services.

As such, each rack controller interface will determine whether a Rack
Controller can provide DHCP on an specific VLAN, or for advanced
configuration, a rack controller interface will determine whether a Rack
Controller can be a primary or backup Rack on an HA configuration.

If for any reason, the rack controller interfaces are mis-identified and are
in the correct fabric, the user can manually change that by editing the Rack
Controller Fabric information:

![image](./media/rack-interface-edit.png)

In order for MAAS to be able to manage a machine throughout its lifecycle, it
needs to provide DHCP for at least one subnet, by configuring the
corresponding VLAN to which the rack controller is connected to.

## Providing DHCP and HA

In order for MAAS to be able to manage machines on the network, and more
specifically, in order to be able to enlist, commission and deploy machines it
needs to provide and manage DHCP. As such, rack controller(s) can provide DHCP
on the different VLANs it is connected to.

### Dynamic Range and Addresses

Starting from MAAS 2.0, a Dynamic range needs to be defined in order for MAAS
to be able to provide DHCP for machines. The purpose of the dynamic range is
to:

-   provide DHCP for machines that are performing auto-registration (also
    called enlistment), or
-   provide DHCP for machines that are being commissioned.

This means that when a machine is being enlisted or commissioned, they DHCP
from the dynamic range in order to perform those two steps.

In turn, however, machines that are being deployed will, by default, obtain
static IP addresses (DHCP or otherwise) from the section of the subnet that
has not been reserved for the Dynamic Range on such VLAN. This allows the
machine to obtain IP addresses that will remain allocated to a machine
throughout the rest of its deployment.

### Enabling a DHCP on a VLAN (optional HA)

As an example, we will configure MAAS to provide DHCP on a rack controller.

The first thing that we need to do is select in what VLAN and subnet we would
like to configure DHCP. In this case, in order to be able to PXE boot
machines, we need to configure DHCP for an 'untagged' VLAN under any fabric.
In this example, we will chose the 'untagged' VLAN on 'fabric-0'. The subnet
'192.168.10.0/24' is on this 'untagged' VLAN. We can see that the Rack
Controller has access to this VLAN via its 'eth0' interface.

The second step is to create a dynamic range:

```bash
maas admin ipranges create type=dynamic start_ip=192.168.10.28 end_ip=192.168.10.100
```

The third, and last step is to enable DHCP on a VLAN. For this to be effective
we need to at least select the Primary Rack controller that will provide DHCP:

```bash
maas admin vlan update fabric-0 untagged dhcp_on=True primary_rack=node01
```

If enabling DHCP HA is something you need for your MAAS deployment, then
following operation would enable HA:

```bash
maas admin vlan update fabric-0 untagged dhcp_on=True primary_rack=node01 secondary_rack=node02
```

Note that if you are enabling DHCP over the CLI, but the subnet doesn't have a
Gateway IP defined, you can define the gateway using:

```bash
maas admin subnet update 192.168.10.0/24 gateway_ip=192.168.10.1
```

You can also do the same configuration via the WebUI on the VLAN details page:

![image](./media/vlan_provide_dhcp.png)

## Multiple Networks

A single rack controller can be connected to more than one VLAN, each from a
different rack controller interface. This allows one rack controller to manage
different subnets to help scale your rack controller or to satisfy your
network architecture.
