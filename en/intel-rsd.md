Title: Intel RSD
TODO:  Add page for deleting a MAAS node and linking from here
       Need to add cover the option of a "virsh chassis Pod"
       This is intel-rsd centric. May need to eventually make it more general
       (composable hardware with intel-rsd as just one example) - will involve file
       renaming :(
table_of_contents: True


# Intel RSD

Intel Rack Scale Design (RSD) is a hardware architecture that allows for the
dynamic composition of physical systems from a pool of available hardware
resources (e.g. disk space, memory, cores). It is an example of *composable
hardware*.

This means a machine request can be made without having to make available
machines beforehand. Modelling tools, such as [Juju][about-juju], can leverage
this functionality when requesting a machine from MAAS, which will dynamically
**create** and Deploy one. Machines can also be requested directly from within
MAAS.

See [MAAS CLI - Composable hardware][manage-cli-comp-hw] for how to manage
Intel RSD with the CLI.


## Definitions

- Intel Rack Scale Design  
  Intel® Rack Scale Design (RSD) is a logical architecture that disaggregates
  compute, storage, and network resources, and introduces the ability to more
  efficiently pool and utilize these resources.
  
- Composed System  
  An Intel RSD term. Used to represent a system that has been created for usage
  as an actual machine in MAAS.
  
- Uncomposed System  
  An Intel RSD term. Used to represent a system that has not been created for
  usage as an actual usable system.
  
- Pod  
  A MAAS term. Use to represent a set of machines or a pool of hardware available
  for MAAS’s control through a single endpoint.


## Web UI

See [Web UI][webui] for how to get started with the web UI.

Composable hardware systems are managed on the 'Pods' page, which is initially
empty:

![initial pods page][img__2.2_pod-initial-page]


### Add a Pod

Add a Pod by using the 'Add pod' button. After choosing 'Rack Scale Design' for
'Pod type' the below form will appear:

![add pod][img__2.2_pod-add]

Fill in the fields (you will need to get values for 'Pod address', 'Pod user',
and 'Pod password' from the Intel RSD administrator) and click 'Save pod'.

### List Pods

The new Pod, including a summary of contained resources, will be listed on the
'Pods' page:

![save pod][img__2.2_pod-list]

### View Pod details

Clicking a Pod's name on the 'Pods' page will reveal the resources contained
within it:

![pod details][img__2.2_pod-details]

### Compose Pod machine

While on a Pod's details view, begin the machine composition process by
pressing the 'Compose machine' button:

![pod compose machine][img__2.2_pod-compose-machine]

Fill in the fields (many are optional) and hit 'Compose machine' to finish. You
will be brought back to the Pod's details view. In a few moments the new
machine will be auto-commissioned:

![pod compose machine commissioning][img__2.2_pod-compose-machine-commissioning]

The main 'Nodes' page should reflect this as well.

As expected, the new machine's resources will be deducted from the Pod's
resources:

![pod machine resources deducted][img__2.2_pod-compose-machine-deducted]

### Decompose a Pod machine

Decomposing a Pod machine means to send the machine's resources back to the Pod
for reuse. Doing so within MAAS will also cause the corresponding MAAS node to
be Deleted.

While on a Pod's details view, select the machine to decompose and choose the
'Delete' button from the dropdown menu:

![pod decompose machine][img__2.2_pod-decompose-machine]

Confirm by hitting the 'Delete machine' button.

!!! Note:
    This operation can also be achieved by simply deleting the corresponding
    MAAS node in the regular way.

Once done, you will be transported back to the main 'Nodes' page.

### Delete a Pod

While on the main Pods page, select a Pod and choose the 'Delete' action from
the dropdown menu. Hit 'Delete 1 pod' to confirm the action:

![pod delete][img__2.2_pod-delete]

Deleting a Pod will also decompose all its machines, thereby also removing all
corresponding nodes from MAAS.


<!-- LINKS -->

[manage-cli-comp-hw]: manage-cli-comp-hw.md
[about-juju]: https://jujucharms.com/docs/stable/about-juju
[webui]: installconfig-webui.md

[img__2.2_pod-initial-page]: ../media/intel-rsd__2.2_pod-initial-page.png
[img__2.2_pod-add]: ../media/intel-rsd__2.2_pod-add.png
[img__2.2_pod-list]: ../media/intel-rsd__2.2_pod-list.png
[img__2.2_pod-details]: ../media/intel-rsd__2.2_pod-details.png
[img__2.2_pod-compose-machine]: ../media/intel-rsd__2.2_pod-compose-machine.png
[img__2.2_pod-compose-machine-commissioning]: ../media/intel-rsd__2.2_pod-compose-machine-commissioning.png
[img__2.2_pod-compose-machine-deducted]: ../media/intel-rsd__2.2_pod-compose-machine-deducted.png
[img__2.2_pod-decompose-machine]: ../media/intel-rsd__2.2_pod-decompose-machine.png
[img__2.2_pod-delete]: ../media/intel-rsd__2.2_pod-delete.png
