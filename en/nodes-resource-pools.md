Title: Resource pools
TODO:  
table_of_contents: True

# Resource pools

Resource pools allow administrators to logically group resources (nodes) into
pools. All MAAS installations have a resource pool named "default." New machines
are automatically added to the default resource pool.

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

To remove a machine from a resource pool, simply follow the procedure above,
except select "default" as the new resource pool. This will return the machine
back to the default resource pool.

<!-- LINKS -->

[webui]: installconfig-webui.md

[img__add-pool]: ../media/nodes-resource-pools__2.5_add-pool.png
[img__delete-pool]: ../media/nodes-resource-pools__2.5_delete-pool.png
[img__add-machine]: ../media/nodes-resource-pools__2.5_add-machine.png
