Title: MAAS CLI
TODO:  Provide links to definitions of the entities (e.g. fabric, dynamic address range)
       Foldouts cannot be used due to bug: https://git.io/vwbCz
       Consider explaining how an API call is converted to a CLI command


# MAAS CLI

The MAAS CLI can do everything that the web UI can do, and more. The CLI uses
the `maas` command exclusively which, in turn, connects to the API.

This page explains what is needed to get going with the CLI. Tasks are then
separated into common, image management, and advanced.

Note that we do not provide complete coverage of the MAAS CLI. For an
exhaustive treatment, see the
[API documentation](http://maas.ubuntu.com/docs2.0/index.html#api-cli-documentation).

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

To use the CLI you must first log in to the API server.

You will need the API key that was generated when your MAAS account was
created. To obtain it, run this command on the region controller (i.e. where
the 'maas-region-controller' package was installed):

```bash
sudo maas-region apikey --username=$USERNAME
```

!!! Note: The API key can also be obtained from the web interface. Click on
'username' in the top right corner, and select 'Account'.

Log in with either of:

```bash
maas login $PROFILE $API_SERVER [$API_KEY]
maas login $PROFILE $API_SERVER - < $API_KEY_FILE
```

Notes:

- The terms 'username' and 'profile' are effectively equivalent.
- The API server is the region controller.
- If the API key is not supplied (in the first form) the user will be prompted for it.

For example, to log in with the account whose username is 'admin' and where
the region controller is on the localhost:

```bash
maas login admin http://localhost/MAAS/api/2.0
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

To continue with the CLI, explore the following links:

- [Common tasks](manage-cli-common.md)
- [Image management](manage-cli-images.md)
- [Advanced tasks](manage-cli-advanced.md)
