Title: Advanced CLI Tasks
TODO:  Update nodes-tags.md to show assigning tags to machines with web UI; then link to it (for entry 'specify boot option') 
       bug tracking: https://pad.lv/1700795 (IP assignment mode)
table_of_contents: True


# Advanced CLI Tasks

This is a list of advanced tasks to perform with the MAAS CLI. See
[MAAS CLI][manage-cli] on how to get started.


## Update node hostname and power parameters

To update the hostname and power parameters of a node:

```bash
maas $PROFILE machine update $SYSTEM_ID \
	hostname=$HOSTNAME \
	power_type=$POWER_TYPE \
	power_parameters_power_address=$POWER_ADDRESS \
	power_parameters_power_id=$HOSTNAME
```

For example, to configure a KVM-based node:

```bash
maas $PROFILE machine update $SYSTEM_ID \
	hostname=$HOSTNAME \
	power_type=virsh \
	power_parameters_power_address=qemu+ssh://ubuntu@$KVM_HOST/system \
	power_parameters_power_id=$HOSTNAME
```

See [Common CLI tasks][cli-system-id] for how to find a node's system id and
[BMC Power Types][power-types] for details on different power types.


## Relay DHCP

To relay DHCP traffic for a VLAN (source) through another VLAN (target):

```bash
maas $PROFILE vlan update $FABRIC_ID $VLAN_VID_SRC relay_vlan=$VLAN_ID_TARGET
```

For example, to relay VLAN with vid 0 (on fabric-2) through VLAN with id 5002 :

```bash
maas $PROFILE vlan update 2 0 relay_van=5002
```

See [DHCP relay][dhcp-relay] for more information.


## Assign a network interface to a fabric

This task is made easier with the aid of the `jq` utility. It filters the
`maas` command (JSON formatted) output and prints it in a desired way. This
allows one to quickly view and compare data. Go ahead and install it:

```bash
sudo apt install jq
```

In summary, an interface is indirectly assigned to a fabric by assigning it to
a VLAN. First we need to gather various bits of data.

List some information on all machines:

```bash
maas $PROFILE machines read | jq '.[] | \
	{hostname:.hostname, system_id: .system_id, status:.status}' --compact-output
```

Example output:

```no-highlight
{"hostname":"node1","system_id":"dfgnnd","status":4}
{"hostname":"node2","system_id":"bkaf6e","status":6}
{"hostname":"node4","system_id":"63wqky","status":6}
{"hostname":"node3","system_id":"qwkmar","status":4}
```

!!! Note:
    An interface can only be edited when the corresponding machine has a
    status of 'Ready'. This is numberically denoted by the integer '4'.

List some information for all interfaces on the machine in question (identified
by its system id 'dfgnnd'):

```bash
maas $PROFILE interfaces read dfgnnd | jq '.[] | \
	{id:.id, name:.name, mac:.mac_address, vid:.vlan.vid, fabric:.vlan.fabric}' --compact-output
```

Example output:

```no-highlight
{"id":8,"name":"eth0","mac":"52:54:00:01:01:01","vid":0,"fabric":"fabric-1"}
{"id":9,"name":"eth1","mac":"52:54:00:01:01:02","vid":null,"fabric":null}
```

List some information for all fabrics:

```bash
maas $PROFILE fabrics read | jq '.[] | \
	{name:.name, vlans:.vlans[] | {id:.id, vid:.vid}}' --compact-output
```

Example output:

```no-highlight
{"name":"fabric-0","vlans":{"id":5001,"vid":0}}
{"name":"fabric-1","vlans":{"id":5002,"vid":0}}
{"name":"fabric-2","vlans":{"id":5003,"vid":0}}
```

This example will show how to move interface '8' (on machine 'dfgnnd') from
'fabric-1' to 'fabric-0'. Based on the gathered information, this will consist
of changing the interface's VLAN from '5002' to '5001':

```bash
maas $PROFILE interface update dfgnnd 8 vlan=5001 >/dev/null
```

Verify the operation by relisting information for the machine's interface:

```bash
maas $PROFILE interfaces read dfgnnd | jq '.[] | \
	{id:.id, name:.name, mac:.mac_address, vid:.vlan.vid, fabric:.vlan.fabric}' --compact-output
```

The output shows that the interface is now on fabric-0:

```no-highlight
{"id":8,"name":"eth0","mac":"52:54:00:01:01:01","vid":0,"fabric":"fabric-0"}
{"id":9,"name":"eth1","mac":"52:54:00:01:01:02","vid":null,"fabric":null}
```


## Change the IP assignment mode of a network interface

To edit the IP assignment mode of a network interface the existing subnet link
first needs to be removed.

