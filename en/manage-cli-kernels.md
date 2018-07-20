

# CLI Kernel Management

This is a list of kernel tasks to perform with the MAAS CLI. See
[MAAS CLI][manage-cli] on how to get started. These resources will also be
helpful:

- [Ubuntu kernels][ubuntu-kernels] for background on Ubuntu kernels within a
  MAAS context.
- [Kernel boot options][kernel-boot-options] for help on kernel boot options.


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
[CLI - Manual tag assignment][cli-manual-tag-assignment].

If multiple tags attached to a node have the `kernel_opts` defined, the first
one (ordered alphabetically) is used.


## Set a default minimum kernel for enlistment and commissioning

To set a default minimum kernel for all new and commissioned machines:

```bash
maas $PROFILE maas set-config name=default_min_hwe_kernel value=$KERNEL
```

For example, to set it to the 16.04 GA kernel:

```bash
maas $PROFILE maas set-config name=default_min_hwe_kernel value=ga-16.04
```

> ⓘ The command option `default_min_hwe_kernel` appears to apply to only  HWE kernels but this is not the case.


## Set a minimum deploy kernel for a machine

To set the minimum deploy kernel on a per machine basis:

```bash
maas $PROFILE machine update $SYSTEM_ID min_hwe_kernel=$HWE_KERNEL
```

For example, to set it to the HWE 16.04 kernel:

```bash
maas $PROFILE machine update $SYSTEM_ID min_hwe_kernel=hwe-16.04
```

> ⓘ The command option `default_min_hwe_kernel` appears to apply to only  HWE kernels but this is not the case.


## Set a specific kernel during machine deployment

To set a specific kernel during the deployment of a machine:

```bash
maas $PROFILE machine deploy $SYSTEM_ID distro_series=$SERIES hwe_kernel=$KERNEL
```

The operation will fail if the kernel specified by `hwe_kernel` is older than
the kernel (possibly) given by `default_min_hwe_kernel`. Similarly, it will not
work if the kernel is simply not available for the given distro series (such as
'hwe-16.10' for 'xenial').

For example, to deploy a Xenial node with the HWE 16.04 edge kernel:

```bash
maas $PROFILE machine deploy $SYSTEM_ID distro_series=xenial hwe_kernel=hwe-16.04-edge
```

> ⓘ The command option `hwe_kernel` appears to apply to only HWE kernels but this is not the case.


<!-- LINKS -->

[manage-cli]: manage-cli.md
[ubuntu-kernels]: nodes-kernels.md
[kernel-boot-options]: nodes-kernel-options.md
[cli-manual-tag-assignment]: manage-cli-tags.md#manual-tag-assignment
