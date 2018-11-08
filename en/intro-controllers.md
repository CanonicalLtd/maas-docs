Title: Introduction
TODO:  
table_of_contents: True

# Controllers

There are two types of controllers: a *region controller* and a *rack
controller*. The region controller deals with operator requests while one or
more rack controllers provide the high-bandwidth services to multiple server
racks, as typically found in a data centre.

A region controller consists of:

- REST API server (TCP port 5240)
- PostgreSQL database
- DNS
- caching HTTP proxy
- web UI

A region controller can be thought of as being responsible for a data centre,
or a single region. Multiple *fabrics* are used by MAAS to accommodate
subdivisions within a single region, such as multiple floors in a data centre.

A rack controller provides:

- DHCP
- TFTP
- HTTP (for images)
- power management

A rack controller is attached to each "fabric". As the name implies, a common
setup is to have a rack controller in each data centre server rack. The rack
controller will cache large items for performance, such as operating system
install images, but maintains no exclusive state other than the credentials
required to talk to the region controller.

Both the region controller and the rack controller can be scaled-out as well
as made highly available. See [MAAS HA][maas-ha] for high availability.

## How region and rack controllers and machines communicate

In multi-region/rack clusters (i.e. HA clusters), all machine communication
with MAAS is proxied through rack controllers, including HTTP metadata, DNS,
syslog and APT (proxying via Squid).  Note that in single-region/rack clusters,
the region controller manages communication.

Proxying through rack controllers is useful in environments where communication
between machines and region controllers is restricted.

MAAS creates an internal DNS domain, not manageable by the user, and a special
DNS resource for each subnet that is managed by MAAS.  Each subnet includes all
rack controllers that have an IP on that subnet. Booting machines use the subnet
DNS resource to resolve the rack controller available for communication. If
multiple rack controllers belong to the same subnet, MAAS uses a round-robin
algorithm to balance the load across multiple rack controllers.  This ensures
that machines always have a rack controller.

Machines use this internal domain for HTTP metadata queries, APT (proxying via
Squid), and Syslog. DNS queries, PXE booting, and NTP polls use IP addresses.

The rack controller installs and configures `bind` as a forwarder. All machines
communicate via the rack controller directly.


!!! Note:
    Zone management and maintenance still happen within the region controller.

## HTTP

The rack controller installs `nginx`, which serves as a proxy and as an HTTP
server, binding to port 5248. Machines contact the metadata server via the rack
controller.

## Syslog

See [Syslog][syslog] for more information about MAAS syslog communication as well as how
to set up a remote syslog server.

<!-- Links -->

[maas-ha]: manage-ha.md
[syslog]: installconfig-syslog.md
