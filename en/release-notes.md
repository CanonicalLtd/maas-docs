Title: 2.2 Release Notes | MAAS
table_of_contents: True


See [Historical release notes][historical-release-notes] for release notes for
all versions.

The development version of MAAS is available on the MAAS Next PPA
(ppa:maas/next):

```bash
sudo add-apt-repository -yu ppa:maas/next
sudo apt install maas
```


# Release Notes - devel

## 2.2.0 (beta3)

### Hardware tests - running by default during Commissioning

MAAS 2.2 introduces the ability to perform hardware tests. As part of MAAS beta
3, MAAS introduces the ability to run disk tests, which can be run as part of
the commissioning processes, or as a separate action from Ready or Deployed.

Please be aware that running hardware tests during the commissioning process
can prevent machines from becoming 'Ready' for deployment, if the hardware
tests fail.

For more information about the Hardware Testing feature please refer to the
following section.

### Intel Rack Scale Design - Dynamically creating machines

MAAS 2.2 Beta 2 introduced support for Intel's Rack Scale Design (RSD). RSD is
a hardware architecture that allows the dynamic composition of physical systems
from a pool of available hardware resources.

Starting from Beta 3, MAAS now extends its support for RSD allowing the
creation (composition) of machines dynamically. This allows administrators and
users to request a machine (allocate) not previously available to MAAS, and
dynamically create (compose) one within the RSD system. This machine can then
be deployed.

Adding such support, it allows Juju to deploy workloads against a MAAS that has
an RSD Pod, with no previously known (available - Ready) machines.


## Major new features

### Hardware Testing

Starting from MAAS, MAAS provides the ability to perform specific hardware
tests. The hardware testing feature provides administrators with a predefined
set of tests that can be run to ensure correct operation of their hardware
before making it available for usage. The hardware testing feature will include
Disk, CPU and Memory tests.

As of MAAS 2.2 Beta 3, only Disk hardware tests have been made available:

- Disk status - The Disk Status test (smartctl-validate) uses the smartctl tool
  to verify existing SMART data on all drives has not detected any errors.

- Disk Integrity - MAAS provides the ability to run SMART tests. This includes:

    - smartctl-short & smartctl-long
      Runs the SMART self tests to validate health on all disks. It provides a long
      running and a short running test.

    - Smartctl-conveyance
      Runs the conveyance SMART self tests to validate health on all disks.

- Memory - For memory, MAAS provides the following tests:
    - Memtestr
      Runs memtester over all available RAM.

    - Stress-ng
      Runs the Stress-NG tests over 12 hours against RAM.

  NOTE: Please note that these are long running tests and will take hours to
  complete.

- CPU - CPU tests include Stress-NG stress tests over 12 hours.

### Intel RSD - Dynamic Composition

The dynamic composition feature allows administrators to request (allocate)
machines from an Intel RSD without having to manually compose such machine.
This allows modeling tools, such as Juju, to request a machine from MAAS when
there are no previously known machines, and dynamically create and deploy one
for a specific workload.

Administrators not using Juju can request a machine via the API, and if no
other machine satisfies the specific or default constraints, a machine will be
automatically created from an RSD pod if one available.

### Web UI - MAAS Pods & Intel RSD

The MAAS web UI introduces a new 'Pods' tab. This is where MAAS will list
composable hardware systems like the Intel RSD. MAAS 2.2 Beta 2 introduces the
ability for MAAS to add and control an Intel RSD via the MAAS API/CLI. MAAS 2.2
Beta 3 introduces a basic Web UI feature to support and manage the Intel RSD
Pods (and any other composable hardware). This changes include:

- List Pods - lists all available pods under the 'Pods' tab:
    - This provides the ability to list all available pods and provide a summary of
      the usage statistics for a pod.
- Add Pod - ability to add new Pods from the 'Pods' tab.
- Pod Details Page - provides more detailed information about a pod:
    - This page provides the ability to obtain more detail information of a
      particular pod. At the moment, it will provide information about the
      available and used resources.

### Facebook Wedge 40 & Wedge 100 discovery

MAAS now has the ability to automatically discover and manage the Facebook
Wedge 40 and Wedge 100 switches. This allows MAAS to automatically discover the
Switch BMC and power manage as any other servers, in order to deploy Ubuntu
onto the switches. MAAS will also automatically tag the machine to easily
identify it.

Additionally, MAAS will automatically identify if the Trident or Tomahawk ASICs
are connected to the switch, and will automatically identify them via tags.

### Web UI - Device Details Page

Starting from Beta 3, MAAS 2.2 now provides a Details Page for 'Devices',
allowing administrators to both, add new interfaces to a device, or modifying
the existing interfaces.


<!-- ===================================================================== -->


## 2.2.0 (beta2)

### Composable hardware

