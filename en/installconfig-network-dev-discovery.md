Title: Network Discovery


# Network Discovery

MAAS constantly listens to the network and reports any discovered devices.
Devices are identified when the rack controller observes them communicating on
an attached IPv4 subnet. Discovered devices that do not correspond to machines
and devices already known to MAAS are shown on the [Dashboard][dashboard]. If a
device advertises a hostname using `mDNS` (such as with `avahi` or `Bonjour`),
MAAS will also present the discovered hostname in the Dashboard.

Using the Dashboard, an unknown discovered device can be added to MAAS as a
device or as a network interface belonging to a machine or device. Clicking the
expand *down* arrow to the right of a new device allows values such as 'Type',
'Domain', 'IP Assignment' and 'Parent' to be changed prior to the device being
added. Selecting a *Parent* device is optional.

Network discovery can be disabled or re-enabled using the switch on the Network
discovery dashboard.

![network discovery page][img__2.3_network-discovery]

<!-- LINKS -->>

[dashboard]: installconfig-webui.md#maas-dashboard

[img__2.3_network-discovery]: ../media/installconfig-networking__2.3_discovery.png
