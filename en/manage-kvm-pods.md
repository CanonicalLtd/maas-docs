# KVM (pod)

A MAAS KVM pod is a collection of virtual machines running on an instance of
libvirt. KVM pods are usefule for Juju integration, allowing for dynamic
allocation of VMs with custom interface constraints.  Alternatively, if you
would like to use MAAS to manage a collection of VMs, the robust web UI allows
you to easily create and manage VMs logically grouped by pod.

Features:

- Juju integration
- At-a-glance visual tools for easy resource management
- Overcommit physical resources in situations where you need to create more VMs
  that can technically run on your server
- Assign pods to resource pools to segregate your pods into logical groupings
- Track libvirt storage pool usage and assign default storage pools to your
  pods
- Create VMs in multiple subnets

## KVM pod networking

In order to enable KVM pod networking features, MAAS must be able to correlate
the IP address of a potential KVM pod host with a host already known to MAAS
(machine, controller, or device). If it cannot, as would be the case if a
machine is manually deployed and later set up as a KVM host, MAAS disallows KVM
networking features because it will not be able to apply its networking model
(VLANs, interfaces, and subnets) when configuring the hypervisor in the manually
deployed host at the time the VM is created.

The recommended way of setting up a KVM host is therefore to deploy a machine
within MAAS and tick the "Use as a KVM host" checkbox (a full explanation is
found in the following section). MAAS will automatically install KVM as well as
ensure that the network model is consistent with what is on the machine.

!!! Note:
    There are other ways of setting up KVM Pod hosts that provide easy
    management of VMs via the MAAS UI. You can, for example, install KVM
    manually on a deployed node (KVM pod networking will be limited) or on a new
    rack controller (fully featured KVM pod networking).

### Differences between MAAS 2.5 and 2.4 KVM pod networking

#### Interface constraints

One of the main difference between MAAS 2.5 and earlier versions of MAAS is the
new interface-constraints feature, which allows you to compose a VM with
specific networking requirements (a full-explanation of the feature is found in
the folowing section -- for now, knowing the feature exists is enough to
continue the discussion). When these requirements are present, MAAS is able
connect your VMs to the full range of your MAAS-configured network.

#### 2.4 and earlier

MAAS checks for the existence of a libvirt network named `maas`.  The `maas`
network typically has DHCP disabled in favor of MAAS-enabled DHCP to allow your
VMs to PXE boot. In addition, NAT port-forwarding to a physical device on the
host will allow the VMs to reach the Internet.

If MAAS cannot find a `maas` network, it will fallback to libvirt's `default`
network, which will allow VMs to connect to the Internet but *not* to PXE boot,
which is not ideal.

!!! Warning:
    Libvirt's default DHCP server, used by the `default` libvirt network,
    doesn't provide the necessary metadata required to support PXE booting.

#### 2.5+

Since 2.5, MAAS supports a more robust networking model with regard to KVM,
provided you deploy KVM host pods with the "Use as a KVM pod host" checkbox
ticked as discussed in the introduction.

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

If the pod host was deployed by MAAS for use as a KVM host as outlined above,
MAAS will skip the libvirt `maas` and `default` networks if they are not
enabled for DHCP in MAAS, instead preferring a DHCP-enabled MAAS network. This
means you don't have to manually create a MAAS-friendly libvirt network to
which to attach the VM.

If you've instead installed KVM manually on your host machine after deploying
via MAAS, MAAS will revert to its 2.4 behavior, namely trying to attach to a
suitable `maas` or `default` libvirt network, enabling PXE boot if it detects
MAAS-enabled DHCP on either.

### Bridges

#### Macvlan

Maclvan is simpler in design and uses less CPU than bridges, while at the same
time offering useful features. Setting up macvlan is outside the scope of this
document, but fortunately, macvlan is installed an enabled by default in
MAAS-deployed machines. MAAS uses macvlan if a interfaces constraint specificies
a macvlan interface when composing a VM.

You can configure the default macvlan mode of an existing pod using the CLI:

```
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

Macvlan is simpler in design than a bridge and therefore can offer better
thruput and less demand on CPU.

A bridge is better suited for situations where you have more complex network
topology or require more advanced features.

For an in-depth discussion about the differences between bridge vs. macvlan see
[here](https://hicu.be/bridge-vs-macvlan).

## Add a KVM host pod to MAAS

### 2.5

Once a machine as been added to MAAS and gone through enlistment, commissioning
and hardware testing, you can deploy it (after acquiring it) as a KVM host by
ticking the "Use as a KVM host" checkbox:

TBD: SCREENSHOT-WHEN-AVAILABLE

You can also use the [MAAS CLI][cli-deploy-kvm] to deploy a machine to use as a
KVM host.


### Manual/Pre-2.5

Setting up a manual KVM host in 2.5 or in older version of MAAS requires many
more manual steps.

#### Setting up a `maas` libvirt network

Libvirt by default creates a virtual bridge, `virbr0`, through which VMs
communicate with each other and the Internet. DHCP is supplied by libvirt so
that new VMs are automatically given an IP address. However, the libvirt DHCP
server does not supply the necessary metadata to allow for PXE booting that MAAS
requires. Therefore, you need to create a `maas` network with DHCP disabled and
NAT port-forwarding enabled. MAAS will look for this libvirt network first
before falling back to libvirt's `default` network. In that case, PXE booting
will not work.

You can set up such a `maas` network like this:

```no-highlight
cat << EOF > maas.xml
<network>
 <name>maas</name>
 <forward mode='nat'>
   <nat>
     <port start='1024' end='65535'/>
   </nat>
 </forward>
 <bridge name='virbr1' stp='off' delay='0'/>
 <domain name='testnet'/>
 <ip address='172.16.99.1' netmask='255.255.255.0'>
 </ip>
</network>
EOF
virsh net-define maas.xml
```

#### Setting up SSH

In order for MAAS to successfully communicate with libvirt on your KVM host
machine, this example command must succeed from every rack controller as user
`maas`:

```bash
virsh -c qemu+ssh://$USER@$KVM_HOST/system list --all
```

Here, `$USER` is a user on your KVM host who is a member of the `libvirtd` unix
group on the KVM host, and `$KVM_HOST` is the IP of your KVM host.

Virsh commands will be issued from rack controllers as user `maas`. Therefore,
you'll need to set up SSH public keys on every rack controller for user `maas`,
and then add those public keys to your `~/.ssh/authorized_keys` file on your KVM
host.

First, on every rack controller, the `maas` user will need an SSH keypair (with
a null passphrase) so the rack controller can query and manage KVM guests
remotely. A login shell will also be necessary when becoming user `maas` in
order for SSH to work:

```bash
sudo chsh -s /bin/bash maas
sudo su - maas
ssh-keygen -f ~/.ssh/id_rsa -N ''
```

Now, enable the `maas` user on every rack controller to log into your KVM host
without a password via public SSH keys using the `ssh-copy-id` command from
every rack controller. You will likely need to (temporarily) enable password
authentication on your KVM host for this command to work. Search for
`PasswordAuthentication` in `/etc/ssh/sshd_config` on your KVM host.

```bash
ssh-copy-id -i ~/.ssh/id_rsa $USER@$KVM_HOST
```

This command adds the rack controller's `maas` public SSH key to the KVM host
user's `~/.ssh/authorized_keys` file.

Remember, `$KVM_HOST` represents the IP address of the KVM host and `$USER`
represents a user on the KVM host with the permission to communicate with the
libvirt daemon. The latter is achieved via group membership, typically the
`libvirtd` group.

Now, as user `maas` on every rack controller, test connecting to the new KVM
host with virsh:

```bash
virsh -c qemu+ssh://$USER@$KVM_HOST/system list --all
```

This should work seamlessly because the private key does not require a
passphrase.

!!! Note:
    Insufficient permissions for `$USER` may cause the `virsh` command to fail
    with an error such as `failed to connect to the hypervisor`. Check the
    `$USER` group membership.

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
storage pool to use from a dropdown list:

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
