Title: MAAS CLI
TODO:  Provide links to definitions of the entities (e.g. fabric, dynamic address range)
       Decide whether explicit examples are needed
       Decide whether foldouts should be used
       Consider a way to explain how an API call is converted to a CLI command


# Using the CLI

Everything that can be done in the web interface can be done with the CLI. This
is achieved with the `maas` command that, in turn, connects to the API. What
follows is a list of common MAAS management tasks. See the full
[API documentation](http://maas.ubuntu.com/docs2.0/index.html#api-cli-documentation)
for details.


## Log in (required)

To use the CLI you must first log in to the API server.

You will need the API key that was generated when your MAAS account was
created. To obtain it, run this command on the region controller (i.e. where
the 'maas-region-controller' package was installed):

```bash
sudo maas-region apikey --username=$USERNAME
```

!!! Note: The API key can also be obtained from the web interface. Click on
'username' in the top right corner, and select 'Account'.

Finally, log in with:

```bash
maas login $PROFILE $API_SERVER [$API_KEY]
```

Notes:

- The terms 'username' and 'profile' are effectively equivalent.
- The API server is the region controller.
- If the API key is not supplied the user will be prompted for it.

For example, to log in with the account whose username is 'admin' and where
the region controller is on the localhost:

```bash
maas login admin http://localhost/MAAS/api/2.0
```


## List nodes

To list all nodes (and their characteristics) in the MAAS cluster:

```bash
maas $PROFILE nodes read
```

Add a filter to get just their hostnames:

```bash
maas $PROFILE nodes read | grep hostname
```


## Set a default minimum kernel

To set a default minimum kernel for all machines:


## Set a minimum kernel for a machine

are specified by using min\_hwe\_kernel or hwe\_kernel variables.

The min\_hwe\_kernel variable is used to instruct MAAS to ensure the release to
be deployed uses a kernel version at or above the value of min\_hwe\_kernel.
For example, if min\_hwe\_kernel is set to 'hwe-x' when deploying any release
before Xenial the 'hwe-x' kernel will be used. For any release after Xenial the
default kernel for that release will be used.

Variable min\_hwe\_kernel can be set (to Xenial) by running following the command:

```bash
maas admin machine update <system-id> min_hwe_kernel=hwe-x
```


## Set a specific kernel during deployment

To set a specific kernel during deployment. MAAS checks that the
specified kernel is available for the release specified before deploying the
node. You can set the hwe\_kernel when deploying by using the command:

```bash
maas admin machine deploy <system-id> distro_series=xenial hwe_kernel=hwe-x
```

## Set dynamic IP address range

To set a range of dynamic IP addresses:

```bash
maas $PROFILE ipranges create type=dynamic \
	start_ip=$IP_DYNAMIC_RANGE_LOW end_ip=$IP_DYNAMIC_RANGE_HIGH
```


## Set reserved IP address range

To set a range of reserved IP addresses:

```bash
maas $PROFILE ipranges create type=reserved \
	start_ip=$IP_RESERVED_RANGE_LOW end_ip=$IP_RESERVED_RANGE_HIGH
```


## Determine a fabric ID

To determine a fabric ID based on a subnet address:

```bash
FABRIC_ID=$(maas $PROFILE subnet read $SUBNET_CIDR \
	| grep fabric | cut -d ' ' -f 10 | cut -d '"' -f 2)
```


## Enable DHCP

To enable DHCP on a fabric:

```bash
maas $PROFILE vlan update $FABRIC_ID untagged \
	dhcp_on=True primary_rack=$RACK_CONTROLLER
```


## Set DNS forwarder

To set a DNS forwarder:

```bash
maas $PROFILE maas set-config name=upstream_dns value=$MY_UPSTREAM_DNS
```


## Set node proxy

To set a node proxy:

```bash
maas $PROFILE maas set-config name=http_proxy value=$MY_PROXY
```


## Set default gateway

To set the default gateway for a subnet:

```bash
maas $PROFILE subnet update $SUBNET_CIDR gateway_ip=$MY_GATEWAY
```


## Set DNS server

To set the DNS server for a subnet:

```bash
maas $PROFILE subnet update $SUBNET_CIDR dns_servers=$MY_NAMESERVER
```


## Set zone description

To set a description for a physical zone:

```bash
maas $PROFILE zone update default \
	description="This zone was configured by a script."
```


## Add public SSH key

To add a public SSH key to a MAAS user account:

```bash
maas $PROFILE sshkeys create "key=$SSH_KEY"
```


## Select install images

To select install images (here Trusty amd64 with Xenial HWE kernel) to be later
imported:

```bash
maas $PROFILE boot-source-selections create 1 \
	os="ubuntu" release="trusty" arches="amd64" \
	subarches="hwe-x" labels="*"
```


## Import install images

To import previously selected install images:

```bash
maas $PROFILE boot-resources import
```


## Determine hostname

To determine the hostname based on a node's MAC address:

```bash
HOSTNAME=$(maas $PROFILE nodes read mac_address=$MAC \
	| grep hostname | cut -d '"' -f 4)
```


## Determine system ID

To determine the system ID based on a node's hostname:

```bash
SYSTEM_ID=$(maas $PROFILE nodes read hostname=$HOSTNAME \
	| grep system_id | cut -d '"' -f 4)
```


## Update node hostname and power parameters

To update the hostname and power parameters of a (KVM) node based on its
system ID:

```bash
maas $PROFILE machine update $SYSTEM_ID \
	hostname=$HOSTNAME \
	power_type=virsh \
	power_parameters_power_address=qemu+ssh://ubuntu@$KVM_HOST/system \
	power_parameters_power_id=$HOSTNAME
```


## Commission node

To commission a node based on its system ID:

```bash
maas $PROFILE machine commission $SYSTEM_ID
```


## Log out

Logs out from the given profile, flushing the stored credentials.

```bash
maas logout $PROFILE
```
