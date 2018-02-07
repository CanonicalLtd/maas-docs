Title: Upgrade from <=2.3 (Xenial) to 2.4 (Bionic)

# Upgrade from <= (Xenial) to 2.4 (Bionic)

MAAS 2.3 is the last releases support on Ubuntu 16.04 LTS (Xenial Xerus). This is
because 18.04 changes the base dependencies, which require MAAS to make changes
that are not backportable to Ubuntu 16.04 LTS (Xenial Xerus).

MAAS 2.3 will continue to be supported on Ubuntu 16.04 LTS (Xenial Xerus) until
the latter reaches the end of its support cycle. See
[Ubuntu Releases][ubuntu-wiki-releases] for release and EOL dates for all
Ubuntu versions.

Upgrading from 2.3 to 2.4+ will therefore involve upgrading the version of
Ubuntu to 16.04 LTS. In so doing, the MAAS database and MAAS configuration will
be migrated. 

Prior to the upgrade all packages should be updated, it is recommended that backups
be made and that a test environment (that mirrors your production environment) be
upgraded first, to pre-empt any issues.

Upgrading to Bionic will also require adminstrators to upgrade their database from
PostgreSQL 9 to PostgreSQL 10.

## Upgrading MAAS

Upgrading to MAAS 2.4 is simple as upgrading the operating system, as the
process that upgrades the OS will also upgrade the software, including MAAS.

To do so, administrators can simply upgrade the OS with:

```bash
sudo do-release-upgrade
```
After the upgrade process is completed (and the machine rebooted), MAAS will continue
to use the PostgreSQL 9.x version that came with Xenial. However, since Bionic has
PostgreSQL 10, it is imperative to upgrade the database as well.

## Upgrading PostgreSQL

The PostgreSQL upgrade process is fairly simple.

1. The first thing is to verify that both postgres clusters are available:

```bash
$ pg_lsclusters
Ver Cluster Port Status Owner    Data directory               Log file
9.5 main    5433 down   postgres /var/lib/postgresql/9.5/main /var/log/postgresql/postgresql-9.5-main.log
10 main    5432 online postgres /var/lib/postgresql/10/main /var/log/postgresql/postgresql-10-main.log
```

2. Once we verify the PostgreSQL cluster is online, we need to stop MAAS and PostgreSQL itself.

```bash
$ sudo service maas-rackd stop && sudo service maas-regiond stop && sudo service postgresql stop
```

3. Once services are stopped, we need to rename the 'main' cluster created by the installation
of PostgreSQL 10, so that it doesn't conflict with the upgrade:

```bash
$ sudo pg_renamecluster 10 main main_pristine
```
4. Now, we can upgrade the cluster:

```bash
$ sudo pg_upgradecluster 9.5 main
```

5. After the upgrade process is complete, we should verify that the postgresq cluster has. Once
we do so, it is ok to drop the other clusters:

```bash
sudo pg_dropcluster 9.5 main
sudo pg_dropcluster 10 main_pristine
```

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
