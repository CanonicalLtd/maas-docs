Title: MAAS CLI - Composable Hardware
table_of_contents: True


# CLI Composable Hardware

This is a list of composable hardware tasks to perform with the MAAS CLI. See
[MAAS CLI][manage-cli] for how to get started with the CLI and
[Composable hardware][intel-rsd] for an overview of the subject matter
(including web UI functionality).


## Register a Pod

To register/add a Pod:

```bash
maas $PROFILE pods create type="rsd" power_address=$POWER_ADDRESS \
	power_user=$USERNAME power_pass=$PASSWORD
```

Where POWER_ADDRESS, USERNAME, and PASSWORD will need to be collected from the
Intel RSD hardware administrator. POWER_ADDRESS can be an IP address (or URL)
followed by a port.

For example:

```bash
maas $PROFILE pods create type=rsd power_address=10.3.0.1:8443 \
	power_user=admin power_pass=admin
```

When a Pod is registered, MAAS automatically discovers and stores the
resources that the Pod contains. Any pre-composed machines will appear on the
'Nodes' page and be commissioned automatically. 


## List resources of all Pods

List the resources of all Pods:

```bash
maas $PROFILE pods read
```

For example, this will grab Pod IDs (POD_ID) and their MAAS names:

```bash
maas $PROFILE pods read | grep -A6 id
```

Sample output:

```no-highlight
        "id": 93,
        "capabilities": [
            "composable",
            "fixed_local_storage",
            "iscsi_storage"
        ],
        "name": "civil-hermit",
```


## List resources of a Pod

To list an individual Pod's resources:

```bash
maas $PROFILE pod read $POD_ID
```


## List Pod connection parameters

To list a Pod's connection parameters:

```bash
maas $PROFILE pod parameters $POD_ID
```

Example output:

```no-highlight
{
    "power_address": "10.3.0.1:8443",
    "power_pass": "admin",
    "power_user": "admin"
}
```


## Compose Pod machines

To compose a Pod's machines:

```bash
maas $PROFILE pod compose $POD_ID
```

Example output for default composing:

```no-highlight
{
    "system_id": "73yxmc",
    "resource_uri": "/MAAS/api/2.0/machines/73yxmc/"
}
```

Compose with resources specified:

```bash
maas $PROFILE pod compose $POD_ID $RESOURCES
```

Where RESOURCES is a space-separated list from:

**cores=**requested cores  
**cpu_speed=**requested minimum cpu speed in MHz  
**memory=**requested memory in MB  
**architecture=**requested architecture that Pod must support  

For example:

```bash
maas $PROFILE pod compose $POD_ID \
	cores=40 cpu_speed=2000 memory=7812 architecture="amd64/generic"
```


## Compose and allocate a Pod machine

In the absence of any nodes in the 'New' or 'Ready' state, if a Pod of
sufficient resources is available, MAAS can automatically compose (add),
commission, and acquire a Pod machine. This is done with the regular `allocate`
sub-command:

```bash
maas $PROFILE machines allocate
```


## List machine parameters

The MAAS node may be a composed machine in which case its resources will be
included in the output:

```bash
maas $PROFILE machine read $SYSTEM_ID
```


## Decompose a Pod machine

To decompose a Pod machine by deleting the corresponding MAAS node:

```bash
maas $PROFILE machine delete $SYSTEM_ID
```

If the Pod's resources are now listed (`pod read $POD_ID`), it would be seen
that the resources for this machine are available and no longer used.


## Delete a Pod

To delete a Pod (and decompose all its machines):

```bash
maas $PROFILE pod delete $POD_ID
```


<!-- LINKS -->

[manage-cli]: manage-cli.md
[intel-rsd]: intel-rsd.md
