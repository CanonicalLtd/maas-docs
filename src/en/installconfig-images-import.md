Title: MAAS | Import Images
TODO: Update images (pictures)
      i (pmatulis) don't understand the mirror thing, images are already stored locally


# Select and Import Images

This page uses the web UI to explain how to select and import images MAAS uses
to provision its nodes. Note that the [MAAS CLI](./manage-cli-images.html) can
also be used for image management.

By default, the most recent LTS release (and amd64 architecture) are selected.
To change the selections go to the Images tab, select any other images (by
choosing 'Release' and 'Architecture'), and click the 'Import images' button.

![image](./media/import-images.png)

A message will appear to indicate that the import process has started.


## Using a local mirror

A local mirror can be used to store MAAS images. This will reduce download
times for repeated image imports. See
[Local Mirroring of Boot Images](./installconfig-images-mirror.html) for information on
how to set up a mirror and configure MAAS to use it.
