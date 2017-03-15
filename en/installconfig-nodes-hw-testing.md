Title: Hardware Testing | MAAS
TODO:  Add/link to CLI when functionality becomes available (2.2 release)
       Display test output (require metal-based nodes)


# Hardware Testing

A node's underlying machine can optionally have its hardware tested using
well-known Linux utilities.

Such testing can be performed on a node with a status of 'Ready' (i.e. recently
commissioned) or on a deployed node.

Testing can also be included as part of the commissioning process. The dialog
(described below) will be displayed when the 'Commission' action is chosen. Be
aware that if the hardware tests fail the node will become unavailable for
Deployment.

!!! Note: This feature only works with nodes that are backed by physical
hardware (e.g. it is incompatible with KVM-based nodes).


## Apply a hardware test

To launch a test, on the 'Nodes' page, or within a node's actual view, choose
action 'Test hardware'. When ready, hit button 'Test machine'. Here, a test is
being applied to a deployed node:

![hw test deployed node][img__2.2_hw-testing-deployed]

There is the option of not powering off the node and to allow SSH access.

A default test will be selected (`smartctl-validate`, a hard drive test) but
others can be chosen by clicking the 'Select scripts' label. Doing so will
reveal the following choices:

![hw test deployed node choices][img__2.2_hw-testing-deployed-choices]


<!-- LINKS -->

[img__2.2_hw-testing-deployed]: ../media/installconfig-nodes-hw-testing__2.2_deployed.png
[img__2.2_hw-testing-deployed-choices]: ../media/installconfig-nodes-hw-testing__2.2_deployed-choices.png
