Title: Virsh Pods
table_of_contents: True


# Virsh (KVM) Pods

Virsh pods were originally created for the developers of MAAS to test and
experiment with pods.  Virsh pods are now a fully supported feature within
MAAS.  Virsh pods have several capabilities that other pod types do not and
we will be going over these capabilities in this section.

Please see [MAAS CLI][manage-cli] for how to get started with the CLI and
[Composable hardware][composable-hardware] for an overview of pods.


## Over Commit Ratios

Virsh pods are over commitable.  Overcommitment is the ability to allocate
more virtual resources than available physical resources.  MAAS has over
commit ratios which can be set by the user to limit how much over committing
should be allowed.

The physical resources with over commit ratio multipliers:

- CPU
- Memory

The over commit ratio multipliers are a floating point number that ranges from
0.0 up to 10.0 (default is 1.0).
Here are some independent examples to show the concept:

`8 physical CPU cores * 0.5 multiplier = 4 virtual CPU cores`

`32 physical CPU cores * 10.0 multiplier = 320 virtual CPU cores`

`128G physical Memory * 5.5 multiplier = 704G virtual Memory`


### Setting Over Commit Ratios

Creating a Virsh pod via the CLI:

```bash
maas $PROFILE pods create type=virsh power_address=qemu+ssh://ubuntu@192.168.1.2/system \
        power_pass=example cpu_over_commit_ratio=0.3 memory_over_commit_ratio=4.6
```

Updating a Virsh pod via the CLI:

```bash
maas $PROFILE pod update $POD_ID power_address=qemu+ssh://ubuntu@192.168.1.2/system \
        power_pass=example cpu_over_commit_ratio=2.5 memory_over_commit_ratio=10.0
```


## Default Storage Pool

In Virsh, you can have multiple storage pools.  MAAS allows you to set the
default storage pool for the pod.  When the default storage pool is set, all
subsequently composed machines within the pod will have their storage block
devices created from this default storage pool.


### Setting the Default Storage Pool

Creating a Virsh pod via the CLI:

```bash
maas $PROFILE pods create type=virsh power_address=qemu+ssh://ubuntu@192.168.1.2/system \
        power_pass=example default_storage_pool=pool1
```

Updating a Virsh pod via the CLI:

```bash
maas $PROFILE pod update $POD_ID power_address=qemu+ssh://ubuntu@192.168.1.2/system \
        power_pass=example default_storage_pool=pool2
```


## Multiple Storage Pools

In Virsh, you can have multiple storage pools.  MAAS allows you to pass storage
tags when composing a machine that will dictate which pool that block device
should come from.  Below is an example of how to compose a machine that has
several block devices coming from different pools.


### Setting Multiple Storage Pools

Composing a Virsh machine via the CLI:

```bash
maas $PROFILE pod compose $POD_ID storage=root:32(pool1),home:64(pool2)
```

This would compose a virtual machine with two disks, one from pool1 and the
other from pool2.


<!-- LINKS -->

[manage-cli]: manage-cli.md
[composable-hardware]: nodes-comp-hw.md
