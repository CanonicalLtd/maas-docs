Title: High Availability (HA) Configuration
TODO:  URGENT: Needs a rewrite (and rename file)

# High Availability (HA) Configuration

MAAS 2.0+ supports high availability (HA) across its entire architecture. HA
can be enabled at the rack controller level allowing the ability for
controlling BMCs, providing DHCP, and deploying machines to span across
multiple rack controllers. At the region controller level, HA can be provided
for the API, WebUI, DNS, and APT proxy.

## Rack Controller HA

Rack controller HA is provided for BMCs out of the box. MAAS will automatically
identify which rack controllers can communicate to which BMCs and pass BMC
actions to the correct rack controllers.

To provide HA for deploying machines, DHCP HA must be turned on. DHCP HA in
MAAS allows a primary and a secondary DHCP server to run on the same VLAN.
This allows a deploying machine to request an IP address from either DHCP
server (primary first) for PXE booting. The responding rack controller will
then handle PXE booting the machine and loading the required files to complete
the deployment. All lease information will be replicated between the primary
and secondary rack controller, allowing one rack controller to fail without
interrupting MAAS operation. See [DHCP](./installconfig-dhcp.html) for enabling
DHCP HA.

## Region Controller HA

Region controller HA is more complicated, in that MAAS allows you to configure
this in many different configurations. Any number of region controllers can be
added to MAAS, as long as they connect to the same PostgreSQL database. The
only state that is held in MAAS is in the database, allowing region
controllers to be scaled up and scaled down at will.

### Initial Region Controller

The first step to enabling HA for the MAAS region controller is installing the
`maas-region-controller` package. This package configures everything for you
to start using the MAAS region controller on one machine. It initializes a new
database, runs the migrations, and sets up the default configuration files for
the new MAAS region controller to run. :

```bash
sudo apt update
sudo apt install maas-region-controller
```

!!! Note: This installs and configures the PostgreSQL database on the same machine as
the region controller. When possible, this is the recommended configuration.
MAAS requires database access to be fast, since all MAAS states (including
operating system images) will be synchronized with each rack controller.

### Enabling PostgreSQL HA

