Title: What is MAAS?
table_of_contents: True


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
provisioned automatically and used as normal. When those machines are no longer
required they are "released" back into the pool. MAAS integrates all the tools
you require in one smooth experience. It includes:

- a beautiful web UI
- full API/CLI support
- high availability (optional)
- IPv6 support
- open source IP address management (IPAM)
- Ubuntu, CentOS, or Windows installation support
- inventory of components
- DHCP and DNS for other devices on the network
- VLAN and fabric support
- NTP for the entire infrastructure

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
the key). The web UI also allows for manual allocation in the sense of reserving
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
rack controller. See [Concepts and terms](intro-concepts.md#controllers) for
how each are defined.

Unless there is specific reason not to, it is recommended to have both
controllers residing on the same system. A no-fuss way to achieve this is by
installing the `maas` metapackage, or by installing from the Ubuntu Server ISO.

Multiple region and rack controllers are required if
[high availability](manage-ha.md) and/or load balancing (see HA page) is desired.

It's important to note that the all-in-one solution will provide a DHCP
service. Review your existing network design in order to determine whether this
will cause problems. See
[DHCP](installconfig-subnets-dhcp.md#competing-dhcp) for more on this subject.


## Installation methods

There are three ways to install MAAS:

- From the Ubuntu Server ISO
- From software packages ("debs")
- As a self-contained LXD environment

These methods, and their respective advantages, are fleshed out on the
[Installation](installconfig-install.md) page.


## Minimum requirements

The minimum requirements for the machines that run MAAS vary widely depending
on local implementation and usage.

Below, resource estimates are provided based on MAAS components and operating
system (Ubuntu Server). A test (or proof of concept) and a production
environment are considered.


^# Test environment

   This is a proof of concept scenario where all MAAS components are installed
   on a single host. *Two* complete sets of images (latest two Ubuntu
   LTS releases) for a *single* architecture (amd64) have been assumed.
   
   |                                                     | Memory (MB) | CPU (GHz) | Disk (GB) |
   | --------------------------------------------------- | ----------- | --------- | --------- |
   | [Region controller][controllers] (minus PostgreSQL) |  512        | 0.5       |  5        |
   | PostgreSQL                                          |  512        | 0.5       |  5        |
   | [Rack controller][controllers]                      |  512        | 0.5       |  5        |
   | Ubuntu Server (including logs)                      |  512        | 0.5       |  5        |

   Therefore, the approximate requirements for this scenario are: 2 GB memory,
   2 GHz CPU, and 20 GB of disk space.


^# Production environment

   This is a production scenario that is designed to handle a high number of
   sustained client connections. Both high availability (region and rack) and load
   balancing (region) have been implemented.

   Even though extra space has been reserved for images (database and rack
   controller) some images such as those for Microsoft Windows may require a lot
   more (plan accordingly).
 
   |                                                     | Memory (MB) | CPU (GHz) | Disk (GB) |
   | --------------------------------------------------- | ----------- | --------- | --------- |
   | [Region controller][controllers] (minus PostgreSQL) | 2048        | 2.0       |  5        |
   | PostgreSQL                                          | 2048        | 2.0       | 20        |
   | [Rack controller][controllers]                      | 2048        | 2.0       | 20        |
   | Ubuntu Server (including logs)                      |  512        | 0.5       | 20        |

   Therefore, the approximate requirements for this scenario are:

   - A region controller (including PostgreSQL) is installed on one host: 4.5 GB
     memory, 4.5 GHz CPU, and 45 GB of disk space.
   - A region controller (including PostgreSQL) is duplicated on a second
     host: 4.5 GB memory, 4.5 GHz CPU, and 45 GB of disk space.
   - A rack controller is installed on a third host: 2.5 GB memory, 2.5 GHz CPU,
     and 40 GB of disk space.
   - A rack controller is duplicated on a fourth host: 2.5 GB memory, 2.5 GHz CPU,
     and 40 GB of disk space.  
 
!!! Note: Figures in the above two tables are for the MAAS infrastructure only.
That is, they do not cover resources needed on the nodes that will subsequently
be added to MAAS. That said, node machines should have IPMI-based BMC
controllers for power cycling, see
[BMC Power Types](installconfig-power-types.md).

Examples of factors that influence hardware specifications include:

 - the number of connecting clients (client activity)
 - the manner in which services are distributed
 - whether [high availability](manage-ha.md) is used
 - whether [load balancing](manage-ha.md#load-balancing-(optional)) is used
 - the number of images that are stored (disk space affecting PostgreSQL and
   the rack controller)

Equally not taken into account is a possible
[local image mirror](installconfig-images-mirror.md) which would be a large
consumer of disk space.

One rack controller should not be used to service more than 1000 nodes (whether
on the same or multiple subnets). There is no load balancing at the rack level
so further independent rack controllers will be needed with each one servicing
its own subnet(s).


<!-- LINKS -->

[controllers]: intro-concepts.md#controllers
