Title: 2.3 Release Notes
table_of_contents: True

See [Historical release notes][historical-notes] for release notes for all versions.

# Release Notes - 2.3

## Important announcements

### Machine network configuration now deferred to cloud-init

Machine network configuration is now handled by [cloud-init][cloudinit].

With previous versions of MAAS (and curtin), network configuration was
performed by [curtin][curtin] during the installation process. In an effort to
improve robustness, this network configuration has been consolidated with
cloud-init. MAAS continues to pass network configuration to curtin, which in
turn, will delegate the configuration to cloud-init.  


### Ephemeral images over HTTP

To reduce the number of dependencies and improve reliability, MAAS ephemeral
(network boot) images are no longer loaded using iSCSI (tgt). By default, the
ephemeral images are now obtained using HTTP requests to the rack controller.

After upgrading to MAAS 2.3, please ensure you have the latest available
images. For more information please refer to the section below (New features &
improvements).


### Advanced network configuration for CentOS and Windows

MAAS 2.3 now supports the ability to perform network configuration for CentOS
and Windows via [cloud-init][cloudinit]. The MAAS CentOS images now use the
latest available version of cloud-init to support these features.


## New features & improvements

### CentOS network configuration

MAAS can now perform machine network configuration for CentOS 6 and 7,
providing those operating systems with networking feature parity.

The following can now be configured for MAAS deployed CentOS images:

- Bonds, VLAN and bridge interfaces.
- Static network configuration.

Our thanks to the [cloud-init][cloudinit] team for improving the network
configuration support for CentOS.


### Windows network configuration

MAAS can now configure NIC teaming (bonding) and VLAN interfaces for Windows
deployments. This uses the native NetLBFO in Windows 2008+.

