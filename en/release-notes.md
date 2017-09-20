Title: 2.3 Release Notes
table_of_contents: True

# Release Notes 2.3

MAAS 2.3 is currently under development. The current release is [MAAS 2.3.0
alpha2][currentrelease]. See [Historical release
notes][historical-release-notes] for release notes for stable versions.

The development version of MAAS is available as a [snap][snapio] and from the
MAAS Next PPA.

To install from the snap, use the ***Beta*** channel on the default track:

```bash
sudo snap install maas --devmode --beta
```

See [Install from a Snap][snapinstall] for further details. 

To install from the MAAS Next PPA (ppa:maas/next):

```bash
sudo add-apt-repository -yu ppa:maas/next
sudo apt install maas
```

## 2.3.0 (alpha3)

### Hardware Testing (backend only)

This release introduces an improved hardware testing framework that enables MAAS to
test individual components of a single machine and provide better feedback for
each test. 

With the new hardware testing framework, you can:

- **Define a custom testing script with a YAML definition**.
  Each custom test can use a YAML definition to provide information about the
  test. This information includes the script name, description, required
  packages and other metadata about the data the script will collect.
  This information will then be displayed in the web UI. 

- **Pass parameters**.
  You can now pass specific parameters to the hardware testing scripts. For example, in upcoming
  beta releases users will be able to select which disks they want to test.

- **Run individual tests**.
  Improves the way how hardware tests are run per component. This allows MAAS
  to run tests against individual components, such a single disk.

- **Additional performance tests**.
  This release includes a new CPU performance test using *[7zip][7zip]* and a new
  storage performance test using *[fio][fio]*.


!!! Note:
    The results for individual components are currently only available from the
    API. Upcoming beta releases will include UI improvements to accomodate these
    results. 

### Rack Controller Deployment in White Box Switches

MAAS can now install and configure a rack controller after a machine has been
deployed. Currently, this feature is only available if the machine is a
certified white box switch.

Current certified switches include the [Wedge 40 and 100][wedge100].

!!! Note: 
    This features makes use of the MAAS *[snap][snapio]* package to configure the rack
    controller on the deployed machine. As 'snap store' mirrors are not yet
    available, your machine will need internet access to install the MAAS snap.

### Improved DNS Reloading

This new release introduces various improvements to the DNS reload mechanism,
enabling MAAS to be smarter about when to reload after changes have been
automatically detected or made. 

### UI improvements

**Controller Versions and Notifications**

The web UI now displays the version number of each running controller and will
notify the user of any mismatch between region and rack controller versions.
This helps administrators avert potential problems when upgrading MAAS on a
multi-node cluster, such as within a HA setup.

### Issues fixed in this release

For all the issues fixed in this release, please refer to:

