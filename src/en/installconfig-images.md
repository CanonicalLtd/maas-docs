Title: Access the GUI
TODO: Update images
      Possibly split into sections
      Update Server install
      Change local anchors as files are renamed
	
## Access the GUI

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

## Import the boot images

Since version 1.7, MAAS stores the boot images in the region controller's
database, from where the rack controllers will synchronise with the region and
pull images from the region to the rack's local disk. This process is
automatic and MAAS will check for and download new Ubuntu images every hour.

However, on a new installation you'll need to start the import process
manually once you have set up your MAAS region controller. There are two ways
to start the import: through the web user interface, or through the remote
API.

To do it in the web user interface, go to the Images tab, check the boxes to
say which images you want to import, and click the "Import images" button at
the bottom of the Ubuntu section.

![image](./media/import-images.png)

A message will appear to let you know that the import has started, and after a
while, the warnings about the lack of boot images will disappear.

It may take a long time, depending on the speed of your Internet connection
for import process to complete, as the images are several hundred megabytes.
The import process will only download images that have changed since last
import. You can check the progress of the import by hovering over the spinner
next to each image.

The other way to start the import is through the
[region-controller API](./api.html#regioncontroller)
, which you can invoke most conveniently through the 
[command-line interface](./maascli.html#cli).

To do this, connect to the MAAS API using the "maas" command-line client. See
Logging in &lt;api-key&gt; for how to get set up with this tool. Then, run the
command:

```bash
maas my-maas-session boot-resources import
```

(Substitute a different profile name for 'my-maas-session' if you have named
yours something else.) This will initiate the download, just as if you had
clicked "Import images" in the web user interface.

By default, the import is configured to download the most recent LTS release
only for the amd64 architecture. Although this should suit most needs, you can
change the selections on the Images tab, or over the API. Read
customise [boot sources](./bootsources.html) to see examples on how to do that.

## Speeding up repeated image imports by using a local mirror

See [Local Mirroring of Boot Images](./sstreams-mirror.html) for information on
how to set up a mirror and configure MAAS to use it.

## Configure DHCP

To enable MAAS to control DHCP, you can either:

1.  Follow the instructions at [Rack Controller
configuration](installconfig-rack.html) to use the web UI to set up your rack 
controller.
2.  Use the command line interface maas by first
    logging in to the [API](./maascli.html#apikey) and then
    [following this procedure](./maascli.html#cli-dhcp).

## Configuring switches on the network

Some switches use Spanning-Tree Protocol (STP) to negotiate a loop-free path
through a root bridge. While scanning, it can make each port wait up to 50
seconds before data is allowed to be sent on the port. This delay in turn can
cause problems with some applications/protocols such as PXE, DHCP and DNS, of
which MAAS makes extensive use.

To alleviate this problem, you should enable
[Portfast](https://www.symantec.com/business/support/index?page=content&id=HOWTO6019)
for Cisco switches or its equivalent on other vendor equipment, which enables
the ports to come up almost immediately.

## Traffic between the region controller and rack controllers

-   Each rack controller must be able to:
    -   Initiate TCP connections (for HTTP) to each region controller on port
        80 or port 5240, the choice of which depends on the setting of the
        MAAS URL.
    -   Initiate TCP connections (for RPC) to each region controller between
        port 5250 and 5259 inclusive. This permits up to 10 `maas-regiond`
        processes on each region controller host. At present this is
        not configurable.

Once everything is set up and running, you are ready to [start enlisting
nodes](./nodes.html) 
