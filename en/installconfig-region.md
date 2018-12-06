Title: Region controller
TODO:  
table_of_contents: True

# Region controller

## PostgreSQL setup

Any number of API servers (region controllers) can be present as long as each
connects to the same PostgreSQL database and allows the required number of
connections.

On the primary database host, edit file `/etc/postgresql/9.5/main/pg_hba.conf`
to allow the eventual secondary API server to contact the primary PostgreSQL
database. Include the below line, replacing `$SECONDARY_API_SERVER_IP` with the
IP address of the host that will contain the secondary API server:

```no-highlight
host    maasdb          maas	$SECONDARY_API_SERVER_IP/32         md5
```

!!! Note:
    The primary database and API servers often reside on the same host.

Apply this change by restarting the database:

```bash
sudo systemctl restart postgresql
```

## Adding a new region host

On a secondary host, add the new region controller by installing
`maas-region-api`:

```bash
sudo apt install maas-region-api
```

You will need the `/etc/maas/regiond.conf` file from the primary API server.
Below, we assume it can be copied (scp) from the 'ubuntu' account home
directory using password authentication (adjust otherwise). The
`local_config_set` command will edit that file by pointing to the host that
contains the primary PostgreSQL database. DNS (`bind9`) configuration options
are also rationalized between bind9 itself and the same options within MAAS:

```bash
sudo systemctl stop maas-regiond
sudo scp ubuntu@$PRIMARY_API_SERVER:regiond.conf /etc/maas/regiond.conf
sudo chown root:maas /etc/maas/regiond.conf
sudo chmod 640 /etc/maas/regiond.conf
sudo maas-region local_config_set --database-host $PRIMARY_PG_SERVER
sudo systemctl restart bind9
sudo systemctl start maas-regiond
```

Check the log files for any errors:

- `/var/log/maas/regiond.log`
- `/var/log/maas/maas.log`
- `/var/log/syslog`
