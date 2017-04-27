Title: Advanced CLI Tasks
TODO:  Decide whether explicit examples are needed everywhere
       Update installconfig-nodes-tags.html to show assigning tags to machines with UI; then link to it (for entry 'specify boot option') 
       Confirm whether kernel boot options really override default/global options such as those given by GRUB's GRUB_CMDLINE_LINUX_DEFAULT variable
       Kernel selection example should not just be about HWE kernels. Adjust installconfig-nodes-ubuntu-kernels.md accordingly
table_of_contents: True


# Advanced CLI Tasks

This is a list of advanced tasks to perform with the MAAS CLI. See
[MAAS CLI][manage-cli] on how to get started.


## Set the default kernel boot options

To set kernel boot options that will be applied to all machines:

```bash
maas $PROFILE maas set-config name=kernel_opts value='$KERNEL_OPTIONS'
```

## Specify kernel boot options for a machine

To specify kernel boot options for an individual machine a tag needs to be
created:

```bash
maas $PROFILE tags create name='$TAG_NAME' \
	comment='$COMMENT' kernel_opts='$KERNEL_OPTIONS'
```

For example:

```bash
maas $PROFILE tags create name='nomodeset' \
	comment='nomodeset kernel option' kernel_opts='nomodeset vga'
```

The tag must then be assigned to the machine in question. This can be done
with the web UI or with the CLI. For the latter, see
[MAAS CLI - common tasks][cli-assign-tag-to-node].

If multiple tags attached to a node have the `kernel_opts` defined, the first
one (ordered alphabetically) is used.


## Set a default minimum HWE kernel

To set a default minimum HWE kernel for all machines:

```bash
maas $PROFILE maas set-config name=default_min_hwe_kernel value=$HWE_KERNEL
```


## Set a minimum HWE kernel for a machine

To set the minimum HWE kernel on a machine basis:

```bash
maas $PROFILE machine update $SYSTEM_ID min_hwe_kernel=$HWE_KERNEL
```


## Set a specific HWE kernel during machine deployment

To set a specific HWE kernel during the deployment of a machine:

```bash
maas $PROFILE machine deploy $SYSTEM_ID distro_series=$SERIES hwe_kernel=$HWE_KERNEL
```

MAAS verifies that the specified kernel is available for the given Ubuntu
release (series) before deploying the node. 


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


## Relay DHCP

To relay DHCP traffic for a VLAN (source) through another VLAN (target):

```bash
maas $PROFILE vlan update $FABRIC_ID $VLAN_VID_SRC relay_vlan=$VLAN_ID_TARGET
```

For example, to relay VLAN with vid 0 (on fabric-2) through VLAN with id 5002 :

```bash
maas $PROFILE vlan update 2 0 relay_van=5002
```


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


## Install a rack controller

To install and register a rack controller with the MAAS:

```bash
sudo apt install maas-rack-controller
sudo maas-rack register
```

!!! Note: 
    The register command is only needed if the rack controller is not
    being added to a system that already houses an API server.

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


## List rack controllers

To list all rack controllers registered with the region:

```bash
maas $PROFILE rack-controllers read | grep hostname | cut -d '"' -f 4
```


<!-- LINKS -->

[manage-cli]: manage-cli.md
[cli-assign-tag-to-node]: manage-cli-common.md#assign-a-tag-to-a-node

[img__2.2_cli-install-rackd]: ../media/manage-maas-cli-advanced__2.2_install-rackd.png
