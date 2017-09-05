Title: Upgrade from 1.9 to 2.x


# Upgrade from 1.9 to 2.x

MAAS 2.0 is only supported on Ubuntu 16.04 LTS (Xenial Xerus). This is because
16.04 defaults to Python 3, whereas previous versions of Ubuntu defaulted to
Python 2.

MAAS 1.9 will continue to be supported on Ubuntu 14.04 LTS (Trusty Tahr) until
the latter reaches the end of its support cycle. See
[Ubuntu Releases][ubuntu-wiki-releases] for release and EOL dates for all
Ubuntu versions.

Upgrading from 1.9 to 2.x will therefore involve upgrading the version of
Ubuntu to 16.04 LTS. In so doing, the MAAS database and MAAS configuration will
be migrated. See the [Xenial Release Notes][xenial-release-notes-upgrading] for
upgrading to Xenial.

Prior to the upgrade all packages should be updated
(`sudo apt-get update && sudo apt-get dist-upgrade`). It is recommended that
backups be made and that a test environment (that mirrors your production
environment) be upgraded first, to pre-empt any issues.

## IP range changes

The concepts and terminology used to define IP ranges within MAAS have changed
significantly between 1.9 and 2.x releases of MAAS. These changes are described
below.

MAAS 1.9 allows users to configure their managed networks to use either
[static][1-9-static] or dynamic ranges. A static range is used by MAAS to allocate
automatic (static) IP addresses while a dynamic range is used solely for
DHCP.

Static ranges are deprecated in MAAS 2.x. Instead, MAAS assumes full control
of the address space for a network it manages with two exceptions:

- When an optionally defined [reserved range][ip-range] has been defined.
- When [managed allocation][managed-subnet] in MAAS 2.3+ is disabled. 

Reserved ranges allow MAAS to avoid addresses already in use on the network.
When upgrading from MAAS 1.9 to MAAS 2.x, static ranges are migrated to their
*inverse* reserved range equivalents.

For example, a dynamic range of `192.168.0.20 - 192.168.0.89` and a static
range of `192.168.0.100 - 192.168.0.199` in MAAS 1.9 would be reconfigured as
the following in MAAS 2.x:

```no-highlight
Reserved range (1): 192.168.0.1   -> 192.168.0.19
Dynamic range:      192.168.0.20  -> 192.168.0.89
Reserved range (2): 192.168.0.90  -> 192.168.0.99
Reserved range (3): 192.168.0.200 -> 192.168.0.254
```

The above example shows a static range replaced by three reserved ranges to
create an equivalent configuration.

!!! Note:
    With MAAS 2.1+, [network devices discovery][device-discovery] uses the ARP
    protocol to determine which addresses are being used, allowing MAAS to
    automatically avoid assigning recently used IP addresses.

## Troubleshooting

The upgrade process can be complex, and depending on your installation, may
require manual intervention. You may be asked whether you want to overwrite
some files, PostgreSQL files in particular, especially if you've implemented
high availability in PostgreSQL (see [PostgreSQL HA][postgresql-ha]). If you've
made no modifications to these files, you can instruct the upgrade process to
overwrite them. Otherwise, you'll need to merge the new changes into the files
manually. 

At the end of the upgrade, if you see processing errors with the `maas`,
`squid3`, `maas-dns`, or `maas-region-controller` packages, or if the upgrade
complains about unmet dependencies with the MAAS packages, try the following:

```bash
sudo apt -f install
sudo apt autoremove
sudo apt upgrade
```

This should fix the dependency errors, remove redundant packages and update to
the latest version of MAAS.

<!-- LINKS -->

[postgresql-ha]: manage-ha-postgresql.md
[ubuntu-wiki-releases]: https://wiki.ubuntu.com/Releases
[xenial-release-notes-upgrading]: https://wiki.ubuntu.com/XenialXerus/ReleaseNotes#Upgrading_from_Ubuntu_14.04_LTS_or_15.10
[managed-subnet]: installconfig-network-subnet-management.md
[1-9-static]: https://docs.ubuntu.com/maas/1.9/en/nodes-commission
[device-discovery]: installconfig-network-dev-discovery.md
[ip-range]: installconfig-network-ipranges.md
