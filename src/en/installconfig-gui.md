Title: MAAS | Access the GUI

	
# Access the GUI

Unless MAAS was installed from the
[Ubuntu Server ISO](./installconfig-server-iso.html), you'll need to create a
user in order to access the web UI. This initial user is a MAAS administrator:

```bash
sudo maas createadmin --username=$PROFILE --email=$EMAIL_ADDRESS
```

For example:

```bash
sudo maas createadmin --username=admin --email=admin@example.com
```

You will be prompted to supply a password for the user. There is also a
command option ('--password=$PASSWORD') that can be used to specify one.

!!! Note: At this time MAAS does not make use of the email address. However, it
may do so in the future.

You can now log in to the web UI.

![web account login](./media/install-login.png)

Once logged in to the UI an administrator can use it to create regular users as
well as additional administrators. See [User Accounts](./manage-account.html)
for this.

See [MAAS CLI](./manage-cli.html) for logging in via the CLI and working with
the CLI.
