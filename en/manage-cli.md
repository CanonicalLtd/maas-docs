Title: MAAS CLI | MAAS
TODO:  Foldouts cannot be used with syntax highlighting: https://git.io/v14BR (affects all CLI pages)
       Consider explaining how an API call is converted to a CLI command
table_of_contents: True


# MAAS CLI

The MAAS CLI can do everything that the web UI can do, and more. The CLI uses
the `maas` command exclusively which, in turn, connects to the API.

This page explains what is needed to get going with the CLI. Tasks are then
separated into common, image management, and advanced.

Note that we do not provide complete coverage of the MAAS CLI. For an
exhaustive treatment, see the
[API documentation](http://docs.maas.io/2.0/api.html).

Values are represented as uppercase variables preceded with the '$' character
(e.g. $PROFILE and $EMAIL_ADDRESS). These are to be replaced with actual
values.


## Create an administrator

MAAS requires an initial administrator, sometimes called a MAAS "superuser".
When the web UI is accessed for the first time you will be prompted to create
this user:

```bash
sudo maas createadmin --username=$PROFILE --email=$EMAIL_ADDRESS
```

Extra administrators can be created in the same way. See
[here](manage-cli-common.md#create-a-regular-user) for creating regular
users with the CLI.


## Log in (required)

To use the CLI you must first log in to the API server (region controller).

You will need the API key that was generated when your MAAS account was
created. To obtain it, run this command on the region controller (i.e. where
the 'maas-region-controller' package was installed):

```bash
sudo maas-region apikey --username=$PROFILE > $API_KEY_FILE
```

!!! Note: A user's API key can also be obtained from the web interface. Click
on 'username' in the top right corner, and select 'Account'.

Log in. You will be prompted for the API key:

```bash
maas login $PROFILE $API_SERVER
```

For example, to log in with the account whose username is 'admin' and where
the region controller is on the localhost:

```bash
maas login admin http://localhost:5240/MAAS/api/2.0
```

To log in by referring to the API key file created earlier:

```bash
maas login $PROFILE $API_SERVER - < $API_KEY_FILE
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

To continue with the CLI, explore the following areas:

- [Common tasks](manage-cli-common.md)
- [Image management](manage-cli-images.md)
- [DHCP snippet management](manage-cli-dhcp-snippets.md)
- [Advanced tasks](manage-cli-advanced.md)
