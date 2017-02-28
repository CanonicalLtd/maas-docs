Title: Installation | MAAS


# Installation

There are three ways to install MAAS:

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

Ubuntu 14.04 LTS systems running the MAAS 1.7 or 1.9 series can
[upgrade to MAAS 2.0][upgrade-to-v2] via an LTS-to-LTS upgrade to Ubuntu 16.04
LTS.


<!-- LINKS -->

[install-from-iso]: installconfig-server-iso.md
[install-from-packages]: installconfig-package-install.md
[install-with-lxd]: installconfig-lxd-install.md
[upgrade-to-v2]: installconfig-upgrade-to-2.md
