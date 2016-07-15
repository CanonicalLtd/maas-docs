Title: MAAS CLI | Common Tasks
TODO:  Decide whether explicit examples are needed everywhere
       Foldouts cannot be used due to bug: https://git.io/vwbCz


# Common CLI Tasks

This is a list of common tasks to perform with the MAAS CLI. See
[MAAS CLI](./manage-cli.html) on how to get started.


## List nodes

To list all nodes (and their characteristics) in the MAAS cluster:

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


## Set a dynamic IP address range

To set a range of dynamic IP addresses:

```bash
maas $PROFILE ipranges create type=dynamic \
	start_ip=$IP_DYNAMIC_RANGE_LOW end_ip=$IP_DYNAMIC_RANGE_HIGH
```


## Set a reserved IP address range

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
maas $PROFILE vlan update $FABRIC_ID untagged dhcp_on=True \
	primary_rack=$PRIMARY_RACK_CONTROLLER
```

To enable DHCP HA on a fabric:

```bash
maas $PROFILE vlan update $FABRIC_ID untagged dhcp_on=True \
	primary_rack=$PRIMARY_RACK_CONTROLLER \
	secondary_rack=$SECONDARY_RACK_CONTROLLER 
```

For DHCP, you should also [set a default gateway](#set-a-default-gateway).


## Set a DNS forwarder

To set a DNS forwarder:

```bash
maas $PROFILE maas set-config name=upstream_dns value=$MY_UPSTREAM_DNS
```


## Set a node proxy

To set a node proxy:

```bash
maas $PROFILE maas set-config name=http_proxy value=$MY_PROXY
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
