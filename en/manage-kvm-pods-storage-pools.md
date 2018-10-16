# Storage pools

Libvirt “storage pools” are storage resources managed by libvirt. For a
more in-depth take on libvirt storage pools, see
[here](https://libvirt.org/storage.html).

MAAS displays information about each pod's storage pools so you can understand
your resource usage at a glance:

![storagepoolusage][img__storagepoolusage]

When you [compose a new VM within a MAAS pod][composevm], you can choose which
storage pool to use from a drop-down list:

![storagepoolavail][img__storagepoolavail]

You can also use the [MAAS CLI][cli-compose-with-storage] to compose pod VMs
with specific storage pool constraints.


<!-- LINKS -->


[img__kvmpoddeploy]: ../media/manage-kvm-pods__2.5_kvm-pod-deploy.png
[img__storagepoolusage]: ../media/manage-kvm-pods__2.5_libvirt_storage_usage.png
[img__storagepoolavail]: ../media/manage-kvm-pods__2.5_libvirt_storage.png

[composevm]: manage-kvm-pods-webui.md#compose-a-pod-machine
[cli-compose-with-storage]: manage-cli-comp-hw.md#compose-pod-machines

