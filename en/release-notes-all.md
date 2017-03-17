Title: Historical Release Notes | MAAS
table_of_contents: True


# Historical Release Notes

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


<!-- ===================================================================== -->


## 2.1

### New MAAS dashboard

In MAAS 2.1, administrators will be shown the new MAAS dashboard after they log
in to the web UI for the first time. Here, they are prompted to answer a few
questions in order to get MAAS up and running quickly (see configuration
journey section for details). In addition, administrators can view hosts that
have been discovered on the network and quickly convert them to a device in
MAAS.

### Image streams have been upgraded to v3 (local mirror update required)

In order to support new kernels, MAAS has moved to a new format for image
streams. Previous releases used stream in 'v2' format. Starting with MAAS 2.1,
the 'v3' format image stream will be used.

Users upgrading from earlier versions of MAAS who are using the default image
source will be automatically migrated to the v3 format.

MAAS will not migrate the URL of a non-default image source (i.e. a mirror) as
it must first contain the v3 stream, which is available at
`http://images.maas.io/ephemeral-v3/`.

Old images downloaded from the v2 stream will continue to work but the MAAS
team only supports MAAS 2.1 users using the v3 stream. Note that the default
image source may eventually drop the v2 stream.

Bootloaders are now included in the default image source (see bootloaders
section for details). Mirrors should be updated accordingly.

### New HWE and GA kernel naming convention

Starting with MAAS 2.1 and Ubuntu 16.04 LTS (Xenial), MAAS is adhering to a
new naming convention for hardware enablement (HWE) kernels and general
availability (GA) kernels. MAAS will no longer support the old naming
convention for HWE kernels (e.g. hwe-y) when selecting images (Xenial and
newer) to import. The new nomenclature is as follows:

- `ga-<version>`: The GA kernel has the major kernel version of the kernel which
  the corresponding Ubuntu release shipped with. For example, ‘ga-16.04’ is the
  kernel which shipped with 16.04 yet comes with all the bug fixes provided by
  the Ubuntu archives. As per Ubuntu policy, a GA kernel will never have its
  major version upgraded (until the release itself is upgraded).

- `hwe-<version>`: The latest HWE kernel available for a given LTS release. As
  new HWE kernels become available (from newly shipped Ubuntu releases), the
  hwe-<version> kernel will be correspondingly changed (up to, and including, the
  next LTS). For example, at time of writing, 'hwe-16.04' is equivalent to
  'ga-16.04'. Soon after Ubuntu 16.10 is released, 'hwe-16.04' will point to
  'ga-16.10'.

### Commissioning-user-data and pxe/uefi templates no longer available

In the past, MAAS stored `commissioning-user-data` and `pxe/uefi` templates in
`/etc/maas/templates`. As of MAAS 2.1, these templates are no longer available
in that location as they are not intended to be modified by users.


## Major new features

### First user configuration journey (web UI)

Administrators can now perform some initial configuration upon logging in to
the web UI for the first time. This includes:

- Ability to change the name of your MAAS
- Ability to configure options that affect connectivity:
    - Select an upstream DNS Server (Optional)
    - Input different Ubuntu mirrors (Required)
    - Input an external proxy (Optional)
    - Ability to select additional images to download
    - Ability to import SSH keys from Launchpad or GitHub

### Device discovery

MAAS now automatically listens to the network and reports any discovered
devices. Devices are identified when the rack controller observes them
communicating on an attached IPv4 subnet. Discovered devices that do not
correspond to machines and devices already known to MAAS are shown on the
dashboard. If a device advertises a hostname using `mDNS` (such as with `avahi`
or `Bonjour`), MAAS will also present the discovered hostname in the dashboard.
Using the dashboard, a discovery can quickly be added to MAAS as a device or as
a network interface to a machine or device.

### Active subnet mapping

The device discovery feature was designed to operate passively by default.
While MAAS will not send any traffic on attached networks for discovery
purposes unless instructed to, there are two ways to instruct MAAS to map your
networks:

