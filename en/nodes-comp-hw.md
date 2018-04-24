Title: Pods
TODO:  Track bug: https://bugs.launchpad.net/maas/+bug/1688066
table_of_contents: True


# Pods

Pods, or composable hardware, allow for the dynamic composition of nodes from a pool
of available hardware resources (e.g. disk space, memory, cores).

This enables a machine request to be made without having machines pre-built.
Modelling tools, such as [Juju][about-juju], can leverage this functionality
when requesting a machine from MAAS, which will dynamically **create** and
Deploy one. Machines can also be requested directly from within MAAS.

MAAS currently supports two such architectures:

- Intel Rack Scale Design (RSD)
- Virsh (KVM)

!!! Note:
    For RSD, MAAS has only been validated to work with Intel RSD reference
    software release v.1.2.5, based on Redfish API v.1.0 and RSD PODM API v.1.0.

See [MAAS CLI - Composable hardware][cli-comp-hw] for how to manage composable
hardware with the CLI.


## Web UI

See [Web UI][webui] for how to get started with the web UI.

Composable hardware systems are managed on the 'Pods' page, which is initially
empty:

![initial pods page][img__pod-initial-page]


### Add a Pod

Add/register a Pod by using the 'Add pod' button.

The first example depicts an RSD Pod being added. After choosing 'Rack Scale
Design' for 'Pod type' the below form will appear:

![add RSD pod][img__pod-add-rsd]

Fill in the fields. You will need to get values for 'Pod address' (IP address
or URL followed by a port), 'Pod user', and 'Pod password' from the RSD
administrator. Then click 'Save pod'.

Once added, MAAS will automatically discover and store the resources that a
Pod contains. Any pre-composed machines will also appear on the 'Machines' page
and be commissioned. 

This is how a Virsh Pod is added:

![add Virsh pod][img__pod-add-virsh]

Virsh Pod notes:

- Typically, the KVM host will have a network bridge set up with a libvirt
  network configured to use it.
- Alternatively, if KVM and MAAS reside on the same system the default NAT
  libvirt network can be used by disabling DHCP on it and enabling MAAS DHCP on
  the VLAN associated with the libvirt subnet of 192.168.122.0/24.
- MAAS will first look for a libvirt network named 'maas', then for 'default'.
- A default *storage pool* can optionally be set. This feature uses storage
  tags to automatically map a storage pool in libvirt with a storage tag in
  MAAS. With no default storage pool defined, MAAS selects the storage pool with
  the most available space.

### List Pods

The new Pod, including a summary of contained resources, will be listed on the
'Pods' page:

![save pod][img__pod-list]

### View Pod details

Clicking a Pod's name on the 'Pods' page will reveal the resources contained
within it, including its total number of CPU cores, the amount of total RAM and
local storage. These values update to reflect usage and remaining resources.

The main view also lists the machines contained within the pod.

![pod details][img__pod-details]

### Configuration

Pods have several configuration options. These that are modified by selecting the
'Configuration' tab and clicking 'Edit'. These options include a pod's
location, password, network zone and default storage pool.

Additionally, two sliders are used to set *over commmit* ratios for CPU and
memory resources. Over committed resources are those allocated beyond what's
available to the pod. These sliders allow you to strictly limit whether CPU and
memory can be over committed, and to what extent.

![pod configuration][img__pod-compose-config]

### Compose Pod machine

While on a Pod's details view, begin the machine composition process by
selecting 'Compose' from the 'Take action' dropdown menu:

![pod compose machine][img__pod-compose-machine]

Fill in the fields (many are optional) and hit 'Compose machine' to finish. You
will be brought back to the Pod's details view. In a few moments the new
machine will be auto-commissioned.

The main 'Machines' page should reflect this as well.

As expected, the new machine's resources will be deducted from the Pod's
resources:

![pod compose machine commissioning][img__pod-compose-machine-commissioning]

### Decompose a Pod machine

Decomposing a Pod machine means to send the machine's resources back to the Pod
for reuse. Doing so within MAAS will also cause the corresponding MAAS node to
be Deleted.

While on a Pod's details view, select the machine to decompose and choose the
'Delete' button from the dropdown menu:

![pod decompose machine][img__pod-decompose-machine]

Confirm by hitting the 'Delete machine' button.

!!! Note:
    This operation can also be achieved by simply deleting the corresponding
    MAAS node in the regular way.

Once done, you will be transported back to the main 'Machines' page.

### Delete a Pod

While on the main Pods page, select a Pod and choose the 'Delete' action from
the dropdown menu. Hit 'Delete 1 pod' to confirm the action:

![pod delete][img__pod-delete]

Deleting a Pod will also decompose all its machines, thereby also removing all
corresponding nodes from MAAS.


<!-- LINKS -->

[cli-comp-hw]: manage-cli-comp-hw.md
[about-juju]: https://jujucharms.com/docs/stable/about-juju
[webui]: installconfig-webui.md
[launchpad-bug-1688066]: https://bugs.launchpad.net/maas/+bug/1688066

[img__pod-initial-page]: ../media/nodes-comp-hw__2.4_pod-initial-page.png
[img__pod-add-rsd]: ../media/nodes-comp-hw__2.4_pod-add-rsd.png
[img__pod-add-virsh]: ../media/nodes-comp-hw__2.4_pod-add-virsh.png
[img__pod-list]: ../media/nodes-comp-hw__2.4_pod-list.png
[img__pod-details]: ../media/nodes-comp-hw__2.4_pod-details.png
[img__pod-compose-config]: ./media/nodes-comp-hw__2.4_pod-compose-config.png
[img__pod-compose-machine]: ../media/nodes-comp-hw__2.4_pod-compose-machine.png
[img__pod-compose-machine-commissioning]: ../media/nodes-comp-hw__2.4_pod-compose-machine-commissioning.png
[img__pod-decompose-machine]: ../media/nodes-comp-hw__2.4_pod-decompose-machine.png
[img__pod-delete]: ../media/nodes-comp-hw__2.4_pod-delete.png
