Title: CLI Image Management
table_of_contents: True


# CLI Image Management

This is a list of image management tasks to perform with the MAAS CLI. See
[MAAS CLI][manage-cli] on how to get started.

See [Images][images] for an overview of images.


## List boot sources

To list boot sources, that is, the locations where images (boot resources) may
be downloaded from:

```bash
maas $PROFILE boot-sources read
```

!!! Note:
    Although multiple boot sources may be listed, MAAS can only practically
    work with a single boot source.


## Select images

To select images (with the intention of later importing them) from a boot
source:

```bash
maas $PROFILE boot-source-selections create $SOURCE_ID \
	os="ubuntu" release="$SERIES" arches="$ARCH" \
	subarches="$KERNEL" labels="*"
```

For example, to select all kernels for 64-bit Trusty from a boot source with an
id of '1':

```bash
maas $PROFILE boot-source-selections create 1 \
	os="ubuntu" release="trusty" arches="amd64" \
	subarches="*" labels="*"
```

To get just the latest amd64 HWE kernel available for Trusty, which, at time of
writing, is from Xenial:

```bash
maas $PROFILE boot-source-selections create 1 \
	os="ubuntu" release="trusty" arches="amd64" \
	subarches="hwe-x" labels="*"
```

For Xenial kernels (and starting with MAAS 2.1), notation has changed. To
select the latest amd64 HWE kernel available for Xenial:

```bash
maas $PROFILE boot-source-selections create 1 \
	os="ubuntu" release="xenial" arches="amd64" \
	subarches="hwe-16.04" labels="*"
```


After new images are selected MAAS will need to import them.


## List image selections

To list image selections for a boot source:

```bash
maas $PROFILE boot-source-selections read $SOURCE_ID
```


## Import newly-selected images

To import newly-selected images (boot resources):

```bash
maas $PROFILE boot-resources import
```

Once newly-selected images are imported a sync mechanism is enabled (by
default) to keep them up to date. The refresh time interval is 60 minutes.

Available images resulting from this action are reflected in the web UI.


## List currently available images

To list currently available/imported images (boot resources):

```bash
maas $PROFILE boot-resources read
```


## Delete a boot source

To delete a boot source (the location where images are downloaded from):

```bash
maas $PROFILE boot-source delete $SOURCE_ID
```

If the boot source that was deleted was the sole boot source then the fields
'Sync URL' and 'Keyring Path' in the web UI will take on null values.


## Edit a boot source

An existing boot source can be edited by changing the GPG keyring file
($KEYRING_FILE) and/or the location ($URL).

Update the boot source:

```bash
maas $PROFILE boot-source update $SOURCE_ID \
	url=$URL keyring_filename=$KEYRING_FILE
```

At this time MAAS only fully supports a boot source containing official MAAS
images. This implies that a boot source would only be edited if a mirror of
such images has been set up. The location can change but the keyring remains
constant:

KEYRING_FILE=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg


## Add a boot source

!!! Note: 
    To avoid unnecessary complexity, you should probably delete any
    existing boot sources before adding a new one.

Presented below are two use cases for adding a boot source:

1. Use a local image mirror (official images)
1. Recreate the default image source (if it was ever deleted)

The general syntax is:

```bash
maas $PROFILE boot-sources create \
	url=$URL keyring_filename=$KEYRING_FILE
```

The output will include a new numeric ID that identifies the boot source
($SOURCE_ID).

Since MAAS can only practically work with a single boot source this scenario
implies that any existing sources have first been deleted, or will be deleted.
In addition, as is the case with editing a source, the location (URL) is the
only acting variable. The only supported keyring is:

KEYRING_FILE=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg

If the source that was added is now the sole boot source then the fields
'Sync URL' and 'Keyring Path' in the web UI will reflect its values.

Once the source is added, proceed to the [Select and import][images-import]
images step.

### Using a local image mirror

Once the mirror is set up according to [Local image mirror][mirror] it is just
a matter of specifying the mirror location (URL). Since the images come from
the default source the default keyring should be used. If the aforementioned
mirror document was followed, the variable values should be:

- URL=https://$MIRROR/maas/images/ephemeral-v3/daily/
- KEYRING_FILE=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg

Where $MIRROR is the mirror server's hostname or IP address.

### Recreate the default boot source

Recreate the default boot source if it was ever deleted using the following
variable values:

- URL=https://images.maas.io/ephemeral-v3/daily/
- KEYRING_FILE=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg


<!-- LINKS -->

[manage-cli]: manage-cli.md
[images]: installconfig-images.md
[images-import]: installconfig-images-import.md
[mirror]: installconfig-images-mirror.md