- **On-demand**: Administrators can choose to map their subnet using an action on
  the subnet details page. This action will scan the subnet just once, so that
  observed devices on that subnet may quickly be seen in the dashboard. This
  feature is useful after initially installing MAAS, to quickly populate the list
  of discoveries with active devices on the network.

- **Periodically** (recommended): By enabling active discovery on a per-subnet
  basis, subnets will be scanned at a user-specified interval (default is
  every three hours). This allows MAAS to maintain current information about
  which IP addresses are in use on each subnet.

Before actively mapping any networks, it is recommended that the `nmap` package
be installed on each rack controller. Doing so results in faster scans that
require less network traffic. If nmap is not installed, MAAS will resort to
scanning using the `ping` utility.

### Offline deployment and customizable APT repositories

MAAS 2.1 improves offline deployment by adding support for *Ubuntu derived
repositories*, PPAs, and custom APT repositories. This enables MAAS to configure
deployed machines with the correct APT repositories and keyrings, without being
dependent on Internet connectivity.

- Prior to 2.1, MAAS only allowed users to change the Ubuntu archive to use.
  This was limited to defining the location of an official Ubuntu mirror.

- Derived repositories are based on an Ubuntu mirror, but have had packages
  added or removed, which requires signing the repository with an unofficial
  GPG key. MAAS now allow users to provide GPG key fingerprints to support this
  type of repository. These fingerprints are required in order for the derived
  repository to be trusted, and will be added to the APT keyring on each machine.

- PPAs can now be specified, which will be added to the APT sources on deployed
  machines. Users may define a GPG key fingerprint in order for the machine to
  trust the PPA, for cases where the deployed machine cannot access the Ubuntu
  key server.

- Custom repositories can be specified to add additional packages to
  deployed machines. The distribution and component can be customized as
  appropriate. For example, users would be able to add the Google Chrome
  repository, which is as follows:

    `deb http://dl.google.com/linux/chrome/deb/ stable main`

    In this case, the distribution is 'stable', and the component is 'main'.

### New NTP service

MAAS now provides managed NTP services (with `ntpd`) for all region and rack
controllers. This allows MAAS to both keep its own controllers synchronized,
and keep deployed machines synchronized as well.

- The region controller configures the NTP service (ntpd) to keep its time
  synchronized from one or more external sources. By default, the MAAS region
  controller uses ntp.ubuntu.com. This can be customized on the Settings page.

- The rack controllers also configure the NTP service (ntpd). They synchronize
  their time with the region controllers.

- Rack controllers also configure DHCP with the correct NTP information. Any
  machine on the network that obtains a DHCP lease from MAAS will benefit from
  NTP support.

- External sites can be used as a time source for both controllers and
  machines. An existing NTP infrastructure can be used so that all
  machines and controllers sync their time from it. This is done by selecting
  the 'External Only' option on the Settings page.

### Advanced networking: static routes

MAAS 2.1 introduces the ability to define static routes. This allows
administrators to configure reachability to a subnet from a source subnet.
Administrators can define routes on a per-subnet basis to use a particular
gateway, using a configured destination and metric.

### Machine networking: bridge configuration

MAAS 2.1 supports the creation of bridge interfaces. This support is limited to
the ability to create a bridge against a single interface, such as for the
purpose of eventually deploying virtual machines or containers on the machine.

Automatic bridge creation on all configured interfaces can also be performed at
allocation time using the API.

### New Rescue mode

MAAS 2.1 supports a new state in the machine lifecycle: Rescue mode. This
allows users to boot a Deployed or a Broken node using an ephemeral image
(Ubuntu running in memory on the underlying machine). This allows
administrators to SSH to the machine for maintenance purposes.

### Enhanced images user interface

The MAAS images page has been completely redesigned. Improvements include:

- Supports selecting the image source (maas.io or custom repository).
- Now shows the image releases and architectures available in a repository before the
  import starts.
