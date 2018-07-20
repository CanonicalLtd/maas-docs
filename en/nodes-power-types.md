Title: BMC Power Types
TODO:  Provide examples for setting up common power types (BMCs)
       Consider putting power check troubleshooting notes on the troubleshooting page
table_of_contents: True


# BMC Power Types

In order for MAAS to fully manage a node it must be able to power cycle it.
This is done via a communication channel with the [BMC][wikipedia-bmc] card of
the node's underlying system. A newly added node is therefore incomplete until
its power type has been configured.

To configure a node's power type, begin by clicking on the node from the
'Machines' page of the web UI followed by its 'Configuration' tab. Scroll down
for *Power configuration*. If the power type is undefined the following will be
displayed:

![power types undefined][img__power-types-undefined]

Choose a type in the dropdown menu that corresponds to the node's underlying
machine's BMC card.

![power types selection][img__power-types-selection]

Fill in the resulting form. The information requested will depend upon the
power type chosen.

Click 'Save changes' to finish. Once that's done, a power check will be
performed on the node. This is a good indication of whether MAAS can
communicate properly with the node. A successful power check will quickly
result in a power status of "Power off". A failed one will show:

![power types power error][img__power-types-power-error]

If you get such an error double-check your entered values by editing the power
type. Also consider another power type altogether. Another cause may be at the
networking level; traffic may be getting filtered between the rack controller
and the BMC card.


## Example: Virsh (KVM) power type

Consider a node backed by KVM. Below, a 'Power type' of `Virsh` has been
selected and the 'Power address' of `qemu+ssh://ubuntu@192.168.1.2/system` has
been entered (replace values as appropriate). Finally, and out of necessity for
virsh, the value of 'Power ID' is the KVM domain (guest) name, here `node2`.

![power types example: virsh][img__power-types-example-virsh]

> ⓘ The node's hostname *according to MAAS* is a randomly chosen string (here `dear.ant`). This would normally be edited to reflect the hostname of the underlying machine.

See [MAAS CLI][cli-update-node-hostname-and-power-parameters] for an example of
how to edit a power type with the CLI.

See [Add nodes][add-nodes-kvm-guest-nodes] for help in setting up MAAS and KVM
to work together.

Multiple Virsh machines running on the same host are managed and composed using
[Pods][pods]. 


## BMC driver support

MAAS supports many types of BMC hardware yet not all the drivers have the same
capabilities. See the below table for a feature comparison of the BMC drivers
currently supported by MAAS.

| Power Driver (*X=supported*) | PXE Next Boot | Power Querying | Chassis/Pod Configuration | Enhanced UI Error Reporting | BMC Enlistment |
|:--------------------------------------|-------------|-----------|---------------|-----------------|------------|
| American Power Conversion (APC) - PDU |             |           |               |                 |            |
| Cisco UCS Manager                     |      X      |     X     |       X       |                 |            |
| Digital Loggers, Inc. - PDU           |             |           |               |                 |            |
| Facebook's Wedge `*`                  |             |           |               |                 |            |
| HP Moonshot - iLO Chassis Manager     |      X      |     X     |       X       |                 |            |
| HP Moonshot - iLO4 (IPMI)             |      X      |     X     |               |                 |     X      |
| IBM Hardware Management Console (HMC) |      X      |     X     |               |                 |            |
| IPMI                                  |      X      |     X     |               |       X         |     X      |
| Intel AMT                             |      X      |     X     |               |       X         |            |
| Manual                                |             |           |               |                 |            |
| Microsoft OCS - Chassis Manager       |      X      |     X     |       X       |                 |            |
| OpenStack Nova                        |             |     X     |               |                 |            |
| Rack Scale Design                     |      X      |     X     |       X       |                 |            |
| SeaMicro 15000                        |      X      |     X     |       X       |                 |            |
| Sentry Switch CDU - PDU               |             |           |               |                 |            |
| VMWare                                |      X      |     X     |       X       |                 |            |
| Virsh (virtual systems)               |      X      |     X     |       X       |                 |            |

`*` The 'Facebook's Wedge' OpenBMC power driver is considered experimental at this time.


<!-- LINKS -->

[wikipedia-bmc]: https://en.wikipedia.org/wiki/Intelligent_Platform_Management_Interface#Baseboard_management_controller
[cli-update-node-hostname-and-power-parameters]: manage-cli-advanced.md#update-node-hostname-and-power-parameters
[add-nodes-kvm-guest-nodes]: nodes-add.md#kvm-guest-nodes
[pods]: nodes-comp-hw.md

[img__power-types-undefined]: ../media/nodes-power-types__2.4_undefined.png
[img__power-types-selection]: ../media/nodes-power-types__2.4_selection.png
[img__power-types-example-virsh]: ../media/nodes-power-types__2.4_example-virsh.png
[img__power-types-power-error]: ../media/nodes-power-types__2.4_power-error.png