Begin by finding the interface ID as well as the interface's subnet link ID
with the command:

```bash
maas $PROFILE node read $SYSTEM_ID
```

Once that's done, proceed to unlink and link:

```bash
maas $PROFILE interface unlink-subnet $SYSTEM_ID $INTERFACE_ID id=$SUBNET_LINK_ID
maas $PROFILE interface link-subnet $SYSTEM_ID $INTERFACE_ID mode=$IP_MODE subnet=$SUBNET_CIDR [$OPTIONS]
```

For instance, to have interface '58', with subnet link '146', on node 'exqn37'
use DHCP on subnet '192.168.1.0/24':
 
```bash
maas $PROFILE interface unlink-subnet exqn37 58 id=146
maas $PROFILE interface link-subnet exqn37 58 mode=dhcp subnet=192.168.1.0/24
```

If, instead of DHCP, a static address was desired, then the second command
would have looked like:
 
```bash
maas $PROFILE interface link-subnet exqn37 58 mode=static subnet=192.168.1.0/24 ip_address=192.168.1.113
```

For a summary of IP assignment modes see
[Post-commission configuration][post-commission-configuration].


## Install a rack controller

To install and register a rack controller with the MAAS:

```bash
sudo apt install maas-rack-controller
sudo maas-rack register
```

!!! Note: 
    The *register* command is not required when the rack controller is being
    added to a system that already houses an API server.

You will be asked for the URL of the region API server. If you provide a
hostname ensure it is resolvable. Next, you will be prompted for the secret key
that is stored in file `/var/lib/maas/secret` on the API server.

You can get the above information from the web UI by visiting the 'Nodes' page,
then the Controller tab, and clicking the button 'Add rack controller'. Here
is an example of what you may see:

![cli-install-rackd][img__2.2_cli-install-rackd]

Based on the above, then, we could have also entered:

```bash
sudo maas-rack register --url http://10.5.1.5:5240/MAAS \
	--secret fa847000e7cb681101d26e3477e6e39e
```

See [Rack controller][rackd] for an overview.


## List rack controllers

To list all rack controllers registered with the region:

```bash
maas $PROFILE rack-controllers read | grep hostname | cut -d '"' -f 4
```


## Set the default storage layout

To set the default storage layout for all nodes:

```bash
maas $PROFILE maas set-config name=default_storage_layout value=$LAYOUT_TYPE
```

For example, to set the default layout to Flat:

```bash
maas $PROFILE maas set-config name=default_storage_layout value=flat
```

!!! Warning "Important":
    The new default will only apply to newly-commissioned nodes.

See [Storage][storage] for more details on MAAS storage features.


## Set a storage layout

An administrator can set a storage layout for a node with a status of 'Ready'
like this:

```bash
maas $PROFILE machine set-storage-layout $SYSTEM_ID storage_layout=$LAYOUT_TYPE [$OPTIONS]
```

For example, to set an LVM layout where the logical volume has a size of 5 GB:

```bash
maas $PROFILE machine set-storage-layout $SYSTEM_ID storage_layout=lvm lv_size=5368709120
```

All storage sizes are currently required to be specified in bytes.

!!! Warning
    This will remove the configuration that may exist on any block device.

## Create an alias (CNAME) record in DNS

An administrator can set a DNS Alias (CNAME record) to an already existing DNS entry of a node. 

```bash
mass $PROFILE dnsresource-records create fqdn=$HOSTNAME.$DOMAIN rrtype=cname rrdata=$ALIAS
```

For example, to set webserver.maas.io to alias to www.maas.io:

```bash
maas $PROFILE dnsresource-records create fqdn=webserver.maas.io rrtype=cname rrdata=www
```

## Create a Mail Exchange pointer record in DNS

An administrator can set a DNS Mail Exchange pointer record (MX and value) to a domain.

```bash
maas $PROFILE dnsresource-records create fqdn=$DOMAIN rrtype=mx rrdata='10 $MAIL_SERVER.$DOMAIN'
```

For example, to set domain.name managed by MAAS to have an MX record and that you own the domain:

```bash
maas $PROFILE dnsresource-records create fqdn=maas.io rrtype=mx rrdata='10 smtp.maas.io'
```


<!-- LINKS -->

[manage-cli]: manage-cli.md
[cli-system-id]: manage-cli-common.md#determine-a-node-system-id
[power-types]: nodes-power-types.md
[dhcp-relay]: installconfig-network-dhcp.md#dhcp-relay
[rackd]: installconfig-rack.md
[storage]: installconfig-storage.md
[post-commission-configuration]: nodes-commission.md#post-commission-configuration

[img__2.2_cli-install-rackd]: ../media/manage-maas-cli-advanced__2.2_install-rackd.png
