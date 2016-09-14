Title: MAAS APT Proxy
TODO:  Needs to be rewritten for clarity


# MAAS APT Proxy

MAAS provides a way for its machines to use a proxy server when they need to
access the Ubuntu package archive.

There are three possible options:

- internal proxy (default)
- external proxy
- no proxy

Unless configured otherwise, the internal proxy will allow hosts residing in
any subnet detected by MAAS to use it. Permissions can be based on a per-subnet basis. It
is typical to disable 

!!! Warning: If your MAAS Region is connected to an untrusted network, you
should disable that subnet in the proxy, as shown below.


## Internal proxy

When you install a Region Controller, maas-proxy will be installed. The
configuration of the proxy relies on maas-proxy being on the same machine as
the Region Controller.


## External proxy

If you want to use an external proxy, you can define its URL using the web
interface by selecting Settings>General and scrolling down to the 'Proxy for
APT and HTTP/HTTPS' section.

![image](./media/external-proxy.png)

!!! Note: Despite the web interface labelling the external proxy field 
'Proxy for APT and HTTP/HTTPS', the proxy is only for APT and not for
HTTP/HTTPS as implied.

Alternatively, the command line API call will specify squid.example.com as the
proxy, using port 3128:

```bash
maas admin maas set-config name=http_proxy value=http://squid.example.com:3128/
```

## Subnet configuration

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

######### ![image](./media/no-proxy.png)

Alternatively, the following command will disable the proxy:

```bash
maas admin maas set-config name=enable_http_proxy value=False
```
