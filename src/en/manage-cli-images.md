Title: MAAS CLI | Image Management
TODO:  Decide whether explicit examples are needed everywhere
       Foldouts cannot be used due to bug: https://git.io/vwbCz


# CLI Image Management

This is a list of image management tasks to perform with the MAAS CLI. See
[MAAS CLI](./manage-cli.html) on how to get started.

See [MAAS Images](./installconfig-images.html) for an overview of images.


## List image sources

To list image sources:

```bash
maas $PROFILE boot-sources read
```


## List image selections

To list image selections for a boot source:

```bash
maas $PROFILE boot-source-selections read $SOURCE_ID
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


## Import newly-selected images

To import newly-selected images:

```bash
maas $PROFILE boot-resources import
```

Once newly-selected images are imported a sync mechanism is enabled (by
default) to keep them up to date. The refresh time interval is 60 minutes.

Available images resulting from this action are reflected in the web UI.


## Delete an image source

To delete an image source:

```bash
maas $PROFILE boot-source delete $SOURCE_ID
```

If the source that was deleted was the sole boot source then the fields
'Sync URL' and 'Keyring Path' in the web UI will take on null values.


## Edit an image source

Editing an existing source implies changing the location ($URL) and keyring
file ($KEYRING_FILE). Once done, the source is updated:

```bash
maas $PROFILE boot-source update $SOURCE_ID \
	url=$URL keyring_filename=$KEYRING_FILE
```

If the source that was edited is the sole boot source then the fields
'Sync URL' and 'Keyring Path' in the web UI will reflect the new values.


## Add an image source

!!! Note: To avoid unnecessary complexity, you should probably delete any
existing source before adding a new one.

Presented below are two use cases for adding an image source:

1. Use a local image mirror (official images)
1. Recreate the default image source (if it was ever deleted)

<!--
1. Use a custom image source (custom images)
-->

The general syntax is:

```bash
maas $PROFILE boot-sources create \
	url=$URL keyring_filename=$KEYRING_FILE
```

The output will include a new numeric ID that identifies the source
($SOURCE_ID).

If the source that was added is now the sole boot source then the fields
'Sync URL' and 'Keyring Path' in the web UI will reflect its values.

Once the source is added, proceed to the
[Select and Import](installconfig-images-import.html) images step.

### Using a local image mirror

Once the mirror is set up according to 
[Local Image Mirror](./installconfig-images-mirror.html) it is just a matter of
specifying the mirror location (URL). Since the images come from the default
source the default keyring should be used. If the aforementioned mirror
document was followed, the variable values should be:

- URL=https://myserver/maas/images/ephemeral-v2/daily/
- KEYRING_FILE=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg

Where `myserver` identifies your mirror server's hostname or IP address.

### Recreate the default image source

Recreate the default image source if it was ever deleted using the following
variable values:

- URL=https://images.maas.io/ephemeral-v2/daily/
- KEYRING_FILE=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg
