Title: Intel RSD | MAAS


# Intel RSD MAAS Release notes and Admin Guide


## Introduction

### Preamble
Intel Rack Scale Design (RSD) is a hardware architecture that allows the
dynamic composition of physical systems from a pool of available hardware
resources. MAAS is a cloud-like, scale-out bare-metal provisioning system, that
allows consumers to request and deploy hardware on demand, providing Juju (a
model based orchestration system) with physical infrastructure to meet the
demands of scale-out software.

This document describes how to use MAAS to manage an Intel Rack Scale Design
(RSD). MAAS will leverage the use of Intel RSD by composing machines on-demand
(dynamically) as required by Juju. MAAS will alternatively allow the manual
composition of machines, from available pool of resources, to be made available
for re-use as part of the MAAS machine lifecycle.

### Definitions for MAAS
Intel Rack Scale Design
Intel® Rack Scale Design (RSD) is a logical architecture that disaggregates
compute, storage, and network resources, and introduces the ability to more
efficiently pool and utilize these resources.

Composed System
An Intel RSD term used to represent a system that has been created for usage as
an actual machine in MAAS.

Uncomposed System
An Intel RSD term used to represent a system that has not been created for
usage as an actual usable system.

Pod
A MAAS term to represent a set of machines or a pool of hardware available for
MAAS’s control through a single endpoint.

Orchestrator
A workload orchestrator tool, such as Juju, Chef, or another consumer of the
MAAS API.

Fabric
A switch or a combination of switches that are trunked, all providing the same
VLANs.


## MAAS Release Notes

MAAS 2.2 Beta 2
MAAS Beta 2.2 introduces the initial support for Intel RSD with following RSD
features :  

Ability to add (create) a new intel RSD POD into MAAS.
Ability to query MAAS for free (available) and utilized resources within the
Intel RSD POD.
Ability to discover & auto-commission pre-composed machines (resources). This
allows MAAS to automatically discover all machines that have been previously
created by a user directly with the Intel RSD pod itself (i.e outside of MAAS).
Ability to create (compose) new machines via MAAS API. This allows MAAS to
automatically communicate with the Intel RSD pod to create & commission a new
machine that can be later used for any workload deployment.
Installation
MAAS 2.2 Beta 2 is available on the MAAS Next PPA (ppa:maas/next). To Install
MAAS please follow the instructions below:

$ sudo add-apt-repository ppa:maas/next
$ sudo apt-get install maas

Note that this PPA will contain the latest MAAS 2.2 release that includes the
features above. 
Known Issues & Workarounds

LP1664732
: Deleting an RSD pod fails when more than 4 composes machines exist
Deleting an RSD Pod fails if there are more than four composed machines in the
pod.  This has to do with a timeout being exceeded on the MAAS region server.  

LP1664664 : Composing a machine may cause an infinite loop
Composing a machine will cause an infinite loop when there are not a sufficient
amount of resources for allocation to succeed.  

LP1664667 : RSD Pod architectures are listed multiple times. 
MAAS is listing the architectures field multiple times.  MAAS will need to
address this and only list the supported architectures once.  


Section 3 - Registration and Resource Discovery
Registration
An RSD Pod can be registered in MAAS via the API (with login of admin):

maas admin pods create type="rsd" power_address="<ip_address|url:port>"
power_user="<username>" power_pass="<password>"

Example output for creating an RSD Pod:

$ maas admin pods create type="rsd" power_address="10.3.0.1:8443"
power_user="admin" power_pass="admin"
Success.
Machine-readable output follows:
{
    "architectures": [
        "amd64/generic"
    ],
    "name": "eager-yak",
    "resource_uri": "/MAAS/api/2.0/pods/135/",
    "total": {
        "local_disks": 7,
        "memory": 249984,
        "local_storage": 959999999999,
        "cores": 352
    },
    "capabilities": [
        "composable",
        "fixed_local_storage"
    ],
    "type": "rsd",
    "used": {
        "local_disks": 0,
        "memory": 0,
        "local_storage": 0,
        "cores": 0
    },
    "available": {
        "local_disks": 7,
        "memory": 249984,
        "local_storage": 959999999999,
        "cores": 352
    },
    "id": 135
}


When the POD is registered, MAAS automatically discovers and stores the
resources that the POD contains, as we can see in the above output.  

There are eight SLEDs in the RSD Pod from the list of architectures.  We can
see the Pod total, used, and available resources.  Let’s compose a couple of
machines to see how this information will change when we read the Pod resources
from the API.

To read the Pod resources:

maas admin pod read <pod_id>

Example output of reading pod:

