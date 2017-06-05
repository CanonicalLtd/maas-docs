Title: Install from a Snap
TODO:  Track bug: https://goo.gl/Yifghb
table_of_contents: True


# Install from a Snap

Although snap installs are meant to eventually replace traditional Ubuntu
packages, installing MAAS from a snap is considered experimental at this time.
In particular, implementing high availability via snaps is not yet possible.
See [MAAS HA][maas-ha] for more on that topic.

All feedback is welcome via the [MAAS issue tracker][launchpad-bugs-maas].


## Snappy

For detailed information on `snappy` (snaps) please see the
[Snappy documentation][snappy-docs]. A less technical summary can be had via
this [Ubuntu Insights][insights.ubuntu.com-snappy] column.


## Installation 

Currently, only the stable and development MAAS versions are available via
snaps. This corresponds, respectively, to the 'stable' and 'edge' snap
*channels*:

```bash
snap info maas
```

Sample output:

```no-highlight
name:      maas
summary:   "Metal as a Service"
publisher: maas
contact:   maas-devel@lists.ubuntu.com
description: |
  Total automation of you physical servers for amazing data center
  operational efficiency.

commands:
  - maas
tracking:        stable
installed:       2.2.0+bzr6057-snap (91) 98MB devmode
refreshed:       2017-05-30 16:15:09 +0000 UTC
channels:
  latest/stable: 2.2.0+bzr6057-snap (91)  98MB -
  latest/edge:   trunk+bzr6071-snap (101) 98MB devmode
```

To install the snap from the 'stable' channel (and the 'latest' *track*):
 
```bash
sudo snap install --devmode --stable maas
```

!!! Note:
    At this time, MAAS can only be installed in 'devmode' and
    is therefore not fully isolated from the rest of the system. This
    corresponds to the same level of security provided by traditional Ubuntu
    packages.

Due to the null defaults used by this particular snap, no MAAS software has
actually been installed and configured yet.


## Configuration options

You will now need to tell the snap what *mode* MAAS will run in. This is known
as *initialization* and it is performed by choosing one of the below options.
Doing so will dictate what services will run on the local system.

- `all` - All services
- `region` - A region API server only (no database)
- `rack` - A rack controller only
- `region+rack` - A region API server and a rack controller (no database)

This is different from the installation scenarios covered in the package
install method (see [Install from packages][install-from-packages]) where
the installation of a "region controller" **will** include a database.

All modes will prompt for a MAAS URL. The 'all' mode will use this for the
creation of a new region controller whereas the other three modes will
interpret it as the URL for an existing region controller.

The 'rack' and 'region+rack' modes will additionally ask for the shared secret
that will allow the new rack controller to register with the region controller.


## Initialization

This is where MAAS components will be installed and configured.

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

A re-initialization is easily achieved. For example, to switch from one mode to
another, say 'region', simply state it:

```bash
sudo maas init --mode region
```


## Configuration verification

A verification of the currently running configuration can be done with:
 
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


<!-- LINKS -->


[snappy-docs]: https://snapcraft.io/docs
[insights.ubuntu.com-snappy]: https://insights.ubuntu.com/2016/06/14/universal-snap-packages-launch-on-multiple-linux-distros/
[maas-ha]: manage-ha.md
[launchpad-bugs-maas]: https://bugs.launchpad.net/maas/+filebug
[install-from-packages]: installconfig-package-install.md
