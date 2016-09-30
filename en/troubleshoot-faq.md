Title: MAAS | Troubleshooting
TODO:  review soon


# MAAS Troubleshooting

This section covers some of the most commonly encountered problems and attempts
to resolve them.


## Nodes hang on "Commissioning"

### Possible Cause: Timing issues

Various parts of MAAS rely on OAuth to negotiate a connection to nodes. If the
current time reported by the hardware clock on your node differs significantly
from that on the MAAS server, the connection will not be made.

**SOLUTION:** Check that the hardware clocks are consistent, and if necessary,
adjust them. This can usually be done from within the system BIOS, without
needing to install an OS.

### Possible Cause: Network drivers

Sometimes the hardware can boot from PXE, but fail to load correct drivers
when booting the received image. This is sometimes the case when no open
source drivers are available for the network hardware.

**SOLUTION:** The best fix for this problem is to install a Linux-friendly
network adapter. It *is* theoretically possible to modify the boot image to
include proprietary drivers, but it is not a straightforward task.


## Nodes fail to PXE boot

### Possible Cause: Using an incorrectly configured VM

Some virtual machine setups include emulation of network hardware that does
not support PXE booting, and in most setups, you will need to explicitly set
the VM to boot via PXE.

**SOLUTION**: Consult the VM docs for details on PXE booting.

### Possible Cause: DHCP conflict

If you are using MAAS in a setup with an existing DHCP, *DO NOT SET UP THE
MAAS DHCP SERVER* as this will cause no end of confusion to the rest of your
network and most likely won't discover any nodes either.

**SOLUTION**: You will need to configure your existing DHCP server to point to
the MAAS server.


## Can't log in to node

Sometimes you may wish to log in directly to a node on your system. If you have
set up Juju and MAAS, the node will automatically have SSH authentication
enabled (and public keys installed) allowing you to log in. There is also an
option in the MAAS web interface to add new SSH keys to the nodes (via
Preferences in the drop down menu which appears when clicking your username in
the top-right of the page).


## Forgot MAAS administrator password

As long as you have sudo privileges the
`maas` command can be used to change the password for a MAAS administrator on the MAAS
region controller:

```bash
sudo maas changepassword $PROFILE
```

where $PROFILE is the name of the user.


## Need to reconfigure server IP address

If you made a mistake during setup or you just need to reconfigure your MAAS
server, you can simply run the setup again:

```bash
sudo dpkg-reconfigure maas-region-controller
```


## Can't find MAAS webpage

The default webpage is located at `http://<hostname>/MAAS/`. If you can't
access it, there are a few things to try:

1. Check that the webserver is running - By default the web interface uses
   Apache, which runs under the service name *apache2*. To check it, on the
   MAAS server box you can run `sudo /etc/init.d/apache2 status`.
2. Check that the hostname is correct - It may seem obvious, but check that
   the hostname is being resolved properly. Try running a browser (even a
   text mode one like `elinks`) on the same box as the MAAS server and
   navigating to the page. If that doesn't work, try
   `http://127.0.0.1/MAAS/`, which will always point at the local server.
3. If you are still getting "404 - Page not found" errors, check that the
   MAAS web interface has been installed in the right place. There should
   be a file present called `/usr/share/maas/maas/urls.py`.


## Debugging ephemeral image

### Backdoor (add a login) to ephemeral images

If you cannot log in to an instance, you might have to "backdoor it" in order
to see what is going wrong. Scott Moser wrote a simple utility that injects a
user and password into an image. Here's how to add a 'backdoor' user with a
password to your images:

```bash
sudo apt-get install --assume-yes bzr
bzr branch lp:~maas-maintainers/maas/backdoor-image backdoor-image

imgs=$(echo /var/lib/maas/boot-resources/*/*/*/*/*/*/root-image)
for img in $imgs; do
    [ -f "$img.dist" ] || sudo cp -a --sparse=always $img $img.dist
done

for img in $imgs; do
    sudo ./backdoor-image/backdoor-image -v --user=backdoor --password-auth --password=ubuntu $img
done
```

### Inside the ephemeral image

Important files for debugging:

```no-highlight
/var/log/cloud-init.log
/var/log/boot.log
/var/log/cloud-init-output.log
```

After enlistment or commissioning, the user-data from MAAS instructs the
system to power off. To stop that from happening, you can just create a file
in /tmp:

```bash
touch /tmp/block-poweroff
```

### MAAS credentials

MAAS credentials can be found in this way:

From `/etc/cloud/cloud.cfg.d/91_kernel_cmdline_url`. The file was pulled from
`url=` parameter by `cloud-init`:

```bash
sudo cat /etc/cloud/cloud.cfg.d/91_kernel_cmdline
```

### MAAS datasource

The cloud-init datasource for MAAS can be invoked as a 'main' for debugging
purposes. To do so, you need to know the URL for the MAAS datasource and a
config file that contains credentials:

```bash
cfg=$(echo /etc/cloud/cloud.cfg.d/*_cmdline_url.cfg)
echo $cfg /etc/cloud/cloud.cfg.d/91_kernel_cmdline_url.cfg
```

Now get the metadata\_url from there:

```bash
url=$(sudo awk '$1 == "metadata_url:" { print $2 }' $cfg)
echo $url http://10.55.60.194/MAAS/metadata/enlist
```

Invoke the client `/usr/share/pyshared/cloudinit/sources/DataSourceMAAS.py`.
The client has --help usage also, but here is an example of how to use it:

```bash
maasds="/usr/share/pyshared/cloudinit/sources/DataSourceMAAS.py"
sudo python $maasds --config=$cfg get $url
== http://10.55.60.194/MAAS/metadata/enlist ==
2012-03-01
latest
sudo python $maasds --config=$cfg get $url/latest/meta-data/local-hostname
maas-enlisting-node
```
