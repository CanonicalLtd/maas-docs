Title: Troubleshooting
TODO:  critical: review needed
table_of_contents: True


# Troubleshooting

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


## Node deployment fails

When deployment fails the [Rescue mode][concepts-rescue-mode-action] action 
can be used to boot ephemerally into the node, followed by an investigation. 

As an example, an improperly configured PPA was added to MAAS which caused
nodes to fail deployment. After entering Rescue mode and connecting via SSH,
the following was discovered in file `/var/log/cloud-init-output.log`:

```no-highlight
2016-11-28 18:21:48,982 - cc_apt_configure.py[ERROR]: failed to add apt GPG Key
to apt keyring
Traceback (most recent call last):
  File "/usr/lib/python3/dist-packages/cloudinit/config/cc_apt_configure.py",
line 540, in add_apt_key_raw
    util.subp(['apt-key', 'add', '-'], data=key.encode(), target=target)
  File "/usr/lib/python3/dist-packages/cloudinit/util.py", line 1836, in subp
    cmd=args)
cloudinit.util.ProcessExecutionError: Unexpected error while running command.
Command: ['apt-key', 'add', '-']
Exit code: 2
Reason: -
Stdout: ''
Stderr: 'gpg: no valid OpenPGP data found.\n'
```

In this instance, the GPG fingerprint was used instead of the GPG key. After
rectifying this oversight, nodes were again able to successfully deploy.


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

## Can't find MAAS web UI

By default, the web UI is located at `http://<hostname>:5240/MAAS/`. If you can't
access it, there are a few things to try:

1. Check that the webserver is running - By default the web interface uses
   Apache, which runs under the service name *apache2*. To check it, on the
   MAAS server box you can run `sudo /etc/init.d/apache2 status`.
2. Check that the hostname is correct - It may seem obvious, but check that
   the hostname is being resolved properly. Try running a browser (even a
   text mode one like `elinks`) on the same box as the MAAS server and
   navigating to the page. If that doesn't work, try
   `http://127.0.0.1:5240/MAAS/`, which will always point at the local server.
3. If you are still getting "404 - Page not found" errors, check that the
   MAAS web interface has been installed in the right place. There should
   be a file present called `/usr/share/maas/maas/urls.py`.


## Backdoor image login

By design, ephemeral images are not built to be edited or tampered with.

However, if you find yourself with no other way to access node, a Linux-based
ephemeral image can be modified to enable a *backdoor* that adds or resets a
user's password, much like you can with any standard version of Linux.

As images are constantly updated and refreshed, the backdoor will only be
temporary, but it should help you login to see what may be going wrong with
your node.

### Extract the cloud image

First, download the cloud image that corresponds to the architecture of your
node. The *Images* page of the web UI lists the images currently being cached
by MAAS:

![web UI image list][img__webui-images]

Images can be downloaded from [https://cloud-images.ubuntu.com/daily/server](https://cloud-images.ubuntu.com/daily/server/).

For example:

```bash
wget https://cloud-images.ubuntu.com/daily/server/xenial/current/xenial-server-cloudimg-amd64-root.tar.gz
```

With the image downloaded, extract its contents so that the *shadow* password
file can be edited:

```bash
mkdir xenial
sudo tar -C xenial -xpSf xenial-server-cloudimg-amd64-root.tar.gz --numeric-owner --xattrs "--xattrs-include=*"
```

!!! Note:
    `sudo` is required when extracting the image filesystem and when making
    changes to the files extracted from the image filesystem.

### Generate password hash

Now generate a hashed password. Use the following Python 3 command, replacing
**ubuntu** with the password you wish to use:

```bash
python3 -c 'import crypt; print(crypt.crypt("ubuntu", crypt.mksalt(crypt.METHOD_SHA512)))'
```

Output from the previous command looks like the following:

```no-highlight
$6$AaHblHl5KGrWBmPV$20ssynyY0EhcT9AwZgA2sTdYt4Bvd97bX7PjeyqVLKun2Hk3NBa8r7efM2duK7pi2dlnd5tG76I0dTUvjb6hx0
```

Open the `xenial/etc/shadow` file extracted from the image with a text editor and
insert the password hash into the *root* user line of `etc/shadow`, between the
first and second colons:

```no-highlight
root:$6$AaHblHl5KGrWBmPV$20ssynyY0EhcT9AwZgA2sTdYt4Bvd97bX7PjeyqVLKun2Hk3NBa8r7efM2duK7pi2dlnd5tG76I0dTUvjb6hx0:17445:0:99999:7:::
```

Save the file and exit the text editor.

### Rebuild SquashFS image

Recent versions of MAAS use SquashFS to hold the ephemeral image filesystem.
The final step is to use the following command to create a SquashFS file called
`xenial-customized.squashfs` that contains the modified shadow file:

```bash
sudo mksquashfs xenial/ xenial-customized.squashfs -xattrs -comp xz
```

The output should look like the following:

```no-highlight
Parallel mksquashfs: Using 2 processors
Creating 4.0 filesystem on xenial-customized.squashfs, block size 131072.
[=======]  2516/26975   9%
```

You now have an ephemeral image with a working root login that can replace an
image locally cached by MAAS.

### Use the custom image

Images are stored on the region controller in `/var/lib/maas/boot-resources/`,
with the *current* directory linking to the latest synchronised images. 

For example, the latest low-latency Ubuntu 16.04 image can be found in the
following directory:

```bash
cd /var/lib/maas/boot-resources/current/ubuntu/amd64/ga-16.04-lowlatency/xenial/daily
```

To replace the original, substitute the *squashfs* file with the custom image
generated earlier, making sure the new owner is *maas*:

```bash
mv squashfs squashfs_original
cp /home/ubuntu/xenial-customized.squashfs .
chown maas:maas squashfs
``` 

You can now use this image to boot a node and access the root account with the
backdoor password, such as by deploying the same specific image from the web UI
to the node you wish to troubleshoot.

![web UI deploy image][img__webui-deploy]


<!-- IMAGES -->
[img__webui-images]: ../media/troulbeshoot-faq__2.3_images.png
[img__webui-deploy]: ../media/troulbeshoot-faq__2.3_deploy.png
<!-- LINKS -->

[concepts-rescue-mode-action]: intro-concepts.md#rescue-mode
