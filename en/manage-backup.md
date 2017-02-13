Title: Backup
table_of_contents: true

# Backup MAAS

MAAS doesn't yet include specific tools to help with the backup and restoration
of a working MAAS environment. As MAAS servers are obviously no different to
the majority of other Linux-based servers, it's likely your current backup and
disaster recovery solution will already include your MAAS environment. 

The most painless backup would be to create a complete snapshot of your
deployment's root storage media and restore from this onto an identical
hardware configuration. But it's also important to know which elements of a
MAAS deployment are compulsory when restoring a working environment and this is
what we'll cover below.

## Backup

The following MAAS components on each Region and Rack controller need to be
backed-up and restored to recreate a working environment:

1. The Postgresql database
1. The configuration files in `/etc/maas`
1. The configuration files in `/var/lib/maas`

`/var/lib/maas/boot-resources` contains images that can usually be easily
re-downloaded from within MAAS. Similarly, the remainder of `/var/lib/maas` can
be ignored in most cases, especially when the Region and Rack controllers are
on the same machine, as the files will be automatically regenerated when MAAS
is re-installed.

Other configuration files, such as those used by Apache or your network
configuration within `/etc/network/interfaces`, will need to be backed up and
restored according to your specific deployment. 

## Step-by-step

As an overview, the following steps can be taken to backup and restore a
MAAS deployment. 

We're going to assume the following:

- Region and Rack controllers are on the same machine
- MAAS 2.1 is installed on Ubuntu 16.04 LTS (Xenial) and up-to-date
- Restoration will be to identical hardware, including the network configuration

!!! Note: If you're using Ubuntu 14.4 LTS (Trusty), the main difference will be
the use of 'upstart' rather than 'systemd' for managing services.

### Postgresql export

To backup your Postgresql database to a file called `dump.sql` in your home
folder, enter the following:

```bash
sudo -u postgres pg_dumpall -c > ~/dump.sql
```

### Stop services

Stop the following services with the `sudo systemctl stop <service>` command to
avoid conflicting updates during a backup: 

- apache2.service
- postgresql.service 
- maas-dhcpd.service
- maas-rackd.service
- maas-regiond.service

### Archive configuration files

Archive the database and the required configuration files with a command
similar to the following:

```bash
sudo tar -cvpzf ~/backup.tar /etc/maas /var/lib/maas ~/dump.sql
```
Move the resulting `backup.tar.gz` to some external storage you can access when
restoring the system. 

We've now backed-up all the components necessary to recreate a MAAS deployment,
which we'll do over the next few steps.

### Restore files

With a fresh and updated installation of Ubuntu onto the same hardware, install the
MAAS packages if these weren't installed initially:

```bash
apt install maas
```

Stop these:
- apache2.service
- maas-dhcpd.service
- maas-rackd.service
- maas-regiond.service

Copy the backup file to the new machine and untar its contents.

To restore the state of the database enter the following:

```bash
sudo su - postgres
psql -f dump.sql postgres
```

Next, copy across the old configuration files to their new locations, taking
care to backup the originals just in case:

```bash
sudo mv /etc/maas /etc/_maas; mv /var/lib/maas /var/lib/_maas
sudo cp -rf etc/maas /etc/; cp -rf var/lib/maas /var/lib/
```

!!! Note: ensure the correct permissions are preserved for all restored
files and folders.

If you have additional stand alone rack controllers, you need to make sure the
secret is updated to the one re-generated in `/var/lib/maas/secret` in order
for the rack controller to re-connect to the new region controller.

All that's left to do is restart your system or the services stopped previously
and you'll find your MAAS deployment has been fully restored. 