MAAS stores all state information in the PostgreSQL database, so it is key to
place this into an HA configuration. PostgreSQL supports many different HA
configurations, but hot standby is recommended as it allows the secondary
database to become the primary quickly and the MAAS region controller can
quickly switch to using the secondary database server as the primary. For
configuring hot standby, the following wiki provides a quick start guide on
setting it up:
[https://wiki.postgresql.org/wiki/Hot_Standby](https://wiki.postgresql.org/wiki/Hot_Standby).

### Extra Region Controller

Since this new region will not be setting up its own database, install the
following packages to set up the new region controller:


```no-highlight
sudo apt install maas-region-api maas-dns
```

In order to add another region controller to MAAS, you will also need the
*regiond.conf* from the initial region controller. This will allow the new
region controller to connect to the same PostgreSQL database. You will want to
adjust the database_host in the *regiond.conf* to point to the primary
database for PostgreSQL:

```bash
sudo apt update
sudo apt install maas-region-api maas-dns
sudo systemctl stop maas-regiond
sudo rm /var/lib/maas/{maas_id,secret}
sudo scp <ubuntu@initial-region>:/etc/maas/regiond.conf /etc/maas/regiond.conf
sudo chown root:maas /etc/maas/regiond.conf
sudo chmod 640 /etc/maas/regiond.conf
sudo maas-region local_config_set --database-host <postgresql-primary-ip>
sudo systemctl restart maas-regiond
```

When you check the MAAS UI or the API, you will see that MAAS now has another 
region controller. But one issue still exists: the `bind9` service will refuse
to start. This is because both BIND and MAAS define some of the same options
in their respective configuration files. Since BIND will not allow you to use
the same option more than once, MAAS needs to migrate the options from the
BIND configuration. You can do this with the following two commands:

```bash
sudo maas-region edit_named_options --migrate-conflicting-options
sudo systemctl restart bind9
```

After that, you should have another fully functioning MAAS region controller.
The DNS configuration and proxy configuration across all region controllers
will stay synced, and you have another server to access the MAAS WebUI and API
endpoints.

### Load Balancing Between Regions (optional)

With multiple region controllers, there are several options for load
balancing. One approach is to only use one region controller all the time, and
fail over to another using a virtual IP (VIP). Another approach is to use a
load-balancer and a VIP, to distribute the workload across all active region
controllers. In this example, we will use `haproxy` to configure load
balancing across the MAAS region controllers.

First (on each region controller) `apache2` needs to be disabled. While the
`maas-region-api` package depends on `apache2` for its default configuration,
it will conflict with `haproxy` (or any other load balancer running on port
80) if it is enabled:

```bash
sudo systemctl stop apache2
sudo systemctl disable apache2
```

With `apache2` disabled, `haproxy` can now be installed (`sudo
apt install haproxy`). To create a configuration file, copy the following into
`/etc/haproxy/haproxy.cfg`, changing &lt;server-name&gt; and 
&lt;server-ip&gt; to match your infrastructure:


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

Finally, launch `haproxy` with the following command:

```bash
sudo systemctl restart haproxy
```

!!! Note: We recommended running a load-balancer on every region controller server
and place a VIP between the servers. This will ensure that the load is
balanced between the servers and ensure that (if a failure occurs) the VIP
moves over to the another server (which could then distribute requests to
the remaining servers).

### VIP between the Regions

Whether you configured a load-balancer or not, a VIP (virtual IP) is needed.
The VIP will be used by the rack controllers (and the deploying machines) to
access the region controller API endpoint. In this example, we will show how
to use `keepalived` to configure a VIP.

First, install the package, load its associated kernel module, set this to load
with after a reboot and configure the systemd environment:

```bash
sudo apt install keepalived
sudo modprobe ip_vs
sudo sh -c 'echo modprobe ip_vs >> /etc/modules'
sudo sh -c 'echo net.ipv4.ip_nonlocal_bind=1' > /etc/sysctl.d/60-keepalived-nonlocal.conf
sudo systemctl restart procps
```

You will also need to create the following configuration file,
`/etc/keepalived/keepalived.conf`, adjusting our example below for either
`apache2` or `haproxy`, depending on your environment. You should also change
`interface_name`, `random_password`, the VIP address and the `priority`. The
priority needs to be between 1-255, and larger priority numbers indicate a greater
preference for the server to claim the VIP.


`/etc/keepalived/keepalived.conf`
```no-highlight
# Un-comment when using haproxy.
#vrrp_script chk_haproxy {
#    script "killall -0 haproxy"
#    interval 2
#}
 # Un-comment when using apache2.
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
sudo maas-rack config --region-url http://<vip>/MAAS
sudo systemctl restart maas-rackd
```

To adjust the region controller: 

```bash
sudo maas-region local_config_set --maas-url http://<vip>/MAAS
sudo systemctl restart maas-regiond
```

## Deploy HA with Juju

Now that you have an understanding of how to configure HA manually, it is
possible to use Juju to deploy MAAS in an HA configuration. Using Juju allows
you to quickly scale up or scale down the MAAS infrastructure in a
configuration supported by the MAAS team.

!!! Note: Using Juju to deploy MAAS is not normally how Juju would be used. Normally,
you would first install MAAS, then use Juju to deploy services on
MAAS-managed machines. However, we can use Juju's manual provisioning
support to deploy MAAS to existing Ubuntu systems.

In the following example, Juju is bootstrapped with manual provisioning, the
machines intended to be used for MAAS services are added, and the applications
are deployed and linked together. Be sure to adjust the given numbers based on
what you see in the "juju status" command. (See the [Juju
documentation](https://jujucharms.com/docs/devel/getting-started) for more
details.)

The following commands could be used to deploy MAAS:

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
