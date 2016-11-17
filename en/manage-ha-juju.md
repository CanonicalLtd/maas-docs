Title: Deploy HA with Juju | MAAS
TODO:  This procedure needs to be verified, with text added as a consequence. It didn't work for me (pmatulis): https://goo.gl/IheOKw ; https://goo.gl/dm5AkK
       Include a diagram or a screenshot of juju gui


# Deploy HA with Juju

This page provides an overview on how to use [Juju][juju-site] to implement
MAAS HA at both the region controller and rack controller levels. It includes
load balancing. Below, a Juju controller is created with
[manual provisioning][juju-clouds-manual]. In this example, four machines are
added to build the MAAS and the applications distributed among them.

```bash
juju bootstrap manual/<ip-of-server> controller
juju add-model maas-ha
juju add-machine ssh:<ip-of-server-0>
juju add-machine ssh:<ip-of-server-1>
juju add-machine ssh:<ip-of-server-2>
juju add-machine ssh:<ip-of-server-3>
juju deploy postgresql --to 0
juju add-unit postgresql --to 1
juju deploy maas-region --to 0
juju add-unit maas-region --to 1
juju add-relation maas-region:db postgresql:db
juju deploy maas-rack --to 2
juju add-unit maas-rack --to 3
juju add-relation maas-region:rpc maas-rack:rpc
```


<!-- LINKS -->
[juju-site]: https://jujucharms.com/docs
[juju-clouds-manual]: https://jujucharms.com/docs/stable/clouds-manual
