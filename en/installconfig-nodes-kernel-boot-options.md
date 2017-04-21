Title: Kernel Boot Options


# Kernel Boot Options

MAAS is able to specify kernel boot options to nodes on both a global basis and
a per-node basis. See
[Linux kernel parameters][upstream-kernel.org-kernel-parameters] (kernel.org)
for a full listing of available options.


## Global kernel boot options

To set kernel boot options globally, as an admin, open the 'Settings' page and
on the 'General' tab scroll down to the 'Global Kernel Parameters' section:

![global kernel options][img__2.2_global-kernel-options]

Type in the desired (space separated) options and click 'Save'. The contents of
the field will be used as-is. Do not use extra characters.

See [MAAS CLI][cli-set-the-default-kernel-boot-options] for how to do this with
the CLI.


## Per-node kernel boot options

Per-node kernel boot options are set using the CLI. See
[MAAS CLI][cli-specify-kernel-boot-options-for-a-machine] for instructions.

Note that per-node boot options take precedence to global ones.


<!-- LINKS -->

[upstream-kernel.org-kernel-parameters]: https://www.kernel.org/doc/html/latest/admin-guide/kernel-parameters.html
[cli-set-the-default-kernel-boot-options]: manage-cli-advanced.md#set-the-default-kernel-boot-options
[cli-specify-kernel-boot-options-for-a-machine]: manage-cli-advanced.md#specify-kernel-boot-options-for-a-machine

[img__2.2_global-kernel-options]: ../media/installconfig-nodes-kernel-boot-options__2.2_global.png
