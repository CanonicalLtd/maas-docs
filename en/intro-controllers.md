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

<!-- Links -->

[maas-ha]: manage-ha.md
