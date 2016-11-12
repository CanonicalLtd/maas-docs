Title: PostgreSQL HA notes | MAAS


# PostgreSQL HA: hot standby

**Disclaimer: The contents of this page do not constitute documentation. They
are *notes* that the reader can peruse to get an idea of what may be involved
at the command line level when setting up 'hot standby' HA mode in PostgreSQL.
These notes are not regularly tested. Please use the
[PostgreSQL documentation](https://www.postgresql.org/docs/9.5/static/high-availability.html)
when setting up HA on PostgreSQL.**

<!-- NOTES

https://www.postgresql.org/docs/9.5/static/high-availability.html
https://jujucharms.com/postgresql/

CREATETABLE guestbook (visitor_email text, vistor_id serial, date timestamp, message text);
INSERT INTO guestbook (visitor_email, date, message) VALUES ( 'jim@gmail.com', current_date, 'This is a test.');
INSERT INTO guestbook (visitor_email, date, message) VALUES ( 'jim@gmail.com', current_date, 'Now we are replicating.');
SELECT * from guestbook;

Primary host:
This should change over time ('*_location' values):
sudo -u postgres psql -x -c "select * from pg_stat_replication;"

-->

The following variables are used on this page:

- PRIMARY_PG_IP: The IP address of the host that contains the primary database.
- SECONDARY_PG_IP: The IP address of the host that contains the secondary database.
- REP_USER: The internal database user that manages replication on the primary. 
- REP_USER_PW: The password of the replication user.

Their values are represented when they are preceded with the '$' character
(e.g. $REP_USER_PW). These are to be replaced with actual values in the commands
and files below.


## Primary

Perform these actions on the primary host.

1) Create an internal database user to manage replication. You will be prompted
to supply a password ($REP_USER_PW) for this new user:

```bash
sudo -u postgres createuser -U postgres $REP_USER -P -c 5 --replication
```

2) Set up a place to store replication files:

```bash
sudo mkdir -p /pgsql/archive
sudo chown postgres /pgsql/archive
```

3) Edit `/etc/postgresql/9.5/main/pg_hba.conf` to allow the secondary host to
contact this primary host.

```no-highlight
host    replication     $REP_USER	$SECONDARY_PG_IP/32         md5
```

4) Edit `/etc/postgresql/9.5/main/postgresql.conf` to listen on more than just
its localhost interface, turn on replication, and point to the archive
directory:

```no-highlight
listen_addresses = '*'
wal_level = hot_standby
archive_mode = on
archive_command = 'test ! -f /pgsql/archive/%f && cp %p /pgsql/archive/%f'
max_wal_senders = 3
```

5) Restart the database to apply the above changes:

```bash
sudo systemctl restart postgresql
```


## Secondary

Perform these actions on the secondary host.

1) Install PostgreSQL and stop the service. Then move the default database
files out of the way and replace them with a copy of the primary database
files. You will be prompted for the password of the replication user.

```bash
sudo apt install postgresql
sudo systemctl stop postgresql
sudo mv /var/lib/postgresql/9.5/main /var/lib/postgresql/9.5/main.old
sudo -u postgres pg_basebackup -h $PRIMARY_PG_IP -D /var/lib/postgresql/9.5/main -U $REP_USER -v -P --xlog-method=stream
Password: 
```

2) Edit `/etc/postgresql/9.5/main/postgresql.conf` and put this secondary host
in hot standby mode:

```no-highlight
hot_standby = on
```

3) Copy a sample recovery configuration file into place:

```bash
sudo cp /usr/share/postgresql/9.5/recovery.conf.sample /var/lib/postgresql/9.5/main/recovery.conf
```

4) Edit `/var/lib/postgresql/9.5/main/recovery.conf`. Specify hot standby mode
and enter the information necessary for contacting the primary:

```no-highlight
standby_mode = on
primary_conninfo = 'host=$PRIMARY_PG_IP port=5432 user=$REP_USER password=$REP_USER_PW'
```

5) Start the database:

```bash
sudo systemctl start postgresql
```
