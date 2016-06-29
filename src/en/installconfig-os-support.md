Title: Operating System Support
TODO: This document needs to be replaced or substantially updated
      maas-image-builder section removed
      Adding documentation for building custom images is maas-docs issue #17

# Operating Systems Support

Besides Ubuntu, MAAS allows users to deploy different operating systems, such
as CentOS. Ubuntu Advantage customers can additionally deploy Red Hat
Enterprise Linux (RHEL), OpenSUSE, SLES, Window Server and Windows HyperV.

## Generated Images vs. Custom Images

MAAS supports two different classes of operating system images; generated images and
custom images.

Generated images are images of the operating system that MAAS team fully supports.
Currently supported operating systems are CentOS and Windows.

Custom images are images that MAAS can deploy, but may have been customized
and differ from those that the MAAS team supports. Custom images can include
any Ubuntu, CentOS or Windows image. Additionally, Red Hat Enterprise Linux
(RHEL), OpenSUSE and SLES images also fall under this category.

## Installing MAAS Images

### Installing Generated Images

Installing MAAS Generated Images (CentOS or Windows) can be done with the
command:

```bash
maas admin boot-resources create name=<os/series> architecture=<architecture> [filetype=ddtgz] content@=<image-name>
```

These are the currently supported operating systems:
- CentOS 6.5 (centos/centos65)
- CentOS 7 (centos/centos7)
- Windows Server 2012 (windows/win2012)
- Windows Server 2012 R2 (windows/win2012r2)
- Windows Hyper-V (windows/win2012hv)
- Windows Hyper-V R2 (windows/win2012hvr2)

If you wanted to add a CentOS 7 amd64 image, for example, you'd use the following
command:

```bash
maas admin boot-resources create name=centos/centos7 architecture=amd64/generic content@=centos7-amd64-root-tgz
```
### Installing Custom Images

Installing custom images require the user to specify a unique identifier for
the OS and Release, as well as the title of the Image:

```bash
maas admin boot-resources create name=custom/<os-release-id> title=<title> architecture=amd64/generic content@=<image-name>
```

For example, the following command will add a custom built image of Red Hat
Enterprise 7:

```bash
maas admin boot-resources create name=custom/rhel7 title="Red Hat Enterprise Linux 7" architecture=amd64/generic content@=rhel7-amd64-root-tgz
```

These are the tested custom image operating systems:

- OpenSUSE
- SLES 11 and SLES 12
- Red Hat Enterprise Linux 7 (RHEL7)
