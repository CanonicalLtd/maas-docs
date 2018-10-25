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

- [Add a KVM host][addkvmhost]
- [Add an RSD Pod][addrsdpod]
- [Configuration][configuration]
- [KVM host networking][networking]
- [Using the CLI to work with Pods][cli]

<!-- LINKS -->

[addkvmhost]: manage-pods-webui.md#add-a-kvm-host
[addrsdpod]: manage-pods-webui.md#add-an-rsd-pod
[configuration]: manage-pods-webui.md#configuration
[networking]: manage-kvm-pods-networking.md
[cli]: manage-cli-comp-hw.md


