Title: What's new in 2.5
TODO:  (1) Add section to 'Rack controller' that explains the new way machines
       communicate with MAAS. (2) Fix '#' items in the link list (3) make sure linked
       sections have the promised information.
table_of_contents: True

# What's new in 2.5

Welcome to MAAS 2.5, a major update to [Canonical's][canonical] *Metal as a
Service* - The smartest way to manage bare metal.

This latest release of MAAS:

+ Improves communications between controllers and machines
+ Simplifies setting up high-availibility environments
+ Provides additional KVM Pod features
    + Virtual machine composition
    + Storage pools
    + New architectures
+ Adds new features for adding and commissioning machines
+ Introduces resource pools
+ Introduces ESXi deployment
+ Enhances the MAAS web UI by using the latest [Vanilla framework][vanilla]
+ Improves API documentation

See below for more details on each of these.

If you're new to MAAS, take a look at [Explore MAAS][explore-maas] to get an
overview of its installation and capabilities, and if you need a more
comprehensive review of the changes in this release, include known issues,
workarounds and bug fixes, take a look at the detailed release notes in the
following MAAS Discourse topics:

+ [MAAS 2.5.0 alpha 1][release-notes-alpha-1].
+ [MAAS 2.5.0 alpha 2][release-notes-alpha-2].

## Improvements to communication between controllers and machines

In previous versions of MAAS, machines interacted directly with the region
controller to access HTTP metadata, DNS, syslog and Squid (proxy). Because some
MAAS environments restrict communications between machines and the region
controller, starting with MAAS 2.5, HTTP metadata, DNS, syslog and Squid are
proxied through rack controllers.

!!! Note:
    For single-rack/region clusters, machines will continue to communicate with
    the region controller directly.

See [Rack controller][rack-controller] for more detailed information about how
rack controllers communicate with MAAS.

## Simplifying rack-to-region configuration in high-availibility (HA) setups

In previous versions of MAAS, rack controllers were always configured against a
single region controller. Although rack controllers would automatically discover
all other region controllers, a rack controller could communicate only with the
configured region controller endpoint, leaving it unable to communicate with the
region if the configured region controller went down.

Starting with MAAS 2.5, users can specify multiple region-controller endpoints
for a single rack controller, greatly simplifying HA setup. In addition, MAAS
can now automatically discover and track all region controllers in a single
cluster. If a rack controller is unable to communicate with its configured
region controller, MAAS will attempt to connect it to another automatically.

For details, see [Multiple region-controller endpoints][multiregion-endpoints].

## Additional KVM pod features

### Composing KVM virtual machines from a pod with interfaces

Starting with MAAS 2.5.0, users can compose KVM virtual machines from a pod with
interfaces. Using the command-line interface (CLI), the `machines allocate` and
`pod compose` endpoints support an `interfaces` constraint, which allows
selecting KVM pod NICs.

For more details, see [Composing KVM virtual machines][composing-kvm-machines].

### Storage pools

MAAS now [tracks storage-pool usage][storage-pool-usage] via libvirt.

### New architecture support

KVM pods now support `arm64` and `ppc64el` architectures. KVM pod hypervisors for
these architectures must be running on Ubuntu 18.04 (bionic) or greater.

## New features for adding and commissioning machines

### Adding machines with IPMI credentials

In previous versions of MAAS, users were required to provide the MAC address of
the PXE interface when adding new machines. In MAAS 2.5, users only need to
specify IPMI credentials or a non-PXE MAC address for non-IPMI machines. MAAS
automatically discovers the machine and runs the enlistment configuration by
matching either the BMC address or a non-PXE MAC address.

See [Add nodes][add-nodes] for more information.

### Commissioning scripts during enlistment

Starting with MAAS 2.5, MAAS runs all provided commissioning scripts during
enlistment, gathering the minimum required information. Administrators can
subsequently make a machine "Ready" simply by running hardware tests.

For more details, see [Commission nodes][commission-nodes].

## Resource pools

MAAS 2.5 introduces resouce pools. Administrators can now organize machines into
pools and restrict access to specific users.

See [Resource pools][resource-pools] in the official MAAS documentation for more
detailed information.

!!! Note:
    The resource-pool feature has been backported to MAAS 2.4 and is available
    in MAAS 2.4.1.

## ESXi deployment

MAAS 2.5 can deploy VMWare ESXi hypervisors (v6.7+) with limited support:

+ Network configuration is not yet supported. MAAS 2.5.0 provides basic
  networking configuration: static IP addresses on non-VLAN or bonded
  interfaces. Future versions of MAAS will support NIC teaming and VLANs.
+ Post-installation is not available over preseeds, for example
  `curtin_userdata`. Users can customize images they create to deploy with MAAS.

!!! Note:
    Currently, ESXi support is provided for [Ubuntu Advantage][advantage]
    customers only.

Find more information at [ESXi deployment][esxi].

## Enhanced web UI

The MAAS web interface has been refreshed with the latest [Vanilla
framework][vanilla]. Vanilla provides fine-grain control of spacing and padding,
allowing more information to be displayed clearly in less space. In addition,
interactions and forms are more consistent throughout the UI. Finally, the
machine-listing page includes the IP address assigned to each machine.


## API documentation improvements

MAAS 2.5.0 introduces improved API documentation for Zones and Resource pools.
Future versions of MAAS will provide enhanced API documentation across all
operations.

<!-- LINKS -->
[storage-pool-usage]: #
[multiregion-endpoints]: #
[resource-pools]: #
[composing-kvm-machines]: #
[esxi]: https://docs.maas.io/devel/en/installconfig-images
[commission-nodes]: https://docs.maas.io/devel/en/nodes-commission
[add-nodes]: https://docs.maas.io/devel/en/nodes-add
[rack-controller]: https://docs.maas.io/devel/en/installconfig-rack
[advantage]: https://www.ubuntu.com/support
[vanilla]: https://vanillaframework.io/
[explore-maas]: intro-explore.md
[canonical]: https://www.canonical.com/
[release-notes-alpha-1]: https://discourse.maas.io/t/maas-2-5-0-alpha-1/106
[release-notes-alpha-2]: https://discourse.maas.io/t/maas-2-5-0-alpha-2-released/155

