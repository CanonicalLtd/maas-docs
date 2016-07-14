Title: MAAS | Select and Import Images
TODO: Update images (pictures)


# Select and Import Images

This page explains how to use the web UI to select and import the images that
MAAS requires in order to provision its nodes. Note that the
[MAAS CLI](./manage-cli-images.html) can also be used for image management.

By default, the most recent LTS release (and amd64 architecture) are selected.
To change the selections go to the Images tab, select any other images (by
choosing 'Release' and 'Architecture'), and click the 'Import images' button.

![image](./media/import-images.png)

A message will appear to indicate that the import process has started.


## Using a local mirror

Optionally, a local mirror can be set up as the boot source. MAAS will then use
it instead of the standard internet-based server. This will reduce the time
required to complete the image import step significantly. See
[Local image mirror](./installconfig-images-mirror.html) for instructions on
doing this.
