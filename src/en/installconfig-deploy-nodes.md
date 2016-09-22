Title: Deploy Nodes
TODO:  Add CLI for deploying (?)


# Deploy Nodes

Once a node has been [commissioned](./installconfig-commission-nodes.html) the
next logical step is to *deploy* it.

Deploying a node means, effectively, to install an operating system on it. The
deployed node will also be ready to accept connections via SSH to the default
user account 'ubuntu' if
[SSH keys have been imported](./manage-account.html#ssh-keys) to MAAS.

The agent that triggers deployment varies depending on how the nodes are
intended to be used in the long term. For instance, if the nodes are destined
to be running complex, inter-related services that may involve scaling up or
down, that is, if they will be regarded as a "cloud" resource, then
[Juju](https://jujucharms.com/docs/devel/getting-started) is the recommended
deploy agent (it will also install & configure services on the deployed nodes).
If you simply want to use MAAS to install a base operating system and work on
the machines manually then you can deploy a node directly with the web UI.

Before deploying you should review and possibly set the
[kernel boot options](./installconfig-kernel.html) and
[HWE kernels](./installconfig-hwe-kernels.html) that may get used by deployed
nodes.

To deploy directly from MAAS simply select any given node and press the
'Deploy' button.

![deploy](./media/installconfig-deploy-nodes__deploy.png)

You then have the option of deviating from the default OS, release, and kernel.
When ready, press 'Go'.

![deploy go](./media/installconfig-deploy-nodes__deploy-go.png)

While a node is deploying its status will change to *Deploying*.

Once a node has finished deploying its status will change to *Deployed*.
