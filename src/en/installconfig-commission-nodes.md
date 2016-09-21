Title: Commission Nodes
TODO:  Add CLI for IP address assignment methods
       Add CLI for image/kernel to use for commissioning (?)
       Explain web UI checkboxes: 'Allow SSH access', 'Retain network configuration' and 'Retain storage configuration'


# Commission Nodes

Once a node is added to MAAS the next logical step is to *commission* it.

It does this by putting a minimal Ubuntu install onto the node and using scripts
to talk to the region API server. The purpose of this is to ensure that
everything is in working order and that eventual deployment will actually work.

The image used is, by default, the latest Ubuntu LTS release and should not
require changing. However, it can be configured in the web UI in the 'Settings'
page.

To commission a node, select it and choose 'Commission' under the 'Take action'
dropdown menu (orange button).

![commission](./media/installconfig-commission-nodes__commission.png)

You have the option of selecting some extra parameters (checkboxes). Then
finalize the directive by hitting 'Go'.

![commission go](./media/installconfig-commission-nodes__commission-go.png)

While a node is commissioning its status will change to *Commissioning*. 

See [MAAS CLI](./manage-cli-common.html#commission-all-machines) for how to
commission all machines with the 'New' status.

!!! Note: If your node has more than one network interface you may need to tell
MAAS which one to use. Do this by marking it *Broken* and proceeding similarly to
what is shown below.

Once a node is commissioned its status will change to *Ready*. The next step
will be to *deploy* it (see [Deploy nodes](./installconfig-deploy-nodes.html)).


## Post-commission configuration

Once a node has been commissioned, its interface(s) can be configured.
Specifically, when a node's status is either 'Ready' or 'Broken', network
interfaces can be added/removed, attached to a fabric and linked to a subnet. 

![node interface](./media/node-interface-ip.png)

There are four methods to choose from that determines how an IP address gets
assigned when the node is eventually deployed:

- **Auto Assign** A random non-DHCP address from the subnet that does not fall
  into a *reserved range*.

- **Static** A static address that the user will enter in a secondary field.

- **DHCP** A dynamic address DHCP. A *reserved dynamic range* on the associated
  subnet is a requirement. DHCP must be available on the associated VLAN and can
  be internal (MAAS managed) or external.

- **Unconfigured** The interface will be left unconfigured.

See [Concepts and terms](./intro-concepts.html#ip-ranges) for definitions of
reserved ranges and reserved dynamic ranges.
