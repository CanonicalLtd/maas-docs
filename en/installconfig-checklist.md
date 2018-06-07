Title: Installation and Configuration Checklist


# Installation and Configuration Checklist

This is a guide that you can use to achieve a working MAAS environment. Once
you perform a step come back here (using the menu in the left pane) to continue
on to the next one.


## Software installation

As explained [here][about-maas], the installation of MAAS consists of the
installation of a rack controller and a region controller which, in turn,
provide a multitude of services. Go ahead and [install MAAS][install-maas]!


## Access the web UI

You *will* be using the web UI so now is the time to log in and take a look
around! Proceed to the [web UI][web-ui] now. This will involve the creation of
an administrator user. Notice how the web UI (API server) is accessed via port
5240 and not port 80.

!!! Note:
    Although the web UI may be accessed via port 80, this is not
    guaranteed to work in future versions of MAAS.


## Zones

For [zones][zones], many people won't need to change anything as a default zone
is provided out of the box. However, they are still worth reading about,
especially if the default one does not suffice.


## Networking

Firstly, in terms of IP addresses, understand what a *reserved range* is by
reading [Concepts and terms](intro-concepts.md#ip-ranges). Create one (not
*reserved dynamic range*) if you need one.

Secondly, configure a default gateway and a nameserver that your nodes will
use. See [Networking](installconfig-networking.md) for how to do this.

<!--
[networks][networks] (points to skeleton page installconfig-network.md)
Lots of stuff can be added to it - see https://git.io/vPLHk
-->


## Import boot images

While you were in the web UI you may have seen a hint to *import boot images*.
[Read up on images][images] as they're quite important. Continue reading until
you have discovered how to import them. You will see that you have the choice
to use the CLI to do this. Either way: achievement unlocked!

!!! Note:
    The import process can take a while. Consider moving on and coming
    back. Just ensure that the import has completed prior to adding a node.


## Access the MAAS CLI

Even if you've imported images with the web UI, it would be wise (and cool?) to
give the [CLI](manage-cli.md) a spin in case you ever need to use it later.
Although we strive to make the web UI feature-equivalent to the CLI, some
things can still only be done with the CLI.


## Enable DHCP

You won't get far without DHCP since it is required in order to make PXE work,
which, in turn, is necessary to introduce your systems to MAAS. But you knew
that. Anyway, DHCP is installed - it just needs enabling.
[Read about DHCP][dhcp] and continue until you have enabled it.


## Users and SSH keys

You already have an administrative user but MAAS can also have regular users
(who log in to the interface or use the CLI). What users you create depends on
how you intend to use MAAS.

Additionally, in order for a user to log into a MAAS-deployed machine that user
*must* have their public SSH key installed on it.

Study [user accounts][user-accounts] to learn about how to create more users
and how to add their SSH keys to MAAS. Once that's done, every deployed machine
will automatically have that key installed.


## Add a node

It's time to actually do something! MAAS manages nodes, but at this time it
doesn't have any. Go forth and [add a node][add-nodes] now. Obviously, you need
a spare physical system (but KVM works too). In the web UI, confirm that the
import of images has finished!

Go to the 'Nodes' page in the web UI. A successfully added node will soon
appear there with a status of *New*. It will also have a funny name. Whatever,
you're still a rock star!


## Edit power type

A node needs to power cycle while being managed by MAAS. The next step is
therefore to tell MAAS how to do this. That is, you need to
[edit the power type][power-type] of the node's BMC.


## Commission a node

Commissioning a node involves MAAS testing it to ensure that it is able to
communicate properly with the region API server. [Commission][commission-nodes]
your node now.


## Deploy a node

Lots of folks would have [Juju][about juju] take over at this point. Juju acts
as a sort of command & control centre for adding services/applications on top
of MAAS nodes (among other "clouds"). If you're just not there and/or you want
to quickly test things out you can use the web UI to
[deploy a node][deploy-nodes] directly.


## SSH to the node

If you [imported your SSH key][ssh-keys] then you should now be able to ssh to
the deployed node by connecting to the 'ubuntu' account. The node's page in the
web UI will inform you of its IP address. Mission accomplished!


<!-- LINKS -->
[about-maas]: index.md#key-components-and-colocation-of-all-services
[install-maas]: installconfig-install.md
[web-ui]: installconfig-gui.md
[zones]: manage-zones.md
[networks]: installconfig-networking.md
[images]: installconfig-images.md
[dhcp]: installconfig-subnets-dhcp.md
[add-nodes]: installconfig-add-nodes.md
[user-accounts]: manage-account.md
[power-type]: installconfig-power-types.md
[commission-nodes]: installconfig-commission-nodes.md
[about-juju]: https://jujucharms.com/docs/stable/about-juju
[deploy-nodes]: installconfig-nodes-deploy.md
[ssh-keys]: manage-account.md#ssh-keys
