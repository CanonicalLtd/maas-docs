Title: MAAS CLI | Image Management
TODO:  Decide whether explicit examples are needed everywhere
       Foldouts cannot be used due to bug: https://git.io/vwbCz


# CLI Image Management

This is a list of image management tasks to perform with the MAAS CLI. See
[MAAS CLI](manage-cli.md) on how to get started.

See [MAAS Images](installconfig-images.md) for an overview of images.


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

For example, to select all HWE kernels for 64-bit Trusty:

```bash
maas $PROFILE boot-source-selections create 1 \
	os="ubuntu" release="trusty" arches="amd64" \
	subarches="*" labels="*"
```

Often users would simply want the latest HWE kernel available for Trusty,
which, at time of writing, is from Xenial:

```bash
maas $PROFILE boot-source-selections create 1 \
	os="ubuntu" release="trusty" arches="amd64" \
	subarches="hwe-x" labels="*"
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

An existing source can be edited by changing the GPG keyring file
(KEYRING_FILE) and/or the location (URL).

Update the source:

```bash
maas $PROFILE boot-source update $SOURCE_ID \
	url=$URL keyring_filename=$KEYRING_FILE
```

At this time MAAS only fully supports a source containing official MAAS images.
This implies that an image source would only be edited if a mirror of such
images has been set up. The location can change but the keyring remains
constant:

KEYRING_FILE=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg


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
(SOURCE_ID).

Since MAAS can only practically work with a single image source this scenario
implies that any existing sources have first been deleted, or will be deleted.
In addition, as is the case with editing a source, the location (URL) is the
only acting variable. The only supported keyring is:

KEYRING_FILE=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg

If the source that was added is now the sole boot source then the fields
'Sync URL' and 'Keyring Path' in the web UI will reflect its values.

Once the source is added, proceed to the
[Select and Import](installconfig-images-import.md) images step.

### Using a local image mirror

Once the mirror is set up according to 
[Local Image Mirror](installconfig-images-mirror.md) it is just a matter of
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
