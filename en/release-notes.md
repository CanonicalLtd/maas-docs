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

### Migrating spaces from L3 to L2
The definition of spaces has changed from a Layer 3 concept to a Layer
2 concept.

The spaces definition in MAAS (first introduced in MAAS 1.9) is "a set of
subnets that can mutually communicate". The assumption is that these spaces can
route to each other, and have appropriate firewall rules for their purposes.
(For example, a dmz space might contain subnets with internet access, and a
storage space might contain subnets that can access the same storage networks.)
Juju uses the current definition in order to ensure that deployed applications
have access to networks appropriate for the services they provide.

The current definition of spaces as a L3 concept is problematic, in that
sometimes Juju wants to deploy applications that themselves create a Layer 3
subnet. Therefore, it was decided that the concept of spaces will be pushed
down a layer (to apply to VLANs in MAAS).

With spaces as a Layer 2 concept, it is is now "a set of VLANs whose subnets
can mutually communicate". As such:

- VLANs will gain a 'space' reference, and subnets will have their spaces
  migrated to the VLANs they are on. On upgrades, if two subnets on the same
  VLAN are in different spaces, the most recently created space will be used for
  both.
- Spaces will become optional. Fresh installs will not have a default space
  (e.g. space-0). On upgrades, if only the default space (space-0) exists, it
  will be removed.

The following API changes will occur in MAAS 2.2:

- Editing a subnet's space will no longer be possible (breaks backwards
  compatibility). Spaces must now be edited each VLAN. (Note: this is an
  API-breaking change; any usage of the MAAS API involving assigning subnets to
  spaces must be updated.)
- For backward compatibility, a subnet's endpoint will present the underlying
  VLAN’s space.

Recommended actions for MAAS administrators prior to upgrading to MAAS 2.2:

- Ensure that no two subnets in the same VLAN are in different spaces, so that
  the upgrade path migrates the expected space to the VLAN.
- Ensure that each VLAN with an assigned space will contain subnets which can
  mutually communicate with other subnets whose VLAN is in the same space. This
  will allow backward compatibility with Juju charms which use the Layer 3
  definition of spaces.[2]

NOTE: Breakage is not expected, provided that most people are
not using spaces. For those who we know are, they are using them in a
compatible way. If you experience some type of issue, please contact us.

### Hardware tests - running by default during Commissioning
It is now possible to perform node hardware tests, which can be run as part of
the commissioning processes, or as a separate action from Ready or Deployed.
Running hardware tests during the commissioning process can prevent machines
from becoming 'Ready' for deployment, if the hardware tests fail. For more
information about the Hardware Testing feature please refer to the section
below.


## New features

### MAAS Pods - Intel RSD Support
MAAS now supports Intel Rack Scale Design (RSD). The supported version of Intel
RSD is with the Intel OEM PODM/PSME software version 1.2.5, which is APIv1 and
based on Redfish.

MAAS Intel RSD support includes the following features:

- Ability to discover all available resources
- Ability to discover pre-composed (existing) machines
- Ability to compose machines (manually) via the API or the web UI
- Ability to compose machines (manually) with remote attached storage (iSCSI)
- Ability to (dynamically) compose machines

### DHCP Relay support
The ability to model the usage of DHCP relays in your networking configuration
has been added to MAAS. The allows an administrator to identify which VLANs
will be relayed through another VLAN running a MAAS DHCP server. This will
configure the MAAS DHCP server running on the primary and/or secondary rack
controller to include the shared network statement for that VLAN. Note: MAAS
does not run a DHCP relay service, it is up to the administrator to configure
the DHCP relay service on the VLAN and point it at the primary and/or secondary
rack controller running the MAAS DHCP.

### Unmanaged subnets
In MAAS 2.0, the concept of a "static range" (a specific range of addresses in
which MAAS was allowed to freely allocate addresses from) was removed from
MAAS, in favor of the idea that MAAS managing entire subnets. As such, the only
way to tell MAAS to not allocate certain sections of a subnet is to add a
reserved IP range.

