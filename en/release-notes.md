Title: 2.1 Release Notes | MAAS
table_of_contents: True


See [Historical release notes][historical-release-notes] for release notes for
all versions.


# Release Notes - 2.1

## Important changes

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


<!-- LINKS -->

[historical-release-notes]: release-notes-all.md
