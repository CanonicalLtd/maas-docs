Title: MAAS CLI


# Introduction to the CLI

Everything that can be done in the web interface can be done with the CLI. This
is achieved with the `maas` command that, in turn, connects to the API. What
follows is a summary of the common MAAS management tasks. See the full
[API documentation](http://maas.ubuntu.com/docs2.0/index.html#api-cli-documentation)
for details.


## Log in (required)

To use the CLI you must first log in to the API server.

To do this, you need the API key that was geneerated when your MAAS account was
created.

To obtain it from the web interface, click on your user name in the top right
corner of the page, and select 'Account'.

To obtain it through the command line, run this command on the region
controller (i.e. where the 'maas-region-controller' package was installed):

```bash
sudo maas-region-admin apikey --username=<my-username>
```

Finally, log in with:

```bash
maas login <profile-name> <hostname> [<key>]
```

Note that 'username' and 'profile-name' are the same.

For example, if you're logging in with the initial superuser account whose
username is 'admin':

```bash
maas login admin http://localhost/MAAS/api/2.0
```

!!! Note: If the key is not supplied, you will be prompted for it.


## List nodes

maas <profile-name> nodes read
maas <profile-name> nodes read | grep hostname


## Log out `logout <profile>`

Logs out from the given profile, flushing the stored credentials.

```bash
maas logout <profile-name>
```



maas $MAAS_SUPERUSER ipranges create type=dynamic
start_ip=$MAAS_IP_DYNAMIC_RANGE_LOW end_ip=$MAAS_IP_DYNAMIC_RANGE_HIGH && echo
"Dynamic IP range set"

maas $MAAS_SUPERUSER ipranges create type=reserved
start_ip=$MAAS_IP_RESERVED_RANGE_LOW end_ip=$MAAS_IP_RESERVED_RANGE_HIGH &&
echo "Reserved IP range set"

FABRIC_ID=\$(maas $MAAS_SUPERUSER subnet read $INSTANCE_SUBNET_CIDR | grep
fabric | cut -d ' ' -f 10 | cut -d '"' -f 2)
maas $MAAS_SUPERUSER vlan update \$FABRIC_ID untagged dhcp_on=True
primary_rack=$MAAS_INSTANCE >/dev/null && echo "DHCP enabled on \$FABRIC_ID"

maas $MAAS_SUPERUSER maas set-config name=upstream_dns
value=$MY_STSSTACK_BASTION && echo "DNS forwarder set"

maas $MAAS_SUPERUSER maas set-config name=http_proxy value=$MY_STSSTACK_PROXY
&& echo "Node proxy set"

maas $MAAS_SUPERUSER subnet update $INSTANCE_SUBNET_CIDR
gateway_ip=$MAAS_INTERNAL_IP && echo "Default gateway set"

maas $MAAS_SUPERUSER subnet update $INSTANCE_SUBNET_CIDR
dns_servers=$MAAS_INTERNAL_IP && echo "DNS server set"

maas $MAAS_SUPERUSER zone update default description="This zone was configured
by Golem." && echo "Zone description set"

maas $MAAS_SUPERUSER sshkeys create "key=\$KEY" && echo "A public SSH key was
added to MAAS superuser '$MAAS_SUPERUSER' account"

maas $MAAS_SUPERUSER boot-source-selections create 1 os="ubuntu"
release="trusty" arches="amd64" subarches="hwe-x" labels="*" && echo "Trusty
amd64 images selected for download"

maas $MAAS_SUPERUSER boot-resources import

                HOSTNAME=\$(maas $MAAS_SUPERUSER nodes read mac_address=\$MAC |
grep hostname | cut -d '"' -f 4)
                nodeSystemIDs[\$i]=\$(maas $MAAS_SUPERUSER nodes read
hostname=\$HOSTNAME | grep system_id | cut -d '"' -f 4)
                maas $MAAS_SUPERUSER machine update \${nodeSystemIDs[\$i]} \

maas $MAAS_SUPERUSER machine commission \${nodeSystemIDs[\$i]} >/dev/null
