Title: Storage

# Storage

MAAS has the ability to configure any storage layout during node deployment.
MAAS doesn't just do simple partitioning - it supports complex storage layouts,
including setting up and configuring Bcache, RAID, and LVM. This gives users
unlimited possibilities on the storage configurations they want to deploy.

## Layouts

When a node is acquired by a user it gets a default storage layout. This
layout provides the basic storage configuration to allow a node to deploy
successfully. The default storage layout can also be adjusted allowing an
administrator to make the decision on which layout will be the default.

The users deploying nodes are not limited by the default. They can set an
explicit storage layout when they acquire a node or after they have acquired a
node with the set-storage-layout API. The user acquiring a node or performing
the set-storage-layout API calls can also customize the layout generation.
Each layout has a set of options that can be set to adjust the generated
layout.

### LVM Layout

The 'LVM Layout' creates a volume group vgroot on a partition that spans the
entire boot disk.  A logical volume lvroot is created for the full size of the
volume group. The lvroot is formatted with ext4 and set as the / mount point:



| Name      | Size     | Type  | Filesystem Type       | Mount point  |
|:----------|----------|-------|---------------|--------------|
| sda       | 100G     | disk  |               |              |
| sda1      | 512M     | part  | fat32         | /boot/efi    |
| sda2      | 99.5G    | part  | lvm-pv(vgroot)|              |
| vgroot    | 99.5G    | lvm   |               |              |
| lvroot    | 99.5G    | lvm   | ext4          |  /           |

The following options are supported for this layout. :

`boot_size`: Size of the boot partition on the boot disk. Default is 0, meaning not to
create the boot partition. The '/boot' will be placed on the root filesystem.

`root_device`: The block device to place the root partition on. Default is the boot disk.

`root_size`: Size of the root partition. Default is 100%, meaning the entire size of the
root device.

`vg_name`: Name of the created volume group. Default is `vgroot`.

`lv_name`: Name of the created logical volume. Default is `lvroot`.

`lv_size`: Size of the created logical volume. Default is 100%, meaning the entire size of
the volume group.

### Flat Layout

With a 'Flat Layout', MAAS creates a partition that spans the entire boot disk. The partition is
formatted with ext4 and set as the / mount point:

| Name      | Size     | Type  | Filesystem Type       | Mount point  |
|:----------|----------|-------|---------------|--------------|
| sda       | 100G     | disk  |               |              |
| sda1      | 512M     | part  | fat32         | /boot/efi    |
| sda2      | 99.5G    | part  | ext4          | /            |


The following options are supported for this layout. :

`boot_size`: Size of the boot partition on the boot disk. Default is 0,
	meaning not to create the boot partition. The '/boot' will be placed on
the root filesystem.
    
`root_device`: The block device to place the root partition on. Default is the
boot disk.
    
`root_size`: Size of the root partition. Default is 100%, meaning the entire
size of the root device.

### Bcache Layout

A 'Bcache Layout' will create a partition that spans the entire boot disk as
the backing device. It uses the smallest block device tagged with 'ssd' as the
cache device. The Bcache device is formatted with ext4 and set as the / mount
point.  If no block devices exists on the node that are tagged with 'ssd' then
the Bcache device will not be created and the 'Flat Layout' will be used
instead:

| Name      | Size     | Type  | Filesystem Type       | Mount point  |
|:----------|----------|-------|---------------|--------------|
| sda       | 100G     | disk  |               |              |
| sda1      | 512M     | part  | fat32         | /boot/efi    |
| sda2      | 99.5G    | part  | bc-backing    |              |
| sdb (ssd) | 50G      | disk  |               |              |
| sdb1      | 50G      | part  | bc-cache      |              |
| bcache0   | 99.5G    | disk  | ext4          | /            |

The following options are supported for this layout. :

`boot_size`: Size of the boot partition on the boot disk. Default is 0, meaning
not to create the boot partition. The '/boot' will be placed on the root
filesystem.

`root_device`: The block device to place the root partition on. Default is the
boot disk.

`root_size`: Size of the root partition. Default is 100%, meaning the entire
size of the root device.

`cache_device`: The block device to use as the cache device. Default is the
smallest block device tagged ssd.

`cache_mode`: The cache mode to set the created Bcache device to. Default is
`writethrough`.

`cache_size`: The size of the partition on the cache device. Default is 100%,
meaning the entire size of the cache device.

