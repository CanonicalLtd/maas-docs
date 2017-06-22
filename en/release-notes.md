Title: 2.2 Release Notes
table_of_contents: True


See [Historical release notes][historical-release-notes] for release notes for
all versions.

# Release Notes - 2.2

## Important announcements

### Support for composable hardware - Intel Rack Scale Design

The MAAS team is excited to announce the support for the Intel Rack Scale
Design (RSD). Intel Rack Scale Design (RSD) is a hardware architecture that
allows for the dynamic composition of physical systems from a pool of available
hardware resources. 

MAAS, as a cloud-like, scale-out bare-metal provisioning system, will leverage
the use of Intel RSD to compose (create) and provision systems. With the
support for RSD, MAAS introduces the ability to manually or dynamically compose
(create) new machines from an available pool of resources. It will allow
administrators to request machines with specific resources on demand and be
able to deploy their workloads on them.

### Migrating spaces from subnets to VLANs

The definition of spaces has changed from a Layer 3 concept to a Layer 2
concept.

The spaces definition in MAAS (first introduced in MAAS 1.9) is "a set of
subnets that can mutually communicate". The assumption is that these spaces can
route to each other, and have appropriate firewall rules for their purposes.
(For example, a "dmz" space might contain subnets with internet access, or a
"storage" space might contain subnets that can access the same storage
networks.) Juju uses the current definition in order to ensure that deployed
applications have access to networks appropriate for the services they provide.

The current definition of spaces as a L3 concept is problematic, in that
sometimes Juju wants to deploy applications that themselves create a Layer 3
subnet. Therefore, it was decided that the concept of spaces will be pushed
down a layer (to apply to VLANs in MAAS).

With spaces as a Layer 2 concept, it is now "a set of VLANs whose subnets can
mutually communicate". As such:

- VLANs will gain a 'space' reference, and subnets will have their spaces
  migrated to the VLANs they are on.
     - On upgrades, if two subnets on the same VLAN are in different spaces,
       the most recently created space will be used for both.
- Spaces will become optional.
     - Fresh installs will not have a default space (e.g. space-0).
     - On upgrades, if only the default space (space-0) exists, it will be
       removed.

The following API changes will occur in MAAS 2.2:

- Editing a subnet's space will no longer be possible. Spaces must now be
  assigned on a per-VLAN basis. (Note: this is an API-breaking change; any usage
  of the MAAS API involving assigning subnets to spaces must be updated.)
- For backward compatibility, a subnet's endpoint will present the underlying
  VLAN's space as a read-only value.

Recommended actions for MAAS administrators prior to upgrading to MAAS 2.2:

- Ensure that no two subnets in the same VLAN are in different spaces, so that
  the upgrade path migrates the expected space to the VLAN.
- In order to preserve backward compatibility with Juju charms that use the
  subnet-based definition of a space, ensure that each space contains subnets
  capable of mutual communication. It may be helpful to view the list of subnets
  grouped by space (using the "Group by: Spaces" option on the Subnets page in
  the web UI) in order to verify that each space is defined correctly.

Please note that MAAS and Juju make assumptions about the security and
isolation of a network based on the space defined for a VLAN (and, by
extension, each subnet in that VLAN). Since a VLAN containing subnets in
multiple spaces implies lack of network isolation, MAAS and Juju cannot support
that use model.


## New features & improvements

### MAAS Pods & composable hardware (and VMs)
MAAS 2.2 introduces a new concept called *pods*. In MAAS, pods are an abstraction
to describe the availability of resources that allows MAAS to create or compose
a machine with a set of those resources.

Pods refer to a combination of hardware resources that can be used to construct
a machine. Each pod can be thought of as a pool of hardware with various
available resources, such as CPU, RAM, and (local or remote) storage capacity.
MAAS allows the manual allocation of physical hardware based on resources
available in the pod. Users can use the MAAS UI or the API to allocate hardware
from a pod.

In addition, MAAS will now make more efficient use of resources by *dynamically
allocating hardware* (using Juju or the MAAS API). That is, machines can be
allocated "just in time", based on CPU, RAM, and storage constraints.

The MAAS 2.2 release supports two types of pods:

