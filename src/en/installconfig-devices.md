Title: Other Devices
TODO:  This information should probably be part of a larger document or provide
       further details on specific devices.

# Other devices

In addition to nodes, a MAAS cluster controller can manage *devices*. Devices
represent non-installable machines. This feature can be used to track routers,
virtual machines, etc. within MAAS.

As with nodes, devices can be assigned IP addresses and DNS names. IP
addresses can be fixed or dynamic:

- `Fixed`; the device should be configured to use the defined IP address.
- `Dynamic`; the device can obtain an IP address from the MAAS DHCP server.

Devices can also be assigned a parent node and will be automatically deleted
(along with all the IP address reservations associated with it) when the
parent node is deleted or released. This is designed to model and manage the
virtual machines or containers running on a MAAS-deployed node.