`cache_no_part`: Whether or not to create a partition on the cache device.
Default is false, meaning to create a partition using the given `cache_size`.
If set to true no partition will be created and the raw cache device will be
used as the cache.

!!! Note: The /boot/efi partition on all layouts will only be created on nodes
that deploy with UEFI.

## Setting the Layout

It's also possible to change the storage layout either globally, on acquire, or
after acquire.

### Globally

The global default storage layout can be set using either the API or the web
interface. From the web interface, for example, look for 'Default Storage Layout' on the
settings page:

![default storage](./media/storage_global_layout.png)

To change the default storage layout from the command line, you would enter the
following:

```bash
maas admin maas set-config name=default_storage_layout value=flat
```
If this command is successful, you will see the following output:

```bash
Success.
Machine-readable output follows:
OK
```

For the default storage layout to apply, a node will need will need to be in
the 'Ready' state, before being acquired. 

### Per node

If a node is already acquired and you want to adjust the storage layout the
`set_storage_layout API` call can be used:

```bash
maas admin machine set-storage-layout <node-id> storage_layout=lvm lv_size=<size>
```
!!! Warning: This will completely remove any previous storage configuration on all
block devices.

## Block Devices

Once the initial storage layout has been configure on a node you can perform
many operations to view and adjust the entire storage layout for the node. In
MAAS there are two different types of block devices.

**Physical**

A physical block device is a physically attached block device such as a 100GB
hard drive connected to a server.

**Virtual**

A virtual block device is a block device that is exposed by the Linux kernel
when an operation is performed. Almost all the operations on a physical block
device can be performed on a virtual block device, such as a RAID device exposed
as md0.

### List Block Devices

To view all block devices on a node use the read operation. This list both
physical and virtual block devices, as you can see in the output from the
following command:

```bash
maas admin block-devices read <node-id>
```

Output:

```nohighlight
Success.
Machine-readable output follows:
[
    {
        "id": 10,
        "path": "/dev/disk/by-dname/vda",
        "serial": "",
        "block_size": 4096,
        "available_size": 0,
        "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/10/",
        "filesystem": null,
        "id_path": "/dev/vda",
        "size": 5368709120,
        "partition_table_type": "MBR",
        "model": "",
        "type": "physical",
        "uuid": null,
        "used_size": 5365563392,
        "used_for": "MBR partitioned with 1 partition",
        "partitions": [
            {
                "bootable": false,
                "id": 9,
                "resource_uri":"/MAAS/api/2.0/nodes/4y3h8a/blockdevices/10/partition/9",
                "path": "/dev/disk/by-dname/vda-part1",
                "uuid": "aae082cd-8be0-4a64-ab49-e998abd6ea43",
                "used_for": "LVM volume for vgroot",
                "size": 5360320512,
                "type": "partition",
                "filesystem": {
                    "uuid": "a56ebfa6-8ef4-48b5-b6bc-9f9d27065d24",
                    "mount_options": null,
                    "label": null,
                    "fstype": "lvm-pv",
                    "mount_point": null
                }
            }
        ],
        "tags": [
            "rotary"
        ],
        "name": "vda"
    },
    {
        "id": 11,
        "path": "/dev/disk/by-dname/lvroot",
        "serial": null,
        "block_size": 4096,
        "available_size": 0,
        "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/11/",
        "filesystem": {
            "uuid": "7181a0c0-9e16-4276-8a55-c77364d137ca",
            "mount_options": null,
            "label": "root",
            "fstype": "ext4",
            "mount_point": "/"
        },
        "id_path": null,
        "size": 3221225472,
        "partition_table_type": null,
        "model": null,
        "type": "virtual",
        "uuid": "fc8ba89e-9149-412c-bcea-e596eb7c0d14",
        "used_size": 3221225472,
        "used_for": "ext4 formatted filesystem mounted at /",
        "partitions": [],
        "tags": [],
        "name": "vgroot-lvroot"
    }
]
```

### Read Block Device

If you want to read just one block device instead of listing all block devices
the read operation on the block device endpoint provides that information. To
display the details on device '11' from the previous output, for example, we
could enter:

```bash
maas admin block-device read <node-id> 11
```

The above command generates the following output:

```nohighlight
Success.
Machine-readable output follows:
{
    "available_size": 0,
    "path": "/dev/disk/by-dname/vgroot-lvroot",
    "name": "vgroot-lvroot",
    "used_for": "ext4 formatted filesystem mounted at /",
    "type": "virtual",
    "used_size": 3221225472,
    "filesystem": {
        "uuid": "7181a0c0-9e16-4276-8a55-c77364d137ca",
        "mount_point": "/",
        "mount_options": null,
        "fstype": "ext4",
        "label": "root"
    },
    "id_path": null,
    "id": 11,
    "partition_table_type": null,
    "block_size": 4096,
    "tags": [],
    "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/11/",
    "uuid": "fc8ba89e-9149-412c-bcea-e596eb7c0d14",
    "serial": null,
    "partitions": [],
    "size": 3221225472,
    "model": null
}

```
It is also possible to use the name of the block device, such as 'sda' or
'vda', instead of its 'id':

```bash
s admin block-device read <node-id> vda
``` 

!!! Note: MAAS allows the name of a block device to be changed. If the
block device name has changed then the API call needs to use the new name.
Using the ID is safer as it never changes.

### Create Block Device

MAAS gathers the required information itself on block devices when re-
commissioning a machine. If this doesn't provide the required information,
it is also possible - though not recommended - for an administrator to use the
API to manually add a physical block device to a node. 

```bash
maas admin block-devices create <node-id> name=vdb model="QEMU" serial="QM00001" size=21474836480 block_size=4096
```
Depending on your configuration, output should be similar to the following:
```nohighlight
Success.
Machine-readable output follows:
{
    "available_size": 21474836480,
    "path": "/dev/disk/by-dname/vdb",
    "name": "vdb",
    "used_for": "Unused",
    "type": "physical",
    "used_size": 0,
    "filesystem": null,
    "id_path": "",
    "id": 12,
    "partition_table_type": null,
    "block_size": 4096,
    "tags": [],
    "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/12/",
    "uuid": null,
    "serial": "QM00001",
    "partitions": [],
    "size": 21474836480,
    "model": "QEMU"
}
```
!!! Note: The serial number is what MAAS will use when a node is deployed to
find the specific block device. It's important that this be correct. In a rare
chance that your block device does not provide a model or serial number you can
provide an id\_path. The id\_path should be a path that is always the same, no
matter the kernel version.

### Update Block Device

An administrator can also update the details held on a physical block device,
such as its name, from the API:

```bash
maas admin block-device update <node-id> 12 name=newroot
```

Output from this command will show that the 'name' has changed:

```nohighlight
Success.
Machine-readable output follows:
{
    "block_size": 4096,
    "size": 21474836480,
    "filesystem": null,
    "model": "QEMU",
    "name": "newroot",
    "partitions": [],
    "tags": [],
    "used_size": 0,
    "path": "/dev/disk/by-dname/newroot",
    "id_path": "",
    "uuid": null,
    "available_size": 21474836480,
    "id": 12,
    "used_for": "Unused",
    "type": "physical",
    "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/12/",
    "partition_table_type": null,
    "serial": "QM00001"
}
```
### Delete Block Device

Physical and virtual block devices can be deleted by an administrator, while
ordinary users can only delete virtual block devices:

```bash
maas admin block-device delete <node-id> 12
```

### Format Block Device

An entire block device can be formatted by defining a filesystem with the
'format' API call:

```bash
maas admin block-device format <node-id> 11 fstype=ext4
```

Successful output from this command will look similar to this:

```nohighlight
Success.
Machine-readable output follows:
{
    "block_size": 4096,
    "size": 3221225472,
    "filesystem": {
        "label": "",
        "fstype": "ext4",
        "mount_options": null,
        "uuid": "75e42f49-9a45-466c-8425-87a40e4f4148",
        "mount_point": null
    },
    "model": null,
    "name": "vgroot-lvroot",
    "partitions": [],
    "tags": [],
    "used_size": 3221225472,
    "path": "/dev/disk/by-dname/vgroot-lvroot",
    "id_path": null,
    "uuid": "fc8ba89e-9149-412c-bcea-e596eb7c0d14",
    "available_size": 0,
    "id": 11,
    "used_for": "Unmounted ext4 formatted filesystem",
    "type": "virtual",
    "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/11/",
    "partition_table_type": null,
    "serial": null
}
```
!!! Note: You cannot format a block device that contains partitions or is used
to make another virtual block device.

### Unformat Block Device

You can remove the filesystem from a block device with the 'unformat' API call:

```bash
maas admin block-device unformat <node-id> 11
```
The output from this command should show the filesystem is now 'null':

