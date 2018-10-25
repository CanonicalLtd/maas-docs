Title: KVM (pod)
TODO:  
table_of_contents: True

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
KVM host pods with the "Install MAAS-managed KVM Pod" checkbox ticked as discussed
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
ticking the "Install MAAS-managed KVM Pod" checkbox:

![kvmpoddeploy][img__kvmpoddeploy]

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


## Web UI

See [Web UI][webui] for how to get started with the web UI.

Composable hardware systems are managed on the 'Pods' page, which is initially
empty:

![initial pods page][img__pod-initial-page]


### Add a pod

The recommended way to add a KVM host pod is to deploy a machine as a KVM host
as explained above. However, you can add a pod manually using the 'Add pod' button.

#### Creating a KVM pod manually

![add Virsh pod][img__pod-add-virsh]


### List pods

Pods and a summary of contained resources will be listed on the 'Pods' page:

![save pod][img__pod-list]

### View pod details

Click a pod's name on the 'Pods' page to show the resources contained within it,
including its total number of CPU cores, the amount of total RAM and local
storage. These values update to reflect usage and remaining resources.

The main view also lists the machines contained within the pod.

![pod details][img__pod-details]

### Configuration

Pods have several configuration options. These are modified by selecting the
'Configuration' tab and clicking 'Edit'. Options include a pod's location,
password, network zone, and default storage pool.

#### Storage pools

Libvirt “storage pools” are storage resources managed by libvirt. For a
more in-depth take on libvirt storage pools, see
[here](https://libvirt.org/storage.html).

![storagepoolusage][img__storagepoolusage]

Additionally, when you compose a new VM within a MAAS pod, you can choose which
storage pool to use from a drop-down list:

![storagepoolavail][img__storagepoolavail]

You can also use the [MAAS CLI][cli-compose-with-storage] to compose pod VMs with specific
storage pool constraints.

#### Overcommit resources

Overcommitted resources are those allocated beyond what's available in the
physical resource. Sliders on the configuration page allow you to strictly limit
whether CPU and memory can be over committed, and to what extent. The input
fields to the right of the sliders accept floating point values from 0 to 10,
with a default value of 1.

The following shows theoretical examples of these ratios and how they affect
physical resource allocation:

- `8 physical CPU cores  * 1 multiplier     = 8 virtual CPU cores`
- `8 physical CPU cores  * 0.5 multiplier   = 4 virtual CPU cores`
- `32 physical CPU cores * 10.0 multiplier  = 320 virtual CPU cores`
- `128GB physical Memory  * 5.5 multiplier  = 704G virtual Memory`

![pod configuration][img__pod-compose-config]

Overcommitting resources allows a user to compose many MAAS-managed VMs without
worrying about the physical limitations of the host. For example, on a physical
host with 4 cores and 12 GB of memory, you could compose 4 virsh nodes, each
using 2 cores and 4 GB of memory, obviously over-committing the available
physical resources. Provided you never run all 4 simultaneously, you'd have all
the benefits of MAAS-managed VMs without over-taxing your host.

### Compose a pod machine

While on a pod's details view, begin the machine composition process by
selecting 'Compose' from the 'Take action' dropdown menu:

![pod compose machine][img__pod-compose-machine]

Fill in the fields (many are optional) and hit 'Compose machine' to finish. You
will be brought back to the pod's details view. In a few moments the new
machine will be auto-commissioned.

The main 'Machines' page should reflect this as well.

As expected, the new machine's resources will be deducted from the pod's
resources:

![pod compose machine commissioning][img__pod-compose-machine-commissioning]

### Decompose a pod machine

Decomposing a pod machine means to send the machine's resources back to the pod
for reuse. Doing so within MAAS will also cause the corresponding MAAS node to
be Deleted.

While on a pod's details view, select the machine to decompose and choose the
'Delete' button from the dropdown menu:

![pod decompose machine][img__pod-decompose-machine]

Confirm by hitting the 'Delete machine' button.

!!! Note:
    This operation can also be achieved by simply deleting the corresponding
    MAAS node in the regular way.

Once done, you will be transported back to the main 'Machines' page.

### Delete a pod

While on the main pods page, select a pod and choose the 'Delete' action from
the dropdown menu. Hit 'Delete 1 pod' to confirm the action:

![pod delete][img__pod-delete]

Deleting a pod will also decompose all its machines, thereby also removing all
corresponding nodes from MAAS.



<!-- LINKS -->


[img__kvmpoddeploy]: ../media/manage-kvm-pods__2.5_kvm-pod-deploy.png
[img__storagepoolusage]: ../media/manage-kvm-pods__2.5_libvirt_storage_usage.png
[img__storagepoolavail]: ../media/manage-kvm-pods__2.5_libvirt_storage.png

[img__pod-initial-page]: ../media/manage-kvm-pods__2.5_pod-initial-page.png
[img__pod-add-rsd]: ../media/manage-kvm-pods__2.5_pod-add-rsd.png
[img__pod-add-virsh]: ../media/manage-kvm-pods__2.5_pod-add-virsh.png
[img__pod-list]: ../media/manage-kvm-pods__2.5_pod-list.png
[img__pod-details]: ../media/manage-kvm-pods__2.5_pod-details.png
[img__pod-compose-config]: ../media/manage-kvm-pods__2.5_pod-compose-config.png
[img__pod-compose-machine]: ../media/manage-kvm-pods__2.5_pod-compose-machine.png
[img__pod-compose-machine-commissioning]: ../media/manage-kvm-pods__2.5_pod-compose-machine-commissioning.png
[img__pod-decompose-machine]: ../media/manage-kvm-pods__2.5_pod-decompose-machine.png
[img__pod-delete]: ../media/manage-kvm-pods__2.5_pod-delete.png

[cli-compose-with-storage]: manage-cli-comp-hw.md#compose-pod-machines
[cli-deploy-kvm]: manage-cli-common.md#deploy-a-node
[juju]: https://docs.jujucharms.com
[webui]: installconfig-webui.md