MAAS now supports composable hardware - The Intel Rack Scale Design
The MAAS team is excited to announce the support for the Intel Rack Scale
Design (RSD). Intel Rack Scale Design (RSD) is a hardware architecture that
allows the dynamic composition of physical systems from a pool of available
hardware resources. 

MAAS, as a cloud-like, scale-out bare-metal provisioning system, will leverage
the use of Intel RSD to compose (create) and provision systems. With the
support for RSD, MAAS introduces the ability to manually or dynamically compose
(create) new machines from an available pool of resources. It will allow
administrators to request machines with specific resources on demand and be
able to deploy their workloads on them.


## Major new features

### MAAS support for Intel RSD - API only

MAAS 2.2b2 introduces initial support for Intel RSD. It provides the ability
to :

- Add a new Intel RSD POD into MAAS, allowing users to have a full view of the
  available and used resources. 
- Add the ability to discover pre-composed resources, allowing MAAS to discover
  machines that have been created before adding the Intel RSD POD into MAAS.
- Add the ability to create (compose) new machines.

### Notifications

MAAS 2.2b2 introduces a new notification system. The notification system
surfaces various messages to the user via the web UI, allowing to have more
visibility as to what’s going on with the system. Initially, users will be
notified when :

- When Rack Controllers get disconnected
- When image import fails on your region controller.
- When Rack Controllers have images that the Region Controller does not.

### Web UI Visual updates

MAAS 2.2b2 now has an updated web UI that includes:

- Updated all icons and colour set within the framework. This will keep inline
  with the Vanilla Framework and the new visual update which is going across
  all products
- Links have changed from black to blue. This keeps MAAS inline with Juju and
  other Cloud products also improves the visual UX.
- Improved the responsive nature of MAAS. Tables especially have been improved.
- The new card view and label using aria-label improves the readability and
  uses on mobile / small screens.
- Navigation responsive issues have been resolved.
- Flash messages has been removed and now replaced with the improved
  notification pattern.
- New utility classes u-display--mobile & u-display--desktop have been added
  for extra responsive development / design flexibility.
- Accordion styles have been improved. Removing the cross style and keeping it
  consistent with our remove style.


<!-- ===================================================================== -->


## 2.2.0 (beta1)

### Migrating MAAS L3 to L2 spaces

MAAS 2.2 has changed the definition of spaces from a Layer 3 concept to a Layer
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
can mutually communicate".

As such, starting from MAAS 2.2b1 :

- VLANs will gain a 'space' reference, and subnets will have their spaces
  migrated to the VLANs they are on. On upgrades, if two subnets on the same
  VLAN are in different spaces, the most recently created space will be used for
  both.

- Spaces will become optional. Fresh installs will not have a default space
  (e.g. space-0). On upgrades, if only the default space (space-0) exists, it
  will be removed.

The following API changes will occur in MAAS 2.2 :

- Editing a subnet's space will no longer be possible (breaks backwards
  compatibility). Spaces must now be edited each VLAN.

- For backward compatibility, the subnets endpoint will present the underlying
  VLAN’s space.

Recommended actions for MAAS administrators prior to upgrading to MAAS 2.2 :

- Ensure that no two subnets in the same VLAN are in different spaces, so that
  the upgrade path migrates the expected space to the VLAN.

- Ensure that each VLAN with an assigned space will contain subnets which can
  mutually communicate with other subnets whose VLAN is in the same space. This
  will allow backward compatibility with Juju charms which use the Layer 3
  definition of spaces.[2]

NOTE: Please note that not breakage is expected, provided that most people are
not using spaces. For those who we know are, they are using them in a
compatible way. If you experience some type of issue, please contact us.


## Major new features

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

In MAAS 2.0, the concept of a “static range” (a specific range of addresses in
which MAAS was allowed to freely allocate addresses from) was removed from
MAAS, in favor of the idea that MAAS managing entire subnets. As such, the only
way to tell MAAS to not allocate certain sections of a subnet is to add a
reserved IP range.

Starting from MAAS 2.2b1, however, MAAS enhances this functionality by
introducing a new concept, called unamanged subnets. Setting a Subnet in MAAS
as unmanaged, allows administrators to prevent MAAS from using that subnet for
automatic IP assignment. In other words, it is a way to tell MAAS that it knows
about a subnet but that it shouldn’t use it. 

### MAAS is now responsive

For all of those users that use (or would like to use) MAAS web UI from their
Phone or Tablet, will now have a better user experience, provided that starting
from 2.2b1, MAAS is now responsive. 

Phone or Table users will see a new slick design for those devices. Thanks for
the Ubuntu Web team for putting the effort into making MAAS look great in
smaller devices.


## Known issues and workarounds

Cannot add a device from the dashboard
https://bugs.launchpad.net/maas/+bug/1659959

Cannot add a device with parent from the dashboard


<!-- LINKS -->

[historical-release-notes]: release-notes-all.md
