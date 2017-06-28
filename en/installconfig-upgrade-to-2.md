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

Prior to the upgrade all packages should be updated (`sudo apt-get update &&
sudo apt-get dist-upgrade`). It is recommended that backups be made and that 
a test environment (that mirrors your production environment) be upgraded first, to
pre-empt any issues.


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
