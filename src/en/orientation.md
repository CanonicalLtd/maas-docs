
## Do I Need MAAS?

MAAS certainly isn't for everyone, but why not ask yourself these questions?

You probably *SHOULD* use MAAS if any or all of the following statements are true:

 - You are trying to manage many physical servers.
 - You need to get the most from your resources.
 - You want things to work, repeatably and reliably.


## A Typical MAAS setup

MAAS is designed to work with your physical hardware, whether your setup includes thousands of server boxes or only a few. The key components of the MAAS software are:

 - Region controller
 - Cluster controller(s)
 - Nodes

The nodes are the computers you manage using MAAS. These can range from just a handful to many thousands of systems.

For small (in terms of number of nodes) setups, you will probably just install the Region controller and a cluster controller on the same server - it is only worth having multiple region controllers if you need to organise your nodes into different subnets (e.g. if you have a lot of nodes). If you install the `maas` package, it will include both a region controller and a cluster controller, and they will be automatically set up to work together.

![image](media/orientation_architecture-diagram.*)

## System requirements


## How MAAS is used

MAAS manages a pool of nodes. After registering a new system with the MAAS and preparing it for service ("commissioning"), the new system joins this pool.

From the moment a node is accepted into the MAAS, any operating system, software, or data that it may have had installed before is meant to be overwritten. A node in the pool is under MAAS's sole control, and off-limits to users.

Once you have nodes in the pool, users of the MAAS can allocate them for their own use. At that point, the nodes are installed with the selected operating system and set up with the user's login credentials for remote access. This is referred to as "starting" a node in the browser interface, and as "acquiring" (and, as a separate step, "starting") a node in the API.

When allocating from the API, you can specify constraints such as how much memory you need, how many CPUs, what networks the node should be connected to, what physical zone they should be in, and so on. API commands can also be issued through the `maas` command-line utility.

An allocated node is not like a virtual instance in a cloud: you get complete control, including hardware drivers and root access. To upgrade a BIOS, for example, an administrator could allocate a node to themselves, and run a vendor-supplied upgrade utility. Needless to say, you also get full hardware performance and tweaking!

Once you are done with a node you have allocated, you can release it back to the pool. Once again any data, software, or operating system will no longer be available.

