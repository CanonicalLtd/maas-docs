

# PostgreSQL HA: hot standby

**Disclaimer: These *notes* give an idea of what is involved in setting up 'hot
standby' HA mode in PostgreSQL. The below procedures are not regularly tested.
Please use the [PostgreSQL documentation][upstream-postgresql-ha-docs] when
setting up HA on PostgreSQL.**

The following variables are used on this page:

- PRIMARY_PG_IP: The IP address of the host that contains the primary database.
- SECONDARY_PG_IP: The IP address of the host that contains the secondary database.
- REP_USER: The internal database user that manages replication on the primary. 
- REP_USER_PW: The password of the replication user.
- REP_ARCHIVE: The directory where the database will place files to be
  replicated.

Their values are represented when they are preceded with the '$' character
(e.g. $REP_USER_PW). These are to be replaced with actual values in the commands
and files below.


## Primary

Perform these actions on the primary host.

### Create internal database user

Create an internal database user to manage replication. You will be prompted to
supply a password ($REP_USER_PW) for this new user:

```bash
sudo -u postgres createuser -U postgres $REP_USER -P -c 5 --replication
```

### Set up replication file storage

Set up a place to store replication files:

```bash
REP_ARCHIVE=/var/backups/pgsql/archive
sudo mkdir -p $REP_ARCHIVE
sudo chown postgres $REP_ARCHIVE
```

### Allow secondary host to connect

Edit `/etc/postgresql/9.5/main/pg_hba.conf` to allow the secondary host to
contact this primary host.

```no-highlight
host    replication     $REP_USER	$SECONDARY_PG_IP/32         md5
```

### Configure for replication

Edit `/etc/postgresql/9.5/main/postgresql.conf` to listen on more than just its
localhost interface, turn on replication, and point to the archive directory:

```no-highlight
listen_addresses = '*'
wal_level = hot_standby
archive_mode = on
archive_command = 'test ! -f $REP_ARCHIVE/%f && cp %p $REP_ARCHIVE/%f'
max_wal_senders = 3
```

### Restart the database

Restart the database to apply the above changes:

```bash
sudo systemctl restart postgresql
```

Check log file `/var/log/postgresql/postgresql-9.5-main.log` on this primary
host for any errors.

The primary database is now ready to accept replication requests from the
secondary database (that will be set up below).


## Secondary

Perform these actions on the secondary host.

This host should ideally match the primary host in terms of:

- CPU architecture
- OS type and version
- PostgreSQL version

Replication has been known to fail due to an architecture mismatch.

### Install PostgreSQL and stop the service

Install PostgreSQL and stop the service: 

```bash
sudo apt install postgresql
sudo systemctl stop postgresql
```

### Copy over primary database files

Move the default database files out of the way and replace them with a copy of
the primary database files. You will be prompted for the password of the
remote replication user.

```bash
sudo mv /var/lib/postgresql/9.5/main /var/lib/postgresql/9.5/main.old
sudo -u postgres pg_basebackup -h $PRIMARY_PG_IP -D /var/lib/postgresql/9.5/main -U $REP_USER -v -P --xlog-method=stream
Password: 
```

Once a copy of the primary database is transferred, proceed to configure actual
replication.

### Place database in hot standby mode

Edit `/etc/postgresql/9.5/main/postgresql.conf` and put this secondary host in
hot standby mode:

```no-highlight
hot_standby = on
```

### Set up recovery configuration file

Copy a sample recovery configuration file into place:

```bash
sudo cp /usr/share/postgresql/9.5/recovery.conf.sample /var/lib/postgresql/9.5/main/recovery.conf
```

### Configure for recovery

Edit `/var/lib/postgresql/9.5/main/recovery.conf`. Specify hot standby mode and
enter the information necessary for contacting the primary:

```no-highlight
standby_mode = on
primary_conninfo = 'host=$PRIMARY_PG_IP port=5432 user=$REP_USER password=$REP_USER_PW'
```

### Start the database

Start the database:

```bash
sudo systemctl start postgresql
```

Check log file `/var/log/postgresql/postgresql-9.5-main.log` on this secondary
host for any errors.

The secondary database is now replicating the primary database.


## Verification of replication

This section includes a raw test that will show whether replication is
functioning.

On the **secondary** database host, perform a query on the 'maasserver_node'
table in the 'maasdb' database:

```bash
sudo -u postgres psql maasdb -c 'SELECT hostname,status,power_state FROM maasserver_node'
```

The output will look something like:

```no-highlight
     hostname      | status | power_state 
-------------------+--------+-------------
 pmatulis-imp-maas |      0 | unknown
 node3             |      4 | off
 node1             |      6 | on
 node2             |      4 | off
 node4             |      6 | on
(5 rows)
```

This includes any hosts that are being used for API servers or rack controllers
('pmatulis-imp-maas' in this example). There are 4 regular MAAS nodes.

To quickly check that replication is working simply (temporarily) rename a
node's hostname in the web UI and re-invoke the above command to see if the
change is reflected.

Another test could be to change the status of a node, for example, by
Commissioning or Deploying (a status of '4' is 'Ready' and a status of '6' is
'Deployed').


<!-- LINKS -->

[upstream-postgresql-ha-docs]: https://www.postgresql.org/docs/9.5/static/high-availability.html
