Title: Images | MAAS


# Images

MAAS supports the images it generates for stable Ubuntu releases and for CentOS
6.6. [Ubuntu Advantage][ubuntu-advantage] is needed in order to use Windows,
RHEL and SUSE images or in order to build a custom image for any operating
system.

Images are stored in the region controller's database, from where the rack
controller will automatically pull them onto its local disk. 

See [CLI Image Management][cli-images] for information on advanced image
management.


## Boot image sources

The place from where a region controller downloads its images is known as a
*boot image source*. The main characteristics of a boot source are its location
(URL) and its associated GPG public keyring.

MAAS comes configured with a boot source that should suffice for most users:

https://images.maas.io/ephemeral-v2/daily/

The above URL points to the 'daily' stream (for the v3 format). See
[Local image mirror][mirror] for some explanation regarding the availability of
other streams.

Although the backend supports multiple boot sources, MAAS itself uses a single
source. If multiple sources are detected the web UI will print a warning and
will be unable to manage images.


## Select and import

MAAS is only useful once it has images available to provision its nodes with.
Therefore, one key task once MAAS is installed is to select and import images
from the boot source. Once images have been imported MAAS will update them on
an hourly basis (a sync mechanism is enabled by default).

See [Select and Import Images][images-import] to get started with images.


<!-- LINKS -->

[ubuntu-advantage]: https://www.ubuntu.com/support
[cli-images]: manage-cli-images.md
[mirror]: installconfig-images-mirror.md
[images-import]: installconfig-images-import.md
