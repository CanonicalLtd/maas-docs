Title: Communication

# MAAS communication

## Machine/rack

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

## Rack/region

Each rack controller must be able to initiate TCP connections on the following
ports:

| Port(s)         | Description                            |
| --------------- | -------------------------------------- |
| `5240`          | HTTP communication with each region controller. Note that port `80` is typically used in high-availability environments. See [MAAS HA][manage-ha]. |
| `5241` - `5247` | Reserved for internal MAAS services.   |
| `5248`          | Reserved for [rack HTTP][rack-http] communication.  |
| `5250` - `5270` | Reserved for region workers (RPC).     |

## HTTP

The rack controller installs `nginx`, which serves as a proxy and as an HTTP
server, binding to port 5248. Machines contact the metadata server via the rack
controller.

## Syslog

See [Syslog][syslog] for more information about MAAS syslog communication as well as how
to set up a remote syslog server.


<!-- LINKS -->

[rack-http]: #http
[manage-ha]: manage-ha.md
[syslog]: installconfig-syslog.md
