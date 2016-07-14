Title: Install from MAAS Packages

# Install from MAAS Packages

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
