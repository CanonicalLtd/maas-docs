Title: BMC Power Types | MAAS
TODO:  Provide examples for setting up common power types (BMCs)


# BMC Power Types

In order for MAAS to fully manage a node it must be able to power cycle it.
This is done via a communication channel with the [BMC][wikipedia-bmc] card of
the node's underlying system. A newly added node is therefore incomplete until
its power type has been configured. Since each BMC card is different, the
required information to provide MAAS will vary.

To configure a power type, visit the 'Nodes' page, select the node in question
and scroll down to the 'Power' section. There, you should see MAAS prompting
you to set up the power type:

![power types section][img__power-types-section]

Choosing the 'Edit' button will reveal a list of available power types:

![power types selection][img__power-types-selection]


## Example: Virsh (KVM) power type

Consider a node backed by KVM. Below, a 'Power type' of `Virsh` has been
selected and the 'Power address' of `qemu+ssh://ubuntu@10.248.64.2/system` has
been entered (replace values as appropriate). Finally, and out of necessity for
virsh, the value of 'Power ID' is the KVM domain (guest) name, here `node`.

![power types example: virsh][img__power-types-example-virsh]

See [MAAS CLI][cli-update-node-hostname-and-power-parameters] for an example of
how to edit a power type with the CLI.

See [Add nodes][add-nodes-kvm-guest-nodes] for help in setting up MAAS and KVM
to work together.


## BMC driver support

MAAS supports many types of BMC hardware yet not all the drivers have the same
capabilities. See the below table for a feature comparison of the BMC drivers
currently supported by MAAS.

^# BMC driver feature table

  | Power Driver (*X=supported*) | PXE Next Boot | Power Querying | Chassis Configuration | Enhanced UI Error Reporting | BMC Enlistment |
  |:--------------------------------------|-------------|-----------|---------------|-----------------|------------|
  | American Power Conversion (APC) - PDU |             |           |               |                 |            |
  | Cisco UCS Manager                     |      X      |     X     |       X       |                 |            |
  | Digital Loggers, Inc. - PDU           |             |           |               |                 |            |
  | HP Moonshot - iLO Chassis Manager     |      X      |     X     |       X       |                 |            |
  | HP Moonshot - iLO4 (IPMI)             |      X      |     X     |               |                 |     X      |
  | IBM Hardware Management Console (HMC) |      X      |     X     |               |                 |            |
  | IPMI                                  |      X      |     X     |               |       X         |     X      |
  | Intel AMT                             |      X      |     X     |               |       X         |            |
  | Manual                                |             |           |               |                 |            |
  | Microsoft OCS - Chassis Manager       |      X      |     X     |       X       |                 |            |
  | OpenStack Nova                        |             |     X     |               |                 |            |
  | SeaMicro 15000                        |      X      |     X     |       X       |                 |            |
  | Sentry Switch CDU - PDU               |             |           |               |                 |            |
  | VMWare                                |      X      |     X     |       X       |                 |            |
  | Virsh (virtual systems)               |      X      |     X     |       X       |                 |            |


<!-- LINKS -->

[wikipedia-bmc]: https://en.wikipedia.org/wiki/Intelligent_Platform_Management_Interface#Baseboard_management_controller
[cli-update-node-hostname-and-power-parameters]: manage-cli-advanced.md#update-node-hostname-and-power-parameters
[add-nodes-kvm-guest-nodes]: installconfig-add-nodes.md#kvm-guest-nodes

[img__power-types-section]: ../media/installconfig-power-types__section.png
[img__power-types-selection]: ../media/installconfig-power-types__types.png
[img__power-types-example-virsh]: ../media/installconfig-power-types__example-virsh.png
