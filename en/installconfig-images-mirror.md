

# Local Image Mirror

Images are delivered to MAAS via the SimpleStreams protocol and the mirroring
of these images is worthy of consideration. This option is especially useful
when your environment has a slow or unreliable Internet link. In such cases,
when the images are requested they will be instantly available and the
disadvantaged link will be less readily apparent.

Begin by installing the necessary software on the host that will house the
mirror:

```bash
sudo apt install simplestreams
```

First define some variables to unclutter eventual CLI commands:

```bash
KEYRING_FILE=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg
IMAGE_SRC=https://images.maas.io/ephemeral-v3/daily/
IMAGE_DIR=/var/www/html/maas/images/ephemeral-v3/daily
```

> ⓘ The v3 format offers only a 'daily' stream whereas in previous versions a 'releases' stream was available. The latter changes far less frequently but lacks security and bug fixes.

The below example selects all available kernels that are compatible with either
Ubuntu 14.04 (Trusty) and Ubuntu 16.04 (Xenial) for the amd64 architecture,
resulting in a download of approximately 3.1 GB. The second command mirrors the
bootloaders.

```bash
sudo sstream-mirror --keyring=$KEYRING_FILE $IMAGE_SRC $IMAGE_DIR \
	'arch=amd64' 'release~(trusty|xenial)' --max=1 --progress
sudo sstream-mirror --keyring=$KEYRING_FILE $IMAGE_SRC $IMAGE_DIR \
	'os~(grub*|pxelinux)' --max=1 --progress
```

To know in advance what the `sstream-mirror` command will grab and/or if you
want to save bandwidth and time due to possible mis-selections, include the
`--dry-run` option. When you are satisfied, remove that option to initiate the
download.

The images will be written to disk in the directory defined by the variable
'IMAGE_DIR' above and the 'location' of the new boot source will be:

`URL=http://<myserver>/maas/images/ephemeral-v3/daily/`

Where `<myserver>` identifies your server's hostname or IP address.

Verify the availability of the images by visiting the above URL.

The final `sstream-mirror` command should be invoked at regular intervals (i.e.
with `cron`) to ensure the mirror contains the latest images.


## Configure MAAS to use the local mirror

See [Image mirrors][web-ui] to learn how to configure MAAS to use the local
image server (mirror) using the web UI.

See [CLI Image Management][cli-add-an-image-source] for instructions on how to
do this with the CLI.


<!-- LINKS -->

[cli-add-an-image-source]: manage-cli-images.md#add-an-image-source
[web-ui]: installconfig-images-import.md#image-mirrors
