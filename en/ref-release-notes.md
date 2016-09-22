Title: Release Notes

# 2.0.0 Release notes

## Important changes

### MAAS 2.0 supported on Ubuntu 16.04 LTS (Xenial)

MAAS version 2.0 is supported on Ubuntu 16.04 LTS. MAAS 2.0 and greater
will NOT be supported on Ubuntu 14.04 LTS. The latest MAAS 1.9 point
release will continue to be supported on Ubuntu 14.04 LTS (Trusty) until
it reaches end-of-life.

Upgrades are supported for users running Ubuntu 14.04 systems running
MAAS 1.9 or earlier. Upon upgrading to Ubuntu 16.04, the MAAS database
and configuration will be seamlessly migrated to the supported
MAAS version.

Please see the “Other Notable Changes” section below for more details
regarding the reasons for this change.

### Terminology Changes

Cluster controllers have been renamed to rack controllers.

Starting from MAAS 2.0, MAAS cluster controllers have been deprecated,
along with the legacy `nodegroups` API. The new API endpoint is
`rackcontrollers`, which provides feature parity with earlier versions
of MAAS.

For more information on rack controllers, refer to the
Major new Features section bellow or refer to rack-configuration.

### API 1.0 has been deprecated, introducing API 2.0

Starting from MAAS 2.0, the MAAS REST API version 1.0 has been
deprecated. MAAS 2.0 drops support for the legacy 1.0 API, in favor of
API version 2.0. With the introduction of the new API version, various
endpoints have now been deprecated, and new end-points have
been introduced. API users will need to update their client tools to
reflect the changes.

For more information on API 2.0, refer
to API documentation &lt;region-controller-api&gt;.

### Static IP ranges have been deprecated

Starting from MAAS 2.0, static IP ranges (previously found on the
cluster interface page) have been deprecated. MAAS now assumes total
control of a subnet. MAAS will automatically assign IP addresses to
deployed machines, as long as those IP addresses are not within a
dynamic or a reserved IP range. Users are now only required to specify
one or more dynamic ranges per subnet. Dynamic ranges are used for
auto-enlistment, commissioning, and any other systems configured
for DHCP. IP addresses in-use for purposes such as devices, default
gateways, DNS servers, rack and region controllers, and BMCs are
automatically avoided when assigning IP addresses. Reserved IP ranges
may be added if MAAS should avoid certain ranges of IP addresses in
the subnet.

### maas-region-controller-min has been renamed to maas-region-api

The `maas-region-controller-min` package has been renamed to
`maas-region-api`. This package provides API services for MAAS
(`maas-regiond`) and can be used to scale out the API front-end of a
MAAS region.

### MAAS user creation been moved to 'maas' command

Starting from MAAS 2.0, the `maas` command now provides the ability to
create admin users. The `maas-region createadmin` command has
been deprecated. New administrators should now be created with
`maas createadmin`.

### maas-provision command has been replaced

The MAAS rack controller command-line interface (`maas-provision`) has
been replaced by the `maas-rack` command.

### maas-region-admin command has been replaced with maas-region

The MAAS region controller command-line interface (`maas-region-admin`)
has been replaced by the `maas-region` command. Note that this command
provides an interface to interact directly with Django, which should
only be used for debugging purposes.

### Debian Installer is no longer installed or supported

Because support for the Debian Installer (DI) has been dropped (as of
MAAS 1.9), MAAS no longer downloads DI-related files from simplestreams.
Upon upgrading to MAAS 2.0, DI-related files will be removed from the
MAAS region (and all rack controllers).

## Major new features

### MAAS Rack Controllers and High Availability

Starting from MAAS 2.0, MAAS **cluster controllers** have been renamed
to **rack controllers**.

-   The `nodegroups` and `nodegroups/(group)/interfaces` API endpoints
    have been deprecated. In MAAS 2.0, the `rackcontrollers` interface
    partially replaces this functionality. For defining dynamic and
    reserved ranges, or specifying default gateways, use the
    `subnets` endpoint. For enabling or disabling DHCP, use the
    `fabrics/(fabric)/vlans` endpoint.