- Now displays detailed status throughout the image import process.
- The Boot Images section in the Settings page has been removed.


## Minor new features

### Disk erasing improvements and secure erase

MAAS 1.7 introduced the ability to erase disks when a machine is Released. This
support was limited to erasing the whole disk and could only be enabled (or
disabled) globally.

Starting with 2.1, MAAS supports the ability to request disk erasure on a
per-machine basis, at the time the machine is released. In addition, new
options for the disk erase mode have been added:

- **Secure erase**: MAAS will attempt to erase via secure erase (if the storage
  device supports it), otherwise, it will perform a full erase or a quick erase
  (depending on the options provided).
- **Quick erase**: MAAS will only erase the beginning and the end of each storage
  device.

### Machine networking: SR-IOV auto-tagging and web UI tag improvements

MAAS now attempts to auto-detect and tag SR-IOV NIC cards.

MAAS now allows the definition of tags per network interface via the web UI.

### Support for low latency kernels

Starting with Ubuntu 16.04 LTS, low latency kernels are available on i386 and
amd64 for both GA and HWE kernels. The currently available low latency kernels
are:

- hwe-x-lowlatency: the Xenial low latency HWE kernel for Trusty
- ga-16.04-lowlatency: the low latency GA kernel for Xenial
- hwe-16.04-lowlatency: the low latency HWE kernel for Xenial

!!! Note: 
    As time of writing, the last 2 kernels are the same.

### Bootloaders are now provided in the image stream

Previously, bootloaders were downloaded on the rack controller from the Ubuntu
archives for each architecture MAAS had images for. Starting with MAAS 2.1,
bootloaders are downloaded with the images from where rack controllers retrieve
them, as they do with images. So MAAS no longer directly interacts with the
Ubuntu archives.

In the case that bootloaders are missing from the stream, MAAS will attempt to
locate previous downloads of the bootloader as well as package installs of the
bootloader. Users with image mirrors must ensure image their mirrors include
the bootloaders in order to be running the latest supported versions.

### SSH keys can be imported from Launchpad or GitHub

Users can now initiate the import of SSH public keys from the web UI. Users who
log in to MAAS for the first time will be given the opportunity to import their
SSH keys. Alternatively, users can import keys later into their user profile
page, or continue to upload keys manually.


## Other notable changes

### Better error surfacing for DHCP snippets and package repositories

Both the DHCP Snippets section and the Package Repositories section have been
improved in order to show errors in a more user-friendly way.

### Vanilla framework: HTML and CSS updates, smoother look and feel

The HTML templates and CSS frameworks in MAAS have been completely rebuilt with
the Vanilla CSS framework. Icons and interactions in MAAS have greatly
improved; users will notice smoother, more intuitive interactions with the web
UI.

The MAAS team would like to thank the Canonical design and web teams for their
contributions in this area.

### Networks page renamed

The Networks page has been renamed to Subnets.


<!-- ===================================================================== -->


## 2.0

### MAAS 2.0 supported on Ubuntu 16.04 LTS (Xenial)

MAAS version 2.0 is supported on Ubuntu 16.04 LTS. MAAS 2.0 and greater
will NOT be supported on Ubuntu 14.04 LTS. The latest MAAS 1.9 point
release will continue to be supported on Ubuntu 14.04 LTS (Trusty) until
it reaches end-of-life.

Upgrades are supported for users running Ubuntu 14.04 systems running
MAAS 1.9 or earlier. Upon upgrading to Ubuntu 16.04, the MAAS database
and configuration will be seamlessly migrated to the supported
MAAS version.

Please see the “Other Notable Changes” section below for more details
regarding the reasons for this change.

### Terminology Changes

Cluster controllers have been renamed to rack controllers.

Starting from MAAS 2.0, MAAS cluster controllers have been deprecated,
along with the legacy `nodegroups` API. The new API endpoint is
`rackcontrollers`, which provides feature parity with earlier versions
of MAAS.