- Physical systems with Intel RSD
- Virtual Machines with libvirt and qemu-kvm

### MAAS Pods - Intel RSD
MAAS now supports Intel Rack Scale Design (RSD). The supported version of Intel
RSD is with the Intel OEM PODM/PSME software version 1.2.5, which is APIv1 and
based on Redfish.

MAAS Intel RSD support includes the following features:

- Ability to discover all available resources
- Ability to discover all pre-composed (pre-existing) resources or machines
- Ability to compose machines (manually) via the API or the web UI
- Ability to compose machines (manually and dynamically) with remote attached
storage (iSCSI)
- Ability to (dynamically) compose machines

### MAAS Pods - libvirt with qemu-kvm
MAAS supports using a given qemu-kvm system as a pod, using libvirt. MAAS will
treat the libvirt hypervisor as a pod, including the following features:

- Ability to discover all available resources
- Ability to discover all pre-composed (pre-existing) resources or machines
- Ability to compose (create) machines (manually) via the API or the web UI
- Ability to (dynamically) compose machines

### Hardware testing
Hardware Testing in MAAS allows administrators to perform a series of tests to
ensure the reliability of CPU, RAM, storage, and network environment.
Therefore, MAAS administrators can now easily identify hardware issues before
placing hardware into production. 

Users can run hardware testing as part the commissioning processes, or as a
separate action available on machines in "Ready" or "Deployed" state. When
hardware tests are run as part of the commissioning process, machines that fail
testing will not transition to the "Ready" state, and cannot be used for
deployment.

The available tests are described below:

#### Disk testing
- **smartctl-validate** - uses the smartctl tool to verify existing SMART data on all
  drives has not detected any errors.
- **smartctl-short & smartctl-long** - runs the SMART self tests to validate health
  on all disks. It provides a long running and a short running test.
- **smartctl-conveyance** - runs the conveyance SMART self tests to validate health
  on all disks.
- **badblocks** - runs badblocks testing on all disks in parallel.
- **badblocks-destructive** - runs badblocks destructive tests on all disks in
  parallel. This means that badblocks will overwrite any date currently on the
  disks.

#### CPU and RAM testing
- **stress-ng-cpu-short/long** - stress tests the CPU of a machine for 5 minutes/12
  hours respectively.
- **stress-ng-memory-short/long** - stress tests the memory of a machine for 5
  minutes/12 hours.
- **memtester** - runs memtester over all available RAM.

#### Environment testing
- **Internet connectivity** - ensures machines can connect to the Internet.
- **NTP connectivity** - ensures that machines can connect to the configured NTP
  server, whether this is MAAS or an external NTP server.

### DHCP relay support
MAAS now supports the modeling of DHCP relays in your network. For example, if
an edge switch is forwarding DHCP traffic to a MAAS DHCP server, an
administrator can tell MAAS that the VLAN at the edge will have its DHCP
traffic forwarded to a particular destination VLAN. This allows MAAS to
configure the DHCP server running on the primary and/or secondary rack
controller to include a shared-network statement for that VLAN. 

Please note that MAAS does not provide a DHCP relay service. Network
administrators must configure a DHCP relay service to forward DHCP traffic from
edge networks to the IP addresses of of the primary and/or secondary rack
controller(s), on the VLAN where DHCP is enabled.

### Unmanaged subnets
In MAAS 2.0, the concept of a "static range" (a specific range of addresses in
which MAAS was allowed to freely allocate addresses from) was removed from
MAAS, in favour of the idea that MAAS managing entire subnets. As such, the only
way to tell MAAS to not allocate certain sections of a subnet is to add a
reserved IP range.

MAAS 2.2 now enhances this functionality by introducing *unmanaged subnets*. By
setting a subnet in MAAS to "unmanaged", administrators prevent MAAS from using
that subnet for automatic IP assignment. On unmanaged subnets, MAAS will only
allocate IP addresses from reserved ranges. If no reserved range exists on an
unmanaged subnet, IP allocation will fail.

### Notifications (web UI)
MAAS 2.2 introduces a new notification system that surfaces messages to the
user via the web UI, providing more visibility to the user when:

