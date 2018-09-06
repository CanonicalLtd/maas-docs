Title: Pods
TODO:  
table_of_contents: True


# Pods

Pods, or composable hardware, allow for the dynamic composition of nodes from a pool
of available hardware resources (e.g. disk space, memory, cores).

This enables a machine request to be made without having machines pre-built.
Modeling tools, such as [Juju][about-juju], can leverage this functionality
when requesting a machine from MAAS, which will dynamically **create** and
Deploy one. Machines can also be requested directly from within MAAS.

MAAS currently supports two such architectures:

- Intel Rack Scale Design (RSD)
- Virsh (KVM)

!!! Note:
    For RSD, MAAS has only been validated to work with Intel RSD reference
    software release v.1.2.5, based on Redfish API v.1.0 and RSD PODM API v.1.0.

See [MAAS CLI - Composable hardware][cli-comp-hw] for how to manage composable
hardware with the CLI.

## Virsh pods

### Networking

When using Virsh pods, the KVM host will typically have a network bridge set up with
a libvirt network configured to use it.

Alternatively, if KVM and MAAS reside on the same system, the default NAT
libvirt network can be used by disabling DHCP on it and enabling MAAS DHCP on
the VLAN associated with the libvirt subnet of 192.168.122.0/24. MAAS will
first look for a libvirt network named 'maas', then for 'default'.

MAAS supports more complex methods for assigning interfaces to pods. Open the
following section for more information.

<details>

<summary>Use the MAAS CLI to manage VM interfaces</summary>

&nbsp;

Using the CLI and the `interfaces` constraint, you can compose virtual machines
with interfaces, allowing the selection of pod NICs. The `interfaces` constraint
is available in the [`machines allocate`][api-allocate] or [`pod
compose`][api-compose] endpoints.

If you don't specify an `interfaces` constraint, MAAS maintains backward
compatibility by checking for a `maas` network, then a `default` network to
which to connect the virtual machine.

If you specify an `interfaces` constraint, MAAS creates a `bridge` or `macvlan`
attachment to the networks that match the given constraint. MAAS prefers `bridge`
interface attachments when possible, since this typically results in successful
communication.

#### Interface constraint examples

Consider the following interfaces constraint:

```
interfaces=eth0:space=maas,eth1:space=storage
```

Assuming the pod is deployed on a machine or controller with access to the
`maas` and `storage` [spaces][spaces], MAAS will create an `eth0` interface
bound to the `maas` space and an `eth1` interface bound to the `storage` space.

Another example tells MAAS to assign unallocated IP addresses:

```
interfaces=eth0:ip=192.168.0.42
```

MAAS automatically converts the `ip` constraint to a VLAN constraint (for the
VLAN where its subnet can be found) and assigns the IP address to the
newly-composed machine upon allocation.

See the [MAAS API documentation][api-allocate] for a list of all constraint
keys.

</details>

### Storage

Virsh pods can optionally use a default *storage pool*. This feature uses
storage tags to map a storage pool in libvirt with a storage tag in MAAS.

- With no default storage pool defined, MAAS selects the storage pool with the
  most available space.
- When a default storage pool is defined, all machines subsequently composed
  within the pod will have their storage block devices created from the default
  storage pool.

See [libvirt storage][about-libvirt-storage] for more information.

<details>
<summary>Use the MAAS CLI to track libvirt storage pools.</summary>

&nbsp;

Retrieve pod storage pool information with the following command:

```
maas $PROFILE pod read $POD_ID
```

Where `$PROFILE` is your MAAS login id and `$POD_ID` is the integer ID of your
pod. The output contains a list of storage pools associated with your pod and
contains usage information.

Example:

```
Success.
Machine-readable output follows:
{
    "used": {
        "cores": 50,
        "memory": 31744,
        "local_storage": 63110426112
    },
    "name": "more-toad",
    "id": 5,
    "available": {
        "cores": 5,
        "memory": 4096,
        "local_storage": 153199988295
    },
    "architectures": [],
    "cpu_over_commit_ratio": 1.0,
    "storage_pools": [
        {
            "id": "pool_id-zvPk9C",
            "name": "name-m0M4ZR",
            "type": "lvm",
            "path": "/var/lib/name-m0M4ZR",
            "total": 47222731890,
            "used": 17226931712,
            "available": 29995800178,
            "default": true
        },
        {
            "id": "pool_id-qF87Ps",
            "name": "name-ZMaIta",
            "type": "lvm",
            "path": "/var/lib/name-ZMaIta",
            "total": 98566956569,
            "used": 15466229760,
            "available": 83100726809,
            "default": false
        },
        {
            "id": "pool_id-a6lyw5",
            "name": "name-RmDPfs",
            "type": "lvm",
            "path": "/var/lib/name-RmDPfs",
            "total": 70520725948,
            "used": 30417264640,
            "available": 40103461308,
            "default": false
        }
    ],
    "total": {
        "cores": 55,
        "memory": 35840,
        "local_storage": 216310414407
    },
    "tags": [],
    "type": "virsh",
    "memory_over_commit_ratio": 1.0,
    "pool": {
        "name": "default",
        "description": "Default pool",
        "id": 0,
        "resource_uri": "/MAAS/api/2.0/resourcepool/0/"
    },
    "zone": {
        "name": "default",
        "description": "",
        "id": 1,
        "resource_uri": "/MAAS/api/2.0/zones/default/"
    },
    "capabilities": [
        "dynamic_local_storage",
        "composable"
    ],
    "host": {
        "system_id": null,
        "__incomplete__": true
    },
    "default_macvlan_mode": null,
    "resource_uri": "/MAAS/api/2.0/pods/5/"
}
```

