Title: Subnet Management


# Subnet Management 

The topic of subnet management pertains to whether MAAS is in full control of a
subnet or not. When a subnet is *managed*, all aspects of IP address allocation
are handled by MAAS. This includes DHCP leases and assigned static addresses.
Typically MAAS would have one managed subnet, but any additional subnets can be
*unmanaged*. This allows for more control over which subnet gets used for DHCP
and which ones do not. Additionally, as detailed below, an unmanaged subnet
treats reserved IP ranges differently, and in a way that some administrators
find more intuitive.


## Managed subnets

When management is enabled for a subnet, MAAS will:

- Lease addresses for DHCP from a *reserved dynamic IP range*
- Assign static addresses not included in a *reserved IP range*, typically via
  'Auto assign' IP allocation mode for a node.

See [Concepts and terms][concepts-ipranges] for an explanation of the two kinds
of reserved IP ranges MAAS uses and
[Post-commission configuration][post-commission-configuration] for information
on IP allocation modes.


## Unmanaged subnets

When management is disabled for a subnet, the definition of a *reserved IP
range* differs from the managed mode. Here, a *reserved IP range* tells MAAS to
**only allocate addresses from this range** (via 'Auto assign'). In addition,
DHCP will never lease addresses from an unmanaged subnet.


## Controlling subnet management

By default, a subnet is managed, but it is easy to change this.

To disable (or re-enable) subnet management navigate to the 'Subnets' page and
select the subnet. There is a slide switch labelled 'Managed allocation'. Click
the label (or the switch icon itself) to toggle between enabled (dark blue) and
disabled (grey).

![subnet management toggle][img__2.2_subnet-management-toggle]

See [MAAS CLI][cli-control-subnet-management] for how to do this with the CLI.


## IP address tracking

MAAS will keep track of all assigned addresses, regardless of whether they come
from managed or unmanaged subnets.


<!-- LINKS -->

[concepts-ipranges]: intro-concepts.md#ip-ranges
[post-commission-configuration]: nodes-commission.md#post-commission-configuration
[cli-control-subnet-management]: manage-cli-common.md#control-subnet-management

[img__2.2_subnet-management-toggle]: ../media/installconfig-network-subnet-management__2.2_management-toggle.png
