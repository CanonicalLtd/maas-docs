Title: Install from Ubuntu Server ISO
TODO:	

# Install from Ubuntu Server ISO

The [Ubuntu Server](http://www.ubuntu.com/download/server) (16.04 LTS)
installer offers the opportunity to pre-configure the server as either a MAAS
Region Controller or a MAAS Rack Controller. 

!["server install menu"](./media/iso-install_01.png)

!!! Note: see '[Concepts and terms](intro-concepts.html#controllers)' for the
differences between region controller and rack controller.

There is very little difference between the install procedure of a generic
Ubuntu Server, and a server pre-configured for MAAS. After selecting either the
rack controller or the region controller from the installation menu, you will
need to select a language, select a geographical location, configure the
keyboard and define a hostname, just as you would normally. 

After these steps have completed, you'll see either a page entitled 'Install
your Metal as a Service (MAAS)' for a 'Region Controller' installation, or
'Install your Metal as a Service (MAAS) rack controller.'

![region controller install](./media/iso-install-region_01.png)

The region controller installation will ask for a username followed by a password
for the MAAS administrator. If these are not provided, an administrator account
will need to be create manually before you can use MAAS. 


![rack controller install](./media/iso-install-rack_01.png)

The rack controller installation requires no further MAAS-specific input, and
the Ubuntu Server installation will proceed normally:

Enter a username and password to create a user account for the server. This
account is separate from the administrator account created for the MAAS Region
Controller. You will then be asked whether you wish to encrypt the home
directory and asked for the server's time zone. 

The next stage configures storage and partitions before the system software will
start to be installed. After this has completed you get the option to define an
HTTP proxy server, which may be needed for your MAAS server to access the
internet, and how you want updates delivered. The choice is between 'No
automatic updates', 'Install security updates automatically' and 'Manage system
with Landscape'. 

![rack updates](./media/iso-install-region-updates.png)

!!! Note: [Landscape](https://landscape.canonical.com) is Canonical's leading
system management tool.

It is important to set updates appropriately so you will receive timely
updates of the MAAS server software, as well as other essential services that
may run on this server.

The final two steps install the Grub boot loader and set the time. You will
then be notified that installation is complete and you should restart the
server.

When the server is back online, the web interface for the region controller
is accessible from `http://$SERVER_IP/MAAS`. You will be asked to login
with the MAAS administrator username and password you created earlier. See [Add
Nodes](installconfig-add-nodes.html) for details on adding resources to MAAS.

The rack controller can be accessed from its local terminal where you can login
with the account credentials configured during installation. See [Rack
Controller Configuration](installconfig-rack.html) for details on registering
and configuring the rack controller with the region controller. 

!!! Note: An SSH server isn't installed on the rack controller by default. 
