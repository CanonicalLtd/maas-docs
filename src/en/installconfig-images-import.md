Title: MAAS | Import Images
TODO: Update images (pictures)
      i (pmatulis) don't understand the mirror thing, images are already stored locally

# Select and Import Images

This page uses the web UI to explain how to select and import images MAAS uses
to provision its nodes. Note that the [MAAS CLI](./manage-cli-images.html) can
also be used for image management.

By default, the most recent Ubuntu LTS release (and amd64 architecture) are
selected.  To change the selections go to the Images tab, select any other
images (by choosing 'Release' and 'Architecture'), and click the 'Import
images' button.

![import image selection](./media/import-images.png)

After the import process has started, imported images will be listed beneath
the selection area, alongside details on the image size, last update date and
the number of nodes used by an image. A busy indicator will also appear until
the import process has completed. 

![import image complete](./media/import-images-list.png)

To remove an image, simply deselect it and click 'Apply Changes'.

## Other images

It is also possible to import and provision images other than Ubuntu. Images
supported and provided by MAAS will appear beneath the 'Other Images' section
of the web UI. Currently, images for both CentOS 6.6 and CentOS 7.0 are
available and these can be imported and used just like the Ubuntu images above.

![import image complete](./media/import-images-other.png)

## Using a local mirror

A local mirror can be used to store MAAS images. This will reduce download
times for repeated image imports. See
[Local Mirroring of Boot Images](./installconfig-images-mirror.html) for information on
how to set up a mirror and configure MAAS to use it.
