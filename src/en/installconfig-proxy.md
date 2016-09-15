Title: MAAS APT Proxy
TODO:  Needs to be rewritten for clarity


# MAAS APT Proxy

MAAS provides a way for its machines to use a proxy server when they need to
access the Ubuntu package archive.

There are three possible options:

- internal proxy (default)
- external proxy
- no proxy

The internal proxy (via the 'maas-proxy' package) must be installed on the same
host as the region controller.

By default, the internal proxy is available to hosts residing in any subnet
detected by MAAS. It is recommended to disable access to subnets that
represent untrusted networks.

Configuring proxying with MAAS consists of enabling/disabling one of the above
three options and enabling/disabling proxying on a specific subnet.

See the [MAAS CLI](./manage-cli-common.html#configure-proxying) for how to
configure proxying with the CLI. Note that per-subnet proxy configuration can
only be accomplished via the CLI.


## Configure proxying

To configure proxying visit the 'Settings' page, select the 'General' tab and
scroll down to the 'Network Configuration' section. Any changes need to be
applied by pressing the 'Save' button.

![image](./media/external-proxy.png)

To enable the internal proxy, ensure that the checkbox (for 'Enable the use of
an APT and HTTP/HTTPS proxy') is checked. This is the default configuration.

To enable an external proxy, ensure that the checkbox is checked and define the
proxy's URL (and port if necessary) in the field 'Proxy for APT and
HTTP/HTTPS'.

!!! Note: Despite the web UI labelling the external proxy field 'Proxy for APT
and HTTP/HTTPS', the proxy is only for APT and not for general HTTP/HTTPS
requests as implied.

To disable proxying completely ensure that the checkbox is unchecked.
