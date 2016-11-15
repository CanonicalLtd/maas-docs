Title: Deploy HA with Juju | MAAS
TODO:  This procedure needs to be understood and verified, with text added as a consequence.
       Does this include load balancing?


# Deploy HA with Juju

This page provides an overview on how to use Juju to implement MAAS HA at both
the region controller and rack controller levels.

Below, a Juju controller is created with manual provisioning, the machines
intended as MAAS nodes are added, and the applications deployed & linked
together. Adjust the given numbers based on your local environment. To aid
with the latter, see the output to the `juju status` command.

```bash
juju bootstrap maas manual/<ip-of-server>
juju add-machine ssh:<ip-of-server>
. add required machines ...
juju deploy postgresql --to 0
juju add-unit postgresql --to 1
juju deploy maas-region --to 0
juju add-unit maas-region --to 1
juju add-relation maas-region:db postgresql:db
juju deploy maas-rack --to 3
juju add-unit maas-rack --to 4
juju add-relation maas-region:rpc maas-rack:rpc
```

See [Juju documentation][juju-site] for in-depth guidance on using Juju.

<!-- LINKS -->
[juju-site]: https://jujucharms.com/docs/