-   The **Clusters** tab is no longer available in the Web UI.
    Controllers are now found under the **Nodes** tab, where each region
    and/or rack controller can be found. Other cluster interface
    properties have been moved to the Subnet and VLAN details pages
    under the **Networks** tab.
-   Machines no longer belong to a specific controller. In earlier
    versions of MAAS, machines would directly assigned to a
    cluster controller. The cluster controller that the machine belonged
    to would not only perform DHCP for that machine, but also all the
    PXE booting and power management.

    In order to support high availability for rack controllers,
    (starting from MAAS 2.0) machines no longer belong to a specific
    rack controller. The best controller to manage a machine is now
    determined at runtime.

-   DHCP is now configured per-VLAN. In earlier versions of MAAS, DHCP
    was directly linked and configured per cluster interface. As of MAAS
    2.0, DHCP is now configured and managed per-VLAN, which allows any
    rack controller to potentially provide DHCP in a
    high-availability environment.
-   Rack controllers have been enabled for high availability. Starting
    from MAAS 2.0, rack controllers in the same VLAN become candidates
    to manage DHCP, PXE/TFTP, and power control for machines on
    the VLAN. MAAS now supports the concept of a **primary** and a
    **secondary** rack controller. If a secondary controller determines
    that the primary controller is unavailable, it will assume control
    of those services.
-   Added `maas-rack support-dump` command. For increased support
    observability, users can now dump the contents of several internal
    MAAS data structures by executing `sudo maas-rack support-dump`.
    This command will dump networking diagnostics, rack configuration,
    and image information. Information can be restricted to a particular
    category by using the `--networking`, `--config`, or
    `--images` options.
-   Rack controllers can now be found under the **Nodes** tab in the Web
    UI. MAAS 2.0 Adds a new **Controllers** section under thee
    **Nodes** tab. This section will now list all rack and
    region controllers. Under a rack controller, the user will be able
    to see service tracking, connected VLANs, rack interfaces and other
    relevant information.

### Region Controller Redundancy (High Availability) 

Starting from MAAS 2.0, MAAS provides the ability to scale out (provide
redundancy for) the MAAS region controller API, HTTP server, and DNS.
This will allow administrators to set up multiple MAAS region
controllers (`maas-region-api`) against a common database, providing
redundancy of services. With further manual configuration, users will be
able to setup the MAAS region controller in high availability mode.

### New Networks Web UI

MAAS 2.0 introduces a few new Web UI features that were not available in
previous versions of MAAS.

-   Added fabric and space details pages.
-   Added the ability to add and remove fabrics, spaces, subnets and
    VLANs. This can be done using the actions menu on the
    **Networks** tab.
    The ability to delete fabrics, spaces, subnets and VLANs is also
    available from the details page for each respective object.

### DNS Management

MAAS 2.0 extends DNS management by adding the following features:

-   Ability to create multiple DNS domains.
-   Ability to add multiple records (`CNAME`, `TXT`, `MX`, `SRV`)
    per domain. (API only)
-   Ability to select the domain for machines and devices.
-   Ability to assign (additional) names to IP addresses. (API only)
-   For deployed machines, `A` records continue to be created for the IP
    of the PXE interface.
-   Additional PTR records are now created for all non-PXE interfaces in
    the form: `<interface>.<machine fully-qualified-domain-name>`
