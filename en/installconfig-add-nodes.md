Title: Add Nodes
TODO: Clarify terms: discovery, enlistment, accept, commission
      AFAIK, user 'maas' has a default home directory of /var/lib/maas
      Need instructions on deploying directly
      KVM stuff needs to be integrated better into this page


# Add Nodes

Adding a node to MAAS means having MAAS acquire a system that is ready and
willing to become a member of the pool of resources that MAAS manages. This is
typically done via a combination of DHCP (and TFTP), which should now be
enabled in your MAAS environment, and PXE, which you tell the system in
question to use when it boots. This manner of acquiring nodes is what MAAS
calls *automatic discovery*.

!!! Note: Configuring a computer to boot over PXE is done via its BIOS and is
often referred to as "netboot" or "network boot".

There are no other requirements for the system other than telling it to boot
from the network. In particular, there is no need to install an operating
system on it.

If automatice discovery doesn't work for you it is possible to
[add a node manually](#add-a-node-manually).

Once a node is added to MAAS its *status* will be one of *New*. The next step
will be to *commission* it (see
[Commission nodes](installconfig-commission-nodes.md)).


## Automatic discovery

A node configured to boot via PXE will:

1. Contact a DHCP server
1. Receive an image over TFTP and boot from it
1. Contact the MAAS server
1. Shut down

During this process, the MAAS server will be passed information about the node,
including the architecture, MAC address and other details which will be stored
in the database.


## KVM guest nodes

If your MAAS nodes will be backed by KVM guests, ensure the `virsh` binary is
available to the rack controller via the `libvirt-bin` package. In the UI,
the power type will be 'virsh'.

!!! Note: The minimum amount of memory per guest should be 768 MB.

The virsh power type takes two parameters:

`Power ID`: This is the name of the virtual machine (libvirt "domain") shown
by:

```bash
sudo virsh list --all
```

`Address:` This is a libvirt connection string, such as:

```nohighlight
qemu+ssh://ubuntu@10.0.0.2/system
```

![qemu ssh power](../../media/virsh-config.png)

For SSH, you'll need to generate an SSH keypair for the 'maas' user. A home
directory and a login shell will also need to be set up:

```bash
sudo mkdir /home/maas
sudo chown maas:maas /home/maas
sudo chsh -s /bin/bash maas
```

Become the 'maas' user and generate a keypair with the private key having a
null passphrase:

```bash
sudo su - maas
ssh-keygen -f ~/.ssh/id_rsa -N ''
```

Add the public key to `/ubuntu/.ssh/authorized_keys` on the KVM host. Because
the private key is passphraseless, virsh will be able to connect seemlessly:

```bash
ssh-copy-id -i ~/.ssh/id_rsa ubuntu@10.0.0.2
```

!!! Note: You may need to (temporarily) configure sshd on the KVM host to
honour password authentication for the `ssh-copy-id` command to be useful.

Still as user 'maas', test connecting to the KVM host with virsh:

```bash
virsh -c qemu+ssh://ubuntu@10.0.0.2/system list --all
```


## Add a node manually

If you know the MAC address of a node, you can manually enter details about
the node through the web interface. Click the `Add Node` button to be taken to
the "Add Node" form:

![image](../../media/add-node.png)