Contact us for more information: [https://maas.io/contact-us](https://maas.io/contact-us).


### Ephemeral images over HTTP

Historically, MAAS used [tgt][tgt] to provide images over iSCSI for the
ephemeral environments (e.g commissioning, deployment environment, rescue mode,
etc). MAAS 2.3 changes the default behaviour by now providing images over HTTP
instead.

This change means that *initrd* (run via PXE) will contact the rack controller to
download the image to load in the ephemeral environment directly.

Support for using 'tgt' is being phased out in MAAS 2.3 and will no longer be
supported from MAAS 2.4 onwards.

 Users who would like to continue to use and load their ephemeral images via
'tgt' they can disable http boot with the following command.

```bash
maas $PROFILE maas set-config name=http_boot value=False
```


### Network discovery and beaconing

In order to confirm network connectivity and aide with the discovery of VLANs,
fabrics and subnets, MAAS 2.3 introduces network beaconing.

MAAS now sends out encrypted beacons to facilitate network discovery and
monitoring. Beacons are sent using IPv4 and IPv6 multicast (and unicast) to UDP
port 5240.

When registering a new controller, MAAS uses the information gathered from the
beaconing protocol to ensure that newly registered interfaces on each
controller are associated with existing known networks in MAAS.

Using network beaconing, MAAS can better correlate which networks are
connected to its controllers, even if interfaces on those controllers are not
configured with IP addresses.

Future uses for beaconing could include validation of networks from
commissioning nodes, MTU verification and a better user experience when
registering new controllers.


### Improved hardware testing

MAAS 2.3 introduces a new hardware testing framework that significantly
improves the granularity and provision of hardware testing feedback. These
improvements include:

- **Run individual tests**.
  The new testing framework that allows MAAS to run each component individually. This
  enables  MAAS to run tests against storage devices, for example, and capture
  results separately.
- **Define a custom testing script with a YAML definition**.
  The ability to describe custom hardware tests with a YAML definition enables
  MAAS do the following:
   - Collate details about the tests, such as script name, description, required
     packages, and other metadata about what information the script will
     gather. All of which will be used by MAAS to render in the UI.
   - Determine whether the test supports a parameter, such as storage,
     that lets the test to be run against individual storage devices.
   - The option to run tests in parallel.
- **Performance metrics**.
  Capture performance metrics for the tests that can provide them:
   - CPU performance now offers a new *[7zip][7zip]* test which includes metrics.
   - Storage performance now include a new *[fio][fio]* test with metrics.
   - The storage test *badblocks* has been improved to provide the number of
     badblocks found as a metric.
- **Failed testing overridei**. 
  The ability to override a machine that has been marked ‘Failed testing’. This
  allows administrators to acknowledge that a machine is usable despite it
  having failed testing.

Hardware testing improvements integrate with the following web UI changes:

- **Machine Listing page**:
   - Displays whether a test is pending, running or failed for the machine
     components (CPU, Memory or Storage.)
   - Displays whether a test not related to CPU, Memory or Storage has failed.
   - Displays a warning when the machine has been overridden and has failed
     tests but is in a ‘Ready’ or ‘Deployed’ state.
- **Machine Details page**:
   - The *Summary tab* now provides hardware testing information about the different
     components (CPU, Memory, Storage).
   - The *Hardware Tests /Commission tab* now displays an improved view of the latest
     test run, its run time as well as an improved view of previous results. It
     also adds more detailed information about specific tests, such as status, exit
     code, tags, runtime and logs/output (such as stdout and stderr).
   - The *Storage tab* now displays the status of specific disks, including whether a
     test is OK or failed after running hardware tests.

For more information, please refer to
[https://docs.ubuntu.com/maas/2.3/en/nodes-hw-testing](https://docs.ubuntu.com/maas/2.3/en/nodes-hw-testing)

### Upstream proxy

MAAS 2.3 enables an upstream HTTP proxy to allow MAAS-deployed machines to
continue to use a caching proxy for repositories. This provides greater
flexibility for closed environments, including:

- Enabling MAAS itself to use a corporate proxy while allowing machines to
  continue to use the MAAS proxy.
- Allowing machines that don’t have access to a corporate proxy to gain network
  access using the MAAS proxy.

Upstream proxy support includes an improved configuration pane on the
settings page. See *Settings > Proxy* for more details.


### Usability improvement (web UI)

Alongside the UI improvements outlined in the features above, MAAS 2.3
introduces an improved web UI design for the machines, devices and controllers
detail pages that include the following changes:

- *Summary tab* now provides only information about the specific node (machine,
  device or controller), organised across cards.
- *Configuration* has been introduced, which includes all editable settings for
  the specific node (machine, device or controllers).

**Controller versions and notifications**

The MAAS web UI now displays the version of each running controller and notifies the users
of any version mismatch between the region and rack controllers.

This helps administrators identify potential problems when upgrading MAAS on a
multi-node MAAS cluster, such as within a HA setup.

Other UI improvements include:

- Added DHCP status column on the *Subnets* tab.
- Added architecture filters
- VLAN and Space details page no longer allows inline editing.
- VLAN page adds the IP ranges tables.
- Zones page converted to AngularJS (away from YUI).
- New warnings when changing a subnet’s mode (*Unmanaged* or *Managed*).
- Renamed *Device Discovery* to *Network Discovery*.
- When MAAS cannot determine the hostname for discovered devices, it will show
  the hostname as 'unknown' and greyed-out rather than using the MAC address
  manufacturer as the hostname.


### Rack controller deployment

MAAS 2.3 can now automatically deploy rack controllers when deploying a
machine.

This is accomplished by providing [cloud-init][cloudinit] user data. Cloud-init
will install and configure the rack controller after a machine has been
deployed. Upon rack controller registration, MAAS will automatically detect
whether the machine is a rack controller and process the transition automatically.

To deploy a rack controller, users can do so via the API (or CLI), e.g:

```bash
maas $PROFILE machine deploy $SYTEM_ID install_rackd=True
```

!!! Note:
    This features makes use of the MAAS [snap][snapio] to configure the rack
    controller on the deployed machine. 'snap store' mirrors are not yet
    available, which means the machine will need access to the internet.


### Improved DNS Reloading

This release includes various improvements to the DNS reload mechanism,
allowing MAAS to be smarter about when to reload DNS after changes have been
automatically detected or made.


### API improvements

The machines [API][maasapi] endpoint now provide more information on configured
storage and provides additional output that includes *volume_groups*, *raids*,
*cache_sets*, and *bcaches* fields.


### Django 1.11 support

MAAS 2.3 now supports the latest [Django LTS][djangolts] version, Django 1.11. This allows
MAAS to work with the newer Django version in Ubuntu Artful, which serves as a
preparation for the next Ubuntu LTS release.

- Users running MAAS in Ubuntu Artful will use Django 1.11.
- Users running MAAS in Ubuntu Xenial will continue to use Django 1.9.

**Contribute**  
If you would like to contribute you can find the source code in GitHub:

https://github.com/maas/python-libmaas

For more questions, please find us:

- `#maas` on freenode
- `maas-devel` mailing list is a good place for questions

### Issues fixed with this release

For issues fixed in MAAS 2.3, please refer to the following milestone:

[https://launchpad.net/maas/+milestone/2.3.0](https://launchpad.net/maas/+milestone/2.3.0)

For more information on previous bug fixes across 2.3, please refer to the
following milestones:

[https://launchpad.net/maas/+milestone/2.3.0rc2](https://launchpad.net/maas/+milestone/2.3.0rc2)
[https://launchpad.net/maas/+milestone/2.3.0rc1](https://launchpad.net/maas/+milestone/2.3.0rc1)
[https://launchpad.net/maas/+milestone/2.3.0beta3](https://launchpad.net/maas/+milestone/2.3.0beta3)
[https://launchpad.net/maas/+milestone/2.3.0beta2](https://launchpad.net/maas/+milestone/2.3.0beta2)
[https://launchpad.net/maas/+milestone/2.3.0beta1](https://launchpad.net/maas/+milestone/2.3.0beta1)
[https://launchpad.net/maas/+milestone/2.3.0alpha3](https://launchpad.net/maas/+milestone/2.3.0alpha3)
[https://launchpad.net/maas/+milestone/2.3.0alpha2](https://launchpad.net/maas/+milestone/2.3.0alpha2)
[https://launchpad.net/maas/+milestone/2.3.0alpha1](https://launchpad.net/maas/+milestone/2.3.0alpha1)


<!-- LINKS -->
[historical-notes]: release-notes-all.md 
[curtin]: https://launchpad.net/curtin
[cloudinit]: https://cloud-init.io/
[tgt]: http://stgt.sourceforge.net/
[snapio]: https://snapcraft.io/
[maasapi]: api.html
[djangolts]: https://docs.djangoproject.com/en/1.11/releases/1.11/
[fio]: https://github.com/axboe/fio
[7zip]: http://www.7-zip.org
[
[snapinstall]: installconfig-snap-install.md
[contactus]: https://maas.io/contact-us

