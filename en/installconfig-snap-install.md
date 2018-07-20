

# Install MAAS

To best fit your requirements, MAAS offers several installation options:

- **[Snap][install-from-snap]**. The quickest and easiest way to install MAAS. Benefits from
  autonomous upgrades and direct access to beta and developmental versions
- **[Packages][install-from-packages]**. Versatile *deb*-based installation
  with manual control over where specific components are placed, when upgrades
  are applied, and where packages are installed from
- **[Ubuntu Server ISO][install-from-iso]**. Conveniently install MAAS as you provision a new
  server

Additionally, you may want to consider an installation within
[LXD containers][install-with-lxd]. This allows MAAS nodes to also run as
local containers and is ideal for testing and experimenting with MAAS.

> ⓘ Implementing high availability via snaps is not yet possible. See [MAAS HA][maas-ha] for more on that topic.

## Install from snap

[Snaps][snappy-docs] are containerised software packages. To install MAAS from a
*snap*, simply enter the following:

```bash
sudo snap install maas --devmode --stable
```

After entering your password, the snap will download and install from the
*stable* channel. However, MAAS needs initialising before it's ready to go.

## Initialisation

The next step involves initialising MAAS with a *run mode*. Selecting one of
the following modes dictates what services will run on the local system:

- `all` - All services
- `region` - A region API server only (no database)
- `rack` - A rack controller only
- `region+rack` - A region API server and a rack controller (no database)

This list is different from the installation scenarios covered in the package
install method (see [Install from packages][install-from-packages]) where
the installation of a "region controller" **will** include a database.

To initialise MAAS and select a run mode, use the `maas init` command with the
*--mode* argument.

Here, the typical all-in-one design (mode 'all') will be chosen as an example:

```bash
sudo maas init --mode all
```
A dialog will appear that will gather some basic information:

```no-highlight
MAAS URL [default=http://10.55.60.1:5240/MAAS]: http://192.168.122.1:5240/MAAS
Create first admin account:       
Username: admin
Password: ******
Again: ******
Email: admin@example.com
Import SSH keys [] (lp:user-id or gh:user-id): lp:petermatulis
```

Each run mode will prompt for a MAAS URL. The 'all' mode will use this for the
creation of a new region controller whereas the other three modes will
interpret it as the URL for an existing region controller.

The 'rack' and 'region+rack' modes will additionally ask for the shared secret
that will allow the new rack controller to register with the region controller.

The username and password will be used to access the web UI and if you enter
a [Launchpad][launchpad] or [GitHub][github] account name with associated SSH
key, these will be imported into MAAS automatically.

A re-initialization is easily achieved. For example, to switch from one mode to
another, say 'region', simply state it:

```bash
sudo maas init --mode region
```


## Configuration verification

After a *snap* installation of MAAS, a verification of the currently running
configuration can be done with:
 
```bash
sudo maas config
```

Sample output (for mode 'all'):

```no-highlight
Mode: all
Settings:
maas_url=http://192.168.122.1:5240/MAAS
```

## Service statuses

The status of running services can likewise be checked:
 
```bash
sudo maas status
```

Sample output (for mode 'all'):

```no-highlight
bind9                            RUNNING   pid 7999, uptime 0:09:17
dhcpd                            STOPPED   Not started
dhcpd6                           STOPPED   Not started
ntp                              RUNNING   pid 8598, uptime 0:05:42
postgresql                       RUNNING   pid 8001, uptime 0:09:17
proxy                            STOPPED   Not started
rackd                            RUNNING   pid 8000, uptime 0:09:17
regiond:regiond-0                RUNNING   pid 8003, uptime 0:09:17
regiond:regiond-1                RUNNING   pid 8008, uptime 0:09:17
regiond:regiond-2                RUNNING   pid 8005, uptime 0:09:17
regiond:regiond-3                RUNNING   pid 8015, uptime 0:09:17
tgt                              RUNNING   pid 8040, uptime 0:09:15
```

With MAAS installed and initialised, you can now open the web UI in your
browser. See [Access the web UI][webui] for further details.

<!-- LINKS -->

[snappy-docs]: https://snapcraft.io/docs
[insights.ubuntu.com-snappy]: https://insights.ubuntu.com/2016/06/14/universal-snap-packages-launch-on-multiple-linux-distros/
[maas-ha]: manage-ha.md
[launchpad-bugs-maas]: https://bugs.launchpad.net/maas/+filebug
[install-from-iso]: installconfig-iso-install.md
[install-from-packages]: installconfig-package-install.md
[install-from-snap]: #install-from-snap
[install-with-lxd]: installconfig-lxd-install.md
[launchpad]: https://launchpad.net/
[github]: https://github.com
[webui]: installconfig-webui.md#access-the-web-ui
