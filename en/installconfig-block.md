Title: Block Devices

# Block Devices

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
maas admin block-devices read <system_id>
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
the read operation on the block device endpoint provides that information. 

```bash
maas admin block-device read <system_id> <block_device_id>
```

To display the details on device '11' from the previous output, for example, we
could enter:

```bash
maas admin block-device read <system_id> 11
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
s admin block-device read <system_id> vda
``` 

!!! Note: 
    MAAS allows the name of a block device to be changed. If the
    block device name has changed then the API call needs to use the new name.
    
    Using the ID is safer as it never changes.

### Create Block Device

MAAS gathers the required information itself on block devices when re-
commissioning a machine. If this doesn't provide the required information,
it is also possible - though not recommended - for an administrator to use the
API to manually add a physical block device to a node. 

```bash
maas admin block-devices create <system_id> name=vdb model="QEMU" serial="QM00001" size=21474836480 block_size=4096
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
!!! Note: 
    The serial number is what MAAS will use when a node is deployed to
    find the specific block device. It's important that this be correct. In a rare
    chance that your block device does not provide a model or serial number you can
    provide an id\_path. The id\_path should be a path that is always the same, no
    matter the kernel version.

### Update Block Device

An administrator can also update the details held on a physical block device,
such as its name, from the API:

```bash
maas admin block-device update <system_id> 12 name=newroot
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
maas admin block-device delete <system_id> <block_device_id>
```

### Format Block Device

An entire block device can be formatted by defining a filesystem with the
'format' API call:

```bash
maas admin block-device format <system_id> 11 fstype=ext4
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
!!! Note: 
    You cannot format a block device that contains partitions or is used
    to make another virtual block device.

### Unformat Block Device

You can remove the filesystem from a block device with the 'unformat' API call:

```bash
maas admin block-device unformat <system_id> 11
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
maas admin block-device mount <system_id> 11 mount_point=/srv
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
maas admin block-device unmount <system_id> 11 mount_point=/srv

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
maas admin block-device set-boot-disk <system_id> <block_device_id>
```

!!! Note: 
    Only an administrator can set which block device should be used as
    the boot disk and only a physical block device can be set as as the boot disk.
    This operation should be done before a node is acquired or the storage layout
    will be applied to the previous boot disk.