For more information on rack controllers, refer to the
Major new Features section bellow or refer to rack-configuration.

### API 1.0 has been deprecated, introducing API 2.0

Starting from MAAS 2.0, the MAAS REST API version 1.0 has been
deprecated. MAAS 2.0 drops support for the legacy 1.0 API, in favor of
API version 2.0. With the introduction of the new API version, various
endpoints have now been deprecated, and new end-points have
been introduced. API users will need to update their client tools to
reflect the changes.

For more information on API 2.0, refer
to API documentation &lt;region-controller-api&gt;.

### Static IP ranges have been deprecated

Starting from MAAS 2.0, static IP ranges (previously found on the
cluster interface page) have been deprecated. MAAS now assumes total
control of a subnet. MAAS will automatically assign IP addresses to
deployed machines, as long as those IP addresses are not within a
dynamic or a reserved IP range. Users are now only required to specify
one or more dynamic ranges per subnet. Dynamic ranges are used for
auto-enlistment, commissioning, and any other systems configured
for DHCP. IP addresses in-use for purposes such as devices, default
gateways, DNS servers, rack and region controllers, and BMCs are
automatically avoided when assigning IP addresses. Reserved IP ranges
may be added if MAAS should avoid certain ranges of IP addresses in
the subnet.

### maas-region-controller-min has been renamed to maas-region-api

The `maas-region-controller-min` package has been renamed to
`maas-region-api`. This package provides API services for MAAS
(`maas-regiond`) and can be used to scale out the API front-end of a
MAAS region.

### MAAS user creation been moved to 'maas' command

Starting from MAAS 2.0, the `maas` command now provides the ability to
create admin users. The `maas-region createadmin` command has
been deprecated. New administrators should now be created with
`maas createadmin`.

### maas-provision command has been replaced

The MAAS rack controller command-line interface (`maas-provision`) has
been replaced by the `maas-rack` command.

### maas-region-admin command has been replaced with maas-region

The MAAS region controller command-line interface (`maas-region-admin`)
has been replaced by the `maas-region` command. Note that this command
provides an interface to interact directly with Django, which should
only be used for debugging purposes.

### Debian Installer is no longer installed or supported

Because support for the Debian Installer (DI) has been dropped (as of
MAAS 1.9), MAAS no longer downloads DI-related files from simplestreams.
Upon upgrading to MAAS 2.0, DI-related files will be removed from the
MAAS region (and all rack controllers).

## Major new features

### MAAS Rack Controllers and High Availability

Starting from MAAS 2.0, MAAS **cluster controllers** have been renamed
to **rack controllers**.

-   The `nodegroups` and `nodegroups/(group)/interfaces` API endpoints
    have been deprecated. In MAAS 2.0, the `rackcontrollers` interface
    partially replaces this functionality. For defining dynamic and
    reserved ranges, or specifying default gateways, use the
    `subnets` endpoint. For enabling or disabling DHCP, use the
    `fabrics/(fabric)/vlans` endpoint.
-   The **Clusters** tab is no longer available in the Web UI.
    Controllers are now found under the **Nodes** tab, where each region
    and/or rack controller can be found. Other cluster interface
    properties have been moved to the Subnet and VLAN details pages
    under the **Networks** tab.
-   Machines no longer belong to a specific controller. In earlier
    versions of MAAS, machines would directly assigned to a
    cluster controller. The cluster controller that the machine belonged
    to would not only perform DHCP for that machine, but also all the
    PXE booting and power management.

    In order to support high availability for rack controllers,
    (starting from MAAS 2.0) machines no longer belong to a specific
    rack controller. The best controller to manage a machine is now
    determined at runtime.

-   DHCP is now configured per-VLAN. In earlier versions of MAAS, DHCP
    was directly linked and configured per cluster interface. As of MAAS
    2.0, DHCP is now configured and managed per-VLAN, which allows any
    rack controller to potentially provide DHCP in a
    high-availability environment.
