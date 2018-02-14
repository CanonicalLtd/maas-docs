Title: Installation


# Installation

There are four ways to install MAAS:

- [From a snap][install-from-snap]. Install via a snap.
    - Versatile: Put components where you want them (centralized or distributed)
    - Can access developmental versions of MAAS
    - Application isolation
- [From an Ubuntu Server ISO][install-from-iso]. Install a complete MAAS
  environment or a rack controller during the ISO installation of Ubuntu
  Server.
    - Recommended for new MAAS environments, especially for new users
    - Enables you to get started as quickly as possible
- [From packages][install-from-packages]. Install packages for individual MAAS
  components.
    - Versatile: Put components where you want them (centralized or distributed)
    - Can access developmental versions of MAAS
- [With LXD][install-with-lxd]. Create a self-contained MAAS
  environment with LXD containers.
    - MAAS nodes also run as local containers
    - Ideal for testing and experimenting with MAAS
    - Can access developmental versions of MAAS

Ubuntu 16.06 LTS systems running MAAS 2.3 or older can upgrade to MAAS 2.4 via
an LTS-to-LTS upgrade to Ubuntu 18.04. See
[Upgrade 2.3 to 2.4 from Ubuntu 16.04][upgrade-to-24] for details.

<!-- LINKS -->

[install-from-iso]: installconfig-iso-install.md
[install-from-packages]: installconfig-package-install.md
[install-from-snap]: installconfig-snap-install.md
[install-with-lxd]: installconfig-lxd-install.md
[upgrade-to-24]: installconfig-upgrade-postgres.md
