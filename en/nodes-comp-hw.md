Title: Composable Hardware
TODO:  Need to cover the option of a "virsh chassis" (but not here)
       Track bug: https://bugs.launchpad.net/maas/+bug/1688066
table_of_contents: True


# Composable Hardware

Composable Hardware allows for the dynamic composition of systems from a pool
of available hardware resources (e.g. disk space, memory, cores). This
collection of resources is what MAAS calls a *Pod*.

This enables a machine request to be made without having machines pre-built.
Modelling tools, such as [Juju][about-juju], can leverage this functionality
when requesting a machine from MAAS, which will dynamically **create** and
Deploy one. Machines can also be requested directly from within MAAS.

MAAS currently supports two such architectures:

- Intel Rack Scale Design (RSD)
- Virsh

!!! Note:
    For RSD, MAAS has only been validated to work with Intel RSD reference
    software release v.1.2.5, based on Redfish API v.1.0 and RSD PODM API v.1.0.

See [MAAS CLI - Composable hardware][manage-cli-comp-hw] for how to manage
composable hardware with the CLI.


## Web UI

See [Web UI][webui] for how to get started with the web UI.

Composable hardware systems are managed on the 'Pods' page, which is initially
empty:

![initial pods page][img__2.2_pod-initial-page]


### Add a Pod

Add/register a Pod by using the 'Add pod' button.

The first example depicts an RSD Pod being added. After choosing 'Rack Scale
Design' for 'Pod type' the below form will appear:

![add pod][img__2.2_pod-add-rsd]

Fill in the fields. You will need to get values for 'Pod address' (IP address
or URL followed by a port), 'Pod user', and 'Pod password' from the RSD
administrator. Then click 'Save pod'.

Once added, MAAS will automatically discover and store the resources that a
Pod contains. Any pre-composed machines will also appear on the 'Nodes' page
and be commissioned. 

This is how a Virsh Pod is added:

![add pod][img__2.2_pod-add-virsh]

Virsh Pod notes:

- Typically, the KVM host will have a network bridge set up with a libvirt
  network configured to use it.
- Alternatively, if KVM and MAAS reside on the same system the default NAT
  libvirt network can be used by disabling DHCP on it and enabling MAAS DHCP on
  the VLAN associated with the libvirt subnet of 192.168.122.0/24.
- MAAS will always use the libvirt network called `default`.
- KVM guests subsequently created (composed) will not, by default, have a
  graphics card added at the libvirt level. See
  [LP #1688066][launchpad-bug-1688066].

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
[launchpad-bug-1688066]: https://bugs.launchpad.net/maas/+bug/1688066

[img__2.2_pod-initial-page]: ../media/intel-rsd__2.2_pod-initial-page.png
[img__2.2_pod-add-rsd]: ../media/intel-rsd__2.2_pod-add-rsd.png
[img__2.2_pod-add-virsh]: ../media/intel-rsd__2.2_pod-add-virsh.png
[img__2.2_pod-list]: ../media/intel-rsd__2.2_pod-list.png
[img__2.2_pod-details]: ../media/intel-rsd__2.2_pod-details.png
[img__2.2_pod-compose-machine]: ../media/intel-rsd__2.2_pod-compose-machine.png
[img__2.2_pod-compose-machine-commissioning]: ../media/intel-rsd__2.2_pod-compose-machine-commissioning.png
[img__2.2_pod-compose-machine-deducted]: ../media/intel-rsd__2.2_pod-compose-machine-deducted.png
[img__2.2_pod-decompose-machine]: ../media/intel-rsd__2.2_pod-decompose-machine.png
[img__2.2_pod-delete]: ../media/intel-rsd__2.2_pod-delete.png
