Title: Pods
TODO:  
table_of_contents: True

# Pods

Pods, or composable hardware, allow for the dynamic composition of nodes from a
pool of available hardware resources (e.g. disk space, memory, cores).

MAAS currently supports two pod architectures:

- Virsh: KVM hosts
- Intel Rack Scale Design: RSD (validated to work with release v.1.2.5, based on
  Redfish API v.1.0 and RSD PODM API v.1.0)

Both are useful for Juju integration, allowing for dynamic allocation of VMs
with custom interface constraints.  Alternatively, if you would like to use MAAS
to manage a collection of VMs, the robust web UI allows you to easily create and
manage VMs logically grouped by KVM host.

Features:

- Juju integration
- At-a-glance visual tools for easy resource management
- Set overcommit ratios for physical resources such as CPU and RAM
- Assign pods to resource pools to segregate your pods into logical groupings
- Track libvirt storage pool usage and assign default storage pools to your
  KVM hosts
- Create VMs on multiple networks, specified by space, subnet, VLAN, or IP
  address

## Next steps

For more information:

[Web UI][webui]  
[Adding KVM pods][addingkvmpods]  
[Storage pools][storagepools]  
[Networking][networking]  

<!-- LINKS -->

[addingkvmpods]: manage-kvm-pods-add.md
[storagepools]: manage-kvm-pods-storage-pools.md
[networking]: manage-kvm-pods-networking.md
[webui]: manage-kvm-pods-webui.md


