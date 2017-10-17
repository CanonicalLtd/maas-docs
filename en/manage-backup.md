Title: Backup
table_of_contents: off

# Backup

MAAS doesn't yet include specific tools to help with the backup and restoration
of a working MAAS environment. As MAAS servers are obviously no different to
the majority of other Linux-based servers, it's likely your current backup and
disaster recovery solution will already include your MAAS environment. 

However, as it's important to know which elements of MAAS are critical when
restoring a previous deployment, we're going to briefly outline the process and
its requirements below.

## Configuration files

The following MAAS components on each region and rack controller need to be
backed-up and restored to recreate a working environment:

1. The PostgreSQL database
1. The configuration files in `/etc/maas`
1. The configuration files in `/var/lib/maas`

`/var/lib/maas/boot-resources` can safely be excluded as this contains images
easily re-downloaded within MAAS. 

Other configuration files, such as those used by your network configuration
(`/etc/network/interfaces`, for example) will need to be backed-up and restored
according to your specific deployment requirements. 

### PostgreSQL export

This procedure assumes the region and rack controllers are on the same machine,
that MAAS is installed on Ubuntu 16.04 LTS (Xenial) and restoration will be to
identical hardware, including the network configuration.

To backup your PostgreSQL database to a file called `dump.sql` in your home
directories, enter the following:

```bash
sudo -u postgres pg_dumpall -c > ~/dump.sql
```

If you run the above `pg_dumpall` process in the background, you can ensure
this has completed and that there are no other established sessions with the
following command:

```bash
sudo -u postgres psql -c  "SELECT * FROM pg_stat_activity"
```

Running sessions, such as *pg_dumpall*, will appear in the `application_name`
column of the output alongside `psql` running the above `pg_stat_activity`
query.  Excepting *psql*, if `application_name` is empty you can safely stop
the database service.

### Stop critical services

To avoid conflicting updates during a backup, stop the following services with
the `sudo systemctl stop <service>` command:

- postgresql.service 
- maas-dhcpd.service
- maas-rackd.service
- maas-regiond.service

!!! Note: 
    Ubuntu 14.04 LTS (Trusty) users need to use Upstart's `service`
    command rather than Systemd's `systemctl` command for managing services.

### Archive configuration files

Archive the database and the required configuration files with a command
similar to the following:

```bash
sudo tar -cvpzf ~/backup.tgz /etc/maas /var/lib/maas ~/dump.sql
```
Make sure you move the resulting `backup.tgz` to some external storage you can access when
restoring the system. 

We've now backed-up all the components necessary to recreate a MAAS deployment,
which we'll cover now.

### Restore files

With a fresh and updated installation of Ubuntu on identical hardware, where
MAAS has already been installed (`sudo apt install maas`), stop the following
services (PostgreSQL needs to stay running):

- maas-dhcpd.service
- maas-rackd.service
- maas-regiond.service

Copy the backup file to the new machine and untar its contents (`sudo tar xvzpf
backup.tgz`).

To restore the state of the database, enter the following from the backup
directory:

```bash
sudo -u postgres psql -f dump.sql postgres
```

Next, copy across the old configuration files to their new locations, taking
care to move the originals aside just in case:

```bash
sudo mv /etc/maas /etc/_maas; mv /var/lib/maas /var/lib/_maas
sudo cp -prf etc/maas /etc/; cp -prf var/lib/maas /var/lib/
```

!!! Note: 
    Ensure the correct permissions are preserved when restoring files and
    directories.

If you have additional stand-alone rack controllers and a fresh installation
has regenerated the  `/var/lib/maas/secret` file, you'll need to make sure this
secret is updated on each rack controller to allow them to re-connect to the
newly restored region controller.

Now either restart your system(s) or the stopped services. You'll find your
MAAS deployment fully restored. 
