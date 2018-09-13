Title: CLI Composable Hardware
table_of_contents: True


# CLI Composable Hardware

This is a list of composable hardware tasks which can be performed with the
MAAS CLI. See [MAAS CLI][manage-cli] for how to get started with the CLI and
[Composable hardware][composable-hardware] for an overview of the subject,
including important details on the differences between *RSD* pods and *Virsh*
pods.


## Register a Pod

To register/add a Pod:

```bash
maas $PROFILE pods create type=$POD_TYPE power_address=$POWER_ADDRESS \
	[power_user=$USERNAME] [power_pass=$PASSWORD] [zone=$ZONE] \
	[tags=$TAG1,$TAG2,...]
```

In the case of the Virsh power type, both USERNAME and PASSWORD are optional.
ZONE and TAGS are optional for all pods.


For example, to create an RSD pod:

```bash
maas $PROFILE pods create type=rsd power_address=10.3.0.1:8443 \
	power_user=admin power_pass=admin
```

And to create a Virsh pod:

```bash
maas $PROFILE pods create type=virsh power_address=qemu+ssh://ubuntu@192.168.1.2/system
```

See [Pod configuration][over-commit] for details on Virsh over commit ratios
and storage pools, as used in the following examples.

Create a Virsh pod with over commit ratios:

```bash
maas $PROFILE pods create type=virsh power_address=qemu+ssh://ubuntu@192.168.1.2/system \
        power_pass=example cpu_over_commit_ratio=0.3 memory_over_commit_ratio=4.6
```

Create a Virsh pod that uses a default storage pool:

```bash
maas $PROFILE pods create type=virsh power_address=qemu+ssh://ubuntu@192.168.1.2/system \
        power_pass=example default_storage_pool=pool1
```


## List resources of all Pods

List the resources of all Pods:

```bash
maas $PROFILE pods read
```

For example, this will grab Pod IDs (POD_ID) and their MAAS names:

```bash
maas $PROFILE pods read | grep -A6 id
```

Sample output:

```no-highlight
        "id": 93,
        "capabilities": [
            "composable",
            "fixed_local_storage",
            "iscsi_storage"
        ],
        "name": "civil-hermit",
```

## List resources of a Pod

To list an individual Pod's resources:

```bash
maas $PROFILE pod read $POD_ID
```


## Update Pod configuration

Update over commit ratios for a Virsh pod:

```bash
maas $PROFILE pod update $POD_ID power_address=qemu+ssh://ubuntu@192.168.1.2/system \
        power_pass=example cpu_over_commit_ratio=2.5 memory_over_commit_ratio=10.0
```

Update the default storage pool used by a Virsh pod:

```bash
maas $PROFILE pod update $POD_ID power_address=qemu+ssh://ubuntu@192.168.1.2/system \
        power_pass=example default_storage_pool=pool2
```


## List Pod connection parameters

To list a Pod's connection parameters:

```bash
maas $PROFILE pod parameters $POD_ID
```

Example output:

```no-highlight
{
    "power_address": "10.3.0.1:8443",
    "power_pass": "admin",
    "power_user": "admin"
}
```


## Compose Pod machines

To compose a Pod's machines:

```bash
maas $PROFILE pod compose $POD_ID
```

Example output for default composing:

```no-highlight
{
    "system_id": "73yxmc",
    "resource_uri": "/MAAS/api/2.0/machines/73yxmc/"
}
```

Compose with resources specified:

```bash
maas $PROFILE pod compose $POD_ID $RESOURCES
```

Where RESOURCES is a space-separated list from:

**cores=**requested cores  
**cpu_speed=**requested minimum cpu speed in MHz  
**memory=**requested memory in MB  
**architecture=**requested architecture that Pod must support  

For example:

```bash
maas $PROFILE pod compose $POD_ID \
	cores=40 cpu_speed=2000 memory=7812 architecture="amd64/generic"
```

Compose a Virsh machine with two disks; one from *pool1* and the other from
*pool2*:

```bash
maas $PROFILE pod compose $POD_ID storage=root:32(pool1),home:64(pool2)
```

### Interface constraints

Using the `interfaces` constraint, you can compose virtual machines with
interfaces, allowing the selection of pod NICs.

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


## Compose and allocate a Pod machine

In the absence of any nodes in the 'New' or 'Ready' state, if a Pod of
sufficient resources is available, MAAS can automatically compose (add),
commission, and acquire a Pod machine. This is done with the regular `allocate`
sub-command:

```bash
maas $PROFILE machines allocate
```


## List machine parameters

The MAAS node may be a composed machine in which case its resources will be
included in the output:

```bash
maas $PROFILE machine read $SYSTEM_ID
```

## Track libvirt storage pools

Retrieve pod storage pool information with the following command:

```
maas $PROFILE pod read $POD_ID
```

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

## Decompose a Pod machine

To decompose a Pod machine by deleting the corresponding MAAS node:

```bash
maas $PROFILE machine delete $SYSTEM_ID
```

If the Pod's resources are now listed (`pod read $POD_ID`), it would be seen
that the resources for this machine are available and no longer used.


## Delete a Pod

To delete a Pod (and decompose all its machines):

```bash
maas $PROFILE pod delete $POD_ID
```


<!-- LINKS -->

[manage-cli]: manage-cli.md
[composable-hardware]: nodes-comp-hw.md
[over-commit]: nodes-comp-hw.md#configuration
