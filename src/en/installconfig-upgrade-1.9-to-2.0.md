Title: Upgrade from MAAS 1.9

# Upgrade from MAAS 1.9

MAAS 2 is only supported on Ubuntu 16.04 LTS (Xenial Xerus). This is because 
Ubuntu 16.04 defaults to Python 3, whereas previous versions of Ubuntu defaulted
to Python 2.

MAAS versions 1.9 and 1.9.x will continue to be supported on Ubuntu 14.04 LTS
(Trusty Tahr) until they reach [end-of-life](https://wiki.ubuntu.com/Releases).

However, it is possible to upgrade from MAAS 1.9.x to MAAS 2.x as part of the
distribution upgrade from Ubuntu 14.04 (or Ubuntu 15.10) to Ubuntu 16.04. The
MAAS database and MAAS configuration will be migrated to the latest MAAS
version as part of the upgrade process.

Before you start, make sure all your packages are updated (`sudo apt update &&
sudo apt full-upgrade`). Backups should [also be
made](https://help.ubuntu.com/14.04/serverguide/backups.html) , and we'd
recommend upgrading a test environment that mirrors your production
environment first, to pre-empt any issues.

See the '[Upgrading from Ubuntu 14.04 LTS or
15.10](https://wiki.ubuntu.com/XenialXerus/ReleaseNotes#Upgrading_from_Ubuntu_14.04_LTS_or_15.10)' 
section in the release notes for Ubuntu 16.04 LTS (Xenial Xerus) for
instructions on the upgrade process.

## Troubleshooting

The upgrade process can be complex, and depending on your installation, may
require manual intervention. In particular, you may be asked whether you want
to overwrite `/etc/postgresql-common/createcluster.conf`. If you've made no
modifications to this file, you can safely allow the upgrade process to
overwrite the file. But if you have made changes, you'll need to merge your
changes into the new file manually. 

At the end of the upgrade, if you see processing errors with the `maas`,
`squid3`, `maas-dns`, or `maas-region-controller` packages, or if the upgrade
complains about unmet dependencies with the MAAS packages, try the following:

```bash
sudo apt -f install
sudo apt autoremove
sudo apt upgrade
```
This will fix the dependency errors, remove redundant packages and update to
the latest version of MAAS.
