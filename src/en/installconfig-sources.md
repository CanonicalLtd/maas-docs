Title: Boot images import configuration
TODO: 	Update to use the GUI

# Boot images import configuration

The configuration for where a Region Controller downloads its images is defined
by a set of "sources". Each "source" defines a Simplestreams repository
location (`URL`) from which images can be downloaded and a `keyring_filename`
(or `keyring_data`) for validating index and image signatures from that
location.  For each source, you can define a series of filters (`selections`)
specifying which images should be downloaded from that source.

The following examples use the MAAS CLI to first list the boot sources and then
list the boot source selections, using the already authenticated 'admin'
profile to connect to MAAS.


To read the boot sources, enter the following:

```bash
maas admin boot-sources read
```

Output from this command should be similar to this:

```yaml
Success.
Machine-readable output follows:
[
    {
        "url": "https://images.maas.io/ephemeral-v2/releases/",
        "keyring_filename":
"/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg",
        "updated": "2016-05-24T12:21:01.837",
        "id": 1,
        "created": "2016-05-24T12:21:01.837",
        "keyring_data": "",
        "resource_uri": "/MAAS/api/2.0/boot-sources/1/"
    }
]
```

To see the boot source selections, enter the following:

```bash
maas admin boot-source-selections read 1
```

The output from the above command will depend on which images you have
installed. Our example output includes both Xenial and Trusty images:

```nohighlight
Success.
Machine-readable output follows:
[
    {
        "os": "ubuntu",
        "arches": [
            "amd64"
        ],
        "release": "xenial",
        "subarches": [
            "*"
        ],
        "labels": [
            "*"
        ],
        "resource_uri": "/MAAS/api/2.0/boot-sources/1/selections/1/",
        "id": 1
    },
    {
        "os": "ubuntu",
        "arches": [
            "amd64"
        ],
        "release": "trusty",
        "subarches": [
            "*"
        ],
        "labels": [
            "*"
        ],
        "resource_uri": "/MAAS/api/2.0/boot-sources/1/selections/2/",
        "id": 2
    }
]

```

## Restricting the images being downloaded

Let's say you want to add a previous LTS release to images being downloaded.
Starting from the configuration described above, the following command will add
Ubuntu 12.04 ("Precise"):

```bash
maas admin boot-source-selections create 1 os="ubuntu" release="precise" arches="amd64" subarches="*" labels="*"
```

After you've selected the additional boot sources you need to tell MAAS to
start the import process by running the following command:

```bash
maas admin boot-resources import
```

The output from this command will inform you that the import of boot resources
has started, and you can check on progress from the 'Images' page of the MAAS
GUI.

## Downloading the images from a different source

Let's say you want to import the images from a different location. You would
need to to change the source's URL and keyring. The keyring can be defined by
creating a file called 'custom_keyring' with contents based on the following
example:

```nohighlight
{
    "url": "http://custom.url/",
    "keyring_data": "<base64 encoded content of `custom_keyring_file`>",
    "resource_uri": "<url omitted for readability>",
    "keyring_filename": "",
    "id": 1
}
```

You can now add the source with the following command:

```bash
maas admin boot-source update 1 url="http://custom.url" keyring_filename="" keyring_data@=./custom_keyring
```

!!! Note: This will update/replace boot source '1' which by default points to
Canonical's MAAS image repository, making it unavailable as an image source.

## Adding a source

You can also add a new source. To recreate the entry for the original MAAS
image repository, for example, enter the following:

```bash
maas admin boot-sources create url=https://images.maas.io/ephemeral-v2/releases/ keyring_filename=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg
```

The output from this `create` command will include a new numeric `id` for the source:

```nohighlight
Success.
Machine-readable output follows:
{
    "keyring_data": "",
    "keyring_filename": "/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg",
    "resource_uri": "/MAAS/api/2.0/boot-sources/3/",
    "created": "2016-06-21T13:59:51.579",
    "updated": "2016-06-21T13:59:51.579",
    "id": 2,
    "url": "https://images.maas.io/ephemeral-v2/releases/"
}

```

You can add your own custom sources too, using the 'custom_keyring' file we created
previously and by defining your own URL:

```bash
maas admin boot-sources create url=http://custom.url keyring_filename="" keyring_data@=./ custom_keyring_file

```
Inside that newly created source ('2') you can now add selections:

```bash
maas admin boot-source-selections create 2 os="ubuntu" release="xenial" arches="amd64" subarches="*" labels='*'
```

## Deleting a source

Finally, if you need to delete a source, you can do this by specifying its
numeric `id` within the following command:

```bash
maas admin boot-source delete 2
```
