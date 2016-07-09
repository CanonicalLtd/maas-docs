Title: MAAS Images


# MAAS Images

MAAS stores its images in the region controller's database, from where the rack
controller will automatically pull them onto its local disk. 

See [CLI Image Management](./manage-cli-images.html) for information on
advanced image management.


## Sources

The place from where a region controller downloads its images is known as an
image *source*. Each source has a location (URL) and a keyring (index and image
validation).

MAAS comes configured with an image source that should suffice for most users.
It is located at https://images.maas.io/ephemeral-v2/releases/.


## Select and import

MAAS is only useful once it has images available to provision its nodes with.
Therefore, the first major task once MAAS is installed is to select and import
some from a configured source. Once images have been imported MAAS will
update them on an hourly basis.

See [Select and Import Images](./installconfig-images-import.html) to get
started with images!
