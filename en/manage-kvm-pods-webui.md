Title: Web UI
TODO:  
table_of_contents: True

# Web UI

See [Web UI][webui] for how to get started with the web UI.

After installing MAAS, the 'Pods' page is typically empty:

![initial pods page][img__pod-initial-page]


## Add a pod

The recommended way to add a KVM host pod is to deploy a machine as a KVM host
as explained [here][kvmdeploy]. However, you can add a pod manually using the
'Add pod' button (see [the following section][manualkvm] for caveats to this
approach).

### Creating a KVM pod manually

![add Virsh pod][img__pod-add-virsh]


## List pods

Pods and a summary of contained resources will be listed on the 'Pods' page:

![save pod][img__pod-list]

## View pod details

Click a pod's name on the 'Pods' page to show the resources contained within it,
including its total number of CPU cores, the amount of total RAM and local
storage. These values update to reflect usage and remaining resources.

The main view also lists the machines contained within the pod.

![pod details][img__pod-details]

## Configuration

Pods have several configuration options. These are modified by selecting the
'Configuration' tab and clicking 'Edit'. Options include a pod's location,
password, network zone, and default storage pool.

### Storage pools

See [Storage pools][storagepools] for more information about configuring KVM
storage pools.

### Overcommit resources

Overcommitted resources are those allocated beyond what's available in the
physical resource. Sliders on the configuration page allow you to strictly limit
whether CPU and memory can be over committed, and to what extent. The input
fields to the right of the sliders accept floating point values from 0 to 10,
with a default value of 1.

The following shows theoretical examples of these ratios and how they affect
physical resource allocation:

- `8 physical CPU cores  * 1 multiplier     = 8 virtual CPU cores`
- `8 physical CPU cores  * 0.5 multiplier   = 4 virtual CPU cores`
- `32 physical CPU cores * 10.0 multiplier  = 320 virtual CPU cores`
- `128GB physical Memory  * 5.5 multiplier  = 704G virtual Memory`

![pod configuration][img__pod-compose-config]

Overcommitting resources allows a user to compose many MAAS-managed VMs without
worrying about the physical limitations of the host. For example, on a physical
host with 4 cores and 12 GB of memory, you could compose 4 virsh nodes, each
using 2 cores and 4 GB of memory, obviously over-committing the available
physical resources. Provided you never run all 4 simultaneously, you'd have all
the benefits of MAAS-managed VMs without over-taxing your host.

## Compose a virtual machine

While on a pod's details view, begin the machine composition process by
selecting 'Compose' from the 'Take action' dropdown menu:

![pod compose machine][img__pod-compose-machine]

Fill in the fields (many are optional) and hit 'Compose machine' to finish. You
will be brought back to the pod's details view. In a few moments the new
machine will be auto-commissioned.

The main 'Machines' page should reflect this as well.

As expected, the new machine's resources will be deducted from the pod's
resources:

![pod compose machine commissioning][img__pod-compose-machine-commissioning]

## Delete a virtual machine

To delete virtual machine, simply delete it as you would any other MAAS node.
Select the desired machine from the list of machines and select 'Delete' from
the 'Take Action' menu.

![pod decompose machine][img__pod-decompose-machine]

## Delete a pod

While on the main pods page, select a pod and choose the 'Delete' action from
the dropdown menu. Hit 'Delete 1 pod' to confirm the action:

![pod delete][img__pod-delete]

Deleting a pod will also decompose all its machines, thereby also removing all
corresponding nodes from MAAS.



<!-- LINKS -->


[img__pod-initial-page]: ../media/manage-kvm-pods__2.5_pod-initial-page.png
[img__pod-add-rsd]: ../media/manage-kvm-pods__2.5_pod-add-rsd.png
[img__pod-add-virsh]: ../media/manage-kvm-pods__2.5_pod-add-virsh.png
[img__pod-list]: ../media/manage-kvm-pods__2.5_pod-list.png
[img__pod-details]: ../media/manage-kvm-pods__2.5_pod-details.png
[img__pod-compose-config]: ../media/manage-kvm-pods__2.5_pod-compose-config.png
[img__pod-compose-machine]: ../media/manage-kvm-pods__2.5_pod-compose-machine.png
[img__pod-compose-machine-commissioning]: ../media/manage-kvm-pods__2.5_pod-compose-machine-commissioning.png
[img__pod-decompose-machine]: ../media/manage-kvm-pods__2.5_pod-decompose-machine.png
[img__pod-delete]: ../media/manage-kvm-pods__2.5_pod-delete.png

[kvmdeploy]: manage-kvm-pods-add.md
[manualkvm]: manage-kvm-pods-add.md#manual/pre-2.5
[cli-compose-with-storage]: manage-cli-comp-hw.md#compose-pod-machines
[storagepools]: manage-kvm-pods-storage-pools.md
[webui]: installconfig-webui.md
