Title: MAAS CLI | Image Management
TODO:  Decide whether explicit examples are needed everywhere
       Foldouts cannot be used due to bug: https://git.io/vwbCz
       should probably open a bug for the UI static source field (should be a dropdown that reflects what the CLI has configured)


# CLI Image Management

This is a list of image management tasks to perform with the MAAS CLI. See
[MAAS CLI](./manage-cli.html) on how to get started.

!!! WARNING: Modifying image sources with the CLI does not alter the web UI.


## List current image sources

To list current image sources:

```bash
maas $PROFILE boot-sources read
```

!!! Note: Although it is possible to have more than one image source, in
practice there is no reason for it and MAAS expects a single image source
at any given time.


## List current image selections

To list current image selections:

```bash
maas $PROFILE boot-source-selections read 1
```


## List currently available images

To list currently available images:

```bash
maas $PROFILE boot-resources read
```


## Select images

To select images from an image source by specifying series; architecture; and
HWE kernel:

```bash
maas $PROFILE boot-source-selections create $SOURCE_ID \
	os="ubuntu" release="$SERIES" arches="$ARCH" \
	subarches="$HWE_KERNEL" labels="*"
```

For example:

```bash
maas $PROFILE boot-source-selections create 1 \
	os="ubuntu" release="trusty" arches="amd64" \
	subarches="hwe-v" subarches="hwe-w" labels="*"
```

After new images are selected MAAS will need to import them.

!!! Note: The web UI has a static field that stipulates what image source is
used.


## Import newly-selected images

To import newly-selected images:

```bash
maas $PROFILE boot-resources import
```

Once newly-selected images are imported a sync mechanism will keep them up to
date automatically.


## Delete an image source

To delete an image source:

```bash
maas $PROFILE boot-source delete $SOURCE_ID
```


## Edit an image source

To edit an existing source the keyring can be defined with a custom location
($URL) and a custom keyring file (path of $KEYRING_FILE) with contents like:

```nohighlight
{
    "url": "$URL",
    "keyring_data": "base64 encoded content of $KEYRING_FILE",
    "resource_uri": "$URL",
    "keyring_filename": "",
    "id": $SOURCE_ID
}
```

Then update the source:

```bash
maas $PROFILE boot-source update $SOURCE_ID \
	url=$URL keyring_filename="" keyring_data@=$KEYRING_FILE
```


## Add an image source

!!! Note: To avoid unecessary complexity, you should probably delete the
existing source before adding a new one.

This example also covers the case of a local image mirror. It is just a matter
of a different URL
Add a custom source with its own location and keyring:

```bash
maas $PROFILE boot-sources create \
	url=$URL keyring_filename="" keyring_data@=$KEYRING_FILE
```

The output will include a new numeric ID that identifies the source
($SOURCE_ID).


## Recreate the default image source

Recreate the default image source if it was ever deleted:

```bash
maas $PROFILE boot-sources create \
	url=$URL keyring_filename=$KEYRING_FILE
```

Where,

- URL=https://images.maas.io/ephemeral-v2/daily/
- KEYRING_FILE=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg
