Title: Hardware-enablement kernels

# Hardware-enablement kernels

MAAS allows you to use hardware enablement kernels when booting nodes with
Ubuntu that require them.

## What are hardware-enablement kernels?

Brand new hardware gets released all the time. We want that hardware to work
well with Ubuntu and MAAS, even if it was released after the latest release of
MAAS or Ubuntu. Hardware Enablement (HWE) is all about keeping pace with the
new hardware.

Ubuntu's solution to this is to offer newer kernels for older releases. There
are at least two kernels on offer for Ubuntu releases: the "generic" kernel,
i.e. the kernel released with the current series, and the HWE kernel, which is
the most recent kernel release.

There are separate HWE kernels for each release of Ubuntu, referred to as
`hwe-<release letter>`. So, the 16.04 / Xenial HWE kernel is called
`hwe-x`, the 14.10 / Trusty Tahr kernel is called `hwe-t` and so on.
This allows you to use newer kernels with older releases, for example running
Precise with a Saucy (hwe-s) kernel.

For more information see the [LTS Enablement
Stack](https://wiki.ubuntu.com/Kernel/LTSEnablementStack) page on the Ubuntu
wiki.

## Booting hardware-enablement kernels

MAAS imports hardware-enablement kernels along with its generic boot images.
These hardware-enablement kernels are specified by using min\_hwe\_kernel or
hwe\_kernel variables.

The min\_hwe\_kernel variable is used to instruct MAAS to ensure the release
to be deployed uses a kernel version at or above the value of
min\_hwe\_kernel. For example if min\_hwe\_kernel is set to hwe-t when
deploying any release before Trusty the hwe-t kernel will be used. For any
release after Trusty the default kernel for that release will be used. If
hwe-t or newer is not available for the specified release MAAS will not allow
that release to be deployed and throw an error.

min\_hwe\_kernel can be set by running following the command (we're setting
`hwe-t` is the minimum kernel version):

```bash
maas admin machine update <system-id> min_hwe_kernel=hwe-t
```

It's also possible to set the min\_hwe\_kernel from the MAAS web UI, by
visiting the node's page and clicking the `Edit` button alongside the 'Machine
summary' pane. Under the Minimum Kernel field, you will be able to select any HWE
kernels that have been imported onto that node's cluster controller.

![image](./media/min_hwe_kernel.png)

You can also set the hwe\_kernel during deployment. MAAS checks that the
specified kernel is available for the release specified before deploying the
node. You can set the hwe\_kernel when deploying by using the command:

```bash
maas admin machine deploy <system-id> distro_series=xenial hwe_kernel=hwe-x
```

Or through the web interface as seen below.

![image](./media/hwe_kernel.png)