-   Rack controllers have been enabled for high availability. Starting
    from MAAS 2.0, rack controllers in the same VLAN become candidates
    to manage DHCP, PXE/TFTP, and power control for machines on
    the VLAN. MAAS now supports the concept of a **primary** and a
    **secondary** rack controller. If a secondary controller determines
    that the primary controller is unavailable, it will assume control
    of those services.
-   Added `maas-rack support-dump` command. For increased support
    observability, users can now dump the contents of several internal
    MAAS data structures by executing `sudo maas-rack support-dump`.
    This command will dump networking diagnostics, rack configuration,
    and image information. Information can be restricted to a particular
    category by using the `--networking`, `--config`, or
    `--images` options.
-   Rack controllers can now be found under the **Nodes** tab in the Web
    UI. MAAS 2.0 Adds a new **Controllers** section under thee
    **Nodes** tab. This section will now list all rack and
    region controllers. Under a rack controller, the user will be able
    to see service tracking, connected VLANs, rack interfaces and other
    relevant information.

### Region Controller Redundancy (High Availability) 

Starting from MAAS 2.0, MAAS provides the ability to scale out (provide
redundancy for) the MAAS region controller API, HTTP server, and DNS.
This will allow administrators to set up multiple MAAS region
controllers (`maas-region-api`) against a common database, providing
redundancy of services. With further manual configuration, users will be
able to setup the MAAS region controller in high availability mode.

### New Networks Web UI

MAAS 2.0 introduces a few new Web UI features that were not available in
previous versions of MAAS.

-   Added fabric and space details pages.
-   Added the ability to add and remove fabrics, spaces, subnets and
    VLANs. This can be done using the actions menu on the
    **Networks** tab.
    The ability to delete fabrics, spaces, subnets and VLANs is also
    available from the details page for each respective object.

### DNS Management

MAAS 2.0 extends DNS management by adding the following features:

-   Ability to create multiple DNS domains.
-   Ability to add multiple records (`CNAME`, `TXT`, `MX`, `SRV`)
    per domain. (API only)
-   Ability to select the domain for machines and devices.
-   Ability to assign (additional) names to IP addresses. (API only)
-   For deployed machines, `A` records continue to be created for the IP
    of the PXE interface.
-   Additional PTR records are now created for all non-PXE interfaces in
    the form: `<interface>.<machine fully-qualified-domain-name>`
-   Reverse DNS is now generated for only the subnet specified, rather
    than the parent /24 or /16. By default, [RFC2137][rfc2137] glue is provided
    for networks smaller than /24. This can be disabled or changed on a per-subnet
    basis via the API.

### IP Ranges  

Previous versions of MAAS used the concepts of a **dynamic range** and
**static range**, which were properties of each cluster interface. This
has been redesigned for MAAS 2.0 as follows:

-   Dynamic ranges have been migrated from earlier MAAS releases as-is.
-   Because static ranges have been removed from MAAS, each static range
    has been migrated to one or more reserved ranges, which represent
    the opposite of the previous static range. (MAAS now assumes it has
    full control of each managed subnet, and is free to assign IP
    addresses as it sees fit, unless told otherwise.)

    For example, if in an earlier MAAS release a cluster interface was
    configured on 192.168.0.1/24, with a dynamic range of 192.168.0.2
    through 192.168.0.99, and a static range of 192.168.0.100 through
    192.168.0.199, this will be migrated to:

        IP range #1 (dynamic): 192.168.0.2 - 192.168.0.99
        IP range #2 (reserved): 192.168.0.200 - 192.168.0.254

    Since 192.168.0.100 - 192.168.0.199 (the previous static range) is
    not accounted for, MAAS assumes it is free to allocate static IP
    addresses from that range.

-   Scalability is now possible by means of adding a second dynamic IP
    range to a VLAN. (To deal with IP address exhaustion, MAAS supports
    multiple dynamic ranges on one or more subnets within a
    DHCP-enabled VLAN.)
