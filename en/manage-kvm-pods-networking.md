# KVM pod networking

In order to enable KVM pod networking features, MAAS must be able to correlate
the IP address of a potential KVM pod host with a host known to MAAS (a machine,
controller, or device). If it cannot, for example, if a machine not known to
MAAS is set up as a KVM host, enhanced interface selection features will not be
available.

The recommended way of setting up a KVM host is therefore to deploy a machine
within MAAS and tick the "Install MAAS-managed KVM Pod" checkbox (a full explanation
is found in the following section). MAAS will automatically install KVM as well
as ensure that the network model is consistent with what is on the machine.

There are other ways of setting up KVM pod hosts that provide easy management of
VMs via the MAAS UI. You can, for example, install KVM manually on a deployed
node or on a new or existing rack controller.

!!! Warning:
    Enhanced KVM pod networking features may not operate correctly when you
    install KVM manaully on a deployed node. (E.g. if any of the host interfaces
    change.)

## Differences between MAAS 2.5 and earlier versions

### Interface constraints

One of the main difference between MAAS 2.5 and earlier versions of MAAS is the
the application of the interfaces-constraints feature to VMs, which allows
you to compose a VM with specific networking requirements (a full-explanation of
the feature is found in the following section &mdash; for now, knowing the feature
exists is enough to continue the discussion). When these requirements are
present, MAAS is able connect your VMs to the full range of your MAAS-configured
network.

### 2.4 and earlier

MAAS requires the use of a DHCP server it can control. Therefore, DHCP must be
enabled in MAAS (rather than in libvirt) to allow VMs to use network booting
(e.g. PXE). DHCP requests can also be forwarded to MAAS via a DHCP relay.

MAAS first checks for the existence of a libvirt network named `maas`. The
`maas` network should have DHCP disabled in favor of MAAS-enabled DHCP to allow
your VMs to network boot. VMs on the `maas` libvirt network must be able to
reach the wider network. As such, either (1) the bridge the VMs are attached to
must include one of the host's physical network interfaces on the appropriate
network, or (2) NAT must be enabled.

If MAAS cannot find a `maas` network, it will fallback to libvirt's `default`
network.

!!! Note:
    Libvirt's `default` network has DHCP enabled by default. You must either
    disable libvirt's DHCP and enable MAAS DHCP on the `default` network in
    libvirt, or create a separate `maas` network on a VLAN with MAAS DHCP enabled.

### 2.5+

Since 2.5, MAAS supports enhanced KVM-networking features, provided you deploy
KVM host pods with the "Install MAAS-managed KVM Pod" checkbox ticked as discussed
in the introduction (or have installed KVM on a new or existing controller).

#### With interface constraints

Instead of attaching to a libvirt network like `maas` or `default`, MAAS in
this case tells the hypervisor on the host to attach the VM directly to a
constraints-matching underlying bridge or non-bridge interface via macvtap.  In
addition, if you provide a specific IP address in the constraint string, MAAS
will try to allocate it and assign it to the interface when the VM is created,
thereby providing some limited interface configuration upon creating the VM.

#### With *no* interface constraints

If you do not specify interface constraints, how MAAS attaches the VM to a
network depends on how KVM was installed on the pod host.

If the pod host was deployed by MAAS for use as a KVM host the recommended way
outlined above, MAAS will skip the libvirt `maas` and `default` networks if they
are not enabled for DHCP in MAAS, instead preferring a DHCP-enabled MAAS
network. This means you don't have to manually create a MAAS-friendly libvirt
network to which to attach the VM as with previous versions of MAAS.

If you've instead installed KVM manually on your host machine after deploying
via MAAS, MAAS will revert to its 2.4 behavior, namely trying to attach to a
suitable `maas` or `default` libvirt network, enabling network booting if it
detects MAAS-enabled DHCP on either.

## Bridges

### Macvlan

MAAS uses macvlan if an interfaces constraint specifies a macvlan interface when
composing a VM.

You can configure the default macvlan mode of an existing pod using the CLI:

```bash
maas $PROFILE pod update <pod-id> host=<host> default_macvlan_mode=<mode>
```

Where:

- `pod-id`: the pod’s MAAS ID
- `host`: the IP or hostname of the libvirt instance
- `default_macvlan_mode`:
    - `private`: VMs with the same parent interface cannot communicate but can
      reach destinations outside the parent interface
    - `vepa`: VM communication is forwarded through the parent interface and
      reflected back if the source and destination of the packet is local to the
      VMs.  VMs can reach destinations outside the parent interface. Note that
      this requires a VEPA switching mechanism.
    - `bridge`: Inter-VM communication is maintained locally (behind the parent
      interface) and destinations outside are forwarded through the parent
      interface.
    - `passthru`: Allows a single VM to be connected directly to the parent
      interface, which in turn allows the VM to change MAC addresses and other
      interface parameters.


### Bridge vs. macvlan

Unless you have a specific reason to use macvlan, a bridge is the better choice
for most situations. Although macvlan is simpler in design than a bridge and
therefore can offer better throughput and less demand on CPU, a bridge is typically
easier to configure and more likely to result in successful communication.



<!-- LINKS -->


