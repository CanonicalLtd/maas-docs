Title: Installation
TODO: Update CLI install
      Update images
      Possibly split into sections
      Update Server install
      Change local anchors as files are renamed
	

# Installation

There are three main ways to install MAAS:

- [From Ubuntu Server](installconfig-server-iso.html)
- [From a package repository](installconfig-package-install.html)
- [Locally with LXD](installconfig-lxd-install.html)

### MAAS Packages

Installing MAAS from packages is straightforward. There are actually several
packages that go into making up a working MAAS install, but for convenience,
many of these have been gathered into a virtual package called 'maas' which
will install the necessary components for a 'seed cloud', that is a single
server that will directly control a group of nodes. The main packages are:

-   `maas` - seed cloud setup, which includes both the region controller and
    the rack controller below.
-   `maas-region-controller` - includes the web UI, API and database.
-   `maas-rack-controller` - controls a group of machines under a rack or
    multiple racks, including DHCP management.
-   `maas-dhcp`/`maas-dns` - required when managing dhcp/dns.
-   `maas-proxy` - required to provide a MAAS proxy.

If you need to separate these services or want to deploy an additional rack
controller, you should install the corresponding packages individually (see the
[description of a typical setup](./orientation.html#a-typical-maas-setup) for
more background on how a typical hardware setup might be arranged).

There are two suggested additional packages 'maas-dhcp' and 'maas-dns'. These
set up MAAS-controlled DHCP and DNS services which greatly simplify deployment
if you are running a typical setup where the MAAS controller can run the
network 


!!! Note: Both 'maas-dhcp' and 'maas-dns' **must** be installed if you later
set the options in the web interface to have MAAS manage DHCP/DNS.

### MAAS Package Repositories

While MAAS is available in the Ubuntu Archives per each release of Ubuntu, the
version might not be the latest. However, if you would like to install a newer
version of MAAS (the latest stable release), this is available in the
following PPA:

-   [ppa:maas/stable](https://launchpad.net/~maas/+archive/ubuntu/stable)

!!! Note: The MAAS team also releases the latest development release of MAAS.
The development release is available in
[ppa:maas/next](https://launchpad.net/~maas/+archive/ubuntu/next). 
However, this is meant to be used for testing and at your own risk.

Adding MAAS package repository is simple. At the command line, type:

```bash
sudo add-apt-repository ppa:maas/stable
```

You will be asked to confirm whether you would like to add this repository,
and its key. Upon configuration, the following needs to be typed at the
command line:

```bash
sudo apt-get update
```

## Installing a Single Node MAAS

At the command line, type:

```bash
sudo apt-get install maas
```

This will install both the MAAS Region Controller and the MAAS Rack
Controller, and will select sane defaults for the communication between the
Rack Controller and the Region Controller. After installation, you can access
the Web Interface. Then, there are just a few more setup steps post\_install

### Reconfiguring a MAAS Installation

You will see a list of packages and a confirmation message to proceed. The
exact list will obviously depend on what you already have installed on your
server, but expect to add about 200MB of files.

The configuration for the MAAS controller will automatically run and pop up
this config screen:

![image](./media/install_cluster-config.png)

Here you will need to enter the hostname for where the region controller can
be contacted. In many scenarios, you may be running the region controller
(i.e. the web and API interface) from a different network address, for example
where a server has several network interfaces.

### Adding Rack Controllers

If you would like to add additional MAAS Rack Controllers to your MAAS setup,
you can do so by following the instructions in [Rack Controller
configuration](./installconfig-rack.html).

## Installing MAAS from Ubuntu Server

If you are installing MAAS as part of a fresh install it is easiest to choose
the "Multiple Server install with MAAS" option from the installer and have
pretty much everything set up for you. Boot from the Ubuntu Server media and
you will be greeted with the usual language selection screen:

![image](./media/install_01.png)

On the next screen, you will see there is an entry in the menu called
"Multiple server install with MAAS". Use the cursor keys to select this and
then press Enter.

![image](./media/install_02.png)

The installer then runs through the usual language and keyboard options. Make
your selections using Tab/Cursor keys/Enter to proceed through the install.
The installer will then load various drivers, which may take a moment or two.

![image](./media/install_03.png)

The next screen asks for the hostname for this server. Choose something
appropriate for your network.

![image](./media/install_04.png)

Finally we get to the MAAS part! Here there are just two options. We want to
"Create a new MAAS on this server" so go ahead and choose that one.

![image](./media/install_05.png)

The install now continues as usual. Next you will be prompted to enter a
username. This will be the admin user for the actual server that MAAS will be
running on (not the same as the MAAS admin user!)

![image](./media/install_06.png)

As usual you will have the chance to encrypt your home directory. Continue to
make selections based on whatever settings suit your usage.

![image](./media/install_07.png)

After making selections and partitioning storage, the system software will
start to be installed. This part should only take a few minutes.

![image](./media/install_09.png)

Various packages will now be configured, including the package manager and
update manager. It is important to set these up appropriately so you will
receive timely updates of the MAAS server software, as well as other essential
services that may run on this server.

![image](./media/install_10.png)

The configuration for MAAS will ask you to configure the host address of the
server. This should be the IP address you will use to connect to the server
(you may have additional interfaces e.g. to run node subnets)

![image](./media/install_cluster-config.png)

The next screen will confirm the web address that will be used to the web
interface.

![image](./media/install_controller-config.png)

After configuring any other packages the installer will finally come to and
end. At this point you should eject the boot media.

![image](./media/install_14.png)

After restarting, you should be able to login to the new server with the
information you supplied during the install. The MAAS software will run
automatically.

![image](./media/install_15.png)

!!! Note: The maas-dhcp and maas-dns packages should be installed by default,
but on older releases of MAAS they won't be. If you want to have MAAS run DHCP
and DNS services, you should install these packages. Check whether they are
installed with:

```bash
dpkg -l maas-dhcp maas-dns
```

If they are missing, then:

```bash
sudo apt-get install maas-dhcp maas-dns
```

And then proceed to the post-install setup.

## Installing MAAS locally with LXC

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

And you can proceed with the installation as above,
From a [package repository](maas-packages). 
