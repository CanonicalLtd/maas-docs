 

# Web UI

The MAAS web UI is where users will spend much of their time. It is the
preferred way to manage MAAS. This page will explain how to access the web UI
for the first time and also draw attention to the first iteration of the MAAS
*Dashboard*.


## Access the web UI

Unless MAAS was installed from a snap
(see [Install from snap][install-from-snap]) or the Ubuntu Server ISO (see
[Install from ISO][install-from-iso]), you'll need to create a user in order to
access the web UI. This initial user is a MAAS administrator:

```bash
sudo maas createadmin --username=$PROFILE --email=$EMAIL_ADDRESS
```

For example:

```bash
sudo maas createadmin --username=admin --email=admin@example.com
```

The username can be anything. You will also be prompted to supply a password
for the user. The command option `--password=$PASSWORD` can be used to specify
one but, depending on your environment, this may pose a security risk.

> ⓘ At this time MAAS does not make use of the email address. However, it may do so in the future.

You can now log in here:

<http://$API_HOST:5240/MAAS>

Where $API_HOST is the hostname or IP address of the region API server.

![web UI login][img__webui-login]

The initial administrator will be shown the MAAS Dashboard after they log in
for the first time. Here, there will be the option of embarking on a
configuration journey in order to get MAAS up and running quickly. This is
explained in [Configuration journey][config-journey].

Once logged in, an administrator can create regular users as well as additional
administrators. See [User Accounts][manage-account] for this.

See [MAAS CLI][manage-cli] for logging in via the CLI and working with the CLI.


## MAAS Dashboard

The Dashboard will be a central hub for the user to branch out to other parts
of the web UI to perform certain operations. For now, it points to the main
pages of the web UI such as Machines, Devices, Controllers, Pods, Images, DNS,
AZs, Subnets and Settings. It is also where the results of 
[Device discovery][device-discovery] are recorded.

The Dashboard is available by clicking the MAAS icon (top-left corner). Its URL
is:

<http://$API_HOST:5240/MAAS/#/dashboard>


<!-- LINKS -->

[install-from-iso]: installconfig-iso-install.md
[install-from-snap]: installconfig-snap-install.md
[config-journey]: installconfig-webui-conf-journey.md
[manage-account]: manage-account.md
[manage-cli]: manage-cli.md
[device-discovery]: installconfig-network-dev-discovery.md
[img__webui-login]: ../media/installconfig-webui__2.4_webui-login.png
