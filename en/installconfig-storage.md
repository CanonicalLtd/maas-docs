Title: Storage
TODO:  Describe the Storage web UI page
       Explain how to perform actions: LVM, RAID, Bcache, modify filesystems
       Bug tracking: https://pad.lv/1636933
       Bug tracking: https://pad.lv/1698891
       Bug tracking: https://pad.lv/1698895
       The 'block devices' and 'partitions' pages have been removed from the menu. They should be reviewed. If worthy, they should be moved to the CLI section
       Re the above, partitions *are* block devices (?)
table_of_contents: True


# Storage

The final storage configuration that a deployed node uses can be influenced
significantly. MAAS supports traditional disk partitioning as well as more
complex options such as LVM, RAID, and Bcache. UEFI is also supported as a boot
mechanism.

A node's storage is dependant upon the underlying system's disks but its
configuration (how the disks get used) is the result of a storage template. In
MAAS this template is called a *layout* and it gets applied to a node when it
is commissioned.

Once a layout is applied, a regular user can make modifications to a node at
the filesystem level in order to arrive at the node's final storage
configuration.

When a node is no longer needed a user can choose from among several disk
erasure types before releasing it.

!!! Note:
    MAAS supports storage configuration for CentOS and RHEL deployments. Support
    includes RAID, LVM, and custom partitioning with different file systems (ZFS
    and Bcache excluded). This support requires a newer version of Curtin,
    [available as a PPA][curtinppa].

## UEFI

A node booting with UEFI is supported by every layout type. In such a case, an
EFI boot partition (`/boot/efi`) will be automatically created. Other than
setting the node to boot from UEFI, no other action is required of the user.

!!! Negative "Warning":
    UEFI is either used by the node throughout its lifecycle or it's not. For
    example, do not enlist a node with UEFI enabled and then disable it before
    commissioning. It won't work!

The EFI partition, if created, will be the first partition (`sda1`) and will
have a FAT32 filesystem with a size of 512 MB.


## Layouts

There are three layout types:

- Flat layout
- LVM layout
- Bcache layout

The below layout descriptions will include the EFI partition. If your system is
not using UEFI simply regard `sda2` as `sda1` (with an additional 512 MB
available to it).

### Flat layout

With the Flat layout, a partition spans the entire boot disk. The partition is
formatted with the ext4 filesystem and uses the `/` mount point:

| Name      | Size        | Type  | Filesystem     | Mount point |
|:----------|-------------|-------|----------------|-------------|
| sda       | -           | disk  |                |             |
| sda1      | 512 MB      | part  | FAT32          | /boot/efi   |
| sda2      | rest of sda | part  | ext4           | /           |

The following options are supported:

`boot_size`: Size of the boot partition on the boot disk. Default is 0,
meaning not to create the boot partition. The '/boot' will be placed on
the root filesystem.
    
`root_device`: The block device to place the root partition on. Default is the
boot disk.
    
`root_size`: Size of the root partition. Default is 100%, meaning the entire
size of the root device.

### LVM layout

The LVM layout creates the volume group `vgroot` on a partition that spans the
entire boot disk. A logical volume `lvroot` is created for the full size of the
volume group; is formatted with the ext4 filesystem; and uses the `/` mount point:

| Name      | Size        | Type  | Filesystem     | Mount point |
|:----------|-------------|-------|----------------|-------------|
| sda       | -           | disk  |                |             |
| sda1      | 512 MB      | part  | FAT32          | /boot/efi   |
| sda2      | rest of sda | part  | lvm-pv(vgroot) |             |
| lvroot    | rest of sda | lvm   | ext4           | /           |
| vgroot    | rest of sda | lvm   |                |             |

The following options are supported:

`boot_size`: Size of the boot partition on the boot disk. Default is 0, meaning not to
create the boot partition. The '/boot' will be placed on the root filesystem.

`root_device`: The block device to place the root partition on. Default is the boot disk.

`root_size`: Size of the root partition. Default is 100%, meaning the entire size of the
root device.

`vg_name`: Name of the created volume group. Default is `vgroot`.

`lv_name`: Name of the created logical volume. Default is `lvroot`.

