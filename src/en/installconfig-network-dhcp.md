Title: Network Configuration
TODO: Add other network configuration options
      Update images
	
# Configure DHCP

To enable MAAS to control DHCP, you can either:

1.  Follow the instructions at [Rack Controller
configuration](installconfig-rack.html) to use the web UI to set up your rack 
controller.
2.  Use the command line interface maas by first
    logging in to the [API](./maascli.html#apikey) and then
    [following this procedure](./maascli.html#cli-dhcp).

## Configuring switches on the network

Some switches use Spanning-Tree Protocol (STP) to negotiate a loop-free path
through a root bridge. While scanning, it can make each port wait up to 50
seconds before data is allowed to be sent on the port. This delay in turn can
cause problems with some applications/protocols such as PXE, DHCP and DNS, of
which MAAS makes extensive use.

To alleviate this problem, you should enable
[Portfast](https://www.symantec.com/business/support/index?page=content&id=HOWTO6019)
for Cisco switches or its equivalent on other vendor equipment, which enables
the ports to come up almost immediately.

## Traffic between the region controller and rack controllers

-   Each rack controller must be able to:
    -   Initiate TCP connections (for HTTP) to each region controller on port
        80 or port 5240, the choice of which depends on the setting of the
        MAAS URL.
    -   Initiate TCP connections (for RPC) to each region controller between
        port 5250 and 5259 inclusive. This permits up to 10 `maas-regiond`
        processes on each region controller host. At present this is
        not configurable.

Once everything is set up and running, you are ready to [start enlisting
nodes](./nodes.html) 
