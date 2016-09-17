Title: MAAS CLI | Common Tasks
TODO:  Decide whether explicit examples are needed everywhere
       Foldouts cannot be used due to bug: https://git.io/vwbCz
       There is a nuance between a single reserved address and a single address in a range (start and end addresses being the same). this could use some digging


# Common CLI Tasks

This is a list of common tasks to perform with the MAAS CLI. See
[MAAS CLI](manage-cli.md) on how to get started.


## List nodes

To list all nodes (and their characteristics) in the MAAS:

```bash
maas $PROFILE nodes read
```

Add a filter to get just their hostnames:

```bash
maas $PROFILE nodes read | grep hostname
```


## Determine a system ID

To determine the system ID based on a node's hostname:

```bash
SYSTEM_ID=$(maas $PROFILE nodes read hostname=$HOSTNAME \
	| grep system_id | cut -d '"' -f 4)
```


## Commission a machine

To commission a machine based on its system ID:

```bash
maas $PROFILE machine commission $SYSTEM_ID
```


## Commission all machines

To commission all machines in the 'Ready' state:

```bash
maas $PROFILE machines accept-all
```


## Assign a tag to a node

To assign a tag to a node:

```bash
maas $PROFILE tag update-nodes $TAG_NAME add=$SYSTEM_ID
```

Multiple `add=` arguments (and their values) can be used to apply a tag to
multiple nodes. 


## Reserve IP addresses

To reserve a range of dynamic IP addresses that will be used by MAAS for
node enlistment and commissioning:

```bash
maas $PROFILE ipranges create type=dynamic \
	start_ip=$IP_DYNAMIC_RANGE_LOW end_ip=$IP_DYNAMIC_RANGE_HIGH
```

See
[Rack Controller Configuration](installconfig-rack.md#dynamic-ip-ranges)
for an explination of dynamic IP ranges.

To reserve a range of IP addresses that will not be used by MAAS:

```bash
maas $PROFILE ipranges create type=reserved \
	start_ip=$IP_STATIC_RANGE_LOW end_ip=$IP_STATIC_RANGE_HIGH
```

To reserve a single IP address that will not be used by MAAS:

```bash
maas $PROFILE ipaddresses reserve ip_address=$IP_STATIC_SINGLE
```

To remove such a single reserved IP address:

```bash
maas $PROFILE ipaddresses release ip=$IP_STATIC_SINGLE
```


## Determine a fabric ID

To determine a fabric ID based on a subnet address:

```bash
FABRIC_ID=$(maas $PROFILE subnet read $SUBNET_CIDR \
	| grep fabric | cut -d ' ' -f 10 | cut -d '"' -f 2)
```


## Enable DHCP

To enable DHCP on a VLAN on a certain fabric:

```bash
maas $PROFILE vlan update $FABRIC_ID $VLAN_TAG dhcp_on=True \
	primary_rack=$PRIMARY_RACK_CONTROLLER
```

To enable DHCP HA you will need both a primary and a secondary controller:

```bash
maas $PROFILE vlan update $FABRIC_ID $VLAN_TAG dhcp_on=True \
	primary_rack=$PRIMARY_RACK_CONTROLLER \
	secondary_rack=$SECONDARY_RACK_CONTROLLER 
```

You will also need to [set a default gateway](#set-a-default-gateway).

!!! Note: DHCP for PXE booting will need to be enabled on the 'untagged' VLAN.


## Set a DNS forwarder

To set a DNS forwarder:

```bash
maas $PROFILE maas set-config name=upstream_dns value=$MY_UPSTREAM_DNS
```


## Configure proxying

Enabling and disabling proxying in general is done via a boolean option ('true'
or 'false'). This is how proxying is disabled completely:

```bash
maas $PROFILE maas set-config name=enable_http_proxy value=false
```

To set an external proxy, ensure proxying is enabled (see above) and then
define it:

```bash
maas $PROFILE maas set-config name=http_proxy value=$EXTERNAL_PROXY
```

For example,

```bash
maas $PROFILE maas set-config name=enable_http_proxy value=true
maas $PROFILE maas set-config name=http_proxy value=http://squid.example.com:3128/
```

Enabling and disabling proxying per subnet is done via a boolean option ('true'
or 'false'). This is how proxying is disabled per subnet:

```bash
maas $PROFILE subnet update $SUBNET_CIDR allow_proxy=false
```

For example,

```bash
maas $PROFILE subnet update 192.168.0.0/22 allow_proxy=false
```


## Set a default gateway

To set the default gateway for a subnet:

```bash
maas $PROFILE subnet update $SUBNET_CIDR gateway_ip=$MY_GATEWAY
```


## Set a DNS server

To set the DNS server for a subnet:

```bash
maas $PROFILE subnet update $SUBNET_CIDR dns_servers=$MY_NAMESERVER
```


## Set a zone description

To set a description for a physical zone:

```bash
maas $PROFILE zone update default \
	description="This zone was configured by a script."
```


## Add a public SSH key

To add a public SSH key to a MAAS user account:

```bash
maas $PROFILE sshkeys create "key=$SSH_KEY"
```


## Determine a hostname

To determine the hostname based on a node's MAC address:

```bash
HOSTNAME=$(maas $PROFILE nodes read mac_address=$MAC \
	| grep hostname | cut -d '"' -f 4)
```


## Create a regular user

To create a regular user:

```bash
maas $PROFILE users create username=$USERNAME \
	email=$EMAIL_ADDRESS password=$PASSWORD is_superuser=0
```

All the options are necessary. Note that stipulating a password on the CLI may
be a security hazard, depending on your environment. If unsure, use the web UI.
See [User Accounts](manage-account.md) for the latter.
