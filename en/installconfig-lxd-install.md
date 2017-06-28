Title: Install with LXD
TODO:  Text needs a review


# Install with LXD

Installing MAAS into containers is a good choice for users who want to test
MAAS, or who may want to continue leveraging an existing container architecture
or policy. 

MAAS running with LXD has the following requirements:

- a network bridge on the LXD host (e.g. br0)
- LXD and ZFS
- a container profile

### Install LXD and ZFS

Begin by installing LXD and ZFS:

```bash
sudo apt install lxd zfsutils-linux
sudo modprobe zfs
sudo lxd init
```

### Create a LXC profile for MAAS

First create a container profile by making use of the 'default' profile:

```bash
lxc profile copy default maas
```

Second, bind the network interface inside the container (eth0) to the bridge on
the physical host (br0):

```bash
lxc profile device set maas eth0 parent br0
```

Third, edit the container profile (lxc profile edit maas) with:

```yaml
config:
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

### Launch and access the LXD container

Launch the LXD container:

```bash
lxc launch -p maas ubuntu:16.04 xenial-maas
```

Once the container is running, it can be accessed with:

```bash
lxc exec xenial-maas bash
```

### Install MAAS

In the container (or containers), install MAAS via packages. See
[Install from packages][maas-install-packages]. 


<!-- LINKS -->

[maas-install-packages]: installconfig-package-install.md
