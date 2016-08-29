Title: Installation
TODO: Update CLI install
      Update images
      Possibly split into sections
      Update Server install
      Change local anchors as files are renamed
	

# Installation

There are three ways to install MAAS:

- [From an Ubuntu Server ISO](installconfig-server-iso.html). Install and
  configure a region controller or a rack controller during the ISO
  installation of Ubuntu Server.
  - Recommended for new MAAS environments
  - Enables you to get started as quickly as possible 

- [From packages](installconfig-package-install.html). Install packages for
  individual MAAS components.
  - Can install both a rack and a region controller on a single machine
  - Ideal for beta and developmental versions of MAAS

- [Locally with LXD](installconfig-lxd-install.html). Create a self-contained
  MAAS environment with LXD containers.
  - Runs the region controller, the rack controller and multiple nodes
  - Ideal for testing and experimenting with MAAS

If you're new to MAAS, we recommend installing from an
[Ubuntu Server ISO](installconfig-server-iso.html).
