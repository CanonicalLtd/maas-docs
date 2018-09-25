Title: High Availability
TODO:  CDO QA (irc: cgregan/jog) might be testing/using installing HA via Juju
table_of_contents: True

# High Availability

This page describes how to provide high availability (HA) for MAAS at both the
rack-controller level and the region-controller level. See [Concepts and
terms][concepts-controllers] for detailed information on what services are
provided by each of those levels.

## Communication between machines and rack controllers

In multi-region/rack clusters (i.e. HA clusters), all machine communication
with MAAS is proxied through rack controllers, including HTTP metadata, DNS,
syslog and APT (proxying via Squid).  Note that in single-region/rack clusters,
the region controller manages communication.

Proxying through rack controllers is useful in environments where communication
between machines and region controllers is restricted.

### DNS/Squid proxy

MAAS creates an internal DNS domain (not manageable by the user) and a special
DNS resource for each subnet that is managed by MAAS. Each subnet includes all
rack controllers that have an IP on that subnet. Booting machines use the subnet
DNS resource to resolve the rack controller available for communication. If
multiple rack controllers belong to the same subnet, MAAS uses a round-robin
algorithm to balance the load across multiple rack controllers. This ensures
that machines always have a rack controller.

The rack controller installs and configures `bind` as a forwarder. All machines
communicate via the rack controller directly.

!!! Note:
    Zone management and maintenance still happen within the region controller.

### HTTP

The rack controller installs `nginx`, which serves as a proxy and as an HTTP
server, binding to port 5248. Machines contact the metadata server via the rack
controller.

### `syslog`

See [Syslog] for more information about MAAS syslog communication as well as how
to set up a remote syslog server.

## Rack controller HA

Multiple rack controllers are necessary to achieve high availability. Please see
[Rack controller][install-rackd] to learn how to install rack controllers.

### Multiple region endpoints

Administrators can specify multiple region-controller endpoints for a single
rack controller by adding entries to `/etc/maas/rackd.conf`.

E.g.

```
.
.
.
maas_url:
  - http://<ip 1>:<port>/MAAS/
  - http://<ip 2>:<port>/MAAS/
.
.
.
```

Note that future releases of MAAS will include the ability to automatically
discover and track all available region controllers in a single cluster, as well
as automatically attempt to connect to them in the event that one becomes
inaccessible.

### BMC HA

HA for BMC control (node power cycling) is provided out of the box once a second
rack controller is present. MAAS will automatically identify which rack
controller is responsible for a BMC and set up communication accordingly.

### DHCP HA

DHCP HA affects node management (enlistment, commissioning and deployment). It
enables a primary and a secondary DHCP instance to serve the same VLAN where all
lease information is replicated between rack controllers. MAAS-managed DHCP is a
requirement for DHCP HA.

If you are enabling DHCP for the first time after adding a second rack
controller, please read [Enabling DHCP][enabling-dhcp].

However, if you have already enabled DHCP on your initial rack controller,
you'll need to reconfigure DHCP. Simply access the appropriate VLAN (via the
'Subnets' page) and choose action 'Reconfigure DHCP'. There, you will see the
second rack controller in the 'Secondary controller' field. All you should have
to do is press the 'Reconfigure DHCP' button:

![reconfigure DHCP][img__reconfigure-dhcp]

The setup of rack controller HA is now complete.

!!! Note:
    For HA purposes, DHCP provisioning will take into account multiple DNS
    services when there is more than one region controller on a single region.


## Region controller HA

Implementing region controller HA involves setting up:

- PostgreSQL HA
- Secondary API server(s)

Load balancing is optional.

### PostgreSQL HA

MAAS stores all state information in the PostgreSQL database. It is therefore
recommended to run it in HA mode. Configuring HA for PostgreSQL is external to
MAAS. You will therefore need to study the
[PostgreSQL documentation][upstream-postgresql-docs] and implement the variant
of HA that you feel most comfortable with.

A quick treatment of [PostgreSQL HA: hot standby][postgresql-ha] is provided
here for convenience only. Its purpose is to give an idea of what's involved at
the command line level when implementing one particular form of HA with
PostgreSQL.

!!! Note:
    Each region controller uses up to 40 connections to PostgreSQL in high load
    situations. Running 2 region controllers requires no modifications to the
    `max_connections` in `postgresql.conf`. More than 2 region controllers
    requires that `max_connections` be adjusted to add 40 more connections per
    extra region controller added to the HA configuration.

### Secondary API server

This section assumes that PostgreSQL HA has been set up.

!!! Note:
    Any number of API servers can be present as long as each connects to
    the same PostgreSQL database and allows the required number of connections.

On the primary database host, edit file `/etc/postgresql/9.5/main/pg_hba.conf`
to allow the eventual secondary API server to contact the primary PostgreSQL
database. Include the below line, replacing $SECONDARY_API_SERVER_IP with the
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

On a secondary host, add the new API server by installing `maas-region-api`:

```bash
sudo apt install maas-region-api
```

The `/etc/maas/regiond.conf` file from the primary API server will be needed.
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

### Load balancing with HAProxy (optional)

Load balancing can be added with [HAProxy][upstream-haproxy] load-balancing
software to support multiple API servers. In this setup, HAProxy provides access
to the MAAS web UI and API.

!!! Note:
    If you happen to have Apache running on the same server where you intend to
    install HAProxy, you will need to stop and disable `apache2`, because
    HAProxy binds to port 80.

#### Install

```bash
sudo apt install haproxy
```

#### Configure

Configure each API server's load balancer by copying the following into
`/etc/haproxy/haproxy.cfg` (see the
[upstream configuration manual][upstream-haproxy-manual]
as a reference). Replace $PRIMARY_API_SERVER_IP and $SECONDARY_API_SERVER_IP
with their respective IP addresses:

```yaml
frontend maas
    bind    *:80
    retries 3
    option  redispatch
    option  http-server-close
    default_backend maas

backend maas
    timeout server 90s
    balance source
    hash-type consistent
    server localhost localhost:5240 check
    server maas-api-1 $PRIMARY_API_SERVER_IP:5240 check
    server maas-api-2 $SECONDARY_API_SERVER_IP:5240 check
```

Where `maas-api-1` and `maas-api-2` are arbitrary server labels.

Now restart the load balancer to have these changes take effect:

```bash
sudo systemctl restart haproxy
```

The configuration of region controller HA is now complete.

**The API server(s) must be now be referenced (e.g. web UI, MAAS CLI) using
port 80 (as opposed to port 5240).**

## Snap

Setting up high-availability using snaps is relatively easy. To use snaps
instead of a package distribution of MAAS:

1. Set up PostgreSQL for high-availability as [explained
   above][postgresql-setup]. PostgreSQL should run outside of the snap.
1. [Install][snap-install] the MAAS snap.
1. [Configure the snap][snap-config] by specifying the role appropriate for your particular
   setup.

<!-- LINKS -->

[syslog]: installconfig-syslog.md
[snap-config]: installconfig-snap-install.md#initialisation
[snap-install]: installconfig-snap-install.md#install-from-snap
[concepts-controllers]: intro-concepts.md#controllers
[rackd-communication]: installconfig-rack.md#communication-between-machines-and-rack-controllers
[install-rackd]: installconfig-rack.md#install-a-rack-controller
[enabling-dhcp]: installconfig-network-dhcp.md#enabling-dhcp
[keepalived-man-page]: http://manpages.ubuntu.com/cgi-bin/search.py?q=keepalived.conf
[upstream-keepalived]: http://www.keepalived.org/
[upstream-haproxy-manual]: http://cbonte.github.io/haproxy-dconv/1.6/configuration.html
[upstream-haproxy]: http://www.haproxy.org/
[postgresql-setup]: manage-ha.md#postgresql-ha
[postgresql-ha]: manage-ha-postgresql.md
[upstream-postgresql-docs]: https://www.postgresql.org/docs/9.5/static/high-availability.html

[img__reconfigure-dhcp]: ../media/manage-ha__2.4_reconfigure-dhcp.png
