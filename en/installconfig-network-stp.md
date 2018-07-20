

# STP

Some switches use Spanning-Tree Protocol (STP) to negotiate a loop-free path
through a root bridge. While scanning, it can make each port wait up to 50
seconds before data is allowed to be sent on the port. This delay in turn can
cause problems with some applications/protocols such as PXE, DHCP and DNS, of
which MAAS makes extensive use.

To alleviate this problem, you should enable
[Portfast][upstream-symantec-portfast] for Cisco switches or its equivalent on
other vendor equipment, which enables the ports to come up almost immediately.


<!-- LINKS -->

[upstream-symantec-portfast]: https://www.symantec.com/business/support/index?page=content&id=HOWTO6019
