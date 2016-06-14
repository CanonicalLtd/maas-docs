Title: MAAS | Detailed definition


# Definition of MAAS

MAAS runs a software-defined data centre - it turns a collection of physical
servers and switches into a bare metal cloud with full open source IP address
management (IPAM) and instant provisioning on demand.

MAAS controls the servers through IPMI or another BMC or converged chassis
controller such as Cisco UCS. It provides a full inventory  of components, and
can install Ubuntu, CentOS or Windows very fast on any  server under its
control. It can also track and provide DHCP and DNS for other devices on the
network.

MAAS handles VLANs and fabrics that span many trunked switches, as well as the
routing-centric infrastructure typically used for large-scale OpenStack  or
other scale-out deployments. MAAS manages IP addresses and provides APIs for
address assignment and release. MAAS can also allocate IP addresses for
containers on machines, and release them when the machine is repurposed. MAAS
provides PXE, DHCP, DNS and other low-level services to ensure the cluster
works smoothly.

MAAS works with any configuration system, and is recommended by the teams
behind both Chef and Juju as a physical provisioning system.

MAAS provides:

- Hardware inventory of servers
- Dynamic provisioning based on name or attributes such as disk space, memory,
  CPU cores, network cards, networking, GPU, and architecture
- DNS and DHCP as needed
- PXE boot services