`lv_size`: Size of the created logical volume. Default is 100%, meaning the entire size of
the volume group.

### Bcache layout

A Bcache layout will create a partition that spans the entire boot disk as the
backing device. It uses the smallest block device tagged with 'ssd' as the
cache device. The Bcache device is formatted with the ext4 filesystem and uses
the `/` mount point. If there are no 'ssd' tagged block devices on the node, 
then the Bcache device will not be created and the Flat layout will be used
instead:

| Name      | Size        | Type  | Filesystem     | Mount point |
|:----------|-------------|-------|----------------|-------------|
| sda       | -           | disk  |                |             |
| sda1      | 512 MB      | part  | FAT32          | /boot/efi   |
| sda2      | rest of sda | part  | bc-backing     |             |
| sdb (ssd) | -           | disk  |                |             |
| sdb1      | 100% of sdb | part  | bc-cache       |             |
| bcache0   | per sda2    | disk  | ext4           | /           |

The following options are supported:

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


### VMFS6 layout

The VMFS6 layout is used for VMware ESXi deployments only. It is required when
configuring VMware VMFS Datastores. The layout creates all operating system
partitions in addition to the default datastore. The datastore may be modified
and new datastores may be created or extended to include other storage
devices. The base operating system partitions may not be modified as they are
required for VMware ESXi use. Once applied another storage layout must be
applied to remove the operating system partitions.

| Name      | Size        | Type    | Use               |
|:----------|-------------|---------|-------------------|
| sda       | -           | disk    |                   |
| sda1      | 3 MB        | part    | EFI               |
| sda2      | 4 GB        | part    | Basic Data        |
| sda3      | Remaining   | part    | VMFS Datastore 1  |
| sda4      | -           | skipped |                   |
| sda5      | 249 MB      | part    | Basic Data        |
| sda6      | 249 MB      | part    | Basic Data        |
| sda7      | 109 MB      | part    | VMware Diagnostic |
| sda8      | 285 MB      | part    | Basic Data        |
| sda9      | 2.5 GB      | part    | VMware Diagnostic |

The following options are supported:

`root_device`: The block device to place the root partition on. Default is the
boot disk.

`root_size`: Size of the default VMFS Datastore. Default is 100%, meaning the
remaining size of the root disk.


### Blank layout

The blank layout removes all storage configuration from all storage devices. It
is useful when needing to apply a custom storage configuration.

!!! Negative "Warning":
Machines with the blank layout applied are not deployable. Storage must be
manually configured first.



## Setting layouts

Layouts can be set globally and on a per-node basis.

### Default layout

All nodes will have a default layout applied when commissioned. An
administrator can configure the default layout on the 'Settings' page, under
the 'Storage' tab.

![default storage layout][img__default-storage-layout]

See [Disk erasure][storage-erasure] for an explanation of the options related
to the erasing of disks.

!!! Warning "Important":
    The new default will only apply to newly-commissioned nodes.

To change the default with the CLI see
[MAAS CLI - advanced tasks][cli-default-storage-layout].

### Node layout

An administrator can change the layout for a single node as well as customise
that layout providing this is done while the node has a status of 'Ready'. This
is only possible via the CLI at this time (see
[MAAS CLI - advanced tasks][cli-set-storage-layout]).

!!! Note:
    Only an administrator can modify storage at the block device level (providing
    the node has a status of 'Ready').


## Final storage modifications

Once a node has been provisioned with block devices via a layout or
administrator customisation (as mentioned under 'Node layout'), a regular user
can perform modifications on the resulting storage configuration at the
filesystem level.


## Disk erasure

Node storage can be erased in several ways. See [Disk erasure][storage-erasure]
for details.


<!-- LINKS -->

[storage-erasure]: installconfig-storage-erasure.md
[cli-default-storage-layout]: manage-cli-advanced.md#set-the-default-storage-layout
[cli-set-storage-layout]: manage-cli-advanced.md#set-a-storage-layout
[curtinppa]: https://launchpad.net/ubuntu/+source/curtin

[img__default-storage-layout]: ../media/installconfig-storage__2.4_default-storage-layout.png
