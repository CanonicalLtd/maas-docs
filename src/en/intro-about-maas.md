Title: MAAS | Metal As A Service


# What is MAAS?

MAAS is *Metal as a Service*. It lets you treat physical servers like virtual
machines (instances) in the cloud. Rather than having to manage each server
individually, MAAS turns your bare metal into an elastic cloud-like resource.

In practical terms, you tell MAAS about the machines you want it to manage and
it will boot them, check that the hardware's okay, and have them waiting for
when you need them. They can then be quickly provisioned and then destroyed
again as easily as you can with instances in a public cloud like Amazon AWS,
Google GCE, and Microsoft Azure, among others.

MAAS can work as a standalone PXE/preseed service or it can be integrated with
other technologies. In particular, it is designed to work especially well with
[Juju](https://juju.ubuntu.com), the service and model management service. It's
a perfect arrangement: MAAS provides the machines and Juju deploys services
onto those machines.

MAAS is ideal where you want the flexibility of the cloud, and the power and
hassle-free nature of Juju charms, but you need, or want, to deploy onto bare
metal.

See a more [Detailed definition of MAAS](./intro-definition-maas.html).
