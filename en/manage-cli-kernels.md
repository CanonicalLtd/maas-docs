Title: CLI Kernel Management
TODO:  Decide whether explicit examples are needed everywhere
       Confirm whether kernel boot options really override default/global options such as those given by GRUB's GRUB_CMDLINE_LINUX_DEFAULT variable
       Kernel selection example should not just be about HWE kernels. Adjust installconfig-nodes-ubuntu-kernels.md accordingly
table_of_contents: True


# CLI Kernel Management

This is a list of kernel tasks to perform with the MAAS CLI. See
[MAAS CLI][manage-cli] on how to get started.


## Set the default kernel boot options

To set kernel boot options that will be applied to all machines:

```bash
maas $PROFILE maas set-config name=kernel_opts value='$KERNEL_OPTIONS'
```

## Specify kernel boot options for a machine

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
[MAAS CLI - common tasks][cli-assign-tag-to-node].

If multiple tags attached to a node have the `kernel_opts` defined, the first
one (ordered alphabetically) is used.


## Set a default minimum HWE kernel

To set a default minimum HWE kernel for all machines:

```bash
maas $PROFILE maas set-config name=default_min_hwe_kernel value=$HWE_KERNEL
```


## Set a minimum HWE kernel for a machine

To set the minimum HWE kernel on a machine basis:

```bash
maas $PROFILE machine update $SYSTEM_ID min_hwe_kernel=$HWE_KERNEL
```


## Set a specific HWE kernel during machine deployment

To set a specific HWE kernel during the deployment of a machine:

```bash
maas $PROFILE machine deploy $SYSTEM_ID distro_series=$SERIES hwe_kernel=$HWE_KERNEL
```

MAAS verifies that the specified kernel is available for the given Ubuntu
release (series) before deploying the node. 


<!-- LINKS -->

[manage-cli]: manage-cli.md
[cli-assign-tag-to-node]: manage-cli-common.md#assign-a-tag-to-a-node