```nohighlight
Success.
Machine-readable output follows:
{
    "available_size": 3221225472,
    "path": "/dev/disk/by-dname/vgroot-lvroot",
    "name": "vgroot-lvroot",
    "used_for": "Unused",
    "type": "virtual",
    "used_size": 0,
    "filesystem": null,
    "id_path": null,
    "id": 11,
    "partition_table_type": null,
    "block_size": 4096,
    "tags": [],
    "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/11/",
    "uuid": "fc8ba89e-9149-412c-bcea-e596eb7c0d14",
    "serial": null,
    "partitions": [],
    "size": 3221225472,
    "model": null
}
```
### Mount Block Device

If a block device has a filesystem, you can use the 'maas' command to mount a block devices at a given mount
point:

```bash
maas admin block-device mount <node-id> 11 mount_point=/srv
```

The mount point is included in the successful output from the command:

```nohighlight
Success.
Machine-readable output follows:
{
    "available_size": 0,
    "path": "/dev/disk/by-dname/vgroot-lvroot",
    "name": "vgroot-lvroot",
    "used_for": "ext4 formatted filesystem mounted at /srv",
    "type": "virtual",
    "used_size": 3221225472,
    "filesystem": {
        "uuid": "6f5965ad-49f7-42da-95ff-8000b739c39f",
        "mount_point": "/srv",
        "mount_options": "",
        "fstype": "ext4",
        "label": ""
    },
    "id_path": null,
    "id": 11,
    "partition_table_type": null,
    "block_size": 4096,
    "tags": [],
    "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/11/",
    "uuid": "fc8ba89e-9149-412c-bcea-e596eb7c0d14",
    "serial": null,
    "partitions": [],
    "size": 3221225472,
    "model": null
}

```

### Unmount Block Device

To remove the mount point from the block device, use the 'unmount' call:

```bash
maas admin block-device unmount <node-id> 11 mount_point=/srv

```

The previous command will include a nullified 'mount_point' in its output:

```nohighlight
Success.
Machine-readable output follows:
{
    "available_size": 0,
    "path": "/dev/disk/by-dname/vgroot-lvroot",
    "name": "vgroot-lvroot",
    "used_for": "Unmounted ext4 formatted filesystem",
    "type": "virtual",
    "used_size": 3221225472,
    "filesystem": {
        "uuid": "6f5965ad-49f7-42da-95ff-8000b739c39f",
        "mount_point": null,
        "mount_options": null,
        "fstype": "ext4",
        "label": ""
    },
    "id_path": null,
    "id": 11,
    "partition_table_type": null,
    "block_size": 4096,
    "tags": [],
    "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/11/",
    "uuid": "fc8ba89e-9149-412c-bcea-e596eb7c0d14",
    "serial": null,
    "partitions": [],
    "size": 3221225472,
    "model": null
}
```

### Set as Boot Disk

By default, MAAS picks the first added block device to the node as the boot
disk. In most cases this works as expected as the BIOS usually enumerates the
boot disk as the first block device. There are cases where this fails and the
boot disk needs to be set to another disk. This API allow setting which block
device on a node MAAS should use as the boot disk.:

```bash
maas admin block-device set-boot-disk <node-id> 10
```

!!! Note: Only an administrator can set which block device should be used as
the boot disk and only a physical block device can be set as as the boot disk.
This operation should be done before a node is acquired or the storage layout
will be applied to the previous boot disk.

## Partitions

### List Partitions

To view all the partitions on a block device, use the 'partitions read' API
call:

```bash
maas admin partitions read <node-id> 10
```

```nohighlight
Success.
Machine-readable output follows:
[
    {
        "bootable": false,
        "id": 9,
        "resource_uri":
"/MAAS/api/2.0/nodes/4y3h8a/blockdevices/10/partition/9",
        "path": "/dev/disk/by-dname/vda-part1",
        "uuid": "aae082cd-8be0-4a64-ab49-e998abd6ea43",
        "used_for": "LVM volume for vgroot",
        "size": 5360320512,
        "type": "partition",
        "filesystem": {
            "uuid": "a56ebfa6-8ef4-48b5-b6bc-9f9d27065d24",
            "mount_options": null,
            "label": null,
            "fstype": "lvm-pv",
            "mount_point": null
        }
    }
]
```

To view the metadata for a specific partition on a block device, rather than
all partitions, use the singular 'partition' API call with an endpoint:

```basg
maas admin partition read <node-id> 10 9
```
### Create Partition

To create a new partition on a block device, use the 'create' API call:

```bash
maas admin partitions create <node-id> 10 size=5360320512
```
In addition to bytes, as shown above, the 'size' of a partition can also be
defined with a 'G' for gigabytes or 'M' for megabytes. The output from the
previous command will look like this:

```nohighlight
Success.
Machine-readable output follows:
{
    "bootable": false,
    "path": "/dev/disk/by-dname/vda-part1",
    "filesystem": null,
    "used_for": "Unused",
    "type": "partition",
    "id": 10,
    "size": 5360320512,
    "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/10/partition/10",
    "uuid": "3d32adbf-9943-4785-ab38-963758338c6c"
}
```

### Delete Partition

Partitions can be deleted from a block device with the 'delete' API call.
Make sure you double check the partition details as the partition is deleted
immediately, with no further confirmation:

```bash
maas admin partition delete <node-id> 10 9
```

Successful output from the 'delete' command will look like this:

```bash
Success.
Machine-readable output follows:
```

### Format Partition

Partitions can be formatted in a similar way to block devices:

```bash
maas admin partition format <node-id> 10 9 fstype=ext4
```
The output from the 'format' command will be similar to the following:

```nohighlight
Success.
Machine-readable output follows:
{
    "id": 9,
    "used_for": "Unmounted ext4 formatted filesystem",
    "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/10/partition/9",
    "path": "/dev/disk/by-dname/vda-part1",
    "uuid": "aae082cd-8be0-4a64-ab49-e998abd6ea43",
    "size": 5360320512,
    "bootable": false,
    "type": "partition",
    "filesystem": {
        "uuid": "ea593366-be43-4ea3-b2d5-0adf82085a62",
        "mount_point": null,
        "mount_options": null,
        "fstype": "ext4",
        "label": ""
    }
}
```

!!! Note: You cannot format partitions that are used to make another virtual
block device.

### Unformat Partition

You can also remove the filesystem from a partition with the 'unformat' API
call:

```bash
maas admin partition unformat <node-id> 10 10 fstype=ext4
```

```nohighlight
Success.
Machine-readable output follows:
{
    "bootable": false,
    "path": "/dev/disk/by-dname/vda-part1",
    "filesystem": null,
    "used_for": "Unused",
    "type": "partition",
    "id": 10,
    "size": 5360320512,
    "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/10/partition/10",
    "uuid": "3d32adbf-9943-4785-ab38-963758338c6c"
}
```
### Mount Partition

A formatted partition can be mounted at a given mount point with the 'mount'
API call"

```bash
maas admin partition mount <node-id> 10 10 mount_point=/srv
```

The mount point and the filesystem is visible in the output from the command:

```nohighlight
Success.
Machine-readable output follows:
{
    "bootable": false,
    "id": 10,
    "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/10/partition/10",
    "path": "/dev/disk/by-dname/vda-part1",
    "uuid": "3d32adbf-9943-4785-ab38-963758338c6c",
    "used_for": "ext4 formatted filesystem mounted at /srv",
    "size": 5360320512,
    "type": "partition",
    "filesystem": {
        "uuid": "1949a5fb-f7bd-4ada-8ba5-d06d3f5857a8",
        "mount_options": "",
        "label": "",
        "fstype": "ext4",
        "mount_point": "/srv"
    }
}
```
### Unmount Partition

A previous mounted partition can be unmounted with the 'unmount' call:

```bash
maas admin partition unmount 4y3h8a 10 10
```

After successfully running this command, the mount point will show as 'null' in
the output:

```nohighlight
Success.
Machine-readable output follows:
{
    "bootable": false,
    "id": 10,
    "resource_uri": "/MAAS/api/2.0/nodes/4y3h8a/blockdevices/10/partition/10",
    "path": "/dev/disk/by-dname/vda-part1",
    "uuid": "3d32adbf-9943-4785-ab38-963758338c6c",
    "used_for": "Unmounted ext4 formatted filesystem",
    "size": 5360320512,
    "type": "partition",
    "filesystem": {
        "uuid": "1949a5fb-f7bd-4ada-8ba5-d06d3f5857a8",
        "mount_options": null,
        "label": "",
        "fstype": "ext4",
        "mount_point": null
    }
}
```
        "type": "partition",
        "id": 3,
        "size": 2000003072
    }

## Restrictions

There are only a couple of restrictions that exists in the storage
configuration. These restrictions are only in place because they are known to
not allow a successful deployment.

-   An EFI partition is required to be on the boot disk for UEFI.
-   You cannot place partitions on logical volumes.
-   You cannot use a logical volume as a Bcache backing device.