-   Reserved ranges can now be allocated to a particular MAAS user.
-   A comment field has been added, so that users can indicate why a
    particular range of IP addresses is reserved.
-   IP ranges can be configured in the Web UI via the Subnet details
    page, or using the `subnets` REST API endpoint.

### API 2.0 and MAAS CLI Updates  

Version 1.0 of the MAAS REST API has been removed and replaced with the
2.0 version of the REST API. As such, new endpoints and commands have
been introduced:

-   RackControllers - This endpoint/command has the following operations
    in addition to the base operations provided by nodes:
    `import-boot-images` - Import the boot images on all rack controllers
    `describe-power-types` - Query all of the rack controllers for
    power information

-   RackController - This endpoint/command has the following operations
    in addition to the base operations provided by nodes
    -   `import-boot-images` - Import boot images on the given rack
        controller
    -   `refresh` - refresh the hardware information for the given rack
        controller
-   Machines - This endpoint/command replaces many of the operations
    previously found in the nodes endpoint/command. The machines
    endpoint/command has the following operations in addition to the
    base operations provided by nodes.
    -   `power-parameters` - Retrieve power parameters for multiple
        machines
    -   `list-allocated` - Fetch machines that were allocated to the
        user/oauth token.
    -   `allocate` - Allocate an available machine for deployment.
    -   `accept` - Accept declared machine into MAAS.
    -   `accept-all` - Accept all declared machines into MAAS.
    -   `create` - Create a new machine.
    -   `add-chassis` - Add special hardware types.
    -   `release` - Release multiple machines.
-   Machine - This endpoint/command replaces many of the operations
    previously found in the node endpoint/command. The machine
    endpoint/command has the following operations in addition to the
    base operations provided by node.
    -   `power-parameters` - Obtain power parameters for the
        given machine.
    -   `deploy` - Deploy an operating system to a given machine.
    -   `abort` - Abort the machines current operation.
    -   `get-curtin-config` - Return the rendered curtin configuration
        for the machine.
    -   `power-off` - Power off the given machine.
    -   `set-storage-layout` - Change the storage layout of the
        given machine.
    -   `power-on` - Turn on the given machine.
    -   `release` - Release a given machine.
    -   `clear-default-gateways` - Clear any set default gateways on
        the machine.
    -   `update` - Change machine configuration.
    -   `query-power-state` - Query the power state of a machine.
    -   `commission` - Begin commissioning process for a machine

#### Other endpoints/commands have changed:

-   All list commands/operations have been converted to read
-   All new and add commands/operations have been converted to create
-   Nodes - The nodes endpoint/command is now a base endpoint/command
    for all other node types(devices, machines, and rack-controllers).
    As such most operations have been moved to the machines
    endpoint/command.The following operations remain as they can be used
    on all node types.
    -   `is-registered` - Returns whether or not the given MAC address
        is registered with this MAAS.
    -   `set-zone` - Assign multiple nodes to a physical zone at once.
    -   `read` - List nodes visible to the user, optionally filtered
        by criteria.
-   Node - The node endpoint/command is now a base endpoint/command for
    all other node types(devices, machines, and rack-controllers). As
    such most operations have been moved to the machine
    endpoint/command. The following operations remain as they can be
    used on all node types.
    -   `read` - Read information about a specific node
    -   `details` - Obtain various system details.
    -   `delete` - Delete a specific node.
