Title: Upgrade 2.3 to 2.4 from Ubuntu 16.04

# Upgrade 2.3 to 2.4 from Ubuntu 16.04

MAAS 2.3 is the last supported version of MAAS for Ubuntu 16.04 LTS (Xenial
Xerus). This is because changes in the base dependencies of Ubuntu 18.04 LTS
(Bionic Beaver) require MAAS updates that are not back-portable to
older versions of MAAS. Consequently, to upgrade from MAAS 2.3 to MAAS 2.4 on Ubuntu
16.04, you will need to upgrade the base operating system.

!!! Note:
    MAAS 2.3 will continue to be supported on Ubuntu 16.04 LTS until the end of its
    support cycle. See [Ubuntu Releases][ubuntu-wiki-releases] for release and EOL
    dates for all Ubuntu versions.

Upgrading from MAAS 2.3 to MAAS 2.4 involves in two steps:

1. Update Ubuntu 16.04 LTS to Ubuntu 18.04 LTS, automatically migrating both
   the MAAS database and the MAAS configuration for MAAS 2.4.
1. Upgrade the PostgreSQL database used by MAAS from version 9.x to version 10.

Prior to the upgrade all packages should be updated. It is also strongly
recommended that backups be made and that a test environment that mirrors your
production environment be upgraded first, to pre-empt any issues.

## Upgrade MAAS

To upgrade to MAAS 2.4, simply upgrade the operating system; the process
that upgrades Ubuntu will also upgrade the software, including MAAS.

To upgrade Ubuntu, administrators need only type:

```bash
sudo do-release-upgrade
```

After the upgrade process completes and the machine rebooted, MAAS will
continue to use the PostgreSQL 9.x version that came with Ubuntu 16.04 LTS.
However, because Ubuntu 18.04 LTS switches to PostgreSQL 10, it is imperative
we upgrade the database as well.

## Upgrade PostgreSQL

The PostgreSQL upgrade process is fairly simple.

First, use the following command to verify that both version 9.x and 10 PostgreSQL clusters are available: 

```bash
pg_lsclusters
```

The output should look similar to the following:

```no-highlight
Ver Cluster Port Status Owner    Data directory               Log file
9.5 main    5432 online postgres /var/lib/postgresql/9.5/main postgresql-9.5-main.log
10  main    5433 online postgres /var/lib/postgresql/10/main  postgresql-10-main.log
```

With both clusters verified to be online, stop MAAS and PostgreSQL:

```bash
sudo service maas-rackd stop 
sudo service maas-regiond stop 
sudo service postgresql stop
```

Next, rename the *main* cluster created by the installation of PostgreSQL 10 so that it doesn't conflict with the upgrade:


```bash
sudo pg_renamecluster 10 main main_pristine
```

The output from `pg_lsclusters` should now look like the following:

```no-highlight
Ver Cluster       Port Status Owner    Data directory                       Log file
9.5 main          5432 down   postgres /var/lib/postgresql/9.5/main         postgresql-9.5-main.log
10  main_pristine 5433 down   postgres /var/lib/postgresql/10/main_pristine postgresql-10-main_pristine.log

```

We can now safely upgrade the 9.x cluster:

```bash
sudo pg_upgradecluster 9.5 main
```

The final output from the previous command should show the new PostgreSQL
version 10 *main* cluster is online:

```no-highlight
Ver Cluster Port Status Owner    Data directory              Log file
10  main    5432 online postgres /var/lib/postgresql/10/main postgresql-10-main.log
```

With the version 10 cluster verified as running, we can now drop the other clusters:

```bash
sudo pg_dropcluster 9.5 main
sudo pg_dropcluster 10 main_pristine
```

PostgreSQL has now been upgraded and you can now either reboot your machine or
restart the MAAS services we stopped earlier:

```bash
sudo service maas-rackd start
sudo service maas-regiond start
```

<!-- LINKS -->

[ubuntu-wiki-releases]: https://wiki.ubuntu.com/Releases
