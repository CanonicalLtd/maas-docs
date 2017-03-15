Title: Intel RSD | MAAS
TODO:  Need access to this hardware to produce quality docs (Newell Jensen is a resource)
table_of_contents: True


# Intel RSD

Intel Rack Scale Design (RSD) is a hardware architecture that allows for the
dynamic composition of physical systems from a pool of available hardware
resources (e.g. disk space, memory, cores). It is an example of *composable
hardware*.

This allows for the request (allocate) of a machine without having to manually
compose it beforehand. Modelling tools, such as [Juju][about-juju], can
therefore leverage this when requesting a machine from MAAS, which will
dynamically **create** and Deploy one. Machines can also be requested directly
from within MAAS.

Functionality for composable hardware first appeared in MAAS 2.2 beta2. See the
[MAAS 2.2.0 release notes][release-notes] for how to install the requisite
version of MAAS.


## Definitions

- Intel Rack Scale Design  
  Intel® Rack Scale Design (RSD) is a logical architecture that disaggregates
  compute, storage, and network resources, and introduces the ability to more
  efficiently pool and utilize these resources.
  
- Composed System  
  An Intel RSD term. Used to represent a system that has been created for usage
  as an actual machine in MAAS.
  
- Uncomposed System  
  An Intel RSD term. Used to represent a system that has not been created for
  usage as an actual usable system.
  
- Pod  
  A MAAS term. Use to represent a set of machines or a pool of hardware available
  for MAAS’s control through a single endpoint.


## MAAS CLI

Functionality for composable hardware is, at this time, primarily accessed via
the MAAS CLI (see [MAAS CLI][manage-cli] to get started) but the web UI (see
[below][anchor__webui]) is quickly advancing in this area.


### List all Pods

List all Pods:

```bash
maas $PROFILE pods read
```


### Register a Pod

To register a Pod:

```bash
maas $PROFILE pods create type="rsd" power_address=$POWER_ADDRESS \
	power_user=$USERNAME power_pass=$PASSWORD
```

Where POWER_ADDRESS can be an IP address or URL followed by a port.

For example:

```bash
maas $PROFILE pods create type="rsd" power_address="10.3.0.1:8443"
```

When a Pod is registered, MAAS automatically discovers and stores the
resources that the Pod contains.  


### List Pod resources

To list a Pod's resources:

```bash
maas $PROFILE pod read $POD_ID
```


### List Pod power parameters

To list a Pod's power parameters:

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


### Compose Pod machines

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
**architecture=**requested architecture that POD must support  

For example:

```bash
maas $PROFILE pod compose $POD_ID \
	cores=40 cpu_speed=2000 memory=7812 architecture="amd64/generic"
```


### List machine parameters

The MAAS machine may be a composed machine in which case its resources will be
included in the output:

```bash
maas $PROFILE machine read $SYSTEM_ID
```


### Machine decomposition

To decompose a Pod machine by deleting the machine itself:

```bash
maas $PROFILE machine delete $SYSTEM_ID
```

If the Pod's resources are now listed (`pod read $POD_ID`), it would be seen
that the resources for this machine are available and no longer used.


### Pod deletion

To delete a Pod:

```bash
maas $PROFILE pod delete $POD_ID
```


## Web UI

Functionality for composable systems (like the Intel RSD) in the web UI
consists of the following actions and information displays:

- List pods - lists all pods and provide a summary of usage statistics for each
- Add a pod - add a pod
- Pod details - provide detailed information about a pod such as available
  resources 

Such functionality has only begun to appear in the web UI. It is under active
development.

Composable hardware systems are managed on the 'Pods' page.


<!-- LINKS -->

[release-notes]: release-notes.md
[manage-cli]: manage-cli.md
[about-juju]: https://jujucharms.com/docs/stable/about-juju
[anchor__webui]: #web-ui
