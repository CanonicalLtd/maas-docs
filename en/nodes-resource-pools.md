Title: Resource pools
TODO:  
table_of_contents: True

# Resource pools

Resource pools allow administrators to logically group resources (nodes and
pods) into pools. All MAAS installations have a resource pool named "default."
New machines are automatically added to the default resource pool.

## Web UI

See [Web UI][webui] for how to get started with the web UI.

Administrators can manage resource pools on the Machines page under the Resource
pools tab.

## Add a resource pool

Use the Add pool button to add a new resource pool.

After giving your new pool a name and description, click the Add pool button:

![add resource pool][img__add-pool]

## Deleting a resource pool

To delete a resource pool, click the trashcan icon next to the pool.

![add resource pool][img__delete-pool]

!!! Note:
    If you delete a resource pool, all machines that belong to that resource pool
    will be returned back to the default pool.

## Add a node to a resource pool

To add a machine to a resource pool, on the Machines page, select the machine you
want to add to the resource pool. Next, select the Configuration tab. Now select
the resource pool and click the Save changes button.

![add resource pool][img__add-machine]

## Removing a node from a resource pool

To remove a machine from a resource pool, simply follow the same procedure to
add a node, except select "default" as the new resource pool. This will return
the machine back to the default resource pool.

## Add a pod to a resource pool

You can add a pod to a resource pool when you create a new pod (see [Pods][createpod]), or
you can edit a pod's configuration:

![add_pod_to_pool][img__pod-to-pool]

## Removing a pod from a resource pool

To remove a pod from a resource pool, simply follow the same procedure to add a
pod to a resource pool, except select "default" as the new resource pool. This
will return the machine back to the default resource pool.

<!-- LINKS -->

[createpod]: nodes-comp-hw.md#add-a-pod
[webui]: installconfig-webui.md

[img__pod-to-pool]: ../media/nodes-comp-hw__2.5_pod_to_pool.png
[img__add-pool]: https://assets.ubuntu.com/v1/2f010325-nodes-resource-pools__2.5_add-pool.png
[img__delete-pool]: https://assets.ubuntu.com/v1/630ed938-nodes-resource-pools__2.5_delete-pool.png
[img__add-machine]: https://assets.ubuntu.com/v1/648e7a8e-nodes-resource-pools__2.5_add-machine.png
