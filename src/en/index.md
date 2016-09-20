Title: MAAS | Metal As A Service
TODO:  Review paragraph "Multiple region and rack controllers are required if..." 


# What is MAAS?

MAAS is *Metal As A Service*. It lets you treat physical servers like virtual
machines (instances) in the cloud. Rather than having to manage each server
individually, MAAS turns your bare metal into an elastic cloud-like resource.

Machines can be quickly provisioned and then destroyed again as easily as you
can with instances in a public cloud like Amazon AWS, Google GCE, and Microsoft
Azure, among others.

MAAS can act as a standalone PXE/preseed service or it can be integrated with
other technologies. In particular, it is designed to work especially well with
[Juju](https://jujucharms.com/docs/stable/about-juju), the service and model
management service. It's a perfect arrangement: MAAS manages the machines and
Juju manages the services running on those machines.

!!! Note: KVM guests can also act as MAAS nodes as long as they are set to boot
from the network (PXE).


## What MAAS offers

MAAS provides management of a large number of physical machines by creating a
single resource pool out of them. Participating machines can then be
provisioned automatically (Debian preseed) and used as normal. When those
machines are no longer required they are "released" back into the pool. MAAS
integrates all the tools you require in one smooth experience. It includes:

- a beautiful web UI
- full API/CLI support
- high availability (optional)
- IPv6 support
- open source IP address management (IPAM)
- Ubuntu, CentOS, or Windows installation support
- inventory of components
- DHCP and DNS for other devices on the network
- VLAN and fabric support

MAAS works with any configuration system, and is recommended by the teams
behind both [Chef](https://www.chef.io/chef) and
[Juju](https://jujucharms.com/docs/stable/about-juju) as a physical
provisioning system.


## How MAAS works

MAAS manages a pool of nodes. After registering ("Enlisting" state) a new
system and preparing it for service ("Commissioning" state), the system joins
the pool and is available for use ("Ready" state).

MAAS controls machines through IPMI (or another BMC) or converged chassis
controller such as Cisco UCS.

!!! Warning: A machine destined for MAAS will have its disk space overwritten.
A node in the pool is under MAAS's sole control and should not be provisioned
using other methods.

Users of the MAAS then allocate them for their own use ("Acquire") when they go
into use. Any subsequently installed operating system will contain the user's
SSH public key for remote access (the user's MAAS account first needs to import
the key). The GUI also allows for manual allocation in the sense of reserving
hardware to specific users for later use.

When allocating from the API/CLI, you can specify requirements ("constraints")
for a machine. Common constraints are: memory, CPU cores, connected networks,
and what physical zone they should be in.

An allocated MAAS node is not like a virtual instance in a cloud: you get
complete control, including hardware drivers and root access. To upgrade a
BIOS, for example, an administrator could allocate a node to themselves, and
run a vendor-supplied upgrade utility.

Once you are done with a node you have allocated you send it back to the pool
for re-use.

Note that [Juju](https://jujucharms.com/docs/stable/about-juju) is designed to
work with MAAS. In this case, MAAS becomes a sort of backend (resource pool)
for Juju, or a "cloud provider" in Juju terminology. However, everything that
was stated earlier still applies. For instance, if Juju removes a machine then
MAAS will, in turn, release that machine to the pool.


## Key components and colocation of all services

The key components of a MAAS installation are the region controller and the
rack controller. See [Concepts and terms](intro-concepts.html#controllers) for
how each are defined.

Unless there is specific reason not to, it is recommended to have both
controllers residing on the same system. A no-fuss way to achieve this is by
installing the `maas` metapackage, or by installing from the Ubuntu Server ISO.

Multiple region and rack controllers are required if nodes need to be organised
into different subnets and high availability and/or load balancing is desired.

It's important to note that the all-in-one solution will provide a DHCP
service. Review your existing network design in order to determine whether this
will cause problems. See
[DHCP](./installconfig-dhcp.html#competing-dhcp) for more on this subject.


## Installation methods

There are three ways to install MAAS:

- From the Ubuntu Server ISO
- From software packages ("debs")
- As a self-contained LXD environment

These methods, and their respective advantages, are fleshed out on the
[Installation](./installconfig-install.html) page.
