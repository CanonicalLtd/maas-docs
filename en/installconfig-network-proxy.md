Title: Proxy


# Proxy

MAAS provides a way for its managed machines to use a proxy server when they
need to access HTTP/HTTPS-based resources, such as the Ubuntu package archive.

There are three possible options:

- internal proxy (default)
- external proxy
- no proxy

Configuring proxying with MAAS consists of enabling/disabling one of the above
three options and enabling/disabling proxying on a specific subnet.


## Internal proxy (MAAS proxy)

MAAS provides an internal proxy server. Although it is set up to work well with
APT/package requests, it is effectively a HTTP caching proxy server. If the
region controller is configured in MAAS as the default gateway for the machines
it manages then the proxy will work transparently (on TCP port 3128).
Otherwise machines will need to access it on TCP port 8000.

By default, the proxy is available to all hosts residing in any subnet detected
by MAAS, not just MAAS-managed machines. It is therefore recommended to disable
access to those subnets that represent untrusted networks.

MAAS manages its proxy. So although the active configuration, located in file
`/var/lib/maas/maas-proxy.conf`, can be inspected, it is not to be hand-edited.

The proxy must be installed on the same host as the region controller (via the
'maas-proxy' package).


## Configure proxy

See the [MAAS CLI][cli-configure-proxying] for how to configure proxying with
the CLI. Note that per-subnet proxy configuration can only be accomplished via
the CLI.

In the web UI, visit the 'Settings' page, select the 'General' tab and scroll
down to the 'Proxy' section. Any changes made are applied by pressing the
'Save' button.

![Configure proxy][img__configure-proxy]

To enable the internal proxy, ensure that the checkbox adjacent to 'MAAS
Built-in' is selected. This is the default configuration.

To enable an external proxy, activate the 'External' checkbox and use the new
field that is displayed to define the proxy's URL (and port if necessary).

An upstream cache peer can be defined by enabling the 'Peer' checkbox and
entering the external proxy URL into the field. With this enabled, machines
will be configured to use the MAAS built-in proxy to download cached APT
packages.

To disable proxying completely, enable the 'Don't use a proxy' checkbox.


<!-- LINKS -->

[cli-configure-proxying]: manage-cli-common.md#configure-proxying

[img__configure-proxy]: ../media/installconfig-network-proxy__2.3_configure-proxy.png