MAAS now enhances this functionality by introducing a new concept, called
unmanaged subnets. Setting a subnet in MAAS as "unmanaged" allows
administrators to prevent MAAS from using that subnet for automatic IP
assignment. On unmanaged subnets, MAAS will only allocate IP addresses from a
reserved range. If no reserved range exists on an unmanaged subnet, IP
allocation will fail.

### Notifications (web UI)
MAAS 2.2 introduces a new notification system that surfaces messages to the
user via the web UI, providing more visibility to the user when:

- Rack controllers get disconnected
- Image imports fail on your region controller
- Rack controllers have images that the region controller does not
- Static IP address allocations on a subnet are close to exhaustion

### Facebook Wedge 40 & Wedge 100 discovery and deployment
MAAS now has the ability to automatically discover and manage the Facebook
Wedge 40 and Wedge 100 switches. This allows MAAS to automatically discover the
Switch BMC and power manage as any other servers, in order to deploy Ubuntu
onto the switches. MAAS will also automatically tag the machine to easily
identify it.

Additionally, MAAS will automatically identify if the Trident or Tomahawk ASICs
are connected to the switch, and will automatically identify them via tags.

### MAAS on mobile devices
The MAAS web UI is now more responsive on mobile devices, resulting in a better
user experience for users working from their phone or tablet. These users will
see a slick new design for these devices. Thanks goes to the Ubuntu Web team
for making MAAS look great on small devices.


## Minor new features & improvements

### Windows deployments
MAAS 2.2 improves the ability to configure storage configuration for Windows.
This includes the ability to select the root device where Windows will be
installed. Note that this ability extends to all DD images that MAAS can
deploy.

### Device details (web UI)
MAAS 2.2 provides a ‘Details Page’ for ‘Devices’ allowing administrators to add
new interfaces as well as modifying existing ones. It also provides the ability
to update a device hostname and domain name.

### Package repositories
MAAS 2.2 improves its package repositories support for Ubuntu mirrors by adding
the ability to disable components. These components are Universe, Multiverse,
and Restricted.

### Commissioning improvements
In 2.1, MAAS would fail to commissioning if a 20-minute timeout was reached.
This meant that if the whole commissioning process took longer than 20 minutes
to run, the machine would fail to commission. As of 2.2, this is no longer the
case.

MAAS now has the ability to track both, builtin and custom commissioning
scripts. This provides the flexibility to add custom commissioning scripts that
would take longer than the initial 20 minute timeout, allowing them to fully
run their scripts without marking a node 'Failed Commissioning'.

### Usability improvements (web UI)

Several web UI improvements have been made:

- Tabs  
  Following the UX improvements from our design team, the web UI has now
  improved navigation. This includes a new tab-based approach for second level
  navigation items (for example, machines, devices and controllers under the
  Nodes page).
- Better error surfacing  
  Add error surfacing when editing node interfaces (including both machine and
  devices interfaces).


## Other features

### MAAS Client Library - libmaas (0.4.1)
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

==================================================
==================================================

### Hardware Testing

Starting from MAAS, MAAS provides the ability to perform specific hardware
tests. The hardware testing feature provides administrators with a predefined
set of tests that can be run to ensure correct operation of their hardware
before making it available for usage. The hardware testing feature will include
Disk, CPU and Memory tests.

As of MAAS 2.2 Beta 3, only Disk hardware tests have been made available:

- Disk status  
  The Disk Status test (smartctl-validate) uses the smartctl tool
  to verify existing SMART data on all drives has not detected any errors.
- Disk Integrity  
  MAAS provides the ability to run SMART tests. This includes:
    - smartctl-short & smartctl-long
      Runs the SMART self tests to validate health on all disks. It provides a long
      running and a short running test.
    - Smartctl-conveyance
      Runs the conveyance SMART self tests to validate health on all disks.
- Memory  
  For memory, MAAS provides the following tests:
    - Memtestr
      Runs memtester over all available RAM.
    - Stress-ng
      Runs the Stress-NG tests over 12 hours against RAM.
  NOTE: Please note that these are long running tests and will take hours to
  complete.
- CPU  
  CPU tests include Stress-NG stress tests over 12 hours.


<!-- LINKS -->

[historical-release-notes]: release-notes-all.md
