Title: Creating and deleting machines
TODO:  
table_of_contents: True

# Creating a machine

While on a pod's details view, select 'Compose' from the 'Take action' drop-down
menu to compose a machine.

![pod compose machine][img__pod-compose-machine]

You can choose which storage to use from a drop-down list.

Click the 'Compose machine' button when you're finished. MAAS will present the pod
detail view. In a few moments, your new machine will be auto-commissioned. The
'Machines' page will reflect this as well.

The new machine's resources will be deducted from the pod's resources:

![pod compose machine commissioning][img__pod-compose-machine-commissioning]

## CLI

Creating RSD machines in MAAS using the CLI is identical to creating KVM virtual
machines. Please see [Creating and deleting machines][create-cli] for more
information.

# Delete a machine

To delete a machine, simply delete it as you would any other MAAS node.  Select
the desired machine from the list of machines and select 'Delete' from the 'Take
Action' menu.

![pod decompose machine][img__pod-decompose-machine]

<!-- LINKS -->

[img__pod-compose-machine]: ../media/manage-kvm-pods__2.5_pod-compose-machine.png
[img__pod-compose-machine-commissioning]: ../media/manage-kvm-pods__2.5_pod-compose-machine-commissioning.png
[img__pod-decompose-machine]: ../media/manage-kvm-pods__2.5_pod-decompose-machine.png

[create-cli]: manage-kvm-create-vms.md#cli