-   Reverse DNS is now generated for only the subnet specified, rather
    than the parent /24 or /16. By default,
    [RFC2137](https://tools.ietf.org/html/rfc2137) glue is provided for
    networks smaller than /24. This can be disabled or changed on a
    per-subnet basis via the API.

### IP Ranges  

Previous versions of MAAS used the concepts of a **dynamic range** and
**static range**, which were properties of each cluster interface. This
has been redesigned for MAAS 2.0 as follows:

-   Dynamic ranges have been migrated from earlier MAAS releases as-is.
-   Because static ranges have been removed from MAAS, each static range
    has been migrated to one or more reserved ranges, which represent
    the opposite of the previous static range. (MAAS now assumes it has
    full control of each managed subnet, and is free to assign IP
    addresses as it sees fit, unless told otherwise.)

    For example, if in an earlier MAAS release a cluster interface was
    configured on 192.168.0.1/24, with a dynamic range of 192.168.0.2
    through 192.168.0.99, and a static range of 192.168.0.100 through
    192.168.0.199, this will be migrated to:

        IP range #1 (dynamic): 192.168.0.2 - 192.168.0.99
        IP range #2 (reserved): 192.168.0.200 - 192.168.0.254

    Since 192.168.0.100 - 192.168.0.199 (the previous static range) is
    not accounted for, MAAS assumes it is free to allocate static IP
    addresses from that range.

-   Scalability is now possible by means of adding a second dynamic IP
    range to a VLAN. (To deal with IP address exhaustion, MAAS supports
    multiple dynamic ranges on one or more subnets within a
    DHCP-enabled VLAN.)
-   Reserved ranges can now be allocated to a particular MAAS user.
-   A comment field has been added, so that users can indicate why a
    particular range of IP addresses is reserved.
-   IP ranges can be configured in the Web UI via the Subnet details
    page, or using the `subnets` REST API endpoint.

### API 2.0 and MAAS CLI Updates  

Version 1.0 of the MAAS REST API has been removed and replaced with the
2.0 version of the REST API. As such, new endpoints and commands have
been introduced:

-   RackControllers - This endpoint/command has the following operations
    in addition to the base operations provided by nodes:
    `import-boot-images` - Import the boot images on all rack controllers
    `describe-power-types` - Query all of the rack controllers for
    power information

-   RackController - This endpoint/command has the following operations
    in addition to the base operations provided by nodes
    -   `import-boot-images` - Import boot images on the given rack
        controller
    -   `refresh` - refresh the hardware information for the given rack
        controller
-   Machines - This endpoint/command replaces many of the operations
    previously found in the nodes endpoint/command. The machines
    endpoint/command has the following operations in addition to the
    base operations provided by nodes.
    -   `power-parameters` - Retrieve power parameters for multiple
        machines
    -   `list-allocated` - Fetch machines that were allocated to the
        user/oauth token.
    -   `allocate` - Allocate an available machine for deployment.
    -   `accept` - Accept declared machine into MAAS.
    -   `accept-all` - Accept all declared machines into MAAS.
    -   `create` - Create a new machine.
    -   `add-chassis` - Add special hardware types.
    -   `release` - Release multiple machines.
-   Machine - This endpoint/command replaces many of the operations
    previously found in the node endpoint/command. The machine
    endpoint/command has the following operations in addition to the
    base operations provided by node.
    -   `power-parameters` - Obtain power parameters for the
        given machine.
    -   `deploy` - Deploy an operating system to a given machine.
    -   `abort` - Abort the machines current operation.
    -   `get-curtin-config` - Return the rendered curtin configuration
        for the machine.
    -   `power-off` - Power off the given machine.
    -   `set-storage-layout` - Change the storage layout of the
        given machine.
    -   `power-on` - Turn on the given machine.
    -   `release` - Release a given machine.
    -   `clear-default-gateways` - Clear any set default gateways on
        the machine.
    -   `update` - Change machine configuration.
    -   `query-power-state` - Query the power state of a machine.
    -   `commission` - Begin commissioning process for a machine

#### Other endpoints/commands have changed:

-   All list commands/operations have been converted to read
-   All new and add commands/operations have been converted to create
-   Nodes - The nodes endpoint/command is now a base endpoint/command
    for all other node types(devices, machines, and rack-controllers).
    As such most operations have been moved to the machines
    endpoint/command.The following operations remain as they can be used
    on all node types.
    -   `is-registered` - Returns whether or not the given MAC address
        is registered with this MAAS.
    -   `set-zone` - Assign multiple nodes to a physical zone at once.
    -   `read` - List nodes visible to the user, optionally filtered
        by criteria.
-   Node - The node endpoint/command is now a base endpoint/command for
    all other node types(devices, machines, and rack-controllers). As
    such most operations have been moved to the machine
    endpoint/command. The following operations remain as they can be
    used on all node types.
    -   `read` - Read information about a specific node
    -   `details` - Obtain various system details.
    -   `delete` - Delete a specific node.
-   With the migration of nodes to machines the following items
    previously outputted with the list command have been changed or
    removed from the machines read command:
    -   \`\`status - Will now show all status types
    -   `substatus`, `substatus_action`, `substatus_message`,
        `substatus_name` - Replaced by `status`, `status_action`,
        `status_message`, `status_name`.
    -   \`\`boot\_type - Removed, MAAS 2.0 only supports fastpath.
    -   `pxe_mac` - Replaced by `boot_interface`.
    -   `hostname` - Now only displays the hostname (without the domain)
        of the machine. `fqdn` and `domain` attributes can now be
        used instead.
-   And other endpoints/commands have been deprecated:
    -   NodeGroups - Replacement operations are found in the
        RackControllers, Machines, and BootResources endpoints/commands.
    -   NodeGroupInterfaces - replacement operations are found in the
        RackController, IPRanges, Subnets, and VLANS endpoints/commands.

### Extended Storage Support  

MAAS 2.0 Storage Model has been extended to support:

-   XFS as a filesystem.
-   Mount options.
-   Swap partitions. (MAAS 1.9 only supported the creation of a swap
    file in the filesystem.)
-   `tmps`/`ramfs` support.

All of these options are currently available over the CLI.

### DHCP Snippets

MAAS 2.0 introduces the ability to define DHCP snippets. This feature
allows administrators to manage DHCP directly from MAAS, removing the
need to manually modify template files. The following types of DHCP
snippets can be defined:

> -   **Host snippets** - used for configuration for a particular node
>     in MAAS.
> -   **Subnet snippets** - used for configuration for a specific subnet
>     in MAAS.
> -   **Global snippets** - used for configuration that will affect DHCP
>     (isc-dhcp) as a whole.

For more information, see DHCP Snippets &lt;dhcpsnippets&gt;.

## Minor new features

### MAAS proxy is now managed

Starting from MAAS 2.0, MAAS now manages the configuration for
`maas-proxy`. This allows MAAS to lock down the proxy so that it only
allows traffic from networks MAAS knows about. For more information,
see MAAS Proxy &lt;proxy&gt;.

### rsyslog during enlistment and commissioning

MAAS 2.0 now enables `rsyslog` for the enlistment and commissioning
environment (when using Xenial as the commissioning image). This allows
users to see `cloud-init`'s syslog information in
`/var/log/maas/rsyslog/`.

### Ability to change a machine’s domain name from the UI 

MAAS 2.0 introduces the ability to change a machine’s DNS domain via the
Web UI. It was previously supported on the API only.

### Networks listing page

In the **Networks** tab, a new networks overview has been introduced,
which provides a high-level view of the MAAS networking mode. The
network model can be grouped by either fabrics or spaces.

### Service Tracking

MAAS now tracks the status of the services required for its operation,
such as `bind`, `maas-dhcpd`, `maas-dhcpd6`, `tgt`, and `maas-proxy`.

## Other notable changes

### MAAS 2.0 requires Python 3.5

Starting with MAAS 2.0, MAAS has now been ported to Python 3.5 (the
default version of Python in Ubuntu 16.04 "Xenial").

### MAAS 2.0 now fully supports native Django 1.8 migration system

MAAS is now based on Django 1.8. Django 1.8 has dropped support for the
South migration system in favor of the native Django migration system,
which breaks backwards compatibility with previous versions of Django.

MAAS continues to support a full upgrade path. MAAS versions 1.5, 1.7,
1.8, and 1.9 have been tested and confirmed to upgrade seamlessly to
MAAS 2.0.

### Instant DHCP lease notifications  
MAAS no longer scans the leases file every 5 minutes. `isc-dhcp-server`
now directly notifies MAAS if a lease is committed, released,
or expires.

### Host entries in DHCP  
Host entries are now rendered in the DHCP configuration instead of
placed in the leases file. This removes any state that previously
existed in the DHCP lease database on the cluster controller.

Starting with MAAS 2.0, if the dhcpd.leases file is lost (such as during
a failure scenario in a high availability environment), MAAS will be
able to reconstruct it.

### Power control is no longer specific to a rack controller  
MAAS selects one of the available rack controllers to power control or
query a BMC. The same rack controller that powers the BMC does not need
to be the rack controller that the machine PXE boots from.