-   With the migration of nodes to machines the following items
    previously outputted with the list command have been changed or
    removed from the machines read command:
    -   \`\`status - Will now show all status types
    -   `substatus`, `substatus_action`, `substatus_message`,
        `substatus_name` - Replaced by `status`, `status_action`,
        `status_message`, `status_name`.
    -   \`\`boot\_type - Removed, MAAS 2.0 only supports fastpath.
    -   `pxe_mac` - Replaced by `boot_interface`.
    -   `hostname` - Now only displays the hostname (without the domain)
        of the machine. `fqdn` and `domain` attributes can now be
        used instead.
-   And other endpoints/commands have been deprecated:
    -   NodeGroups - Replacement operations are found in the
        RackControllers, Machines, and BootResources endpoints/commands.
    -   NodeGroupInterfaces - replacement operations are found in the
        RackController, IPRanges, Subnets, and VLANS endpoints/commands.

### Extended Storage Support  

MAAS 2.0 Storage Model has been extended to support:

-   XFS as a filesystem.
-   Mount options.
-   Swap partitions. (MAAS 1.9 only supported the creation of a swap
    file in the filesystem.)
-   `tmps`/`ramfs` support.

All of these options are currently available over the CLI.

### DHCP Snippets

MAAS 2.0 introduces the ability to define DHCP snippets. This feature
allows administrators to manage DHCP directly from MAAS, removing the
need to manually modify template files. The following types of DHCP
snippets can be defined:

> -   **Host snippets** - used for configuration for a particular node
>     in MAAS.
> -   **Subnet snippets** - used for configuration for a specific subnet
>     in MAAS.
> -   **Global snippets** - used for configuration that will affect DHCP
>     (isc-dhcp) as a whole.

For more information, see DHCP Snippets &lt;dhcpsnippets&gt;.

## Minor new features

### MAAS proxy is now managed

Starting from MAAS 2.0, MAAS now manages the configuration for
`maas-proxy`. This allows MAAS to lock down the proxy so that it only
allows traffic from networks MAAS knows about. For more information,
see MAAS Proxy &lt;proxy&gt;.

### rsyslog during enlistment and commissioning

MAAS 2.0 now enables `rsyslog` for the enlistment and commissioning
environment (when using Xenial as the commissioning image). This allows
users to see `cloud-init`'s syslog information in
`/var/log/maas/rsyslog/`.

### Ability to change a machine’s domain name from the UI 

MAAS 2.0 introduces the ability to change a machine’s DNS domain via the
Web UI. It was previously supported on the API only.

### Networks listing page

In the **Networks** tab, a new networks overview has been introduced,
which provides a high-level view of the MAAS networking mode. The
network model can be grouped by either fabrics or spaces.

### Service Tracking

MAAS now tracks the status of the services required for its operation,
such as `bind`, `maas-dhcpd`, `maas-dhcpd6`, `tgt`, and `maas-proxy`.

## Other notable changes

### MAAS 2.0 requires Python 3.5

Starting with MAAS 2.0, MAAS has now been ported to Python 3.5 (the
default version of Python in Ubuntu 16.04 "Xenial").

### MAAS 2.0 now fully supports native Django 1.8 migration system

MAAS is now based on Django 1.8. Django 1.8 has dropped support for the
South migration system in favor of the native Django migration system,
which breaks backwards compatibility with previous versions of Django.

MAAS continues to support a full upgrade path. MAAS versions 1.5, 1.7,
1.8, and 1.9 have been tested and confirmed to upgrade seamlessly to
MAAS 2.0.

### Instant DHCP lease notifications  
MAAS no longer scans the leases file every 5 minutes. `isc-dhcp-server`
now directly notifies MAAS if a lease is committed, released,
or expires.

### Host entries in DHCP  
Host entries are now rendered in the DHCP configuration instead of
placed in the leases file. This removes any state that previously
existed in the DHCP lease database on the cluster controller.

Starting with MAAS 2.0, if the dhcpd.leases file is lost (such as during
a failure scenario in a high availability environment), MAAS will be
able to reconstruct it.

### Power control is no longer specific to a rack controller  
MAAS selects one of the available rack controllers to power control or
query a BMC. The same rack controller that powers the BMC does not need
to be the rack controller that the machine PXE boots from.


<!-- LINKS -->

[rfc2137]: https://tools.ietf.org/html/rfc2137