- Rack controllers get disconnected
- Image imports fail on your region controller
- Rack controllers have images that the region controller does not
- Static IP address allocations on a subnet are close to exhaustion

### Switch discovery and deployment (Facebook Wedge 40, Wedge 100)
MAAS now has the ability to automatically discover and manage the Facebook
Wedge 40 and Wedge 100 switches. When enlisting a Wedge switch, MAAS will
identify OpenBMC-compatible management, provide power management, and allow the
deployment of Ubuntu. MAAS will also automatically tag the fact that the device
is a switch (and which particular model was found) for easy identification.

Additionally, MAAS will automatically identify if the Trident or Tomahawk ASICs
are connected to the switch, and will automatically identify them via tags.

### MAAS on mobile devices
The MAAS web UI is now more responsive on mobile devices, resulting in a better
user experience for users working from their phone or tablet. These users will
see a slick new design for these devices. Thanks goes to the Ubuntu Web team
for making MAAS look great on small devices.

### Windows deployments
MAAS 2.2 improves the ability to configure storage configuration for Windows.
This includes the ability to select the root device where Windows will be
installed. Note that this ability extends to all DD images that MAAS can
deploy.

### Device details (web UI)
MAAS 2.2 provides a 'Details Page' for 'Devices' allowing administrators to add
new interfaces as well as modifying existing ones. It also provides the ability
to update a device hostname and domain name.

### Package repositories
MAAS 2.2 improves its package repositories support for Ubuntu mirrors by adding
the ability to disable components. These components are Universe, Multiverse,
and Restricted.

### Commissioning improvements
Several improvements have been made to the commissioning process in MAAS 2.2:

- **Ability to select custom commissioning scripts**  
  As of 2.1, MAAS would run all uploaded custom commissioning scripts that.
  MAAS 2.2 now provides the ability to select which custom commissioning scripts
  to run. By default, however, all custom commissioning scripts will be run.

- **Commissioning no longer dependent on a 20 minute timeout**  
  In 2.1, if the entire commissioning process took longer than 20 minutes to
  run, the machine would fail to commission.

    As of 2.2, this is no longer the case. MAAS now has the ability to track both,
  builtin and custom commissioning scripts. This provides the flexibility to add
  custom commissioning scripts that would take longer than the initial 20 minute
  timeout, allowing them to fully run their scripts without marking a node
  'Failed Commissioning'.

### Usability improvements (web UI)
Several web UI improvements have been made:

- **Navigation improvements - adding tabs**  
  Following the UX improvements from our design team, the web UI now has improved
  navigation. This includes a new tab-based approach for second level navigation
  items (for example, machines, devices, and controllers on the Nodes page).

- **Better error surfacing**  
  Added error surfacing when editing node interfaces (including both machine and
  devices interfaces).


## Other features

### MAAS Client Library — libmaas (0.4.1)

The MAAS team is happy to announce the introduction of a new and improved MAAS
client library (python-libmaas). The MAAS team has started work on an
asyncio-based client library to allow developers, integrators, and
administrators to better interact with MAAS.

While this is an initial client library release and does not support all MAAS
endpoints (nor all operations), we encourage all of our users to try it out and
provide feedback. The currently supported releases include both MAAS 2.1 & 2.2.

If you wish to contribute to the development of the client library, please see
below!

**Available endpoints**  
The library currently has the following endpoints:

- Account
- Boot-resources, boot-sources (manages images)
- Machines, devices, region-controllers & rack-controllers (manages nodes)
- Events (manages machine events)
- Configuration (settings)
- Tags
- Version
- Zones

**Documentation**  
If you would like to know more about python-libmaas, please refer to the
below resources:

For installation and initial steps:
http://maas.github.io/python-libmaas/index.html

For a few examples:

- http://maas.github.io/python-libmaas/client/index.html
- http://maas.github.io/python-libmaas/client/nodes/index.html

For pypi information:
https://pypi.python.org/pypi/python-libmaas

**Contribute**  
If you would like to contribute you can find the source code in GitHub:

https://github.com/maas/python-libmaas

For more questions, please find us:

- `#maas` on freenode
- `maas-devel` mailing list is a good place for questions


<!-- LINKS -->

[historical-release-notes]: release-notes-all.md
