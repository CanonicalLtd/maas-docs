Title: Access the GUI
TODO: Update images
	
# Access the GUI

Once MAAS is installed, you'll need to create an administrator account:

```bash
sudo maas createadmin --username=root --email=MYEMAIL@EXAMPLE.COM
```

Substitute your own email address for <MYEMAIL@EXAMPLE.COM>. You may also use
a different username for your administrator account, but "root" is a common
convention and easy to remember. The command will prompt for a password to
assign to the new user.

You can run this command again for any further administrator accounts you may
wish to create, but you need at least one.

## Log in on the server

Looking at the region controller's main web page again, you should now see a
login screen. Log in using the user name and password which you have just
created.

![image](./media/install-login.png)
