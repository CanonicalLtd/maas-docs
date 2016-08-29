Title: MAAS | Metal As A Service


# What is MAAS?

MAAS is *Metal As A Service*. It lets you treat physical servers like virtual
machines (instances) in the cloud. Rather than having to manage each server
individually, MAAS turns your bare metal into an elastic cloud-like resource.

Machines can be quickly provisioned and then destroyed again as easily as you
can with instances in a public cloud like Amazon AWS, Google GCE, and Microsoft
Azure, among others.

MAAS can work as a standalone PXE/preseed service or it can be integrated with
other technologies. In particular, it is designed to work especially well with
[Juju](https://jujucharms.com/docs/stable/about-juju), the service and model
management service. It's a perfect arrangement: MAAS manages the machines and
Juju manages the services running on those machines.

## Installation

There are three main ways to install MAAS:

- [From an Ubuntu Server ISO](installconfig-server-iso.html). Easily configure
  a
  server as either a region controller or a rack controller from a new Ubuntu
  Server installation.

- [From a package repository](installconfig-package-install.html). Add MAAS
  packages for region and rack controllers to a system already running Ubuntu.

- [Locally with LXD](installconfig-lxd-install.html). Create a local MAAS
  environment within a container that is capable of running the region
  controller, the rack controller and multiple nodes.

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

## A simple MAAS setup

The key components of a MAAS installation are:

- Region controller(s)
- Rack controller(s)
- MAAS machines (nodes)

For a small setup, it is typical to have a single region controller and a
single rack controller. In addition, both can reside on the same system. This
is easy to achieve by simply installing the `maas` software package. It is only
worth having multiple region and rack controllers if you need to organise your
nodes into different subnets and you want high availability and/or load
balancing.
