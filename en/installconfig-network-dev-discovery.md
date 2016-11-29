Title: Device Discovery | MAAS
TODO:  Link to Dashboard page when it's ready


# Device Discovery

MAAS constantly listens to the network and reports any discovered devices.
Devices are identified when the rack controller observes them communicating on
an attached IPv4 subnet. Discovered devices that do not correspond to machines
and devices already known to MAAS are shown on the Dashboard. If a device
advertises a hostname using `mDNS` (such as with `avahi` or `Bonjour`), MAAS
will also present the discovered hostname in the Dashboard. Using the
Dashboard, an unknown discovered device can be added to MAAS as a device or as
a network interface belonging to a machine or device.
