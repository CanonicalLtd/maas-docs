Title: Add Nodes
TODO: Review needed
      Update/replace API references with GUI
      Clarify terms: discovery, enlistment, accept, commission
      There should be a "commission" section (i.e. not bundled with "discovery")
      AFAIK, user 'maas' has a default home directory of /var/lib/maas


# Add Nodes

Now that the MAAS controller is running, we need to make the nodes aware of
MAAS and vice-versa. If you have set up DHCP correctly, and your nodes can
boot via [PXE](http://en.wikipedia.org/wiki/Preboot_Execution_Environment)
then things really couldn't be much easier and you can use the [automatic
discovery procedure](#automatic-discovery), below. You do not need to install
Ubuntu on nodes that you wish to add to MAAS prior to enlistment.

To learn more about setting up DHCP, read the
[Rack Controller](./installconfig-rack.html) documentation.


## Automatic discovery

A node configured to boot over the network (PXE) will:

1. Contact a DHCP server
1. Receive an image over TFTP and boot from it
1. Contact the MAAS server
1. Shut down

During this process, the MAAS server will be passed information about the node,
including the architecture, MAC address and other details which will be stored
in the database. You can accept and commission the nodes via the web interface.
After the nodes have been accepted, the selected series of Ubuntu will be
installed.

See [Using the CLI](./manage-cli.html#commission-all-machines) for how to
commission all machines from the CLI.


## Manually add nodes

If you know the MAC address of a node, you can manually enter details about
the node through the web interface. Click the `Add Node` button to be taken to
the "Add Node" form:

![image](./media/add-node.png)


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

![image](./media/virsh-config.png)

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