</details>

### Supported architectures

MAAS KVM pods support `i386`-, `amd64`-, `ppc64el`- and `arm64`-based
architectures, provided hypervisors for these architectures are running at least
Ubuntu 18.04.  MAAS KVM pods running on `amd64` support older versions of
Ubuntu.

## Web UI

See [Web UI][webui] for how to get started with the web UI.

Composable hardware systems are managed on the 'Pods' page, which is initially
empty:

![initial pods page][img__pod-initial-page]


### Add a Pod

Add/register a Pod by using the 'Add pod' button.

The first example depicts an RSD Pod being added. After choosing 'Rack Scale
Design' for 'Pod type' the below form will appear:

![add RSD pod][img__pod-add-rsd]

Fill in the fields. You will need to get values for 'Pod address' (IP address
or URL followed by a port), 'Pod user', and 'Pod password' from the RSD
administrator. Then click 'Save pod'.

Once added, MAAS will automatically discover and store the resources that a
Pod contains. Any pre-composed machines will also appear on the 'Machines' page
and be commissioned. 

#### Virsh pods

This is how a virsh pod is added:

![add Virsh pod][img__pod-add-virsh]


### List Pods

The new Pod, including a summary of contained resources, will be listed on the
'Pods' page:

![save pod][img__pod-list]

### View Pod details

Clicking a Pod's name on the 'Pods' page will reveal the resources contained
within it, including its total number of CPU cores, the amount of total RAM and
local storage. These values update to reflect usage and remaining resources.

The main view also lists the machines contained within the pod.

![pod details][img__pod-details]

### Configuration

Pods have several configuration options. These are modified by selecting the
'Configuration' tab and clicking 'Edit'. Options include a pod's location,
password, network zone.

On Virsh pods, you can also change the default storage pool. Additionally, two
sliders are used to set *over commit* ratio multipliers for CPU and memory
resources.

Over committed resources are those allocated beyond what's available in the
physical resource. These sliders allow you to strictly limit whether CPU and
memory can be over committed, and to what extent. The input fields to the right
of the sliders accept floating point values from 0 to 10, with a default value
of 1.

The following shows theoretical examples of these ratios and how they affect
physical resource allocation:

- `8 physical CPU cores  * 1 multiplier     = 8 virtual CPU cores`
- `8 physical CPU cores  * 0.5 multiplier   = 4 virtual CPU cores`
- `32 physical CPU cores * 10.0 multiplier  = 320 virtual CPU cores`
- `128GB physical Memory  * 5.5 multiplier  = 704G virtual Memory`

![pod configuration][img__pod-compose-config]

### Compose Pod machine

While on a Pod's details view, begin the machine composition process by
selecting 'Compose' from the 'Take action' dropdown menu:

![pod compose machine][img__pod-compose-machine]

Fill in the fields (many are optional) and hit 'Compose machine' to finish. You
will be brought back to the Pod's details view. In a few moments the new
machine will be auto-commissioned.

The main 'Machines' page should reflect this as well.

As expected, the new machine's resources will be deducted from the Pod's
resources:

![pod compose machine commissioning][img__pod-compose-machine-commissioning]

### Decompose a Pod machine

Decomposing a Pod machine means to send the machine's resources back to the Pod
for reuse. Doing so within MAAS will also cause the corresponding MAAS node to
be Deleted.

While on a Pod's details view, select the machine to decompose and choose the
'Delete' button from the dropdown menu:

![pod decompose machine][img__pod-decompose-machine]

Confirm by hitting the 'Delete machine' button.

!!! Note:
    This operation can also be achieved by simply deleting the corresponding
    MAAS node in the regular way.

Once done, you will be transported back to the main 'Machines' page.

### Delete a Pod

While on the main Pods page, select a Pod and choose the 'Delete' action from
the dropdown menu. Hit 'Delete 1 pod' to confirm the action:

![pod delete][img__pod-delete]

Deleting a Pod will also decompose all its machines, thereby also removing all
corresponding nodes from MAAS.


<!-- LINKS -->

[api-allocate]: api.md#post-maasapi20machines-opallocate
[api-compose]: api.md#post-maasapi20podsid-opcompose
[spaces]: intro-concepts.md#spaces
[cli-comp-hw]: manage-cli-comp-hw.md
[about-juju]: https://jujucharms.com/docs/stable/about-juju
[webui]: installconfig-webui.md
[launchpad-bug-1688066]: https://bugs.launchpad.net/maas/+bug/1688066
[virsh-pods]: nodes-comp-virsh.md
[about-libvirt-storage]: https://libvirt.org/storage.html

[img__pod-initial-page]: ../media/nodes-comp-hw__2.4_pod-initial-page.png
[img__pod-add-rsd]: ../media/nodes-comp-hw__2.4_pod-add-rsd.png
[img__pod-add-virsh]: ../media/nodes-comp-hw__2.4_pod-add-virsh.png
[img__pod-list]: ../media/nodes-comp-hw__2.4_pod-list.png
[img__pod-details]: ../media/nodes-comp-hw__2.4_pod-details.png
[img__pod-compose-config]: ../media/nodes-comp-hw__2.4_pod-compose-config.png
[img__pod-compose-machine]: ../media/nodes-comp-hw__2.4_pod-compose-machine.png
[img__pod-compose-machine-commissioning]: ../media/nodes-comp-hw__2.4_pod-compose-machine-commissioning.png
[img__pod-decompose-machine]: ../media/nodes-comp-hw__2.4_pod-decompose-machine.png
[img__pod-delete]: ../media/nodes-comp-hw__2.4_pod-delete.png
