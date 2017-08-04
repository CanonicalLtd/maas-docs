Title: Boot images import configuration
table_of_contents: True

# Boot images import configuration

The configuration for where a region downloads its images is defined by a set
of "sources". Each "source" defines a Simplestreams repository location (`url`)
from which images can be downloaded and a `keyring_filename` (or
`keyring_data`) for validating index and image signatures from that location.
For each source, you can define a series of filters (`selections`) specifying
which images should be downloaded from that source.

The following example use the MAAS CLI to list the boot sources and the boot
source selections. Assuming the CLI `PROFILE` is the name of the profile under
which you're logged in to the server:

```bash
maas $PROFILE boot-sources read
```

The output of which will include the boot sources:

```yaml
    [
        {
            "url": "http://maas.ubuntu.com/images/ephemeral-v2/releases/",
            "keyring_data": "",
            "resource_uri": "<url omitted for readability>",
            "keyring_filename": "/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg",
            "id": 1
        }
    ]
```

```bash
maas $PROFILE boot-source-selections read 1
```

The output will list boot source selections:

```yaml
    [
        {
            "labels": [
                "release"
            ],
            "arches": [
                "amd64"
            ],
            "subarches": [
                "*"
            ],
            "release": "trusty",
            "id": 1,
            "resource_uri": "<url omitted for readability>"
        }
    ]
```

## Restricting the images being downloaded

Let's say you want to add a previous LTS release to images being downloaded.
Starting from the configuration described above, you would need to:

- Add the "Precise" selection (the selection '1' of the source '1'):

```bash
maas $PROFILE boot-source-selections create 1 os="ubuntu" release="precise" arches="amd64" subarches="*" labels="*"
```

After you've selected the additional boot sources you need to tell MAAS to
start the import process by running the command:

```bash
maas $PROFILE boot-resources import
```

## Downloading the images from a different source

Let's say you want to import the images from a different location. You would
need to to change the source's url and keyring:

```bash
maas $PROFILE boot-source update 1 url="http://custom.url" keyring_filename="" keyring_data@=./custom_keyring_file
```

```yaml
    {
        "url": "http://custom.url/",
        "keyring_data": "<base64 encoded content of `custom_keyring_file`>",
        "resource_uri": "<url omitted for readability>",
        "keyring_filename": "",
        "id": 1
    }
```
## Adding a source

You can also add a new source:

```bash
maas $PROFILE boot-sources create url=http://my.url keyring_filename="" keyring_data@=./ custom_keyring_file
```

Which produces output similar to the following:

```yaml
    {
        "url": "http://my.url/",
        "keyring_data": "ZW1wdHkK",
        "keyring_filename": "",
        "id": 2,
        "resource_uri": "<url omitted for readability>"
    }
```

Inside that newly created source ('2') you can add selections:

```bash
maas $PROFILE boot-source-selections create 2 os="ubuntu" release="trusty" arches="amd64" subarches="*" labels='*'
```

With the following output:

```yaml
    {
        "labels": ["*"],
        "arches": ["amd64"],
        "subarches": ["*"],
        "release": "trusty",
        "id": 3,
        "resource_uri": "<url omitted for readability>"
    }
```

## Deleting a source

Let's say you need to delete the newly added source.

To delete the source:

```bash
maas $PROFILE boot-source delete 2
```
