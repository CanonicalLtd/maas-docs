# KVM (pod)

A MAAS KVM pod is a collection of virtual machines running on an instance of
libvirt. KVM pods are useful for Juju integration, allowing for dynamic
allocation of VMs with custom interface constraints.  Alternatively, if you
would like to use MAAS to manage a collection of VMs, the robust web UI allows
you to easily create and manage VMs logically grouped by pod.

Features:

- Juju integration
- At-a-glance visual tools for easy resource management
- Set overcommit ratios for physical resources such as CPU and RAM
- Assign pods to resource pools to segregate your pods into logical groupings
- Track libvirt storage pool usage and assign default storage pools to your
  pods
- Create VMs on multiple networks, specified by space, subnet, VLAN, or IP
  address

## KVM pod networking

In order to enable KVM pod networking features, MAAS must be able to correlate
the IP address of a potential KVM pod host with a host known to MAAS (a machine,
controller, or device). If it cannot, for example, if a machine not known to
MAAS is set up as a KVM host, enhanced interface selection features will not be
available.

The recommended way of setting up a KVM host is therefore to deploy a machine
within MAAS and tick the "Install MAAS-managed KVM" checkbox (a full explanation
is found in the following section). MAAS will automatically install KVM as well
as ensure that the network model is consistent with what is on the machine.

There are other ways of setting up KVM pod hosts that provide easy management of
VMs via the MAAS UI. You can, for example, install KVM manually on a deployed
node or on a new or existing rack controller.

!!! Warning:
    Enhanced KVM pod networking features may not operate correctly when you
    install KVM manaully on a deployed node. (E.g. if any of the host interfaces
    change.)

### Differences between MAAS 2.5 and earlier versions

#### Interface constraints

One of the main difference between MAAS 2.5 and earlier versions of MAAS is the
the application of the interfaces-constraints feature to VMs, which allows
you to compose a VM with specific networking requirements (a full-explanation of
the feature is found in the following section &mdash; for now, knowing the feature
exists is enough to continue the discussion). When these requirements are
present, MAAS is able connect your VMs to the full range of your MAAS-configured
network.

#### 2.4 and earlier

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

#### 2.5+

Since 2.5, MAAS supports enhanced KVM-networking features, provided you deploy
KVM host pods with the "Install MAAS-managed KVM" checkbox ticked as discussed
in the introduction (or have installed KVM on a new or existing controller).

##### With interface constraints

Instead of attaching to a libvirt network like `maas` or `default`, MAAS in
this case tells the hypervisor on the host to attach the VM directly to a
constraints-matching underlying bridge or non-bridge interface via macvtap.  In
addition, if you provide a specific IP address in the constraint string, MAAS
will try to allocate it and assign it to the interface when the VM is created,
thereby providing some limited interface configuration upon creating the VM.

##### With *no* interface constraints

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

### Bridges

#### Macvlan

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


#### Bridge vs. macvlan

Unless you have a specific reason to use macvlan, a bridge is the better choice
for most situations. Although macvlan is simpler in design than a bridge and
therefore can offer better throughput and less demand on CPU, a bridge is typically
easier to configure and more likely to result in successful communication.

## Add a KVM host pod to MAAS

### 2.5

Once a machine as been added to MAAS and gone through enlistment, commissioning
and hardware testing, you can deploy it (after acquiring it) as a KVM host by
ticking the "Install MAAS-managed KVM" checkbox:

TBD: SCREENSHOT-WHEN-AVAILABLE

You can also use the [MAAS CLI][cli-deploy-kvm] to deploy a machine to use as a
KVM host.


### Manual/Pre-2.5

Setting up a manual KVM host in 2.5 or in older version of MAAS requires many
more manual steps.

#### Setting up a `maas` libvirt network

Libvirt by default creates a virtual bridge, `virbr0`, through which VMs
communicate with each other and the Internet. DHCP is supplied by libvirt so
that new VMs are automatically given an IP address.

However, to enable network booting in MAAS, you’ll need to provide DHCP in MAAS
and either:

1. Disable DHCP on libvirt’s `default` network, or
2. Create a new libvirt network `maas` with DHCP disabled.

You can set up such a `maas` network like this:

```bash
cat << EOF > maas.xml
<network>
 <name>maas</name>
 <forward mode='nat'>
   <nat>
     <port start='1024' end='65535'/>
   </nat>
 </forward>
 <dns enable="no" />
 <bridge name='virbr1' stp='off' delay='0'/>
 <domain name='testnet'/>
 <ip address='172.16.99.1' netmask='255.255.255.0'>
 </ip>
</network>
EOF
virsh net-define maas.xml
```

Note that this network also has NAT port forwarding enabled to allow VMs to
communicate with the Internet at large. This is useful in test environments.

#### Setting up SSH

In order for MAAS to successfully communicate with libvirt on your KVM host
machine, this example command must succeed from every rack controller as user
`maas`:

```bash
virsh -c qemu+ssh://$USER@$KVM_HOST/system list --all
```

Here, `$USER` is a user on your KVM host who is a member of the `libvirtd` unix
group on the KVM host, and `$KVM_HOST` is the IP of your KVM host.

The `maas` user on your rack controllers will issue all virsh commands.
Therefore, you'll need to set up SSH public keys on every rack controller for
user `maas`.

To do this, first create SSH keys on all rack controllers:

```bash
sudo chsh -s /bin/bash maas
sudo su - maas
ssh-keygen -t rsa -N ''
```

Next, add the contents of `~maas/.ssh/id_rsa.pub` to the KVM host user's
`~$USER/.ssh/authorized_keys`. To do this, you can, for example, log into your
KVM host node via SSH from a host for which you provided MAAS an existing public
SSH key (e.g. your imported Launchpad keys).

!!! Note:
    Insufficient permissions for `$USER` may cause the `virsh` command to fail
    with an error such as `failed to connect to the hypervisor`. Check the
    `$USER` group membership to make sure `$USER` is a member of the `libvirtd`
    group.

## Storage pools

Libvirt “storage pools” are storage resources managed by libvirt. For a
more in-depth take on libvirt storage pools, see
[here](https://libvirt.org/storage.html).

### Web UI

See [Web UI][webui] for how to get started with the web UI.

MAAS detects available libvirt storage pools and displays information about
each when you select a pod from the Pods page:

![storagepoolusage][img__storagepoolusage]

Additionally, when you compose a new VM within a MAAS pod, you can choose which
storage pool to use from a drop-down list:

![storagepoolavail][img__storagepoolavail]


You can also use the [MAAS CLI][cli-compose-with-storage] to compose pod VMs with specific
storage pool constraints.


<!-- LINKS -->


[img__storagepoolusage]: ../media/manage-kvm-pods__2.5_libvirt_storage_usage.png
[img__storagepoolavail]: ../media/manage-kvm-pods__2.5_libvirt_storage.png

[cli-compose-with-storage]: manage-cli-comp-hw.md#compose-pod-machines
[cli-deploy-kvm]: manage-cli-common.md#deploy-a-node
[juju]: https://docs.jujucharms.com
[webui]: installconfig-webui.md
