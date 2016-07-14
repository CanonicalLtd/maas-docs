Title: Install Locally with LXD

# Install locally with LXD

Installing MAAS in a container is a typical setup for those users who would
like to take advantage of their machine for other users at the same time of
using MAAS.

In order to setup MAAS, you need some requirements:

-   Create a bridge (for example, it can be br0).
-   Install LXD and ZFS.
-   Create a Container profile for MAAS

### Install LXD and ZFS

The first thing to do is to install LXD and ZFS:

```bash
sudo apt-get install lxd zfsutils-linux
sudo modprobe zfs
sudo lxd init
```

### Create a LXC profile for MAAS

First, lets create a container profile by copying the default:

```bash
lxc profile copy default maas
```

Second, bind the NIC inside the container (eth0) against the bridge on the
physical host (br0):

```bash
lxc profile device set maas eth0 parent br0
```

Third, edit the container profile (lxc profile edit maas) with:

```yaml
    raw.lxc: |-
      lxc.cgroup.devices.allow = c 10:237 rwm
      lxc.aa_profile = unconfined
      lxc.cgroup.devices.allow = b 7:* rwm
    security.privileged: "true"
```

And lastly, ensure that the LXC container has loop devices added:

```bash
for i in `seq 0 7`; do lxc profile device add maas loop$i unix-block path=/dev/loop$i; done
```

### Launch LXD container

Once the profile has been created, you can now launch the LXC container:

```bash
lxc launch -p maas ubuntu:16.04 xenial-maas
```

### Install MAAS

Once the container is running, you can now install MAAS. First you need to
access the container with:

```bash
lxc exec bash xenial-maas
```
You can now proceed with the [standard package
installation](installconfig-package-install.html). 