$ maas admin pod read 135
Success.
Machine-readable output follows:
{
    "id": 135,
    "available": {
        "cores": 256,
        "local_disks": 5,
        "memory": 184448,
        "local_storage": 719931752447
    },
    "used": {
        "cores": 96,
        "local_storage": 240068247552,
        "local_disks": 2,
        "memory": 65536
    },
    "resource_uri": "/MAAS/api/2.0/pods/135/",
    "type": "rsd",
    "name": "eager-yak",
    "architectures": [
        "amd64/generic"
    ],
    "total": {
        "cores": 352,
        "local_storage": 959999999999,
        "local_disks": 7,
        "memory": 249984
    },
    "capabilities": [
        "composable",
        "fixed_local_storage"
    ]
}

The Pod’s output now shows the two composed machines that were created.  The
total, used, and available fields in the Pod output now reflects the Pod’s new
state.

To read the Pods power parameters:

maas admin pod parameters <pod_id>

Example output of pod parameters:

$ maas admin pod parameters 135
Success.
Machine-readable output follows:
{
    "power_address": "10.3.0.1:8443",
    "power_pass": "admin",
    "power_user": "admin"
}


Section 4 - Machine Composition
Composition
Composing RSD Pod machines via the API.

Default compose:

maas admin pod compose <pod_id>

Example output for default composing:

$ maas admin pod compose 135
Success.
Machine-readable output follows:
{
    "system_id": "73yxmc",
    "resource_uri": "/MAAS/api/2.0/machines/73yxmc/"
}

Compose with resources specified:

maas admin pod compose <pod_id> cores=<requested cores> cpu_speed=<requested
minimum cpu speed in MHz> memory=<requested memory in MiB>
architecture=<requested architecture that POD must support>

Example output for composing with resources specified:

$ maas admin pod compose 135 cores=40  cpu_speed=2000 memory=7812
architecture="amd64/generic"
Success.
Machine-readable output follows:
{
    "resource_uri": "/MAAS/api/2.0/machines/yc4nms/",
    "system_id": "yc4nms"
}

To read machine:

maas admin machine read <system_id>

Example output for composed machine:

