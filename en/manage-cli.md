Title: CLI
TODO:  Foldouts cannot be used with syntax highlighting: https://git.io/v14BR (affects all CLI pages)
table_of_contents: True


# MAAS CLI

The MAAS CLI can do everything that the web UI can do, and more. The CLI uses
the `maas` command exclusively which, in turn, connects to the API.

This page explains what is needed to get going with the CLI. Tasks are then
separated into common, image management, DHCP snippet management, and advanced.

Note that we do not provide complete coverage of the MAAS CLI. For an
exhaustive treatment, see the [API documentation][api].

Values are represented as uppercase variables preceded with the '$' character
(e.g. $PROFILE and $EMAIL_ADDRESS). These are to be replaced with actual
values.


## The maas command

The `maas` command is obtained via the `maas-cli` Ubuntu package which is
installed on every region API server and rack controller. To manage MAAS at the
CLI level from a remote workstation this package will need to be installed:

```bash
sudo apt install maas-cli
```


## Create an administrator

MAAS requires an initial administrator, sometimes called a MAAS "superuser".
When the web UI is accessed for the first time you will be prompted to create
this user:

```bash
sudo maas createadmin --username=$PROFILE --email=$EMAIL_ADDRESS
```

Extra administrators can be created in the same way. See
[MAAS CLI - common tasks][cli-create-regular-user] for creating regular users
with the CLI.


## Log in (required)

To use the CLI you must first log in to the API server (region controller).

You will need the API key that was generated when your MAAS account was
created. To obtain it, run this command on the region controller (i.e. where
the 'maas-region-controller' package was installed):

```bash
sudo maas-region apikey --username=$PROFILE > $API_KEY_FILE
```

!!! Note: 
    A user's API key can also be obtained from the web interface. Click
    on 'username' in the top right corner, and select 'Account'.

Log in. You will be prompted for the API key:

```bash
maas login $PROFILE $MAAS_URL
```

For example, to log in with the account whose username is 'admin' and where
the region controller is on the localhost:

```bash
maas login admin http://localhost:5240/MAAS/api/2.0
```

To log in by referring to the API key file created earlier:

```bash
maas login $PROFILE $MAAS_URL - < $API_KEY_FILE
```

A handy shell script, say `maas-login.sh`, is provided:

```no-highlight
#!/bin/sh

# Change these 3 values as required 
PROFILE=admin
API_KEY_FILE=/home/ubuntu/tmp/api_key
API_SERVER=localhost

MAAS_URL=http://$API_SERVER/MAAS/api/2.0

maas login $PROFILE $MAAS_URL - < $API_KEY_FILE
```


## Get help

To access command help:

```bash
maas $PROFILE -h
```

Further examples:

```bash
maas $PROFILE tags -h
maas $PROFILE tags read -h
```


## Log out

Once you are done with the CLI you can log out from the given profile, flushing
the stored credentials.

```bash
maas logout $PROFILE
```


## Next steps

The following categories are now available to be explored:

- [Common tasks][cli-common]
- [Image management][cli-images]
- [Tag management][cli-tags]
- [DHCP snippet management][cli-snippets]
- [Advanced tasks][cli-advanced]


<!-- LINKS -->

[api]: api.md
[cli-create-regular-user]: manage-cli-common.md#create-a-regular-user
[cli-common]: manage-cli-common.md
[cli-images]: manage-cli-images.md
[cli-tags]: manage-cli-tags.md
[cli-snippets]: manage-cli-dhcp-snippets.md
[cli-advanced]: manage-cli-advanced.md
