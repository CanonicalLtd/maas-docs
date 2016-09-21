Title: Installation and Configuration Checklist


# Installation and Configuration Checklist

This is a list of required and/or important steps that require fulfilling in
order to get a working MAAS. Once you perform a step come back here (using the
menu in the left pane) to continue to the next step.


## Software installation

As explained [here][about-maas], the installation of MAAS consists of the
installation of a rack controller and a region controller which, in turn,
provide a multitude of services. Go ahead and [install MAAS][install-maas]!


## Access the web UI

You *will* be using the web UI so now is the time to log in and take a look
around! Proceed to the [web UI][web-ui] now. This will involve the creation of
an administrator user.


## Zones and networks

Reading time. Many people won't need to actually change anything here but it is
still worth reading about [zones][zones] and [networks][networks]. Don't let it
slow you down too much.


## Import boot images

While you were in the web UI you may have seen a hint to *import boot images*.
[Read up on images][images] as they're quite important. Continue reading until
you have discovered how to import them. You will see that you have the choice
to use the CLI to do this. Either way: achievement unlocked!


## Access the MAAS CLI

Even if you've imported images with the web UI, it would be wise (and cool?) to
give the CLI a spin in case you ever need to use it later. Although we strive
to make the UI feature-equivalent to the CLI, some things can still only be
done with the CLI.


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

It's time to actually do something. MAAS manages nodes, but at this time it
doesn't have any. Go forth and [add a node][add-nodes] now. Obviously, you need
a spare physical system (but KVM works too!).

Go to the 'Nodes' page in the web UI. A successfully added node will soon
appear there with a status of *New*. It will also have a funny name. Whatever,
you're still a rock star!


## Commission a node

Commissioning a node involves MAAS testing it to ensure that it is able to
communicate properly with the region API server. [Commission][commission-nodes]
your node now.


## Deploy a node

Lots of folks would have [Juju][juju-getting-started] take over at this point.
Juju acts as a sort of command & control centre for adding
services/applications on top of MAAS nodes (among other "clouds"). If you're
just not there and/or you want to quickly test things out you can use the web
UI to [deploy a node][deploy-nodes] directly.


## Connect to the deployed node

Once the node is deployed it should have a status of *Deployed*. If you
imported your SSH key then you should be able to log in. The node's page in the
web UI will inform you of its IP address. Connect to the 'ubuntu' account.
Congratulations!


<!-- LINKS -->
[about-maas]: ./index.html#key-components-and-colocation-of-all-services
[install-maas]: ./installconfig-install.html
[web-ui]: ./installconfig-gui.html
[zones]: ./installconfig-zones.html
[networks]: ./installconfig-network2.html
[images]: ./installconfig-images.html
[dhcp]: ./installconfig-dhcp.html
[add-nodes]: ./installconfig-add-nodes.html
[user-accounts]: ./manage-account.html
[commission-nodes]: ./installconfig-commission-nodes.html
[juju-getting-started]: https://jujucharms.com/docs/stable/getting-started
[deploy-nodes]: ./installconfig-deploy-nodes.html
