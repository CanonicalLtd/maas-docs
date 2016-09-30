Title: MAAS Images


# MAAS Images

MAAS stores its images in the region controller's database, from where the rack
controller will automatically pull them onto its local disk. 

See [CLI Image Management](manage-cli-images.md) for information on
advanced image management.


## Boot image sources

The place from where a region controller downloads its images is known as a
*boot image source*. The main characteristics of a boot source are its location
(URL) and its associated GPG public keyring.

MAAS comes configured with a boot source that should suffice for most users.
It is located at https://images.maas.io/ephemeral-v2/releases/.

Although the backend supports multiple boot sources, MAAS itself uses a single
source. If multiple sources are detected the web UI will print a warning and
will be unable to manage images.


## Select and import

MAAS is only useful once it has images available to provision its nodes with.
Therefore, one key task once MAAS is installed is to select and import images
from the boot source. Once images have been imported MAAS will update them on
an hourly basis (a sync mechanism is enabled by default).

See [Select and Import Images](installconfig-images-import.md) to get
started with images!
