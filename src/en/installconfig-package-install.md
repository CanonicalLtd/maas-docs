Title: Install from Packages
TODO:  Explain MAAS proxy
       Mention danger of conflicting DHCP on the network


# Install from Packages

There are several packages to choose from:

- `maas-region-controller` - includes the web UI, API and database.
- `maas-rack-controller` - controls a group of machines under a rack or
   multiple racks, including DHCP management.
- `maas-dhcp`/`maas-dns` - required when managing DHCP/DNS.
- `maas-proxy` - required to provide a MAAS proxy.

For convenience, the 'maas' metapackage will install all the above packages
onto the localhost. This will provide all the services necessary to manage
your machines with MAAS. See
[A simple MAAS setup](./index.html#a-simple-maas-setup) for a little
more detail on the all-in-one MAAS solution. It is the ideal design for trying
out MAAS for the first time.

If you want to distribute these services on several machines (or want to deploy
an additional rack controller), you will need to install packages individually
on those machines.

Packages 'maas-dhcp' and 'maas-dns' provide MAAS-controlled DHCP and DNS
services which greatly simplify deployment. This is the recommended design and
should be chosen if your local network policies allow it. Note that these
packages **must** be installed if you later configure the web
UI to have MAAS manage DHCP/DNS.


## Package repositories

While MAAS is available in the normal Ubuntu archives, the available packages
may be lagging behind non-archive, but still stable, versions. To install a newer
stable version the following PPA can be used:

- [ppa:maas/stable](https://launchpad.net/~maas/+archive/ubuntu/stable)

Development releases (not meant for production) are available here:

- [ppa:maas/next](https://launchpad.net/~maas/+archive/ubuntu/next)

To add a PPA, type:

```bash
sudo apt-add-repository -y ppa:maas/stable
sudo apt update
```

## All-in-one solution

As described above, to put everything on one machine:

```bash
sudo apt install maas
```

The below dialog will appear:

![image](./media/install_cluster-config.png)

Enter the IP address of the region controller. In some cases, the machine
running the region controller (i.e. the web and API interface) may have several
network interfaces. Choose the address according to your design.


## Adding rack controllers

To add additional rack controllers, see the instructions in
[Rack controller configuration](./installconfig-rack.html).
