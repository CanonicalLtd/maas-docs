Title: 2.4 Release Notes
table_of_contents: True

# Release Notes 2.4

MAAS 2.4 is currently under development. The current release is
[MAAS 2.4.0 (alpha1)][currentrelease]. See
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

## 2.4.0 (alpha2)

### NTP services now provided by Chrony

Starting with 2.4 Alpha 2, and in common with changes being made to Ubuntu Server, MAAS replaces ‘ntpd’ with Chrony for the NTP protocol. MAAS will handle the upgrade process and automatically resume NTP service operation.

### Vanilla CSS Framework Transition

MAAS 2.4 is undergoing a Vanilla CSS framework transition to a new version of vanilla, which will bring a fresher look to the MAAS UI. This framework transition is currently work in progress and not all of the UI have been fully updated. Please expect to see some inconsistencies in this new release.

### New Features & Improvements

#### NTP services now provided by Chrony.

Starting from MAAS 2.4alpha2, chrony is now the default NTP service, replacing ntpd.
This work has been done to align with the Ubuntu Server and Security team to support
chrony instead of ntpd. MAAS will continue to provide services exactly the same way and
users will not be affected by the changes, handling the upgrade process transparently.
This means that:

 - MAAS will configure chrony as peers on all Region Controllers
 - MAAS will configure chrony as a client of peers for all Rack Controllers
 - Machines will use the Rack Controllers as they do today

#### MAAS Internals optimisation

MAAS 2.4 is currently undergoing major surgery to improve various areas of operation
that are not visible to the user. These updates will improve the overall performance of
MAAS in larger environments. These improvements include:


 - **AsyncIO based event loop**
    MAAS has an event loop which performs various internal actions. In older versions of MAAS, the event loop was managed by the default twisted event loop. MAAS now uses an asyncio based event loop, driven by uvloop, which is targeted at improving internal performance.

 - **Improved daemon management**
   MAAS has changed the way daemons are run to allow users to see both ‘regiond’ and ‘rackd’ as processes in the process list.
   As part of these changes, regiond workers are now managed by a master regiond process. In older versions of MAAS each worker was directly run by systemd. The master process is now in charge of ensuring workers are running at all times, and re-spawning new workers in case of failures. This also allows users to see the worker hierarchy in the process list.


 - **Ability to increase the number of regiond workers**
   Following the improved way MAAS daemons are run, further internal changes have been made to allow the number of regiond workers to be increased automatically. This allows MAAS to scale to handle more internal operations in larger environments.
   While this capability is already available, it is not yet available by default. It will become available in the following milestone release.


- **Database query optimizations**
   In the process of inspecting the internal operations of MAAS, it was discovered that multiple unnecessary database queries are performed for various operations. Optimising these requires internal improvements to reduce the footprint of these operations. Some areas that have been addressed in this release include:

     *  When saving node objects (e.g. making any update of a machine, device, rack controller, etc), MAAS validated changes across various fields. This required an increased number of queries for fields, even when they were not being updated. MAAS now tracks specific fields that change and only performs queries for those fields.
     Example: To update a power state, MAAS would perform 11 queries. After these improvements, , only 1 query is now performed.

     * On every transaction, MAAS performed 2 queries to update the timestamp. This has now been consolidated into a single query per transaction.

   These changes  greatly improve MAAS performance and database utilisation in larger environments. More improvements will continue to be made as we continue to examine various areas in MAAS.


 - **UI optimisations**
   MAAS is now being optimised to reduce the amount of data loaded in the websocket API to render the UI. This is targeted at only processing data for viewable information, improving various legacy areas. Currently, the work done in this area includes:

   Script results are only loaded for viewable nodes in the machine listing page, reducing the overall amount of data loaded.

   The node object is updated in the websocket only when something has changed in the database, reducing the data transferred to the clients as well as the amount of internal queries.

#### Audit logging

Continuing with the audit logging improvements, alpha2 now adds audit logging for all
user actions that affect Hardware Testing & Commissioning.

#### KVM pod improvements

MAAS’ KVM pods was initially developed as a feature to help developers quickly iterate
and test new functionality while developing MAAS. This, however, because a feature that
allow not only developers, but also administrators to make better use of resources across
their datacenter. Since the feature was initially create for developers, some features
were lacking. As such, in 2.4 we are improving the usability of KVM pods:


 - **Pod AZ’s**
   MAAS now allows setting the physical zone for the pod. This helps administrators by conceptually placing their KVM pods in a AZ, which enables them to request/allocate machines on demand based on its AZ. All VM’s created from a pod will inherit the AZ.


 - **Pod tagging**
   MAAS now adds the ability to set tags for a pod. This allows administrators to use tags to allow/prevent the creation of a VM inside the pod using tags. For example, if the administrator would like a machine with a ‘tag’ named ‘virtual’, MAAS will filter all physical machines and only consider other VM’s or a KVM pod for machine allocation.

### Bug fixes

Please refer to the following for all bug fixes in this release.

https://launchpad.net/maas/+milestone/2.4.0alpha2


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
[currentrelease]: release-notes.md#2.4.0-(alpha1)
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
