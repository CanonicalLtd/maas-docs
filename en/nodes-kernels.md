Title: Ubuntu Kernels
TODO:  Warning: Ubuntu codenames are used
table_of_contents: True


# Ubuntu Kernels

MAAS supports four types of kernels for its Ubuntu nodes.

- General availability kernels
- Hardware enablement kernels
- Hardware enablement kernels (pre-release)
- Low latency kernels


## General availability kernels

The *general availability* (GA) kernel is based on the *generic* kernel that
originally ships with a new Ubuntu version. Fixes that have since entered the
package archives get applied regularly due to the 'daily' *stream* that is used
when setting up the global image source for MAAS.

MAAS denotes a GA kernel like this:

`ga-<version>` : The GA kernel has the major kernel version of the kernel which
the corresponding Ubuntu release shipped with. For example, 'ga-16.04' is based
on the 'generic' 4.4 Ubuntu kernel. As per Ubuntu policy, a GA kernel will
never have its major version upgraded (until the release itself is upgraded).


## Hardware enablement kernels

New hardware gets released all the time and if an Ubuntu host is running an
older kernel then that hardware likely won't be supported by it. Ubuntu's
response to this is to backport more recent kernels. Doing this effectively
enables more hardware. Hence, HWE is an acronym for HardWare Enablement.

Clearly, any kernel improvements and new features are also gained by installing
an HWE kernel.

!!! Note: 
    There is the notion of an HWE *stack*. This refers to the (graphical)
    X portion (in addition to the kernel) when the Ubuntu host is running a desktop
    environment. This is not the case with MAAS as nodes are provisioned strictly
    as non-graphical servers.

Note that these backported/HWE kernels are only available for LTS releases
(e.g. Trusty, Xenial, etc). For example, the first available HWE kernel for
Ubuntu 16.04 LTS (Xenial) will be the GA kernel from Ubuntu 16.10 (Yakkety). 

In MAAS, prior to MAAS 2.1 on Xenial, HWE kernels are referred to by the
notation `hwe-<release letter>`. So, to install the Yakkety HWE kernel on
Xenial the `hwe-y` kernel is used. By default, when using the web UI, MAAS
imports all available HWE kernels along with its generic boot images. So if
Trusty images are imported then the following HWE kernels are included:
`hwe-u`, `hwe-v`, `hwe-w`, `hwe-x` (presuming the Xenial HWE kernel is
available).

In MAAS 2.1, starting with Xenial kernels, the notation has changed. The
following is used to refer to the latest HWE kernel available for Xenial:
`hwe-16.04`.

See [MAAS CLI][cli-select-images] for how to target specific HWE kernels when
selecting install images.

See [LTS Enablement Stack][ubuntu-wiki-hwe] (Ubuntu wiki) for the latest
information on HWE.


## Hardware enablement kernels (pre-release)

The pre-release HWE kernel is the HWE kernel that has not been released yet. It
is known as the *edge* HWE kernel.

MAAS denotes the edge kernel like this: `hwe-<version>-edge`.

So 'hwe-16.04' is considered older than 'hwe-16.04-edge'.

See [Rolling LTS Enablement Stack][ubuntu-wiki-hwe-edge] (Ubuntu wiki) for more
information.


## Low latency kernels

The low latency kernel is based on the GA kernel, but uses a more aggressive
configuration to reduce latency. It is categorized as a soft real-time kernel.
For more information see
[Criteria for real-time computing][wikipedia-real-time-computing] (Wikipedia).

MAAS denotes a low latency kernel in a few ways:

- `hwe-x-lowlatency` : the Xenial low latency HWE kernel for Trusty
- `ga-16.04-lowlatency` : the low latency GA kernel for Xenial
- `hwe-16.04-lowlatency` : the low latency HWE kernel for Xenial


## Using kernels

The kernel installed on a node during deployment is, by default, the Ubuntu
release's native kernel (GA). However, it is possible to tell MAAS to use a
different kernel. Kernels can be managed in three ways:

- globally (default minimum enlistment and commissioning kernel)
- per machine (minimum deploy kernel)
- per machine during deployment (specific deploy kernel)

See
[MAAS CLI][cli-set-a-default-minimum-kernel-for-enlistment-and-commissioning]
for how to perform these three configurations from the CLI.

### Default minimum kernel

To set the default minimum enlistment and commissioning kernel (based on Ubuntu
release: GA kernel) for all machines visit the 'General' tab of the 'Settings'
page and select a kernel in the 'Default Minimum Kernel Version' field of the
*Commissioning* section. Don't forget to click 'Save'.

![default minimum kernel][img__2.2_default-minimum-kernel]

### Machine minimum kernel

To set the minimum deploy kernel on a machine basis, select a machine from the
'Nodes' page and switch to its 'Settings' page. Click 'Edit' in the 'Machine
settings' section, select a kernel in the 'Minimum Kernel' field followed by
'Save changes'.

![machine minimum kernel][img__machine-minimum-kernel]

### Machine kernel during deployment

To set a specific kernel during deployment, select a machine from the 'Nodes'
page and choose 'Deploy' under 'Take action'. Then select a kernel in the
(third) kernel field. Hit 'Deploy machine' to initiate the deployment.

![machine during deploy kernel][img__machine-during-deploy-kernel]

MAAS verifies that the specified kernel is available for the given Ubuntu
release (series) before deploying the node. 


<!-- LINKS -->

[cli-select-images]: manage-cli-images.md#select-images
[ubuntu-wiki-hwe]: https://wiki.ubuntu.com/Kernel/LTSEnablementStack
[ubuntu-wiki-hwe-edge]: https://wiki.ubuntu.com/Kernel/RollingLTSEnablementStack#hwe-16.04-edge
[wikipedia-real-time-computing]: https://en.wikipedia.org/wiki/Real-time_computing#Criteria_for_real-time_computing
[cli-set-a-default-minimum-kernel-for-enlistment-and-commissioning]: manage-cli-kernels.md#set-a-default-minimum-kernel-for-enlistment-and-commissioning

[img__2.2_default-minimum-kernel]: ../media/nodes-kernels__2.2_default-minimum-kernel.png
[img__machine-minimum-kernel]: ../media/nodes-kernels__2.3_machine-minimum-kernel.png
[img__machine-during-deploy-kernel]: ../media/nodes-kernels__2.3_machine-during-deploy-kernel.png
