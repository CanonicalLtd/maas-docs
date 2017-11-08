Title: Hardware Testing
TODO:  Display test output (require metal-based nodes)


# Hardware Testing

A node's underlying machine can optionally have its hardware tested using
well-known Linux utilities.

Such testing can be performed on a node with a status of 'Ready' (i.e. recently
commissioned), broken or on a deployed node.

Testing can also be included as part of the commissioning process. The dialog
(described below) will be displayed when the 'Commission' action is chosen. Be
aware that if the hardware tests fail the node will become unavailable for
Deployment.

!!! Note: 
    The majority of testing scripts only work with nodes that are backed by
    physical hardware (e.g. they may be incompatible with KVM-based nodes).


## Apply a hardware test

To launch a test, select the target machine from the 'Nodes' page and use the
'Take action' drop-down menu to select 'Test hardware'. When ready, hit button
'Test machine'. Here, a test is being applied to a deployed node:

![hw test deployed node][img__2.2_hw-testing-deployed]

There is the option of not powering off the node and to allow SSH access.

A default test will be selected (`smartctl-validate`, a hard drive test) but
others can be chosen by clicking the 'Select scripts' label. Doing so will
reveal the following choices:

![hw test deployed node choices][img__2.2_hw-testing-deployed-choices]

## Included scripts

The following hardware testing scripts can be selected from the web UI:

| Name                       | Category Tags   | Description
|:-:                         |:-:      | :-:
| **smartctl-short** | storage | Run the short SMART self-test and validate SMART health on all drives in parallel |
| **smartctl-long**  | storage | Run the long SMART self-test and validate SMART health on all drives in parallel |
| **smartctl-conveyance** | storage | Run the conveyance SMART self-test and validate SMART health on all drives in parallel |
| **memtester** | memory | Run memtester against all available userspace memory. |
| **internet-connectivity** | network, internet, node | Check if the system has access to the internet. |
| **stress-ng-cpu-long** | cpu | Run stress-ng memory tests for 12 hours. |
| **stress-ng-cpu-short** | cpu | Run stress-ng memory tests for 5 minutes. |
| **stress-ng-memory-long** | memory | Run stress-ng memory tests for 12 hours. |
| **stress-ng-memory-short** | memory | Run stress-ng memory tests for 5 minutes. |
| **ntp** | network, ntp, node | Run ntp clock set to verify NTP connectivity. |
| **badblocks** | storage | Run badblocks on disk in read-only mode. |
| **badblocks-destructive** | destructive, storage | Run badblocks on a disk in read/write destructive mode. |
| **7z** | cpu | Run *7zip* CPU benchmarking. |
| **fio** | storage, destructive | Run Fio benchmarking against selected storage devices. |

After either commissioning, testing, or installation has started, MAAS reports
in real time which script is running.

The verbatim output from any tests is accessed by selecting a node, selecting
the 'Hardware tests' page and clicking on the name of the specific test.

See [Hardware Testing Scripts][nodes-hw-scripts] for more details on how
these scripts work and how you can write your own.

<!-- LINKS -->
[nodes-hw-scripts]: nodes-hw-scripts.md

<!-- IMAGES -->
[img__2.2_hw-testing-deployed]: ../media/nodes-hw-testing__2.2_deployed.png
[img__2.2_hw-testing-deployed-choices]: ../media/nodes-hw-testing__2.2_deployed-choices.png
