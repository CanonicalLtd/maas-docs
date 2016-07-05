Title: Proxy Server
TODO:  Needs to be rewritten for clarity

# Proxy Server

In most cases, the machines deployed in a MAAS installation will use an
internal proxy server to access the archive. Alternatively, MAAS can be told to
use an externally configured proxy, or none at all.

As of MAAS 2.0, the default MAAS region controller configuration will create a
maas-proxy configuration that explicitly allows all of the subnets in the
configuration to use it for a proxy.

## Assumptions

It is generally assumed that the MAAS region controller is not exposed to
untrusted networks (there's a firewall between the MAAS region
controller and any such networks). Prior to MAAS 2.0, the only option if this
was not the case was to manually edit `/etc/maas/maas-proxy.conf`, or use
iptables to create a firewall on the host.

As of MAAS 2.0, permission to use the proxy can be managed on a per-subnet
basis, with the default to allow proxying.

!!! Warning: If your MAAS Region is connected to an untrusted network, you
should disable that subnet in the proxy, as shown below.

## MAAS Proxy Installation

When you install a Region Controller, maas-proxy will be installed. The
configuration of the proxy relies on maas-proxy being on the same machine as
the Region Controller.

### Using an external proxy

If you want to use an external proxy, you can define its URL using the web
interface by selecting Settings>General and scrolling down to the 'Proxy for
APT and HTTP/HTTPS' section:

![image](./media/external-proxy.png)

Alternatively, the command line API call will specify squid.example.com as the
proxy, using port 3128:

```bash
maas admin maas set-config name=http_proxy value=http://squid.example.com:3128/
```
You should see the following output after entering the command:
```nonighlight
Success.
Machine-readable output follows:
OK
```
### Subnet configuration

You can disable the use of the proxy for a specific subnet with the following
command:

```bash
maas admin subnet update 192.168.0.0/22 allow_proxy=False
```

And re-enabling the proxy for a subnet requires the allow_proxy argument to
be set to `True`:

```bash
maas admin subnet update 192.168.0.0/22 allow_proxy=True
```
You can create a simple subnet with the following command:

```bash
maas admin subnets create cidr=192.168.100.0/23
```

You may wish to set other parameters on the subnet. But as MAAS defaults to
allow proxying, any new subnet will inherit the proxy configuration.

## Disabling proxying

If you do not need a proxy, the proxy can be disabled from the web interface.
Select Settings>General and scroll down to the 'Proxy for APT and HTTP/HTTPS'
section and disable the checkbox. Settings are applied after clicking 'Save'

![image](./media/no-proxy.png)

Alternatively, the following command will disable the proxy:

```bash
maas admin maas set-config name=enable_http_proxy value=False
```