$ maas admin machine read yc4nms
Success.
Machine-readable output follows:
{
    "address_ttl": null,
    "power_type": "rsd",
    "storage": 120034.123776,
    "min_hwe_kernel": "",
    "pod": {
        "resource_uri": "/MAAS/api/2.0/pods/135/",
        "id": 135,
        "name": "eager-yak"
    },
    "cpu_count": 40,
    "owner_data": {},
    "osystem": "ubuntu",
    "blockdevice_set": [
        {
            "resource_uri": "/MAAS/api/2.0/nodes/yc4nms/blockdevices/860/",
            "id_path": "/dev/disk/by-id/wwn-0x55cd2e4000040357",
            "used_for": "MBR partitioned with 1 partition",
            "available_size": 0,
            "size": 120034123776,
            "serial": "CVLI3106005Z120E",
            "id": 860,
            "filesystem": null,
            "partition_table_type": "MBR",
            "name": "sda",
            "partitions": [
                {
                    "resource_uri":
"/MAAS/api/2.0/nodes/yc4nms/blockdevices/860/partition/278",
                    "device_id": 860,
                    "uuid": "0222b0c3-16ce-429a-92b9-684c7c7ba39e",
                    "used_for": "ext4 formatted filesystem mounted at /",
                    "path": "/dev/disk/by-dname/sda-part1",
                    "size": 120028397568,
                    "type": "partition",
                    "id": 278,
                    "filesystem": {
                        "uuid": "ba9b9652-78b9-4f58-a7d8-f70c0ca5cbc8",
                        "mount_point": "/",
                        "fstype": "ext4",
                        "mount_options": null,
                        "label": "root"
                    },
                    "bootable": false,
                    "system_id": "yc4nms"
                }
            ],
            "used_size": 120033640448,
            "tags": [
                "ssd",
                "sata"
            ],
            "uuid": null,
            "type": "physical",
            "block_size": 4096,
            "model": "INTEL SSDMCEAC12",
            "path": "/dev/disk/by-dname/sda",
            "system_id": "yc4nms"
        }
    ],
    "owner": "admin",
    "status": 6,
    "resource_uri": "/MAAS/api/2.0/machines/yc4nms/",
    "swap_size": null,
    "boot_interface": {
        "tags": [
            "1.0"
        ],
        "children": [],
        "discovered": [],
        "id": 866,
        "vlan": {
            "dhcp_on": true,
            "mtu": 1500,
            "id": 5002,
            "name": "untagged",
            "vid": 0,
            "external_dhcp": null,
            "resource_uri": "/MAAS/api/2.0/vlans/5002/",
            "primary_rack": "ssapke",
            "space": "space-0",
            "secondary_rack": null,
            "fabric_id": 1,
            "fabric": "fabric-1",
            "relay_vlan": null
        },
        "name": "eno1",
        "effective_mtu": 1500,
        "resource_uri": "/MAAS/api/2.0/nodes/yc4nms/interfaces/866/",
        "params": "",
        "parents": [],
        "type": "physical",
        "enabled": true,
        "links": [
            {
                "subnet": {
                    "resource_uri": "/MAAS/api/2.0/subnets/4/",
                    "rdns_mode": 2,
                    "vlan": {
                        "dhcp_on": true,
                        "mtu": 1500,
                        "id": 5002,
                        "name": "untagged",
                        "vid": 0,
                        "external_dhcp": null,
                        "resource_uri": "/MAAS/api/2.0/vlans/5002/",
                        "primary_rack": "ssapke",
                        "space": "space-0",
                        "secondary_rack": null,
                        "fabric_id": 1,
                        "fabric": "fabric-1",
                        "relay_vlan": null
                    },
                    "active_discovery": false,
                    "id": 4,
                    "name": "10.1.0.0/22",
                    "gateway_ip": "10.1.0.2",
                    "managed": true,
                    "dns_servers": [],
                    "space": "space-0",
                    "cidr": "10.1.0.0/22",
                    "allow_proxy": true
                },
                "id": 4005,
                "mode": "auto",
                "ip_address": "10.1.0.6"
            }
        ],
        "mac_address": "54:ab:3a:8e:c8:36",
        "system_id": "yc4nms"
    },
    "status_message": "'cloudinit' running modules for final",
    "tag_names": [],
    "hostname": "crisp-emu",
    "special_filesystems": [],
    "architecture": "amd64/generic",
    "hwe_kernel": "ga-16.04",
    "node_type": 0,
    "boot_disk": null,
    "domain": {
        "authoritative": true,
        "ttl": null,
        "resource_record_count": 0,
        "id": 0,
        "name": "maas",
        "resource_uri": "/MAAS/api/2.0/domains/0/"
    },
    "status_name": "Deployed",
    "netboot": false,
    "system_id": "yc4nms",
    "virtualblockdevice_set": [],
    "distro_series": "xenial",
    "zone": {
        "resource_uri": "/MAAS/api/2.0/zones/default/",
        "id": 1,
        "name": "default",
        "description": ""
    },
    "memory": 32768,
    "status_action": "modules-final",
    "disable_ipv4": false,
    "physicalblockdevice_set": [
        {
            "resource_uri": "/MAAS/api/2.0/nodes/yc4nms/blockdevices/860/",
            "id_path": "/dev/disk/by-id/wwn-0x55cd2e4000040357",
            "used_for": "MBR partitioned with 1 partition",
            "available_size": 0,
            "size": 120034123776,
            "serial": "CVLI3106005Z120E",
            "id": 860,
            "filesystem": null,
            "partition_table_type": "MBR",
            "name": "sda",
            "partitions": [
                {
                    "resource_uri":
"/MAAS/api/2.0/nodes/yc4nms/blockdevices/860/partition/278",
                    "device_id": 860,
                    "uuid": "0222b0c3-16ce-429a-92b9-684c7c7ba39e",
                    "used_for": "ext4 formatted filesystem mounted at /",
                    "path": "/dev/disk/by-dname/sda-part1",
                    "size": 120028397568,
                    "type": "partition",
                    "id": 278,
                    "filesystem": {
                        "uuid": "ba9b9652-78b9-4f58-a7d8-f70c0ca5cbc8",
                        "mount_point": "/",
                        "fstype": "ext4",
                        "mount_options": null,
                        "label": "root"
                    },
                    "bootable": false,
                    "system_id": "yc4nms"
                }
            ],
            "used_size": 120033640448,
            "tags": [
                "ssd",
                "sata"
            ],
            "uuid": null,
            "type": "physical",
            "block_size": 4096,
            "model": "INTEL SSDMCEAC12",
            "path": "/dev/disk/by-dname/sda",
            "system_id": "yc4nms"
        }
    ],
    "power_state": "on",
    "interface_set": [
        {
            "tags": [
                "1.0"
            ],
            "children": [],
            "discovered": [],
            "id": 866,
            "vlan": {
                "dhcp_on": true,
                "mtu": 1500,
                "id": 5002,
                "name": "untagged",
                "vid": 0,
                "external_dhcp": null,
                "resource_uri": "/MAAS/api/2.0/vlans/5002/",
                "primary_rack": "ssapke",
                "space": "space-0",
                "secondary_rack": null,
                "fabric_id": 1,
                "fabric": "fabric-1",
                "relay_vlan": null
            },
            "name": "eno1",
            "effective_mtu": 1500,
            "resource_uri": "/MAAS/api/2.0/nodes/yc4nms/interfaces/866/",
            "params": "",
            "parents": [],
            "type": "physical",
            "enabled": true,
            "links": [
                {
                    "subnet": {
                        "resource_uri": "/MAAS/api/2.0/subnets/4/",
                        "rdns_mode": 2,
                        "vlan": {
                            "dhcp_on": true,
                            "mtu": 1500,
                            "id": 5002,
                            "name": "untagged",
                            "vid": 0,
                            "external_dhcp": null,
                            "resource_uri": "/MAAS/api/2.0/vlans/5002/",
                            "primary_rack": "ssapke",
                            "space": "space-0",
                            "secondary_rack": null,
                            "fabric_id": 1,
                            "fabric": "fabric-1",
                            "relay_vlan": null
                        },
                        "active_discovery": false,
                        "id": 4,
                        "name": "10.1.0.0/22",
                        "gateway_ip": "10.1.0.2",
                        "managed": true,
                        "dns_servers": [],
                        "space": "space-0",
                        "cidr": "10.1.0.0/22",
                        "allow_proxy": true
                    },
                    "id": 4005,
                    "mode": "auto",
                    "ip_address": "10.1.0.6"
                }
            ],
            "mac_address": "54:ab:3a:8e:c8:36",
            "system_id": "yc4nms"
        },
        {
            "tags": [
                "sriov"
            ],
            "children": [],
            "discovered": [],
            "id": 865,
            "vlan": {
                "dhcp_on": true,
                "mtu": 1500,
                "id": 5002,
                "name": "untagged",
                "vid": 0,
                "external_dhcp": null,
                "resource_uri": "/MAAS/api/2.0/vlans/5002/",
                "primary_rack": "ssapke",
                "space": "space-0",
                "secondary_rack": null,
                "fabric_id": 1,
                "fabric": "fabric-1",
                "relay_vlan": null
            },
            "name": "enp1s0",
            "effective_mtu": 1500,
            "resource_uri": "/MAAS/api/2.0/nodes/yc4nms/interfaces/865/",
            "params": "",
            "parents": [],
            "type": "physical",
            "enabled": true,
            "links": [
                {
                    "subnet": {
                        "resource_uri": "/MAAS/api/2.0/subnets/4/",
                        "rdns_mode": 2,
                        "vlan": {
                            "dhcp_on": true,
                            "mtu": 1500,
                            "id": 5002,
                            "name": "untagged",
                            "vid": 0,
                            "external_dhcp": null,
                            "resource_uri": "/MAAS/api/2.0/vlans/5002/",
                            "primary_rack": "ssapke",
                            "space": "space-0",
                            "secondary_rack": null,
                            "fabric_id": 1,
                            "fabric": "fabric-1",
                            "relay_vlan": null
                        },
                        "active_discovery": false,
                        "id": 4,
                        "name": "10.1.0.0/22",
                        "gateway_ip": "10.1.0.2",
                        "managed": true,
                        "dns_servers": [],
                        "space": "space-0",
                        "cidr": "10.1.0.0/22",
                        "allow_proxy": true
                    },
                    "id": 4001,
                    "mode": "link_up"
                }
            ],
            "mac_address": "54:ab:3a:8e:e5:23",
            "system_id": "yc4nms"
        }
    ],
    "fqdn": "crisp-emu.maas",
    "node_type_name": "Machine",
    "ip_addresses": [
        "10.1.0.6"
    ]
}


Section 5 - Machine Decomposition
Decomposition
Decomposing RSD Pod machines via the API by deleting the machine itself:

maas admin machine delete <system_id>

Example output for deleting pod machine:

maas admin machine delete yc4nms
Success.
Machine-readable output follows:

If we did another read of the RSD Pod, we would see that the resources for this
machine are available and no longer used.


Section 6 - Pod Deletion
Deleting a Pod
Deleting an RSD Pod via the API:

maas admin pod delete <pod_id>

Example output of Pod deletion:

$ maas admin pod delete 135
Success.
Machine-readable output follows:

Read list of Pods to check delete:

maas admin pods read

Example output of reading list of Pods (should be empty):

 $ maas admin pods read
Success.
Machine-readable output follows:
[]