[https://launchpad.net/maas/+milestone/2.3.0alpha3](https://launchpad.net/maas/+milestone/2.3.0alpha3)

## 2.3.0 (alpha2)

### Advanced Network for CentOS & Windows

MAAS 2.3 now supports the ability to perform network configuration for CentOS
and Windows. The network configuration is performed via cloud-init. MAAS CentOS
images now use the latest available version of cloud-init that includes these
features.

### New Features & Improvements

CentOS Networking Support MAAS can now perform machine network configuration
for CentOS, giving CentOS networking feature parity with Ubuntu. The following
can now be configured for MAAS deployed CentOS images:

- Static network configuration.
- Bonds, VLAN and bridge interfaces.

### Windows Networking Support

MAAS can now configure NIC teaming (bonding) and VLAN interfaces for Windows
deployments. This uses the native NetLBFO in Windows 2008+. [Contact
us][contactus] for more information.

### Network Discovery & Beaconing

MAAS now sends out encrypted beacons to facilitate network discovery and
monitoring.  Beacons are sent using IPv4 and IPv6 multicast (and unicast) to
UDP port 5240.  When registering a new controller, MAAS uses the information
gathered from the beaconing protocol to ensure that newly registered interfaces
on each controller are associated with existing known networks in MAAS. 

### UI improvements 

Minor UI improvements have been made:

- Renamed “Device Discovery” to “Network Discovery”.
- Discovered devices where MAAS cannot determine the hostname now show the
  hostname as “unknown” and greyed out instead of using the MAC address
  manufacturer as the hostname.

### Issues fixed in this release

For all the issues fixed in this release, please refer to:

[https://launchpad.net/maas/+milestone/2.3.0alpha2](https://launchpad.net/maas/+milestone/2.3.0alpha2)

## 2.3.0 (alpha1)

### Machine Network configuration now deferred to cloud-init.

The machine network configuration is now deferred to cloud-init. In previous
MAAS (and curtin) releases, the machine network configuration was performed by
curtin during the installation process. In an effort to consolidate and improve
robustness, network configuration has now been consolidated in cloud-init.

Since MAAS 2.3 now depends on the latest version of curtin, the network
configuration is now deferred to cloud-init. As such, while MAAS will continue
to send the network configuration to curtin for backwards compatibility, curtin
itself will defer the network configuration to cloud-init. Cloud-init will then
perform such configuration on first boot after the installation process has
completed.

### Ephemeral Images over HTTP

In the effort to reduce the amount of dependencies and improve MAAS’
robustness, MAAS ephemeral images are no longer loaded via iSCSI (tgt).
Starting from 2.3, the ephemeral images are obtained via HTTP from the Rack
Controller.

Please ensure you have the latest available images. For more information please
refer to the section below in New Features & Improvements.

### New Features and Improvements

#### Django 1.11 support

MAAS 2.3 now supports the latest Django LTS version, Django 1.11. This allows
MAAS to work with the newer Django version in Ubuntu Artful, which serves as a
preparation for the next Ubuntu LTS release. 

- Users running MAAS from the snap in any Ubuntu release will use Django 1.11.
- Users running MAAS in Ubuntu Artful will use Django 1.11.
- Users running MAAS in Ubuntu Xenial will continue to use Django 1.9.

#### Upstream Proxy

MAAS 2.3 now supports the ability to use an upstream proxy. Doing so provides
greater flexibility for closed environments provided that:

- Allows MAAS itself to use the corporate proxy at the same time as allowing
  machines to continue to use the MAAS proxy.
- Allows machines that don’t have access to the corporate proxy, to have
  access to other pieces of the infrastructure via MAAS’ proxy.

Adding upstream proxy support also includes an improved configuration on the
settings page. Please refer to *Settings > Proxy* for more details.

#### Fabric deduplication and beaconing

MAAS 2.3 will introduce network beaconing, to confirm network connectivity and
aide discovery of VLANs and fabrics. MAAS now listens for unicast and multicast
beacons on UDP port 5240, and will reply to received beacons. To prepare for
beaconing, several improvements to fabric discovery and creation have been
completed. (For example, MAAS 2.3 alpha 1 should no longer create empty fabrics
when a rack controller is initially registered.)

#### Ephemeral Images over HTTP (feature flag)

Historically, MAAS has used ‘tgt’ to provide images over iSCSI for the
ephemeral environments (e.g commissioning, deployment environment, rescue mode,
etc). MAAS 2.3 will change that behavior in favor of loading images via HTTP.
The change means that the initrd loaded on PXE will contact the Rack Controller
to download the image to load in the ephemeral environment.  Due to these
changes, ‘tgt’ will be dropped as a dependency completely once 2.3 is final.

MAAS 2.3 alpha 1 includes this feature behind a feature flag. While the feature
is enabled by default, users experiencing issues who would want to go back to
use 'tgt' can do so by turning of the feature flag:

```bash
maas <user> maas set-config name=http_boot value=False
```

### Issues fixed in this release

For all the issues fixed in this release, please refer to:

[https://launchpad.net/maas/+milestone/2.3.0alpha1](https://launchpad.net/maas/+milestone/2.3.0alpha1)

<!-- LINKS -->
[currentrelease]: release-notes.md#2.3.0-(alpha2)
[snapio]: https://snapcraft.io/
[snapinstall]: installconfig-snap-install.md
[historical-release-notes]: release-notes-all.md
[contactus]: https://maas.io/contact-us
[fio]: https://github.com/axboe/fio
[7zip]: http://www.7-zip.org
[maasapi]: api.html
[wedge100]: https://code.facebook.com/posts/1802489260027439/wedge-100-more-open-and-versatile-than-ever/
