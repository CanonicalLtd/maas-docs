Title: MAAS CLI | Image Management
TODO:  Decide whether explicit examples are needed everywhere
       Foldouts cannot be used due to bug: https://git.io/vwbCz
       should probably open a bug for the UI static source field (should be a dropdown that reflects what the CLI has configured)


# CLI Image Management

This is a list of image management tasks to perform with the MAAS CLI. See
[MAAS CLI](./manage-cli.html) on how to get started.


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

Add a custom source:

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


## Recreate the default image source

Recreate the default image source if it was ever deleted:

```bash
maas $PROFILE boot-sources create \
	url=$URL keyring_filename=$KEYRING_FILE
```

Where,

- URL=https://images.maas.io/ephemeral-v2/releases/
- KEYRING_FILE=/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg
