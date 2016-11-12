Title: High Availability | MAAS
TODO:  CDO QA (irc: cgregan/jog) might be testing/using installing HA via Juju
       Can DHCP HA involve more than 2 DHCP instances?
       Remove the part about stopping apache2 once port 80 redirect is removed from MAAS
table_of_contents: True


# High Availability

MAAS has support for high availability (HA) at both the rack controller level
and the region controller level. See
[Concepts and Terms](intro-concepts.md#controllers) for detailed information on
what services are provided by each of those levels.


## Rack controller HA

Although DHCP is handled at the rack controller level one should not worry
about a second DHCP service coming online and causing disruption. DHCP software
is added intelligently and DHCP HA will become available as an option.

Install a second rack controller by reading
[Rack controller](installconfig-rack.md#install-a-rack-controller).

### BMC HA

HA for BMC control (node power cycling) is provided out of the box once a
second rack controller is present. MAAS will automatically identify which rack
controller is responsible for a BMC and communication will be set up
accordingly.

### DHCP HA

DHCP HA affects node management (enlistment, commissioning and deployment) and
it is turned on automatically if the initial rack controller already has DHCP
enabled. If DHCP is being enabled for the first time after a second rack
controller is added then enable it according to
[Enabling DHCP](installconfig-subnets-dhcp.md#enabling-dhcp).

DHCP HA enables a primary and a secondary DHCP instance to serve the same VLAN
where all lease information is replicated between rack controllers. DHCP
needs to be MAAS-managed in order for DHCP HA to work with MAAS.

The setup of rack controller HA is now complete.


## Region Controller HA

For region controller HA any number of region controllers can be present as
long as each connects to the same PostgreSQL database instance.

### PostgreSQL HA

MAAS stores all state information in the PostgreSQL database. It is therefore
recommended to run it in HA mode. Configuring HA for PostgreSQL is external to
MAAS. You will therefore need to study the
[PostgreSQL documentation](https://www.postgresql.org/docs/9.5/static/high-availability.html)
and implement the variant of HA that you feel most comfortable with.

A quick treatment of [PostgreSQL HA: hot standby](manage-ha-postgresql.md) is
provided here for convenience only. Its purpose is to give an idea of what's
involved at the command line level when implementing one particular form of HA
with PostgreSQL.

### Secondary API server

This section assumes that PostgreSQL HA has been set up.

Begin by allowing the (eventual) secondary API server to contact the primary PostgreSQL
database. On the primary database host then, edit file
`/etc/postgresql/9.5/main/pg_hba.conf` and include the line:

```no-highlight
host    maasdb          maas	$SECONDARY_API_SERVER_IP/32         md5
```

!!! Note: It is very common for the primary database server and the primary API
server to reside on the same host.

Then apply this change by restarting the database:

```bash
sudo systemctl restart postgresql
```

On the host set aside for the new API server, add it by installing a few
carefully chosen packages:

```bash
sudo apt install maas-region-api maas-dns
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
sudo maas-region edit_named_options --migrate-conflicting-options
sudo systemctl restart bind9
sudo systemctl start maas-regiond
```

The setup of region controller HA is now complete.

Check the log files for any errors:

- `/var/log/maas/regiond.log`
- `/var/log/maas/maas.log`
- `/var/log/syslog`

### Load balancing between regions (optional)

With multiple region controllers, there are several options for load balancing.
One approach is to use one region controller all the time, and fail over to
another one using a virtual IP (VIP). Another approach is to use a
load-balancer and a VIP to distribute the workload across all active region
controllers. Here, we will use `haproxy` to do the latter.

Firstly, on each region controller, before haproxy is installed, `apache2`
needs to be disabled. This is because both apache2 and haproxy listen on
the same port (TCP 80).

```bash
sudo systemctl stop apache2
sudo systemctl disable apache2
sudo apt install haproxy
```

To create a configuration file, copy the following into
`/etc/haproxy/haproxy.cfg`, changing &lt;server-name&gt; and &lt;server-ip&gt;
to match your infrastructure:

```yaml
frontend maas
    bind    *:80
    retries 3
    option  redispatch
    option  http-server-close
    default_backend maas

backend maas
    timeout server 30s
    balance roundrobin
    server localhost localhost:5240 check
    server <server-name-1> <server-ip-1>:5240 check
    server <server-name-2> <server-ip-2>:5240 check
```

Finally, launch `haproxy`:

```bash
sudo systemctl restart haproxy
```

!!! Note: We recommended running a load-balancer on every region controller
server and place a VIP between the servers. This will ensure that the load is
balanced between the servers and ensure that (if a failure occurs) the VIP
moves over to the other server (which could then distribute requests to the
remaining servers).

### VIP between the regions

Whether a load-balancer has been configured or not, a VIP (virtual IP) is
needed.  The VIP will be used by the rack controllers (and the deploying
machines) to access the region controller API endpoint. In this example, we
will show how to use `keepalived` to configure a VIP.

Install the software, load its associated kernel module, set this to load
upon reboot and configure the systemd environment:

```bash
sudo apt install keepalived
sudo modprobe ip_vs
sudo sh -c 'echo modprobe ip_vs >> /etc/modules'
sudo sh -c 'echo net.ipv4.ip_nonlocal_bind=1' > /etc/sysctl.d/60-keepalived-nonlocal.conf
sudo systemctl restart procps
```

The file `/etc/keepalived/keepalived.conf` will also need to be created. Adjust
the example below for either `apache2` or `haproxy`, depending on your
environment. The values for `interface_name`, `random_password`, the VIP
address and the `priority` should also be changed. The priority needs to be
between 1-255 (a larger value indicates a greater preference for the server to
claim the VIP).

```no-highlight
### Un-comment this section if using haproxy
#vrrp_script chk_haproxy {
#    script "killall -0 haproxy"
#    interval 2
#}

### Un-comment this section if using apache2
#vrrp_script chk_apache2 {
#    script "killall -0 apache2"
#    interval 2
#}

vrrp_script chk_named {
    script "killall -0 named"
    interval 2
}

vrrp_instance maas_region {
    state MASTER
    interface <interface_name>
    priority <priority>
    virtual_router_id 51
     authentication {
        auth_type PASS
        auth_pass <random_password>
    }
     track_script {
        # Un-comment when using haproxy
        #chk_haproxy
        # Un-comment when using apache2
        #chk_apache2
        chk_named
    }
     virtual_ipaddress {
        <vip>
    }
}
```

Finally, start the daemon with:

```bash
sudo systemctl restart keepalived
```

!!! Note: If you are enabling this inside of a container, the host of the
container needs the ip\_vs module loaded and the sysctl change. A restart of
the container is required once the change has been made in the host.

Once `keepalived` has been configured you will want to adjust the MAAS\_URL on
all region controllers and rack controllers to point to that VIP. This will
ensure that all clients and machines use that IP address for communication.

To adjust the rack controller:

```bash
sudo maas-rack config --region-url http://<vip>:5240/MAAS
sudo systemctl restart maas-rackd
```

To adjust the region controller: 

```bash
sudo maas-region local_config_set --maas-url http://<vip>:5240/MAAS
sudo systemctl restart maas-regiond
```

## Deploy HA with Juju

It is possible to use Juju to deploy MAAS in an HA configuration. However, this
is not typically how Juju is used. Normally, MAAS would be installed first and
*then* have Juju deploy services on the MAAS nodes.

In the following example, a Juju controller is created with manual
provisioning, the machines intended to be used for MAAS services are added, and
the applications are deployed and linked together. Be sure to adjust the given
numbers based on what you see in the "juju status" command.

<!-- What about load balancing? -->
Here is how to install MAAS with HA at both the region controller level and
rack controller level.

```bash
juju bootstrap maas manual/<ip-of-server>
juju add-machine ssh:<ip-of-server>
. add required machines ...
juju deploy postgresql --to 0
juju add-unit postgresql --to 1
juju deploy maas-region --to 0
juju add-unit maas-region --to 1
juju add-relation maas-region:db postgresql:db
juju deploy maas-rack --to 3
juju add-unit maas-rack --to 4
juju add-relation maas-region:rpc maas-rack:rpc
```

See [Juju](https://jujucharms.com/docs/devel/getting-started) for more on how
to use Juju.
