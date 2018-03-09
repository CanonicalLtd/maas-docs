Title: 2.4 Release Notes
table_of_contents: True

# Release Notes 2.4

MAAS 2.4 is currently under development. The current release is 
[MAAS 2.4.0 (alpha1)][currentrelease]. See 
[Historical release notes][historical-release-notes] for release notes for
stable versions.

The development version of MAAS is available from the *proposed* repository of
the upcoming Ubuntu 18.04 LTS (Bionic Beaver) release and the MAAS Next PPA.

To install from the MAAS Next PPA (ppa:maas/next) repository:

```bash
sudo add-apt-repository -yu ppa:maas/next
sudo apt install maas
```

### MAAS Client Library (python-libmaas)

The official Python client library for MAAS is available in the Ubuntu Bionic
archive or you can download the source from:
[https://github.com/maas/python-libmaas/releases](https://github.com/maas/python-libmaas/releases)

## 2.4.0 (alpha1)

### Dependency on tgt (iSCSI) has been dropped

MAAS 2.3 moved away from using iSCSI to run ephemeral environments and
deployments, adding the ability to perform the same functions with a *squashfs*
image. While this removed the requirement for *tgt*, the dependency wasn't
dropped from 2.3. As of 2.4, however, tgt has been completely removed.

### Apache2 dependency dropped from Debian packages

MAAS 2.0 changed the web UI to port 5240 and deprecated the use of port 80.
However, so as to not break deployments when upgrading from the previous LTS
release, MAAS continued to have *apache2* as a dependency. This was purely to
provide a reverse proxy to allow users to connect via port 80.

The availability of the MAAS *snap* changes that behaviour, longer providing
web UI access on port 80. To remain consistent with the snap, the Debian
package removes its dependency on *apache2* and drops proxy access via port 80.

### Python libmaas (0.6.0) available in the Ubuntu Archive

The new [MAAS Client
Library](#maas-client-library-(python-libmaas)) is now available in the Ubuntu
Archives for Ubuntu 18.04. *Libmaas* is an asyncio-based client library that
provides an improved programming interface to interact with MAAS. More details
below.

### New Features & Improvements

#### Machine Locking

MAAS adds the ability to lock machines, preventing the user from
performing actions that could change their state. This gives MAAS a prevention
mechanism for potentially catastrophic actions. For example, it prevents
powering off machines by mistake, or releasing machines that could bring
workloads down.

#### Audit logging

With the introduction of *audit logging*, MAAS 2.4 allows the administrators to
audit the user’s actions.

The audit logs are available to administrators via the MAAS CLI/API, giving
administrators a centralised location to access these logs. See
[Audit Event Logs][audit-logs] for more details.

#### Commissioning Harness

**Support for firmware upgrades and hardware specific scripts**

The *commissioning harness* has been expanded with various improvements to help
administrators write their own firmware upgrades and hardware specific scripts.
These improvements addresses some of the challenges administrators face when
performing such tasks at scale. 

Improvements include:

- auto-select all firmware upgrade/storage hardware changes (API
  only, UI will be available soon)
- write and run scripts for specific hardware
- reboot machines from the commissioning environment without disrupting the commissioning process

These improvements allow administrators to:

- target specific hardware specific by specifying PCI ID, modalias, vendor or
  model of the machine or device
- use script metadata to create firmware upgrade scripts that require a reboot
  before the machine finishes the commissioning process
- define where a script can obtain proprietary firmware and/or proprietary
  tools to perform any operations required.

#### Minor improvements

**Gather information about BIOS & firmware**

MAAS now probes for more underlying system details, including the model, serial
number, BIOS and firmware of a machine (where available). It also gathers
details on storage devices and network interfaces.

### MAAS Client Library (python-libmaas)

**New upstream release - 0.6.0**

A new release is now available in the Ubuntu Archive for Bionic. The new
release lets you do the following:

- add/read/update/delete storage devices attached to machines
- configure partitions and mount points
- configure bcache
- configure RAID
- configure LVM

### Known issues

[LP: #1748712][bug] - 2.4.0a1 upgrade failed with old node event data

It has been reported that an upgrade to MAAS 2.4.0(alpha1) failed due to the
existence of old data from a non-existent node stored in the database. This
could have been due to an older development version of MAAS which could have
left an entry in the node event table. A work around is provided in the bug
report.

If you hit this issue, please update the bug report immediately so MAAS
developers can get a better idea of the problem.

### Issues fixed in this release

For all the issues fixed in this release, please refer to:

[https://launchpad.net/maas/+milestone/2.4.0alpha1](https://launchpad.net/maas/+milestone/2.4.0alpha1)


<!-- LINKS -->
[currentrelease]: release-notes.md#2.3.0-(alpha1)
[snapio]: https://snapcraft.io/
[snapinstall]: installconfig-snap-install.md
[historical-release-notes]: release-notes-all.md
[contactus]: https://maas.io/contact-us
[fio]: https://github.com/axboe/fio
[7zip]: http://www.7-zip.org
[maasapi]: api.html
[audit-logs]: manage-audit-events.md
[bug]: https://bugs.launchpad.net/maas/+bug/1748712
