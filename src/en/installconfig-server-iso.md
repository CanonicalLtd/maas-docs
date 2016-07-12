Title: Ubuntu Server
TODO:	

# Install MAAS from Ubuntu Server

If you are installing MAAS as part of a fresh install it is easiest to choose
the "Multiple Server install with MAAS" option from the installer and have
pretty much everything set up for you. Boot from the Ubuntu Server media and
you will be greeted with the usual language selection screen:

![image](./media/install_01.png)

On the next screen, you will see there is an entry in the menu called
"Multiple server install with MAAS". Use the cursor keys to select this and
then press Enter.

![image](./media/install_02.png)

The installer then runs through the usual language and keyboard options. Make
your selections using Tab/Cursor keys/Enter to proceed through the install.
The installer will then load various drivers, which may take a moment or two.

![image](./media/install_03.png)

The next screen asks for the hostname for this server. Choose something
appropriate for your network.

![image](./media/install_04.png)

Finally we get to the MAAS part! Here there are just two options. We want to
"Create a new MAAS on this server" so go ahead and choose that one.

![image](./media/install_05.png)

The install now continues as usual. Next you will be prompted to enter a
username. This will be the admin user for the actual server that MAAS will be
running on (not the same as the MAAS admin user!)

![image](./media/install_06.png)

As usual you will have the chance to encrypt your home directory. Continue to
make selections based on whatever settings suit your usage.

![image](./media/install_07.png)

After making selections and partitioning storage, the system software will
start to be installed. This part should only take a few minutes.

![image](./media/install_09.png)

Various packages will now be configured, including the package manager and
update manager. It is important to set these up appropriately so you will
receive timely updates of the MAAS server software, as well as other essential
services that may run on this server.

![image](./media/install_10.png)

The configuration for MAAS will ask you to configure the host address of the
server. This should be the IP address you will use to connect to the server
(you may have additional interfaces e.g. to run node subnets)

![image](./media/install_cluster-config.png)

The next screen will confirm the web address that will be used to the web
interface.

![image](./media/install_controller-config.png)

After configuring any other packages the installer will finally come to and
end. At this point you should eject the boot media.

![image](./media/install_14.png)

After restarting, you should be able to login to the new server with the
information you supplied during the install. The MAAS software will run
automatically.

![image](./media/install_15.png)

!!! Note: The maas-dhcp and maas-dns packages should be installed by default,
but on older releases of MAAS they won't be. If you want to have MAAS run DHCP
and DNS services, you should install these packages. Check whether they are
installed with:

```bash
dpkg -l maas-dhcp maas-dns
```

If they are missing, then:

```bash
sudo apt-get install maas-dhcp maas-dns
```

And then proceed to the post-install setup.

