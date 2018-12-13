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

### CLI

To specify kernel boot options for an individual machine a tag needs to be
created:

```bash
maas $PROFILE tags create name='$TAG_NAME' \
	comment='$COMMENT' kernel_opts='$KERNEL_OPTIONS'
```

For example:

```bash
maas $PROFILE tags create name='nomodeset' \
	comment='nomodeset kernel option' kernel_opts='nomodeset vga'
```

The tag must then be assigned to the machine in question. This can be done
with the web UI or with the CLI. For the latter, see
[CLI - Manual tag assignment][cli-manual-tag-assignment].

If multiple tags attached to a node have the `kernel_opts` defined, the first
one (ordered alphabetically) is used.

<!-- LINKS -->

[upstream-kernel.org-kernel-parameters]: https://www.kernel.org/doc/html/latest/admin-guide/kernel-parameters.html
[cli-set-the-default-kernel-boot-options]: manage-cli-kernels.md#set-global-kernel-boot-options
[cli-specify-kernel-boot-options-for-a-machine]: manage-cli-kernels.md#specify-per-node-kernel-boot-options

[img__2.2_global-kernel-options]: ../media/nodes-kernel-options__2.2_global.png
