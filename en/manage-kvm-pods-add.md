# Add KVM pods

## 2.5+

Once a machine as been added to MAAS and gone through enlistment, commissioning
and hardware testing, you can deploy it (after acquiring it) as a KVM host by
ticking the "Install MAAS-managed KVM Pod" checkbox:

![kvmpoddeploy][img__kvmpoddeploy]

You can also use the [MAAS CLI][cli-deploy-kvm] to deploy a machine to use as a
KVM host.


## Manual/Pre-2.5

Setting up a manual KVM host in 2.5 or in older version of MAAS requires many
more manual steps.

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

### Create a pod

Finally, you'll need to create a pod. See the [Add a pod][addapod] section for
more information about using the Web UI to do this.

<!-- LINKS -->


[img__kvmpoddeploy]: ../media/manage-kvm-pods__2.5_kvm-pod-deploy.png
[addapod]: manage-kvm-pods-webui.md#add-a-pod
[cli-deploy-kvm]: manage-cli-common.md#deploy-a-node
