# KVM (pod)

A MAAS KVM pod is a collection of virtual machines running on an instance of
libvirt. KVM pods are useful for Juju integration, allowing for dynamic
allocation of VMs with custom interface constraints.  Alternatively, if you
would like to use MAAS to manage a collection of VMs, the robust web UI allows
you to easily create and manage VMs logically grouped by pod.

Features:

- Juju integration
- At-a-glance visual tools for easy resource management
- Set overcommit ratios for physical resources such as CPU and RAM
- Assign pods to resource pools to segregate your pods into logical groupings
- Track libvirt storage pool usage and assign default storage pools to your
  pods
- Create VMs on multiple networks, specified by space, subnet, VLAN, or IP
  address

<!-- LINKS -->

