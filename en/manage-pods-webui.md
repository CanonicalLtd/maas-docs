Title: Web UI
TODO:  
table_of_contents: True

# Web UI

See [Web UI][webui] for how to get started with the web UI.

After installing MAAS, the 'Pods' page is typically empty:

![initial pods page][img__pod-initial-page]


## Add a KVM host

The recommended way to add a KVM host is to deploy an acquired machine as a KVM
host as explained [here][kvmdeploy]. However, you can add a pod manually using
the 'Add pod' button (see [the following section][manualkvm] for caveats to this
approach).

### Add manually

Add a KVM host by using the 'Add pod' button. Choose 'Virsh (Virtual systems)'
from the 'Pod type' drop-down menu.

![add Virsh pod][img__pod-add-virsh]

Here, 'Virsh address' typically looks like:

```no-highlight
qemu+ssh://<kvm host IP>/system
```

You can [set up public-key SSH access][setup-ssh] or supply a username and
password so that MAAS can interact with Virsh on the KVM host.

!!! Note:
    MAAS will automatically discover and store the resources your KVM host
    contains. Any existing machines will also appear on the 'Machines' page and
    be commissioned.

## Add an RSD Pod

Add an RSD Pod by using the 'Add pod' button. Choose 'Rack Scale Design' from
the Pod type drop-down menu.

![add RSD pod][img__pod-add-rsd]

You will need to get values for 'Pod address' (IP address or URL followed by a
port), 'Pod user', and 'Pod password' from your RSD administrator.

!!! Note:
    MAAS will automatically discover and store the resources your RSD Pod
    contains.

## List pods

Pods and a summary of their resources are listed on the 'Pods' page:

![save pod][img__pod-list]

## View pod details

One the 'Pods' page, click a pod's name to show the resources that belong to it,
including total number of CPU cores, the amount of total RAM and local storage.
These values update to reflect usage and remaining resources.

The main view also lists the machines contained within the pod.

![pod details][img__pod-details]

## Configuration

Pods have several configuration options. Modify these by selecting the
'Configuration' tab and clicking 'Edit'. Options include a pod's location,
password, network zone, and default storage pool.

### KVM host storage pools

See [KVM host storage pools][storagepools] for more information about
configuring KVM storage pools.

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

Overcommitting resources allows a user to compose many MAAS-managed machines without
worrying about the physical limitations of the host. For example, on a physical
host with 4 cores and 12 GB of memory, you could compose 4 virsh nodes, each
using 2 cores and 4 GB of memory, obviously over-committing the available
physical resources. Provided you never run all 4 simultaneously, you'd have all
the benefits of MAAS-managed VMs without over-taxing your host.

## Compose a machine

While on a pod's details view, select 'Compose' from the 'Take action' drop-down
menu to compose a machine.

![pod compose machine][img__pod-compose-machine]

Click the 'Compose machine' button when you're finished. MAAS will present the pod
detail view. In a few moments, your new machine will be auto-commissioned. The
'Machines' page will reflect this as well.

The new machine's resources will be deducted from the pod's resources:

![pod compose machine commissioning][img__pod-compose-machine-commissioning]

## Delete a machine

To delete a machine, simply delete it as you would any other MAAS node.  Select
the desired machine from the list of machines and select 'Delete' from the 'Take
Action' menu.

![pod decompose machine][img__pod-decompose-machine]

## Delete a pod

While on the main pods page, select a pod and choose the 'Delete' action from
the 'Take action' dropdown menu. Click 'Delete 1 pod' to confirm the action:

![pod delete][img__pod-delete]

Deleting a pod will also decompose all its machines, thereby also removing all
corresponding nodes from MAAS.



<!-- LINKS -->


[img__pod-initial-page]: ../media/manage-kvm-pods__2.5_pod-initial-page.png
[img__pod-add-rsd]: ../media/nodes-comp-hw__2.4_pod-add-rsd.png
[img__pod-add-virsh]: ../media/manage-kvm-pods__2.5_pod-add-virsh.png
[img__pod-list]: ../media/manage-kvm-pods__2.5_pod-list.png
[img__pod-details]: ../media/manage-kvm-pods__2.5_pod-details.png
[img__pod-compose-config]: ../media/manage-kvm-pods__2.5_pod-compose-config.png
[img__pod-compose-machine]: ../media/manage-kvm-pods__2.5_pod-compose-machine.png
[img__pod-compose-machine-commissioning]: ../media/manage-kvm-pods__2.5_pod-compose-machine-commissioning.png
[img__pod-decompose-machine]: ../media/manage-kvm-pods__2.5_pod-decompose-machine.png
[img__pod-delete]: ../media/manage-kvm-pods__2.5_pod-delete.png

[setup-ssh]: manage-kvm-pods-add.html#set-up-ssh
[kvmdeploy]: manage-kvm-pods-add.md
[manualkvm]: manage-kvm-pods-add.md#manual/pre-2.5
[cli-compose-with-storage]: manage-cli-comp-hw.md#compose-pod-machines
[storagepools]: manage-kvm-pods-storage-pools.md
[webui]: installconfig-webui.md
