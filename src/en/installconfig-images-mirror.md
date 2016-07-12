Title: Local Image Mirror


# Local Image Mirror

Images are delivered to MAAS via the simplestreams protocol and the mirroring
of these images is worthy of consideration. This option is especially
interesting when your environment has a slow or unreliable internet link. In
such cases, when the images are requested they will be instantly avaiable and
the disadvantaged link will be less readily apparent.

Begin by installing the necessary software on the host that will house the
mirror:

```bash
sudo apt install simplestreams ubuntu-cloudimage-keyring apache2
```

After defining some variables (to de-clutter eventual CLI commands) the mirror
can be easily populated:

```bash
KEYRING_FILE=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg
URL=https://images.maas.io/ephemeral-v2/daily/
IMAGES_DIR=/var/www/html/maas/images/ephemeral-v2/daily
```

If you wish to use older images (which change far less frequently,
but which will lack security updates), you can use the 'releases' stream. The
variables then become:

```bash
URL=https://images.maas.io/ephemeral-v2/releases/
IMAGES_DIR=/var/www/html/maas/images/ephemeral-v2/releases
```

The below example is a solid choice for the year 2016. It uses the daily stream
and selects kernels that are compatible with Ubuntu 14.04 (Trusty) and Ubuntu
16.04 (Xenial) for the amd64 architecture, representing a download of
approximately 2.3 GB:

```bash
sudo sstream-mirror --keyring=$KEYRING_FILE $URL $IMAGES_DIR \
	'arch=amd64' 'release~(trusty|xenial)' --max=1 --progress
```

The output to the `sstream-mirror` command is very instructive in terms of
what it is downloading. To know in advance what it will grab and/or if you want
to save bandwidth and time due to possible mis-selections, include the
`--dry-run` option.

The images will be written to disk in the directory defined by the variable
'IMAGES_DIR' above. Their availability over the network can be verified by
visiting:

`http://<server>/maas/images/ephemeral-v2/daily/streams/v1/index.sjson`

Where `<server>` identifies your server's hostname or IP address.

The final `sstream-mirror` command should now be invoked at regular intervals
(i.e. with `cron`) to ensure the images are up-to-date.


## Configure MAAS to use the local mirror

To point MAAS to the local image server (mirror) using the web UI navigate to
the Settings tab and scroll down to the 'Boot Images' section. Then fill in the
fields 'Sync URL' and 'Keyring Path' using the values for variables 'URL' and
'KEYRING_FILE' above.

```bash
maas admin boot-sources create url=http://<server>/images/ephemeral-v2/daily/ keyring_filename=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg
```

See [CLI Image Management](./manage-cli-images.html#) for instructions on
how to do this with the CLI.

See [Images](./installconfig-images.html) for an overview of images and how to
manage them.
