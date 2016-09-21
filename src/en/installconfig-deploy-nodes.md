Title: Deploy Nodes
TODO:  Add CLI for deploying (?)


# Deploy Nodes

Once a node has been [commissioned](./installconfig-commission-nodes.html) the
next logical step is to *deploy* it.

Deploying a node means, effectively, to have an operating system installed on
it. The deployed node will also be ready to accept connections via SSH to the
default user account 'ubuntu' if
[SSH keys have been imported](./manage-account.html#ssh-keys) to MAAS.

The agent that triggers deployment varies depending on how the nodes are
intended to be used in the long term. For instance, if the nodes are destined
to be running complex, inter-related services that may involve scaling up or
down, that is, they will be regarded as a "cloud" resource, then
[Juju](https://jujucharms.com/docs/devel/getting-started) is the recommeded
deploy agent (it will also install & configure services on the deployed nodes).
If you simply want to use MAAS to install a base operating system and work on
the machines manually then MAAS itself can be that agent.

To deploy directly from MAAS simply select any given node and press the
'Deploy' button.

![deploy](./media/installconfig-deploy-nodes__deploy.png)

You have the option of changing from the default OS, release, and kernel. When
ready, press 'Go'.

![deploy go](./media/installconfig-deploy-nodes__deploy-go.png)

While a node is deploying its status will change to *Deploying*.

Once a node has finished deploying its status will change to *Deployed*.
