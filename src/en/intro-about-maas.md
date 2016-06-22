Title: MAAS | Metal As A Service


# What is MAAS?

MAAS is *Metal As A Service*. It lets you treat physical servers like virtual
machines (instances) in the cloud. Rather than having to manage each server
individually, MAAS turns your bare metal into an elastic cloud-like resource.

Machines can be quickly provisioned and then destroyed again as easily as you
can with instances in a public cloud like Amazon AWS, Google GCE, and Microsoft
Azure, among others.

MAAS can work as a standalone PXE/preseed service or it can be integrated with
other technologies. In particular, it is designed to work especially well with
[Juju](https://jujucharms.com/docs/stable/about-juju), the service and model
management service. It's a perfect arrangement: MAAS manages the machines and
Juju manages the services running on those machines.
