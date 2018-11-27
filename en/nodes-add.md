Title: Add Nodes
table_of_contents: True


# Add Nodes

Adding a node to MAAS is typically done via a combination of DHCP (and TFTP),
which should, by now, be enabled in your MAAS environment, and PXE, which you
tell the system in question to use when it boots. This unattended manner of
adding a node is called *enlistment*.

!!! Note: 
    Configuring a computer to boot over PXE is done via its BIOS and is
    often referred to as "netboot" or "network boot".

Regardless of how a node is added, there are no special requirements for the
underlying machine. In particular, there is no need to install an operating
system on it.

Once MAAS is working to the point of adding nodes it is important to
understand node statuses and node actions. See
[Node statuses][concepts-statuses] and [Node actions][concepts-actions]
respectively.

## Enlistment

As explained, to enlist, the underlying machine needs to be configured to
netboot. Such a machine will undergo the following process:

1. DHCP server is contacted
1. kernel and initrd are received over TFTP
1. machine boots
1. initrd mounts a Squashfs image ephemerally over HTTP
1. cloud-init runs enlistment and built-in commissioning scripts
1. machine shuts down

The enlistment scripts will send the region API server information about the
machine, including the architecture, MAC address and other details which will
be stored in the database. This information-gathering process is known as
*automatic discovery*.

After the enlistment process, the machine will be placed in the 'New' state.

Typically, the next step will be to *commission* the node. See
[Commission nodes][commission-nodes].

!!! Note:

    MAAS runs built-in commissioning scripts during the enlistment phase so that
    when you commission a node, any customised commissioning scripts you add
    will have access to data collected during enlistment. Follow the link above
    for more information about commissioning and commission scripts.


As an alternative to enlistment, an administrator can add a node manually (see
[below][anchor-add-a-node-manually]). Typically this is done when enlistment
doesn't work for some reason.


## KVM host nodes

For more information about adding nodes to use as KVM hosts, please see [Add KVM
pods][kvmhosts].


## Adding virtual machines as nodes

After you have deployed a machine to use as a KVM host, you can "compose" VMs to
add to MAAS. Please see the [Compose a virtual machine section][kvmwebui] for more
information.

## Add a node manually

Enlistment can be done manually if the hardware specifications of the
underlying machine are known. On the 'Machines' page of the web UI, click the
'Add hardware' button and then select 'Machine'.

Fill in the form and hit 'Save machine'. In this example, IPMI machine is
being added:

![add node manually][img__add-node-manually]

!!! Note:
    The underlying machine will still need to be configured to boot over the
    network in order to be commissioned. MAAS will not do this for you.

### BMC enlistment

#### 2.4

Note that in MAAS versions prior to 2.5, you are required to provide the MAC
address of the PXE interface when adding a new machine manually.

#### 2.5+

Beginning with MAAS 2.5:

##### IPMI machines

For IPMI machines, you only need to provide IPMI credentials. MAAS
automatically discovers the machine and runs enlistment configuration by
matching the BMC address.

##### Non-IPMI machines

For non-IPMI machines, you must specify a non-PXE MAC address. MAAS
automatically discovers the machine and runs enlistment configuration by
matching the non-PXE MAC address.


## Add nodes via a chassis

Use the *chassis* feature to add multiple nodes at once. To do this, instead of
selecting 'Machine' as above, choose 'Chassis' from the drop-down menu. In the
following example, MAAS will add all available VMs from the given virsh address:

![add node via chassis][img__add-node-chassis]

The required fields will change based on the type of chassis you choose.

!!! Note:
    As with the manual method, the underlying machines will require netbooting.



<!-- LINKS -->

[kvmwebui]: manage-pods-webui.md#compose-a-machine
[kvmhosts]: manage-pods-webui.md#add-a-kvm-host
[concepts-statuses]: intro-concepts.md#node-statuses
[concepts-actions]: intro-concepts.md#node-actions
[commission-nodes]: nodes-commission.md
[anchor-add-a-node-manually]: #add-a-node-manually
[power-types-example-virsh]: nodes-power-types.md#example:-virsh-(kvm)-power-type
[composable-hardware]: nodes-comp-hw.md

[img__add-node-manually]: https://assets.ubuntu.com/v1/20aa36b2-nodes-add__2.5_add-node-manually.png
[img__add-node-chassis]: https://assets.ubuntu.com/v1/d5314a8a-nodes-add__2.4_add-node-chassis.png
