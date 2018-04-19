Title: 2.4 Release Notes
table_of_contents: True

# Release Notes 2.4

MAAS 2.4 is currently under development. The current release is 
[MAAS 2.4.0 (beta2)][currentrelease]. See 
[Historical release notes][historical-release-notes] for release notes for
stable versions.

The development version of MAAS is available from the *proposed* repository of
the upcoming Ubuntu 18.04 LTS (Bionic Beaver) release and the MAAS Next PPA
repository.

To install from the MAAS Next PPA (ppa:maas/next) repository:

```bash
sudo add-apt-repository -yu ppa:maas/next
sudo apt install maas
```

### MAAS Client Library (python-libmaas)

The official Python client library for MAAS is available in the Ubuntu 18.04
LTS package archive or you can download the source from:
[https://github.com/maas/python-libmaas/releases](https://github.com/maas/python-libmaas/releases)

## 2.4.0 (beta2)

### New Features & Improvements

#### Continued internal optimisation

On the backend, the image download process has been improved to ensure rack
controllers start to download images immediately after the region controller
has finished downloading images.

The service monitor interval has also been reduced to 30 seconds. The monitor
tracks the status of the various services provided alongside MAAS (DNS, NTP,
Proxy).

Various web UI performance improvements include better filtering of node
types for machines, pods and zones.

#### KVM pod improvements

This release adds the following to KVM pod functionality:

**Define a default storage pool**

- This feature allows users to select the default storage pool to use when
  composing machines, in case multiple pools have been defined. Otherwise, MAAS
  will pick the storage pool automatically, depending which pool has the most
  available space.

**Allow machines to be allocated with different storage pools**

- From the API, you can now request a machine with multiple storage devices from
  different storage pools. This feature uses storage tags to automatically map a
  storage pool in *libvirt* with a storage tag in MAAS.

#### UI improvements

**YUI finally dropped in favor of AngularJS**

- MAAS has now fully dropped the use of [YUI][yui] for the web UI. The final
  sections using this were the Settings and login pages. Both have now been
  transitioned to use AngularJS instead.

**Settings page reorganisation**

- The web UI MAAS setting pages has been reorganised into tabs, making
  configuration options easier to find.

#### Minor improvements

**API for default DNS domain selection**

- A default DNS domain can now be defined from the API.

**Vanilla framework upgrade**

We would like to thank the Ubuntu web team for their continued hard work
upgrading MAAS to the latest version of the Vanilla framework. MAAS is looking
better and more consistent every day!

### Issues fixed in this release

For all the issues fixed in this release, please refer to:

[https://launchpad.net/maas/+milestone/2.4.0beta2](https://launchpad.net/maas/+milestone/2.4.0beta2)


## 2.4.0 (beta1)

### Debian package `maas-dns` no longer needed

The Debian package, *maas-dns*, has been made a transitional package. This
package previously provided some post-installation configuration to prepare
*bind* to be managed by MAAS, but it required *maas-region-api* to be installed
first. 

To streamline the installation and make it easier for users to install MAAS
within high-availability environments, the configuration of *bind* has been
integrated into the ‘maas-region-api’ package itself. Subsequently, ‘maas-dns’
is now a dummy transitional package that can be removed.

### New Features & Improvements

#### Further internal optimisation

Major internal surgery to MAAS 2.4 continues to improve various areas not visible
to the user. These updates will advance the overall performance of MAAS in
larger environments and include:

**Database query optimisation**

Further reductions in the number of database queries have been made,
significantly cutting the queries made by the boot source cache image import
process from over 100 to just under 5.

**UI optimisation**

MAAS is being optimised to reduce the amount of data using the websocket API to
render the UI. These improvements target the processing of data *only* for
viewable information, improving various legacy areas. Currently, the work done
for this release includes:

- Only load historic script results (e.g. old commissioning/testing results)
  when requested / accessed by the user, instead of always making them
  available over the websocket.
- Only load node objects in listing pages when the specific object type is
  requested. For instance, only load machines when accessing the machines tab
  instead of also loading devices and controllers.
- Change the UI mechanism to only request OS Information only on initial page
  load rather than every 10 seconds.

**KVM pod improvements**

This release provides more updates to KVM pods:

- **Added over-commit ratios for CPU and memory.**
  When composing or allocating machines, previous versions of MAAS allow the
  user to request resources regardless of resource availability. This caused
  problems when dynamically allocating machines as it allowed users to create
  an infinite number of machines when the physical host was over committed.
  This new feature allows administrators to control the amount of resources
  they want to over commit.


- **Added filter for which pods or pod types to avoid when allocating machines,**
  Provides users with the ability to select which pods, or pod types, *not* to
  allocate resources from. This makes it particularly useful when dynamically
  allocating machines when MAAS has a large number of pods.

**DNS UI improvements**

MAAS 2.0 introduced the ability to manage DNS and to create resources records
such as A, AAA and CNAME. However, as the UI only supported adding and removing
domains, most of this functionality was only available via the API.

This release adds the ability to manage not only DNS domains but also
the following resource records within the web UI:

- Edit domains (e.g. TTL, name, authoritative).
- Create and delete resource records (A, AAA, CNAME, TXT, etc).
- Edit resource records.

**Navigation UI improvements**

MAAS 2.4 beta 1 changes the top-level navigation:
- *Zones* renamed to *AZs* (Availability Zones).
- *Machines*, *Devices* and *Controllers* have been moved from *Hardware* to
  the top-level menu.

*Minor improvements*

- **IPMI machines boot type can now be forced.**
  Hardware manufactures have been upgrading their BMC firmware versions to be
  more compliant with the Intel IPMI 2.0 spec. Unfortunately, the IPMI 2.0 spec
  has made changes that provide a non-backward compatible user experience. For
  example, if the administrator configures their machine to always PXE boot over
  EFI, and the user executes an IPMI command without specifying the boot type,
  the machine would use the value of the configured BIOS. However, with  these
  new changes, the user is required to always specify a boot type, avoiding a
  fallback to the BIOS. As such, MAAS now allows the selection of a boot type
  (auto, legacy, EFI) to force the machine to always PXE with the desired type
  (on the next boot only) .

- **Skip BMC configuration on commissioning.**
  The API now provides an option to skip BMC auto-configuration during
  commissioning for IPMI systems. This option helps admins keep the credentials
  provided over the API when adding new nodes.

### Issues fixed in this release

For all the issues fixed in this release, please refer to:

[https://launchpad.net/maas/+milestone/2.4.0beta1](https://launchpad.net/maas/+milestone/2.4.0beta1)

## 2.4.0 (alpha2)

### NTP services provided by Chrony

Starting with 2.4.0 alpha 2, and in common with changes made to Ubuntu Server,
‘ntpd’ has been replaced with [Chrony][chrony] for the NTP protocol.

MAAS will handle the upgrade process automatically and resume NTP service operation.

### Vanilla CSS Framework Transition

MAAS 2.4.0 is transitioning to a new version of the
[Vanilla CSS framework][vanilla], which will bring a fresher look to the MAAS
web UI. This transition is currently *work-in-progress* and not all of the UI
have been fully updated. As a result, expect to see some inconsistencies in new
release.

### New Features & Improvements

#### NTP services provided by Chrony

Starting with 2.4.0 alpha 2, and in common with changes made to Ubuntu Server,
MAAS replaces ‘ntpd’ with [chrony][chrony] for the NTP protocol. MAAS will
continue to provide services exactly the same way and users will not be
affected by the change. The upgrade process is handled transparently.

This means that:

- MAAS will configure chrony as peers on all Region Controllers
- MAAS will configure chrony as a client of peers for all Rack Controllers
- Machines will use Rack Controllers as they do today

#### MAAS internals optimisation

MAAS 2.4 is currently undergoing major surgery to improve various areas of
operation that are not visible to the user. These updates will improve the
overall performance of MAAS in larger environments.

These improvements include:

**AsyncIO based event loop**

MAAS has an event loop which performs various internal actions. In older
versions of MAAS, the event loop was managed by the default *Twisted* event
loop. MAAS now uses an AsyncIO based event loop, driven by uvloop, which is
targeted at improving internal performance.

**Improved daemon management**

MAAS has changed the way daemons are run to allow users to see both ‘regiond’
and ‘rackd’ as processes in the process list.

As part of these changes, regiond workers are now managed by a master regiond
process. In older versions of MAAS, each worker was directly run by systemd. The
master process is now in charge of ensuring workers are running at all times,
re-spawning new workers in case of failures. This also allows users to see the
worker hierarchy in the process list.

**Ability to increase the number of regiond workers**

Following the improved way MAAS daemons are run, further internal changes have
been made to allow the number of regiond workers to be increased automatically.
This allows MAAS to scale to handle an increased number of internal operations
in larger environments.

While this capability is already available, it is not yet available by default.
It will become available in the following milestone release.

**Database query optimisation**

Internal improvements have been made to reduce the footprint and number of
database queries. Some areas that have been addressed in this release include:

- When saving node objects (e.g. making any update of a machine, device, rack
  controller, etc), MAAS validated changes across various fields. This
  required an increased number of queries for fields, even when they were not
  being updated. MAAS now tracks specific fields that change and only performs
  queries for those fields.  For example, to update a power state, MAAS would
  perform 11 queries. After these improvements, only 1 query is now performed.

- On every transaction, MAAS performed 2 queries to update the timestamp. This
  has now been consolidated into a single query per transaction.

These changes greatly improves MAAS performance and database utilisation in
larger environments. More improvements will continue to be made as we continue
to examine various areas in MAAS.

#### UI optimisation

MAAS is being optimised to reduce the amount of data loaded in the WebSocket
API to render the UI. This is targeted at only processing data for viewable
information, improving various legacy areas. Currently, the work done in this
area includes:

- Script results are only loaded for viewable nodes in the machine listing
  page, reducing the overall amount of data loaded.
- The node object is updated in the WebSocket only when something has changed
  in the database, reducing the data transferred to the clients as well as the
  amount of internal queries.

#### Audit logging

Continuing with the audit logging improvements, *alpha2* now adds audit logging
for all user actions that affect Hardware Testing & Commissioning.

### Issues fixed in this release

For all the issues fixed in this release, please refer to:

[https://launchpad.net/maas/+milestone/2.4.0alpha2](https://launchpad.net/maas/+milestone/2.4.0alpha2)

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

See [Commissioning and Hardware Testing Scripts][hardware-scripts] for more details.

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

## Get in touch

We'd love to hear about how you're using MAAS, whether it's at the smallest of
scales or the largest. Our team is always approachable and can usually be found
in the following locations:

- Join us on IRC. We can be found on the [maas][maas-freenode] channel on
  [freenode][freenode].
- Subscribe to the [maas-devel][mailing-list] mailing list, a great place to
  ask questions.

<!-- LINKS -->
[currentrelease]: release-notes.md#2.4.0-(beta2)
[snapio]: https://snapcraft.io/
[snapinstall]: installconfig-snap-install.md
[historical-release-notes]: release-notes-all.md
[contactus]: https://maas.io/contact-us
[fio]: https://github.com/axboe/fio
[7zip]: http://www.7-zip.org
[maasapi]: api.html
[audit-logs]: manage-audit-events.md
[bug]: https://bugs.launchpad.net/maas/+bug/1748712
[maas-freenode]: http://webchat.freenode.net/?channels=maas
[freenode]: https://freenode.net/
[mailing-list]: https://lists.ubuntu.com/mailman/listinfo/Maas-devel
[hardware-scripts]: nodes-scripts.md
[chrony]: https://chrony.tuxfamily.org/
[vanilla]: https://vanillaframework.io/
[yui]: https://en.wikipedia.org/wiki/YUI_Library
