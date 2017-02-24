Title: Install from Packages | MAAS


# Install from Packages

There are three packages to consider when installing MAAS:

- `maas-region-controller` - region API server, database, DNS,
  [HTTP proxy][proxy], and [web UI][webui]
- `maas-rack-controller` - [rack controller][rackd] and [DHCP][dhcp]
- `maas` - a metapackage that installs both the above packages to provide a complete
  MAAS environment

Each of the above packages has its own dependencies. That is, each will bring
in other MAAS packages not listed above. The full list of MAAS packages can be
obtained with the command:

```bash
apt-cache search maas
```

The 'maas' package is the recommended way to install MAAS. See the
[Introduction][all-in-one] for more detail on colocating all services on a single host.

High availability with MAAS involves installing multiple region controllers
and/or multiple rack controllers. See [MAAS HA][maas-ha].


## Package repositories

While MAAS is available in the normal Ubuntu archives, the available packages
may be lagging behind non-archive, but still stable, versions. To install a newer
stable version the following PPA can be used:

- [ppa:maas/stable](https://launchpad.net/~maas/+archive/ubuntu/stable)

Development releases (not meant for production) are available here:

- [ppa:maas/next](https://launchpad.net/~maas/+archive/ubuntu/next)

For example, to add the 'stable' PPA, type:

```bash
sudo apt-add-repository -yu ppa:maas/stable
```

## Installation scenarios

The recommended way to set up an initial MAAS environment is to put everything
on one machine:

```bash
sudo apt install maas
```

For a more distributed environment, the region controller can be placed on one
machine:

```bash
sudo apt install maas-region-controller
```

and the rack controller on another:

```bash
sudo apt install maas-rack-controller
sudo maas-rack register
```

See [Rack controller][rackd] for details.


<!-- LINKS -->

[proxy]: installconfig-network-proxy.md
[webui]: installconfig-webui.md
[rackd]: installconfig-rack.md
[dhcp]: installconfig-network-dhcp.md
[all-in-one]: index.md#key-components-and-colocation-of-all-services
[maas-ha]: manage-ha.md
