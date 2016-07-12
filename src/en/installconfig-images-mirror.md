Title: Local Image Mirror
TODO: Review needed

# Local Image Mirror

Boot images are delivered to MAAS via the simplestreams protocol. It is useful
in some situations, such as testing, to mirror the images locally so that you
don't need to repeatedly pull them down over a slower Internet link.

First, install the required packages on the host where you wish to store the
mirrored images:

```bash
sudo apt install simplestreams ubuntu-cloudimage-keyring apache2
```

Now you can pull the images over using the mirroring tools for simplestreams.
This example gets the daily trusty (14.04) and precise (12.04) images for the
amd64/generic and amd64/hwe-t architectures:

```bash
sudo sstream-mirror --keyring=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg https://images.maas.io/ephemeral-v2/daily/ /var/www/html/maas/images/ephemeral-v2/daily 'arch=amd64' 'subarch~(generic|hwe-t)' 'release~(trusty|precise)' --max=1
```

The above example downloads 722Mb of data. The images will be written to the
local disk and you can verify their presence by browsing to
`http://<server>/maas/images/ephemeral-v2/daily/streams/v1/index.sjson`
(replace `<server>` with your own server's name).

It is a good idea to configure a `cron` job to repeat this import on a regular
basis to keep your mirror up-to-date.

## Configure MAAS to use the local mirror

You can do this using the API or the web UI. To do this via the API you can
use the `maas` command (see [Command Line Interface](manage-cli.html)), logged in as the admin user:

```bash
maas admin boot-sources create url=http://<server>/images/ephemeral-v2/daily/ keyring_filename=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg
```

The output from the above command will look something like the following:

```nohighlight
Success.
Machine-readable output follows:
{
    "keyring_filename": "/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg",
    "resource_uri": "/MAAS/api/2.0/boot-sources/2/",
    "id": 2,
    "url": "http://192.168.122.143/images/ephemeral-v2/daily/",
    "updated": "2016-06-27T15:48:29.254",
    "keyring_data": "",
    "created": "2016-06-27T15:48:29.254"
}
```

If you wish to use older images (which change far less frequently, but will be
lacking security updates), you can use the `releases` stream, such as:

```bash
maas admin boot-sources create url=http://<server>/images/ephemeral-v2/releases/ keyring_filename=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg
```

And then initiate the download with:

```bash
maas admin boot-resources import
```

See [Images](./installconfig-images.html) for an overview of images and how to
manage them.
