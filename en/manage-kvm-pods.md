# KVM (pod)

MAAS can help you to manage your virtual machines. A MAAS KVM pod is a
collection of virtual machines running on an instance of `libvirt`. You can set
up a single pod per `libvirt` instance and then use MAAS to compose as many VMs
as you need. If you have many `libvirt` instances, you can set up a pod to
control each one.

Features:

* Overcommit physical resources in situations where you need to create more VMs
  that can technically run on your server.
* Assign pods to resource pools to segregate your pods into logical groupings
* Track `libvirt` storage pool usage and assign default storage pools to your
  pods
* Create VMs in multiple subnets

## Add a KVM host (pod) to MAAS

### Add a remote KVM host (libvirt) as a MAAS KVM pod (non-MAAS deployed)

#### 2.5:

[TBD: Copy Add-a-pod section from https://docs.maas.io/2.5/en/nodes-comp-hw]

#### 2.4

[TBD: Combine the network setup here
https://tutorials.ubuntu.com/tutorial/create-kvm-pods-with-maas#3 with
https://docs.maas.io/2.4/en/nodes-add#kvm-guest-nodes]

## Adding a machine in MAAS as a KVM host

### Deploying a machine in MAAS as a KVM Pod

While not yet available via the MAAS web UI or MAAS CLI, you can tell MAAS to
deploy a KVM-pod-ready machine. Once MAAS has enlisted, commissioned and
hardware-tested the machine, and it’s ready to deploy, you can tell MAAS to
install KVM during deployment via the [MAAS
API](https://docs.maas.io/2.5/en/api#post-maasapi20machinessystem_id-opdeploy).

!!! Note:
    The MAAS UI and CLI will soon support this feature.


In order to support full KVM pod networking, MAAS will bridge all available
interfaces on the physical machine.

### Converting a MAAS deployed machine into a KVM Pod

#### 2.5

MAAS does not install KVM by default on deployed nodes so you’ll need to
install KVM:


```bash
[TBD: Install kvm instructions]
```

You can then use macvlan (depending on how you configure it) to connect
physical interfaces to VMs.

[Based on a quick look in the code, KVM is not installed by default, so this
section also needs a bit about how to install KVM, right?]

#### 2.4

[TBD: KVM needs to be installed and a bridge needs setting up, like above:
https://tutorials.ubuntu.com/tutorial/create-kvm-pods-with-maas#3 and
https://docs.maas.io/2.4/en/nodes-add#kvm-guest-nodes]

## Storage pools

`libvirt` “storage pools” are storage resources managed by `libvirt`. For a
more in-depth take on `libvirt` storage pools, see
[here](https://libvirt.org/storage.html). 

MAAS detects available `libvirt` storage pools. You can choose which storage
pool to use when composing a new VM within a MAAS pod.

In the Storage configuration section:

[storagepool][img__storagepool]

[TBD: Add CLI command from
https://docs.maas.io/2.5/en/manage-cli-comp-hw#compose-pod-machines: `maas
admin pod compose storage=root:32(pool1),home:64(pool2)` and explain that
“root” and “home” are labels -- undocumented in the API so all values needed
there, :NN is size in GB (presumably) and “pool1” and “pool2” are tags]

## Networking

Networking virtual machines is a complex topic, so only two options will be
discussed here, as they are typical options.  Using a libvirt network

### 2.5+

Best practice is to use MAAS to deploy a machine to act as a KVM host. In this
case, MAAS automatically bridges all interfaces on a deployed physical server
so that KVM pods can communicate with one another and the Internet.

If you are using a server that MAAS didn’t deploy as a remote KVM host, you’ll
need to set up networking manually so that VMs you create inside a MAAS pod can
communicate with MAAS, other pods, and the Internet. See the following section
for more information.

Beginning with 2.5, MAAS first checks if DHCP is enabled in the network used by
the KVM MAAS host, if it is, PXE booting is disabled. If, however, there is an
available network known to have DHCP enabled within MAAS, MAAS will default to
use that network.

### Manual/2.3/2.4

`libvirt` by default creates a virtual bridge, virbr0, through which VMs
communicate with each other and the Internet. DHCP is supplied so that new VMs
are automatically given an IP address. 

Typically, DHCP should be disabled in whatever libvirt network MAAS attaches
to. MAAS looks for a `maas` libvirt network first and attaches to that if it
exists. If not, MAAS defaults to the `default` network. DHCP should then be
subsequently enabled within MAAS in order to allow for PXE booting. 

One approach to setting up a `libvirt` network is to set up a virtual bridge
similar to the default, except without DHCP. If this network connection is
named `maas`, MAAS will connect to it automatically when run inside a virtual
machine. The same applies to running MAAS inside an LXD container. You can set
up a network:

E.g.:


```
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

## Bridges

### Macvlan

Maclvan is simpler in design and use less CPU than bridges, while at the same
time offering useful features. Setting up macvlan is outside the scope of this
document, but once it is set up, you can use the MAAS CLI to configure the
default macvlan mode of a pod:

```
maas $PROFILE pod update <pod-id> host=<host> default_macvlan_mode=<mode>
```

Where:

`pod-id`: the pod’s MAAS ID
`host`: the IP or hostname of the `libvirt` instance
`default_macvlan_mode`: 
	1. `private`: VMs with the same parent interface cannot communicate but can
        reach destinations outside the parent interface
	2. `vepa`: VM communication is forwarded through the parent interface and
        reflected back if the source and destination of the packet is local to the VMs.
        VMs can reach destinations outside the parent interface. Note that this
        requires a VEPA switching mechanism.
	3. `bridge`: Inter-VM communication is maintained locally (behind the
        parent interface) and destinations outside are forwarded through the parent
        interface.
	4. `passthru`: Allows a single VM to be connected directly to the parent
       interface, which in turn allows the VM to change MAC addresses and other
       interface parameters.


### Bridge vs. macvlan

Because macvlan uses less CPU and provides better thruput, use it when you want
to let VMs reach the internet and not each other.

A bridge is better suited for situations where you need to connect VMs on the
same host or you need more complex network topologies or requirements.

For an in-depth discussion about the differences between bridge vs. macvlan see
[here](https://hicu.be/bridge-vs-macvlan).
