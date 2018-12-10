Title: Manage pods
TODO:  
table_of_contents: True

# Manage pods

See [Web UI][webui] for how to get started with the web UI.

## Add a KVM host

After installing MAAS, the 'Pods' page is typically empty:

![initial pods page][img__pod-initial-page]

### 2.5+

Once a machine as been added to MAAS and gone through enlistment, commissioning
and hardware testing, you can deploy it (after acquiring it) as a KVM host by
ticking the 'Install MAAS-managed KVM Host' checkbox:

![kvmpoddeploy][img__kvmpoddeploy]

You can also use the [MAAS CLI][cli-deploy-kvm] to deploy a machine to use as a
KVM host.

### Manual/Pre-2.5

Setting up a manual KVM host in 2.5 or on an older version of MAAS requires more
steps.

#### Set up a `maas` libvirt network

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

#### Set up SSH

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


#### Add

Now, add a KVM host by using the 'Add pod' button. Choose 'Virsh (Virtual
systems)' from the 'Pod type' drop-down menu.

![add Virsh pod][img__pod-add-virsh]

Here, 'Virsh address' typically looks like the following:

```no-highlight
qemu+ssh://<kvm host IP>/system
```

!!! Note:
    MAAS will automatically discover and store the resources your KVM host
    contains. Any existing machines will also appear on the 'Machines' page and
    be commissioned.

## Add an RSD Pod

Add an RSD Pod by using the 'Add pod' button. Choose 'Rack Scale Design' from
the Pod type drop-down menu.

![add RSD pod][img__pod-add-rsd]

You will need to get values for 'Pod address' (IP address or URL followed by a
port), 'Pod user', and 'Pod password' from your RSD administrator.

!!! Note:
    MAAS will automatically discover and store the resources your RSD Pod
    contains.

## List pods

Pods and a summary of their resources are listed on the 'Pods' page:

![save pod][img__pod-list]

## View pod details

One the 'Pods' page, click a pod's name to show the resources that belong to it,
including total number of CPU cores, the amount of total RAM and local storage.
These values update to reflect usage and remaining resources.

The main view also lists the machines contained within the pod.

![pod details][img__pod-details]

## KVM host storage pools

Libvirt “storage pools” are storage resources managed by libvirt. For a
more in-depth take on libvirt storage pools, see
[here](https://libvirt.org/storage.html).

MAAS displays information about each pod's storage pools so you can understand
your resource usage at a glance:

![storagepoolusage][img__storagepoolusage]


## Configuration

Pods have several configuration options. Modify these by selecting the
'Configuration' tab and clicking 'Edit'. Options include a pod's location,
password, network zone, and default resource pool.

![pod configuration][img__pod-compose-config]

### Overcommit resources

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

Overcommitting resources allows a user to compose many MAAS-managed machines without
worrying about the physical limitations of the host. For example, on a physical
host with 4 cores and 12 GB of memory, you could compose 4 virsh nodes, each
using 2 cores and 4 GB of memory, obviously over-committing the available
physical resources. Provided you never run all 4 simultaneously, you'd have all
the benefits of MAAS-managed VMs without over-taxing your host.

## Compose a machine

While on a pod's details view, select 'Compose' from the 'Take action' drop-down
menu to compose a machine.

![pod compose machine][img__pod-compose-machine]

You can choose which storage pool to use from a drop-down list:

![storagepoolavail][img__storagepoolavail]

You can also use the [MAAS CLI][cli-compose-with-storage] to compose pod VMs
with specific storage pool constraints.

Click the 'Compose machine' button when you're finished. MAAS will present the pod
detail view. In a few moments, your new machine will be auto-commissioned. The
'Machines' page will reflect this as well.

The new machine's resources will be deducted from the pod's resources:

![pod compose machine commissioning][img__pod-compose-machine-commissioning]

## Delete a machine

To delete a machine, simply delete it as you would any other MAAS node.  Select
the desired machine from the list of machines and select 'Delete' from the 'Take
Action' menu.

![pod decompose machine][img__pod-decompose-machine]

## Delete a pod

While on the main pods page, select a pod and choose the 'Delete' action from
the 'Take action' dropdown menu. Click 'Delete 1 pod' to confirm the action:

![pod delete][img__pod-delete]

!!! Warning:
    Deleting a pod will also delete all its machines and remove them from MAAS.

<!-- LINKS -->


[img__pod-initial-page]: https://assets.ubuntu.com/v1/c1698d33-manage-kvm-pods__2.5_pod-initial-page.png
[img__pod-add-rsd]: https://assets.ubuntu.com/v1/2604a48b-nodes-comp-hw__2.4_pod-add-rsd.png
[img__pod-add-virsh]: https://assets.ubuntu.com/v1/ca39b7a1-manage-kvm-pods__2.5_pod-add-virsh.png
[img__pod-list]: https://assets.ubuntu.com/v1/6a1e0fc2-manage-kvm-pods__2.5_pod-list.png
[img__pod-details]: https://assets.ubuntu.com/v1/458b90b6-manage-kvm-pods__2.5_pod-details.png
[img__pod-compose-config]: https://assets.ubuntu.com/v1/50c94029-manage-kvm-pods__2.5_pod-compose-config.png
[img__pod-compose-machine]: https://assets.ubuntu.com/v1/62316284-manage-kvm-pods__2.5_pod-compose-machine.png
[img__pod-compose-machine-commissioning]: https://assets.ubuntu.com/v1/0047fe3d-manage-kvm-pods__2.5_pod-compose-machine-commissioning.png
[img__pod-decompose-machine]: https://assets.ubuntu.com/v1/613c1d7b-manage-kvm-pods__2.5_pod-decompose-machine.png
[img__pod-delete]: https://assets.ubuntu.com/v1/55498a64-manage-kvm-pods__2.5_pod-delete.png
[img__kvmpoddeploy]: https://assets.ubuntu.com/v1/d7271011-manage-kvm-pods__2.5_kvm-pod-deploy.png
[img__kvmpoddeploy]: https://assets.ubuntu.com/v1/d7271011-manage-kvm-pods__2.5_kvm-pod-deploy.png
[img__storagepoolusage]: https://assets.ubuntu.com/v1/984dcd91-manage-kvm-pods__2.5_libvirt_storage_usage.png
[img__storagepoolavail]: https://assets.ubuntu.com/v1/a026986c-manage-kvm-pods__2.5_libvirt_storage.png

[composevm]: manage-kvm-pods-webui.md#compose-a-virtual-machine
[cli-compose-with-storage]: manage-cli-comp-hw.md#compose-pod-virtual-machines
[cli-deploy-kvm]: manage-cli-common.md#deploy-a-node
[setup-ssh]: manage-kvm-pods-add.html#set-up-ssh
[kvmdeploy]: manage-kvm-pods-add.md
[manualkvm]: manage-kvm-pods-add.md#manual/pre-2.5
[cli-compose-with-storage]: manage-cli-comp-hw.md#compose-pod-machines
[storagepools]: manage-kvm-pods-storage-pools.md
[webui]: installconfig-webui.md
