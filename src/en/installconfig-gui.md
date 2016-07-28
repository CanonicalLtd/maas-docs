Title: Access the GUI
	
# Access the GUI

Unless you installed MAAS via [Ubuntu Server](installconfig-server-iso.html),
you'll need to create an administrator account before you can access the web
interface:

```bash
sudo maas createadmin --username=root --email=MYEMAIL@EXAMPLE.COM
```

Substitute your own email address for <MYEMAIL@EXAMPLE.COM>. You may also use
a different username for your administrator account, but "root" is a common
convention and easy to remember. The command will prompt for a password to
assign to the new user.

Additional administrator accounts can be created from the [web
UI](installconfig-account.html), or by running the above
command again, but you will always need at least one account.

## Log in on the server

Looking at the region controller's main web page again, you should now see a
login screen. Log in using the user name and password which you have just
created.

![web account login](./media/install-login.png)
