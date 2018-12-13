Title: Add a KVM h ost
TODO:  
table_of_contents: True

# Add a KVM host

After installing MAAS, the 'Pods' page is typically empty:

![initial pods page][img__pod-initial-page]

## 2.5+

Once a machine as been added to MAAS and gone through enlistment, commissioning
and hardware testing, you can deploy it (after acquiring it) as a KVM host by
ticking the 'Install MAAS-managed KVM Host' checkbox:

![kvmpoddeploy][img__kvmpoddeploy]

### CLI

Once a machine has been enlisted, commissioned, and acquired, you can tell MAAS
to deploy it as a KVM host:

```bash
maas $PROFILE machine deploy <system_id> install_kvm=True
```

## Manual/Pre-2.5

Setting up a manual KVM host in 2.5 or on an older version of MAAS requires more
steps.

### Set up a `maas` libvirt network

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

### Set up SSH

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


### Add

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

#### Add with CLI

Create a KVM host:

```bash
maas $PROFILE pods create type=virsh power_address=qemu+ssh://ubuntu@192.168.1.2/system
```

Create a KVM host with [overcommitted resources][over-commit]:

```bash
maas $PROFILE pods create type=virsh power_address=qemu+ssh://ubuntu@192.168.1.2/system \
        power_pass=example cpu_over_commit_ratio=0.3 memory_over_commit_ratio=4.6
```

Create a KVM host that uses a default [storage pool][storagepools]:

```bash
maas $PROFILE pods create type=virsh power_address=qemu+ssh://ubuntu@192.168.1.2/system \
        power_pass=example default_storage_pool=pool1
```

## Configuration

KVM hosts have several configuration options. Modify these by selecting the
'Configuration' tab and clicking 'Edit'. Options include a KVM host's location,
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

<!-- LINKS -->

[img__pod-compose-config]: ../media/manage-kvm-pods__2.5_pod-compose-config.png
[img__pod-initial-page]: ../media/manage-kvm-pods__2.5_pod-initial-page.png
[img__kvmpoddeploy]: ../media/manage-kvm-pods__2.5_kvm-pod-deploy.png
[img__pod-add-virsh]: ../media/manage-kvm-pods__2.5_pod-add-virsh.png

[over-commit]: #overcommit-resources
[storagepools]: manage-kvm-storage.md

