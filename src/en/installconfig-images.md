Title: MAAS Images
	
MAAS stores the boot images in the region controller's
database, from where the rack controllers will synchronise with the region and
pull images from the region to the rack's local disk. This process is
automatic and MAAS will check for and download new Ubuntu images every hour.

# Sources and selections

The place from where a region controller downloads its images is called a
*source*. Each source has a location (URL) and a keyring (for validating index
and image signatures). Images are then selected from a source for eventual
download.


## Set a different image source

MAAS is only useful once it has images available to provision its nodes with.
Therefore, the first major task once MAAS is installed is to select and import
images.
