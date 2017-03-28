Title: A Title That Is Capitalized | MAAS
TODO:  Add CLI (?)
table_of_contents: True

<!--

This is a comment. It ends up as an HTML comment so please be polite.

Use this file as a model to base new files upon. Pay attention to
capitalization of headers and links.

The new filename should be based upon where it is found in the menu hierarchy
(e.g. installconfig-nodes-deploy.md).

See contribution.md for details.

-->


# A Title That Is Capitalized

This is explained in [SSH keys][user-accounts-ssh-keys].

This is an ordered list:

1. DHCP server is contacted
1. cloud-init triggers deployment process
    1. curtin installation script is run
    1. Squashfs image (same as above) is placed on disk

!!! Note: This is an admonishment that refers to a file. See
`/etc/maas/preseed` directory.


## A second level header that isn't capitalized

[Juju][about-juju] is the recommended deploy agent.

This is an unordered list:

- review the [Kernel boot options][kernel-boot-options].
- ensure any SSH keys are imported (see [SSH keys][user-accounts-ssh-keys]).


### A third level header that isn't capitalized

To deploy directly from MAAS simply press the 'Deploy' button:

![deploy][img__2.1_deploy-nodes]

Don't forget to install a second rack controller. See
[Rack controller][install-rackd] for details.


<!-- LINKS -->

[user-accounts-ssh-keys]: manage-account.md#ssh-keys
[about-juju]: https://jujucharms.com/docs/stable/about-juju
[kernel-boot-options]: installconfig-nodes-kernel-boot-options.md
[install-rackd]: installconfig-rack.md#install-a-rack-controller

[img__2.1_deploy-nodes]: ../media/installconfig-nodes-deploy-nodes__2.1_deploy.png
