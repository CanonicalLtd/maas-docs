Title: Import Boot Images
TODO: Update images
	
# Import Boot Images

Since version 1.7, MAAS stores the boot images in the region controller's
database, from where the rack controllers will synchronise with the region and
pull images from the region to the rack's local disk. This process is
automatic and MAAS will check for and download new Ubuntu images every hour.

However, on a new installation you'll need to start the import process
manually once you have set up your MAAS region controller. There are two ways
to start the import: through the web user interface, or through the remote
API.

To do it in the web user interface, go to the Images tab, check the boxes to
say which images you want to import, and click the "Import images" button at
the bottom of the Ubuntu section.

![image](./media/import-images.png)

A message will appear to let you know that the import has started, and after a
while, the warnings about the lack of boot images will disappear.

It may take a long time, depending on the speed of your Internet connection
for import process to complete, as the images are several hundred megabytes.
The import process will only download images that have changed since last
import. You can check the progress of the import by hovering over the spinner
next to each image.

The other way to start the import is through the
[region-controller API](./api.html#regioncontroller)
, which you can invoke most conveniently through the 
[command-line interface](./maascli.html#cli).

To do this, connect to the MAAS API using the "maas" command-line client. See
Logging in &lt;api-key&gt; for how to get set up with this tool. Then, run the
command:

```bash
maas my-maas-session boot-resources import
```

(Substitute a different profile name for 'my-maas-session' if you have named
yours something else.) This will initiate the download, just as if you had
clicked "Import images" in the web user interface.

By default, the import is configured to download the most recent LTS release
only for the amd64 architecture. Although this should suit most needs, you can
change the selections on the Images tab, or over the API. Read
customise [boot sources](./bootsources.html) to see examples on how to do that.

## Speeding up repeated image imports by using a local mirror

See [Local Mirroring of Boot Images](./sstreams-mirror.html) for information on
how to set up a mirror and configure MAAS to use it.
