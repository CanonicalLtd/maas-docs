### Navigation

-   [next](api_authentication.html "API authentication")
-   [previous](physical-zones.html "Physical Zones") |
-   [MAAS 1.8 documentation](index.html) »

MAAS API[¶](#maas-api "Permalink to this headline")
===================================================

Restful MAAS API.

This is the documentation for the API that lets you control and query
MAAS. The API is “Restful”, which means that you access it through
normal HTTP requests.

API versions[¶](#api-versions "Permalink to this headline")
-----------------------------------------------------------

At any given time, MAAS may support multiple versions of its API. The
version number is included in the API’s URL, e.g. /api/1.0/

For now, 1.0 is the only supported version.

HTTP methods and parameter-passing[¶](#http-methods-and-parameter-passing "Permalink to this headline")
-------------------------------------------------------------------------------------------------------

The following HTTP methods are available for accessing the API:
:   -   GET (for information retrieval and queries),
    -   POST (for asking the system to do things),
    -   PUT (for updating objects), and
    -   DELETE (for deleting objects).

All methods except DELETE may take parameters, but they are not all
passed in the same way. GET parameters are passed in the URL, as is
normal with a GET: “/item/?foo=bar” passes parameter “foo” with value
“bar”.

POST and PUT are different. Your request should have MIME type
“multipart/form-data”; each part represents one parameter (for POST) or
attribute (for PUT). Each part is named after the parameter or attribute
it contains, and its contents are the conveyed value.

All parameters are in text form. If you need to submit binary data to
the API, don’t send it as any MIME binary format; instead, send it as a
plain text part containing base64-encoded data.

Most resources offer a choice of GET or POST operations. In those cases
these methods will take one special parameter, called op, to indicate
what it is you want to do.

For example, to list all nodes, you might GET “/api/1.0/nodes/?op=list”.

Operations[¶](#operations "Permalink to this headline")
-------------------------------------------------------

### Logged-in user[¶](#logged-in-user "Permalink to this headline")

Manage the current logged-in user.

`POST /api/1.0/account/`{.docutils .literal}
`op=create_authorisation_token`{.docutils .literal}

> Create an authorisation OAuth token and OAuth consumer.
>
> return:
>
> a json dict with three keys: ‘token\_key’, ‘token\_secret’ and
> ‘consumer\_key’ (e.g. {token\_key: ‘s65244576fgqs’, token\_secret:
> ‘qsdfdhv34’, consumer\_key: ‘68543fhj854fg’}).
>
> rtype:
>
> string (json)

`POST /api/1.0/account/`{.docutils .literal}
`op=delete_authorisation_token`{.docutils .literal}

> Delete an authorisation OAuth token and the related OAuth consumer.
>
> param token\_key:
>
>  
>
> The key of the token to be deleted.
>
> type token\_key:
>
> unicode

### Boot images[¶](#boot-images "Permalink to this headline")

Manage the collection of boot images.

`GET /api/1.0/nodegroups/{uuid}/boot-images/`{.docutils .literal}
:   List boot images.

    Get a listing of a cluster’s boot images.

    param uuid:

    The UUID of the cluster for which the images should be listed.

### Boot resource[¶](#boot-resource "Permalink to this headline")

Manage a boot resource.

`DELETE /api/1.0/boot-resources/{id}/`{.docutils .literal}
:   Delete boot resource.
`GET /api/1.0/boot-resources/{id}/`{.docutils .literal}
:   Read a boot resource.

### Boot resources[¶](#boot-resources "Permalink to this headline")

Manage the boot resources.

`GET /api/1.0/boot-resources/`{.docutils .literal}
:   List all boot resources.

    param type:

    Type of boot resources to list. Default: all

`POST /api/1.0/boot-resources/`{.docutils .literal}
:   Uploads a new boot resource.

    param name:

    Name of the boot resource.

    param title:

    Title for the boot resource.

    param architecture:

     

    Architecture the boot resource supports.

    param filetype:

    Filetype for uploaded content. (Default: tgz)

    param content:

    Image content. Note: this is not a normal parameter, but a file
    upload.

`POST /api/1.0/boot-resources/`{.docutils .literal}
`op=import`{.docutils .literal}

> Import the boot resources.

### Boot source[¶](#boot-source "Permalink to this headline")

Manage a boot source.

`DELETE /api/1.0/boot-sources/{id}/`{.docutils .literal}
:   Delete a specific boot source.
`GET /api/1.0/boot-sources/{id}/`{.docutils .literal}
:   Read a boot source.
`PUT /api/1.0/boot-sources/{id}/`{.docutils .literal}
:   Update a specific boot source.

    param url:

    The URL of the BootSource.

    param keyring\_filename:

     

    The path to the keyring file for this BootSource.

    param keyring\_filename:

     

    The GPG keyring for this BootSource, base64-encoded data.

### Boot source selection[¶](#boot-source-selection "Permalink to this headline")

Manage a boot source selection.

`DELETE /api/1.0/boot-sources/{boot_source_id}/selections/{id}/`{.docutils .literal}
:   Delete a specific boot source.
`GET /api/1.0/boot-sources/{boot_source_id}/selections/{id}/`{.docutils .literal}
:   Read a boot source selection.
`PUT /api/1.0/boot-sources/{boot_source_id}/selections/{id}/`{.docutils .literal}
:   Update a specific boot source selection.

    param release:

    The release for which to import resources.

    param arches:

    The list of architectures for which to import resources.

    param subarches:

     

    The list of subarchitectures for which to import resources.

    param labels:

    The list of labels for which to import resources.

### Boot source selections[¶](#boot-source-selections "Permalink to this headline")

Manage the collection of boot source selections.

`GET /api/1.0/boot-sources/{boot_source_id}/selections/`{.docutils .literal}
:   List boot source selections.

    Get a listing of a boot source’s selections.

`POST /api/1.0/boot-sources/{boot_source_id}/selections/`{.docutils .literal}
:   Create a new boot source selection.

    param release:

    The release for which to import resources.

    param arches:

    The architecture list for which to import resources.

    param subarches:

     

    The subarchitecture list for which to import resources.

    param labels:

    The label lists for which to import resources.

### Boot sources[¶](#boot-sources "Permalink to this headline")

Manage the collection of boot sources.

`GET /api/1.0/boot-sources/`{.docutils .literal}
:   List boot sources.

    Get a listing of boot sources.

`POST /api/1.0/boot-sources/`{.docutils .literal}
:   Create a new boot source.

    param url:

    The URL of the BootSource.

    param keyring\_filename:

     

    The path to the keyring file for this BootSource.

    param keyring\_data:

     

    The GPG keyring for this BootSource, base64-encoded.

### Commissioning script[¶](#commissioning-script "Permalink to this headline")

Manage a custom commissioning script.

> This functionality is only available to administrators.

`DELETE /api/1.0/commissioning-scripts/{name}`{.docutils .literal}
:   Delete a commissioning script.
`GET /api/1.0/commissioning-scripts/{name}`{.docutils .literal}
:   Read a commissioning script.
`PUT /api/1.0/commissioning-scripts/{name}`{.docutils .literal}
:   Update a commissioning script.

### Commissioning scripts[¶](#commissioning-scripts "Permalink to this headline")

Manage custom commissioning scripts.

> This functionality is only available to administrators.

`GET /api/1.0/commissioning-scripts/`{.docutils .literal}
:   List commissioning scripts.
`POST /api/1.0/commissioning-scripts/`{.docutils .literal}
:   Create a new commissioning script.

    Each commissioning script is identified by a unique name.

    By convention the name should consist of a two-digit number, a dash,
    and a brief descriptive identifier consisting only of ASCII
    characters. You don’t need to follow this convention, but not doing
    so opens you up to risks w.r.t. encoding and ordering. The name must
    not contain any whitespace, quotes, or apostrophes.

    A commissioning node will run each of the scripts in lexicographical
    order. There are no promises about how non-ASCII characters are
    sorted, or even how upper-case letters are sorted relative to
    lower-case letters. So where ordering matters, use unique numbers.

    Scripts built into MAAS will have names starting with “00-maas” or
    “99-maas” to ensure that they run first or last, respectively.

    Usually a commissioning script will be just that, a script. Ideally
    a script should be ASCII text to avoid any confusion over encoding.
    But in some cases a commissioning script might consist of a binary
    tool provided by a hardware vendor. Either way, the script gets
    passed to the commissioning node in the exact form in which it was
    uploaded.

    param name:

    Unique identifying name for the script. Names should follow the
    pattern of “25-burn-in-hard-disk” (all ASCII, and with numbers
    greater than zero, and generally no “weird” characters).

    param content:

    A script file, to be uploaded in binary form. Note: this is not a
    normal parameter, but a file upload. Its filename is ignored; MAAS
    will know it by the name you pass to the request.

### Device[¶](#device "Permalink to this headline")

Manage an individual device.

> The device is identified by its system\_id.

`DELETE /api/1.0/devices/{system_id}/`{.docutils .literal}
:   Delete a specific Device.

    Returns 404 if the device is not found. Returns 403 if the user does
    not have permission to delete the device. Returns 204 if the device
    is successfully deleted.

`GET /api/1.0/devices/{system_id}/`{.docutils .literal}
:   Read a specific device.

    Returns 404 if the device is not found.

`POST /api/1.0/devices/{system_id}/`{.docutils .literal}
`op=claim_sticky_ip_address`{.docutils .literal}

> Assign a “sticky” IP address to a device’s MAC.
>
> param mac\_address:
>
>  
>
> Optional MAC address on the device on which to assign the sticky IP
> address. If not passed, defaults to the primary MAC for the device.
>
> param requested\_address:
>
>  
>
> Optional IP address to claim. If this isn’t passed, this method will
> draw an IP address from the static range of the cluster interface this
> MAC is related to. If passed, this method lets you associate any IP
> address with a MAC address if the MAC isn’t related to a cluster
> interface.
>
> Returns 404 if the device is not found. Returns 400 if the
> mac\_address is not found on the device. Returns 503 if there are not
> enough IPs left on the cluster interface to which the mac\_address is
> linked. Returns 503 if the requested\_address falls in a dynamic
> range. Returns 503 if the requested\_address falls in a dynamic range.
> Returns 503 if the requested\_address is already allocated.

`POST /api/1.0/devices/{system_id}/`{.docutils .literal}
`op=release_sticky_ip_address`{.docutils .literal}

> Release a “sticky” IP address from a device’s MAC.
>
> param address:
>
> Optional IP address to release. If left unspecified, will release
> every “sticky” IP address associated with the device.
>
> Returns 400 if the specified addresses could not be deallocated
> Returns 404 if the device is not found.

`PUT /api/1.0/devices/{system_id}/`{.docutils .literal}
:   Update a specific device.

    param hostname:

    The new hostname for this device.

    param parent:

    Optional system\_id to indicate this device’s parent. If the parent
    is already set and this parameter is omitted, the parent will be
    unchanged.

    type hostname:

    unicode

    Returns 404 if the device is not found. Returns 403 if the user does
    not have permission to update the device.

### Devices[¶](#devices "Permalink to this headline")

Manage the collection of all the devices in the MAAS.

`GET /api/1.0/devices/`{.docutils .literal} `op=list`{.docutils
.literal}

> List devices visible to the user, optionally filtered by criteria.
>
> param hostname:
>
> An optional list of hostnames. Only devices with matching hostnames
> will be returned.
>
> type hostname:
>
> iterable
>
> param mac\_address:
>
>  
>
> An optional list of MAC addresses. Only devices with matching MAC
> addresses will be returned.
>
> type mac\_address:
>
>  
>
> iterable
>
> param id:
>
> An optional list of system ids. Only devices with matching system ids
> will be returned.
>
> type id:
>
> iterable

`POST /api/1.0/devices/`{.docutils .literal} `op=new`{.docutils
.literal}

> Create a new device.
>
> param mac\_addresses:
>
>  
>
> One or more MAC addresses for the device.
>
> param hostname:
>
> A hostname. If not given, one will be generated.
>
> param parent:
>
> The system id of the parent. Optional.

### Events[¶](#events "Permalink to this headline")

Retrieve filtered node events.

> A specific Node’s events is identified by specifying one or more ids,
> hostnames, or mac addresses as a list.

`GET /api/1.0/events/`{.docutils .literal} `op=query`{.docutils
.literal}

> List Node events, optionally filtered by various criteria via URL
> query parameters.
>
> param hostname:
>
> An optional hostname. Only events relating to the node with the
> matching hostname will be returned. This can be specified multiple
> times to get events relating to more than one node.
>
> param mac\_address:
>
>  
>
> An optional list of MAC addresses. Only nodes with matching MAC
> addresses will be returned.
>
> param id:
>
> An optional list of system ids. Only nodes with matching system ids
> will be returned.
>
> param zone:
>
> An optional name for a physical zone. Only nodes in the zone will be
> returned.
>
> param agent\_name:
>
>  
>
> An optional agent name. Only nodes with matching agent names will be
> returned.
>
> param level:
>
> Desired minimum log level of returned events. Returns this level of
> events and greater. Choose from: DEBUG, INFO, WARNING, CRITICAL,
> ERROR. The default is INFO.

### File[¶](#file "Permalink to this headline")

Manage a FileStorage object.

> The file is identified by its filename and owner.

`DELETE /api/1.0/files/{filename}/`{.docutils .literal}
:   Delete a FileStorage object.
`GET /api/1.0/files/{filename}/`{.docutils .literal}
:   GET a FileStorage object as a json object.

    The ‘content’ of the file is base64-encoded.

`POST /api/1.0/files/{filename}/`{.docutils .literal}
`op=delete`{.docutils .literal}

> Delete a FileStorage object.

### Files[¶](#files "Permalink to this headline")

Manage the collection of all the files in this MAAS.

`GET /api/1.0/files/`{.docutils .literal} `op=get`{.docutils .literal}

> Get a named file from the file storage.
>
> param filename:
>
> The exact name of the file you want to get.
>
> type filename:
>
> string
>
> return:
>
> The file is returned in the response content.

`GET /api/1.0/files/`{.docutils .literal} `op=get_by_key`{.docutils
.literal}

> Get a file from the file storage using its key.
>
> param key:
>
> The exact key of the file you want to get.
>
> type key:
>
> string
>
> return:
>
> The file is returned in the response content.

`GET /api/1.0/files/`{.docutils .literal} `op=list`{.docutils .literal}

> List the files from the file storage.
>
> The returned files are ordered by file name and the content is
> excluded.
>
> param prefix:
>
> Optional prefix used to filter out the returned files.
>
> type prefix:
>
> string

`POST /api/1.0/files/`{.docutils .literal} `op=add`{.docutils .literal}

> Add a new file to the file storage.
>
> param filename:
>
> The file name to use in the storage.
>
> type filename:
>
> string
>
> param file:
>
> Actual file data with content type application/octet-stream
>
> Returns 400 if any of these conditions apply:
> :   -   The filename is missing from the parameters
>     -   The file data is missing
>     -   More than one file is supplied
>
### IP Addresses[¶](#ip-addresses "Permalink to this headline")

Manage IP addresses allocated by MAAS.

`GET /api/1.0/ipaddresses/`{.docutils .literal}
:   List IPAddresses.

    Get a listing of all IPAddresses allocated to the requesting user.

`POST /api/1.0/ipaddresses/`{.docutils .literal} `op=release`{.docutils
.literal}

> Release an IP address that was previously reserved by the user.
>
> param ip:
>
> The IP address to release.
>
> type ip:
>
> unicode
>
> Returns 404 if the provided IP address is not found.

`POST /api/1.0/ipaddresses/`{.docutils .literal} `op=reserve`{.docutils
.literal}

> Reserve an IP address for use outside of MAAS.
>
> Returns an IP adddress, which MAAS will not allow any of its known
> devices and Nodes to use; it is free for use by the requesting user
> until released by the user.
>
> The user may supply either a range matching the subnet of an existing
> cluster interface, or a specific IP address within the static IP
> address range on a cluster interface.
>
> param network:
>
> CIDR representation of the network on which the IP reservation is
> required. e.g. 10.1.2.0/24
>
> param requested\_address:
>
>  
>
> the requested address, which must be within a static IP address range
> managed by MAAS.
>
> param hostname:
>
> the hostname to use for the specified IP address
>
> type network:
>
> unicode
>
> Returns 400 if there is no network in MAAS matching the provided one,
> or a requested\_address is supplied, but a corresponding network could
> not be found. Returns 503 if there are no more IP addresses available.

### License Key[¶](#license-key "Permalink to this headline")

Manage a license key.

`DELETE /api/1.0/license-key/{osystem}/{distro_series}`{.docutils .literal}
:   Delete license key.
`GET /api/1.0/license-key/{osystem}/{distro_series}`{.docutils .literal}
:   Read license key.
`PUT /api/1.0/license-key/{osystem}/{distro_series}`{.docutils .literal}
:   Update license key.

    param osystem:

    Operating system that the key belongs to.

    param distro\_series:

     

    OS release that the key belongs to.

    param license\_key:

     

    License key for osystem/distro\_series combo.

### License Keys[¶](#license-keys "Permalink to this headline")

Manage the license keys.

`GET /api/1.0/license-keys/`{.docutils .literal}
:   List license keys.
`POST /api/1.0/license-keys/`{.docutils .literal}
:   Define a license key.

    param osystem:

    Operating system that the key belongs to.

    param distro\_series:

     

    OS release that the key belongs to.

    param license\_key:

     

    License key for osystem/distro\_series combo.

### MAAS server[¶](#maas-server "Permalink to this headline")

Manage the MAAS server.

`GET /api/1.0/maas/`{.docutils .literal} `op=get_config`{.docutils
.literal}

> Get a config value.
>
> param name:
>
> The name of the config item to be retrieved.
>
> type name:
>
> unicode
>
> Available configuration items: - commissioning\_distro\_series:
> Default Ubuntu release used for commissioning. - default\_osystem:
> Default operating system used for deployment. - ports\_archive: Ports
> archive. Archive used by nodes to retrieve packages for non-Intel
> architectures. E.g.
> [http://ports.ubuntu.com/ubuntu-ports](http://ports.ubuntu.com/ubuntu-ports).
> - http\_proxy: Proxy for HTTP and HTTPS traffic. This is used by the
> cluster and region controllers for downloading PXE boot images and
> other provisioning-related resources. This will also be passed onto
> provisioned nodes instead of the default proxy (the region controller
> proxy). - windows\_kms\_host: Windows KMS activation host. FQDN or IP
> address of the host that provides the KMS Windows activation service.
> (Only needed for Windows deployments using KMS activation.) -
> enable\_disk\_erasing\_on\_release: Erase nodes’ disks prior to
> releasing.. - default\_distro\_series: Default OS release used for
> deployment. - ntp\_server: Address of NTP server for nodes. NTP server
> address passed to nodes via a DHCP response. e.g. ntp.ubuntu.com -
> dnssec\_validation: Enable DNSSEC validation of upstream zones. Only
> used when MAAS is running its own DNS server. This value is used as
> the value of ‘dnssec\_validation’ in the DNS server config. -
> upstream\_dns: Upstream DNS used to resolve domains not managed by
> this MAAS (space-separated IP addresses). Only used when MAAS is
> running its own DNS server. This value is used as the value of
> ‘forwarders’ in the DNS server config. - boot\_images\_auto\_import:
> Automatically import/refresh the boot images every 60 minutes. -
> enable\_third\_party\_drivers: Enable the installation of proprietary
> drivers (i.e. HPVSA). - kernel\_opts: Boot parameters to pass to the
> kernel by default. - main\_archive: Main archive. Archive used by
> nodes to retrieve packages for Intel architectures. E.g.
> [http://archive.ubuntu.com/ubuntu](http://archive.ubuntu.com/ubuntu).
> - maas\_name: MAAS name.

`POST /api/1.0/maas/`{.docutils .literal} `op=set_config`{.docutils
.literal}

> Set a config value.
>
> param name:
>
> The name of the config item to be set.
>
> type name:
>
> unicode
>
> param value:
>
> The value of the config item to be set.
>
> type value:
>
> json object
>
> Available configuration items: - commissioning\_distro\_series:
> Default Ubuntu release used for commissioning. - default\_osystem:
> Default operating system used for deployment. - ports\_archive: Ports
> archive. Archive used by nodes to retrieve packages for non-Intel
> architectures. E.g.
> [http://ports.ubuntu.com/ubuntu-ports](http://ports.ubuntu.com/ubuntu-ports).
> - http\_proxy: Proxy for HTTP and HTTPS traffic. This is used by the
> cluster and region controllers for downloading PXE boot images and
> other provisioning-related resources. This will also be passed onto
> provisioned nodes instead of the default proxy (the region controller
> proxy). - windows\_kms\_host: Windows KMS activation host. FQDN or IP
> address of the host that provides the KMS Windows activation service.
> (Only needed for Windows deployments using KMS activation.) -
> enable\_disk\_erasing\_on\_release: Erase nodes’ disks prior to
> releasing.. - default\_distro\_series: Default OS release used for
> deployment. - ntp\_server: Address of NTP server for nodes. NTP server
> address passed to nodes via a DHCP response. e.g. ntp.ubuntu.com -
> dnssec\_validation: Enable DNSSEC validation of upstream zones. Only
> used when MAAS is running its own DNS server. This value is used as
> the value of ‘dnssec\_validation’ in the DNS server config. -
> upstream\_dns: Upstream DNS used to resolve domains not managed by
> this MAAS (space-separated IP addresses). Only used when MAAS is
> running its own DNS server. This value is used as the value of
> ‘forwarders’ in the DNS server config. - boot\_images\_auto\_import:
> Automatically import/refresh the boot images every 60 minutes. -
> enable\_third\_party\_drivers: Enable the installation of proprietary
> drivers (i.e. HPVSA). - kernel\_opts: Boot parameters to pass to the
> kernel by default. - main\_archive: Main archive. Archive used by
> nodes to retrieve packages for Intel architectures. E.g.
> [http://archive.ubuntu.com/ubuntu](http://archive.ubuntu.com/ubuntu).
> - maas\_name: MAAS name.

### Network[¶](#network "Permalink to this headline")

Manage a network.

`DELETE /api/1.0/networks/{name}/`{.docutils .literal}
:   Delete network definition.

    A network cannot be deleted while it still has nodes attached to it.

`GET /api/1.0/networks/{name}/`{.docutils .literal}
:   Read network definition.

`GET /api/1.0/networks/{name}/`{.docutils .literal}
`op=list_connected_macs`{.docutils .literal}

> Returns the list of MAC addresses connected to this network.
>
> Only MAC addresses for nodes visible to the requesting user are
> returned.

`POST /api/1.0/networks/{name}/`{.docutils .literal}
`op=connect_macs`{.docutils .literal}

> Connect the given MAC addresses to this network.
>
> These MAC addresses must belong to nodes in the MAAS, and have been
> registered as such in MAAS.
>
> Connecting a network interface to a network which it is already
> connected to does nothing.
>
> param macs:
>
> A list of node MAC addresses, in text form.

`POST /api/1.0/networks/{name}/`{.docutils .literal}
`op=disconnect_macs`{.docutils .literal}

> Disconnect the given MAC addresses from this network.
>
> Removing a MAC address from a network which it is not connected to
> does nothing.
>
> param macs:
>
> A list of node MAC addresses, in text form.

`PUT /api/1.0/networks/{name}/`{.docutils .literal}
:   Update network definition.

    param name:

    A simple name for the network, to make it easier to refer to. Must
    consist only of letters, digits, dashes, and underscores.

    param ip:

    Base IP address for the network, e.g. 10.1.0.0. The host bits will
    be zeroed.

    param netmask:

    Subnet mask to indicate which parts of an IP address are part of the
    network address. For example, 255.255.255.0.

    param vlan\_tag:

    Optional VLAN tag: a number between 1 and 0xffe (4094) inclusive, or
    zero for an untagged network.

    param description:

     

    Detailed description of the network for the benefit of users and
    administrators.

### Networks[¶](#networks "Permalink to this headline")

Manage the networks.

`GET /api/1.0/networks/`{.docutils .literal}
:   List networks.

    param node:

    Optionally, nodes which must be attached to any returned networks.
    If more than one node is given, the result will be restricted to
    networks that these nodes have in common.

`POST /api/1.0/networks/`{.docutils .literal}
:   Define a network.

    param name:

    A simple name for the network, to make it easier to refer to. Must
    consist only of letters, digits, dashes, and underscores.

    param ip:

    Base IP address for the network, e.g. 10.1.0.0. The host bits will
    be zeroed.

    param netmask:

    Subnet mask to indicate which parts of an IP address are part of the
    network address. For example, 255.255.255.0.

    param vlan\_tag:

    Optional VLAN tag: a number between 1 and 0xffe (4094) inclusive, or
    zero for an untagged network.

    param description:

     

    Detailed description of the network for the benefit of users and
    administrators.

### Nodegroup[¶](#nodegroup "Permalink to this headline")

Manage a NodeGroup.

> NodeGroup is the internal name for a cluster.
>
> The NodeGroup is identified by its UUID, a random identifier that
> looks something like:
>
> > 5977f6ab-9160-4352-b4db-d71a99066c4f
>
> Each NodeGroup has its own uuid.

`GET /api/1.0/nodegroups/{uuid}/`{.docutils .literal}
:   GET a node group.

    Returns 404 if the nodegroup (cluster) is not found.

`GET /api/1.0/nodegroups/{uuid}/`{.docutils .literal}
`op=list_nodes`{.docutils .literal}

> Get the list of node ids that are part of this group.
>
> Returns 404 if the nodegroup (cluster) is not found.

`POST /api/1.0/nodegroups/{uuid}/`{.docutils .literal}
`op=details`{.docutils .literal}

> Obtain various system details for each node specified.
>
> For example, LLDP and `lshw`{.docutils .literal} XML dumps.
>
> Returns a `{system_id: {detail_type: xml, ...}, ...}`{.docutils
> .literal} map, where `detail_type`{.docutils .literal} is something
> like “lldp” or “lshw”.
>
> param system\_ids:
>
>  
>
> System ids of nodes for which to get system details.
>
> Note that this is returned as BSON and not JSON. This is for
> efficiency, but mainly because JSON can’t do binary content without
> applying additional encoding like base-64.
>
> For security purposes:
>
> 1.  Requests are only fulfilled for the worker assigned to the
>     nodegroup.
> 2.  Requests for nodes that are not part of the nodegroup are just
>     ignored.
>
> Returns 404 if the nodegroup (cluster) is not found. Returns 403 if
> the user does not have access to the nodegroup.

`POST /api/1.0/nodegroups/{uuid}/`{.docutils .literal}
`op=import_boot_images`{.docutils .literal}

> Import the pxe files on this cluster controller.
>
> Returns 404 if the nodegroup (cluster) is not found.

`POST /api/1.0/nodegroups/{uuid}/`{.docutils .literal}
`op=probe_and_enlist_hardware`{.docutils .literal}

> Add special hardware types.
>
> param model:
>
> The type of hardware. ‘seamicro15k’, ‘virsh’, ‘vmware’, ‘powerkvm’,
> ‘mscm’, ‘msftocs’ and ‘ucsm’ are supported.
>
> seamicro15k is the model for the Seamicro 1500 Chassis. virsh is the
> model for Virtual Machines managed by Virsh. powerkvm is the model for
> Virtual Machines on Power KVM, managed by Virsh. mscm is the model for
> the Moonshot Chassis Manager. msftocs is the model for the Microsoft
> OCS Chassis Manager. ucsm is the model for the Cisco UCS Manager.
>
> type model:
>
> unicode
>
> The following are optional for all models:
>
> param accept\_all:
>
>  
>
> If true, all enlisted nodes will be commissioned.
>
> type accept\_all:
>
>  
>
> unicode
>
> The following are required if you are probing seamicro15k:
>
> param mac:
>
> The MAC of the seamicro15k chassis.
>
> type mac:
>
> unicode
>
> param username:
>
> The username for the chassis.
>
> type username:
>
> unicode
>
> param password:
>
> The password for the chassis.
>
> type password:
>
> unicode
>
> The following are optional if you are probing seamicro15k:
>
> param power\_control:
>
>  
>
> The power\_control to use, either ipmi (default) or restapi.
>
> type power\_control:
>
>  
>
> unicode
>
> The following are required if you are probing virsh:
>
> param power\_address:
>
>  
>
> The connection string to virsh.
>
> type power\_address:
>
>  
>
> unicode
>
> The following are optional if you are probing virsh:
>
> param power\_pass:
>
>  
>
> The password to use, when qemu+ssh is given as a connection string and
> ssh key authentication is not being used.
>
> type power\_pass:
>
>  
>
> unicode
>
> param prefix\_filter:
>
>  
>
> Filter nodes with supplied prefix.
>
> type prefix\_filter:
>
>  
>
> unicode
>
> The following are required if you are probing vmware:
>
> param host:
>
> The VMware hostname or IP address
>
> type host:
>
> unicode
>
> param username:
>
> The VMware API username
>
> type username:
>
> unicode
>
> param password:
>
> The VMware API password
>
> type password:
>
> unicode
>
> The following are optional if you are probing vmware:
>
> param protocol:
>
> The VMware API protocol (default: https)
>
> type protocol:
>
> unicode
>
> param port:
>
> The VMware API port (default: 443)
>
> type port:
>
> integer
>
> param prefix\_filter:
>
>  
>
> Filter nodes with supplied prefix.
>
> type prefix\_filter:
>
>  
>
> unicode
>
> The following are required if you are probing mscm:
>
> param host:
>
> IP Address for the Moonshot Chassis Manager.
>
> type host:
>
> unicode
>
> param username:
>
> The username for the Moonshot Chassis Manager.
>
> type username:
>
> unicode
>
> param password:
>
> The password for the Moonshot Chassis Manager.
>
> type password:
>
> unicode
>
> The followeing are required if you are probing msftocs:
>
> param ip:
>
> IP Address for the Microsoft OCS Chassis.
>
> type ip:
>
> unicode
>
> param port:
>
> Port for the Microsoft OCS Chassis.
>
> type port:
>
> unicode
>
> param username:
>
> The username for the Microsoft OCS Chassis.
>
> type username:
>
> unicode
>
> param password:
>
> The password for the Microsoft OCS Chassis.
>
> type password:
>
> unicode
>
> The followeing are required if you are probing a ucsm:
>
> param url:
>
> The URL of the UCS Manager API.
>
> type url:
>
> unicode
>
> param username:
>
> The username for the UCS Manager API.
>
> type username:
>
> unicode
>
> param password:
>
> The password for the UCS Manager API.
>
> type password:
>
> unicode
>
> Returns 404 if the nodegroup (cluster) is not found. Returns 403 if
> the user does not have access to the nodegroup. Returns 400 if the
> required parameters were not passed.

`POST /api/1.0/nodegroups/{uuid}/`{.docutils .literal}
`op=probe_and_enlist_mscm`{.docutils .literal}

> Add the nodes from a Moonshot HP iLO Chassis Manager (MSCM).
>
> **Warning: this API is deprecated in favor of
> probe\_and\_enlist\_hardware.**
>
> param host:
>
> IP Address for the MSCM.
>
> type host:
>
> unicode
>
> param username:
>
> The username for the MSCM.
>
> type username:
>
> unicode
>
> param password:
>
> The password for the MSCM.
>
> type password:
>
> unicode
>
> param accept\_all:
>
>  
>
> If true, all enlisted nodes will be commissioned.
>
> type accept\_all:
>
>  
>
> unicode
>
> Returns 404 if the nodegroup (cluster) is not found. Returns 403 if
> the user does not have access to the nodegroup. Returns 400 if the
> required parameters were not passed.

`POST /api/1.0/nodegroups/{uuid}/`{.docutils .literal}
`op=probe_and_enlist_ucsm`{.docutils .literal}

> Add the nodes from a Cisco UCS Manager.
>
> **Warning: this API is deprecated in favor of
> probe\_and\_enlist\_hardware.**
>
> param url:
>
> The URL of the UCS Manager API.
>
> type url:
>
> unicode
>
> param username:
>
> The username for the API.
>
> type username:
>
> unicode
>
> param password:
>
> The password for the API.
>
> type password:
>
> unicode
>
> param accept\_all:
>
>  
>
> If true, all enlisted nodes will be commissioned.
>
> type accept\_all:
>
>  
>
> unicode
>
> Returns 404 if the nodegroup (cluster) is not found. Returns 403 if
> the user does not have access to the nodegroup. Returns 400 if the
> required parameters were not passed.

`POST /api/1.0/nodegroups/{uuid}/`{.docutils .literal}
`op=report_download_progress`{.docutils .literal}

> Report progress of a download.
>
> Cluster controllers can call this to update the region controller on
> file downloads they need to perform, such as kernels and initrd files.
> This gives the administrator insight into what downloads are in
> progress, how well downloads are going, and what failures may have
> occurred.
>
> A file is identified by an arbitrary name, which must be consistent.
> It could be a URL, or a filesystem path, or even a symbolic name that
> the cluster controller makes up. A cluster controller can download the
> same file many times over, but not simultaneously.
>
> Before downloading a file, a cluster controller first reports progress
> without the bytes\_downloaded parameter. It may optionally report
> progress while downloading, passing the number of bytes downloaded so
> far. Finally, if the download succeeded, it should report one final
> time with the full number of bytes downloaded.
>
> If the download fails, the cluster controller should report progress
> with an error string (and either the number of bytes that were
> successfully downloaded, or zero).
>
> Progress reports should include the file’s size, if known. The final
> report after a successful download must include the size.
>
> param filename:
>
> Arbitrary identifier for the file being downloaded.
>
> type filename:
>
> unicode
>
> param size:
>
> Optional size of the file, in bytes. Must be passed at least once,
> though it can still be passed on subsequent calls. If file size is not
> known, pass it at the end when reporting successful completion. Do not
> change the size once given.
>
> param bytes\_downloaded:
>
>  
>
> Number of bytes that have been successfully downloaded. Cannot exceed
> size, if known. This parameter must be omitted from the initial
> progress report before download starts, and must be included for all
> subsequent progress reports for that download.
>
> type bytes\_downloaded:
>
>  
>
> int
>
> param error:
>
> Optional error string. A download that has submitted an error with its
> last progress report is considered to have failed.
>
> type error:
>
> unicode
>
> Returns 404 if the nodegroup (cluster) is not found. Returns 403 if
> the user does not have access to the nodegroup. Returns 400 if the
> required parameters were not passed.

`PUT /api/1.0/nodegroups/{uuid}/`{.docutils .literal}
:   Update a specific cluster.

    param name:

    The new DNS name for this cluster.

    type name:

    unicode

    param cluster\_name:

     

    The new name for this cluster.

    type cluster\_name:

     

    unicode

    param status:

    The new status for this cluster (see vocabulary NODEGROUP\_STATUS).

    type status:

    int

    Returns 404 if the nodegroup (cluster) is not found.

### Nodegroup interface[¶](#nodegroup-interface "Permalink to this headline")

Manage a NodeGroupInterface.

> A NodeGroupInterface is identified by the uuid for its NodeGroup, and
> the name of the network interface it represents: “eth0” for example.

`DELETE /api/1.0/nodegroups/{uuid}/interfaces/{name}/`{.docutils .literal}
:   Delete a specific NodeGroupInterface.

    Returns 404 if the nodegroup (cluster) is not found. Returns 403 if
    the user does not have permission to access the interface.

`GET /api/1.0/nodegroups/{uuid}/interfaces/{name}/`{.docutils .literal}
:   List of NodeGroupInterfaces of a NodeGroup.

    Returns 404 if the nodegroup (cluster) is not found.

`PUT /api/1.0/nodegroups/{uuid}/interfaces/{name}/`{.docutils .literal}
:   Update a specific NodeGroupInterface.

    param name:

    Identifying name for the cluster interface.

    param ip:

    Static IP of the interface.

    type ip:

    unicode (IP Address)

    param interface:

     

    Network interface.

    type interface:

    unicode

    param management:

     

    The service(s) MAAS should manage on this interface.

    type management:

     

    Vocabulary NODEGROUPINTERFACE\_MANAGEMENT

    param subnet\_mask:

     

    Subnet mask, e.g. 255.0.0.0.

    type subnet\_mask:

     

    unicode (IP Address)

    param broadcast\_ip:

     

    Broadcast address for this subnet.

    type broadcast\_ip:

     

    unicode (IP Address)

    param router\_ip:

     

    Address of default gateway.

    type router\_ip:

    unicode (IP Address)

    param ip\_range\_low:

     

    Lowest dynamic IP address to assign to clients.

    type ip\_range\_low:

     

    unicode (IP Address)

    param ip\_range\_high:

     

    Highest dynamic IP address to assign to clients.

    type ip\_range\_high:

     

    unicode (IP Address)

    param static\_ip\_range\_low:

     

    Lowest static IP address to assign to clients.

    type static\_ip\_range\_low:

     

    unicode (IP Address)

    param static\_ip\_range\_high:

     

    Highest static IP address to assign to clients.

    type static\_ip\_range\_high:

     

    unicode (IP Address)

    Returns 404 if the nodegroup (cluster) is not found. Returns 403 if
    the user does not have permission to access the interface.

### Nodegroup interfaces[¶](#nodegroup-interfaces "Permalink to this headline")

Manage the collection of all the NodeGroupInterfaces in this MAAS.

> A NodeGroupInterface is a network interface attached to a cluster
> controller, with its network properties.

`GET /api/1.0/nodegroups/{uuid}/interfaces/`{.docutils .literal}
`op=list`{.docutils .literal}

> List of NodeGroupInterfaces of a NodeGroup.

`POST /api/1.0/nodegroups/{uuid}/interfaces/`{.docutils .literal}
`op=new`{.docutils .literal}

> Create a new NodeGroupInterface for this NodeGroup.
>
> param name:
>
> Name for the interface. Must be unique within this cluster. Only
> letters, digits, dashes, and colons are allowed.
>
> param ip:
>
> Static IP of the interface.
>
> type ip:
>
> unicode (IP Address)
>
> param interface:
>
>  
>
> Name of the network interface that connects the cluster controller to
> this network.
>
> type interface:
>
> unicode
>
> param management:
>
>  
>
> The service(s) MAAS should manage on this interface.
>
> type management:
>
>  
>
> Vocabulary NODEGROUPINTERFACE\_MANAGEMENT
>
> param subnet\_mask:
>
>  
>
> Subnet mask, e.g. 255.0.0.0.
>
> type subnet\_mask:
>
>  
>
> unicode (IP Address)
>
> param broadcast\_ip:
>
>  
>
> Broadcast address for this subnet.
>
> type broadcast\_ip:
>
>  
>
> unicode (IP Address)
>
> param router\_ip:
>
>  
>
> Address of default gateway.
>
> type router\_ip:
>
> unicode (IP Address)
>
> param ip\_range\_low:
>
>  
>
> Lowest dynamic IP address to assign to clients.
>
> type ip\_range\_low:
>
>  
>
> unicode (IP Address)
>
> param ip\_range\_high:
>
>  
>
> Highest dynamic IP address to assign to clients.
>
> type ip\_range\_high:
>
>  
>
> unicode (IP Address)
>
> param static\_ip\_range\_low:
>
>  
>
> Lowest static IP address to assign to clients.
>
> type static\_ip\_range\_low:
>
>  
>
> unicode (IP Address)
>
> param static\_ip\_range\_high:
>
>  
>
> Highest static IP address to assign to clients.
>
> type static\_ip\_range\_high:
>
>  
>
> unicode (IP Address)
>
> Returns 404 if the node group (cluster) is not found. Returns 403 if
> the user does not have permission to access the interface.

### Nodegroups[¶](#nodegroups "Permalink to this headline")

Manage the collection of all the nodegroups in this MAAS.

`GET /api/1.0/nodegroups/`{.docutils .literal}
`op=describe_power_types`{.docutils .literal}

> Query all the cluster controllers for power information.
>
> return:
>
> a list of dicts that describe the power types in this format.

`GET /api/1.0/nodegroups/`{.docutils .literal} `op=list`{.docutils
.literal}

> List nodegroups.

`POST /api/1.0/nodegroups/`{.docutils .literal} `op=accept`{.docutils
.literal}

> Accept nodegroup enlistment(s).
>
> param uuid:
>
> The UUID (or list of UUIDs) of the nodegroup(s) to accept.
>
> type name:
>
> unicode (or list of unicodes)
>
> This method is reserved to admin users and returns 403 if the user is
> not an admin.
>
> Returns 404 if the nodegroup (cluster) is not found.

`POST /api/1.0/nodegroups/`{.docutils .literal}
`op=import_boot_images`{.docutils .literal}

> Import the boot images on all the accepted cluster controllers.

`POST /api/1.0/nodegroups/`{.docutils .literal} `op=reject`{.docutils
.literal}

> Reject nodegroup enlistment(s).
>
> param uuid:
>
> The UUID (or list of UUIDs) of the nodegroup(s) to reject.
>
> type name:
>
> unicode (or list of unicodes)
>
> This method is reserved to admin users and returns 403 if the user is
> not an admin.
>
> Returns 404 if the nodegroup (cluster) is not found.

### Node[¶](#node "Permalink to this headline")

Manage an individual Node.

> The Node is identified by its system\_id.

`DELETE /api/1.0/nodes/{system_id}/`{.docutils .literal}
:   Delete a specific Node.

    Returns 404 if the node is not found. Returns 403 if the user does
    not have permission to delete the node. Returns 204 if the node is
    successfully deleted.

`GET /api/1.0/nodes/{system_id}/`{.docutils .literal}
:   Read a specific Node.

    Returns 404 if the node is not found.

`GET /api/1.0/nodes/{system_id}/`{.docutils .literal}
`op=details`{.docutils .literal}

> Obtain various system details.
>
> For example, LLDP and `lshw`{.docutils .literal} XML dumps.
>
> Returns a `{detail_type: xml, ...}`{.docutils .literal} map, where
> `detail_type`{.docutils .literal} is something like “lldp” or “lshw”.
>
> Note that this is returned as BSON and not JSON. This is for
> efficiency, but mainly because JSON can’t do binary content without
> applying additional encoding like base-64.
>
> Returns 404 if the node is not found.

`GET /api/1.0/nodes/{system_id}/`{.docutils .literal}
`op=power_parameters`{.docutils .literal}

> Obtain power parameters.
>
> This method is reserved for admin users and returns a 403 if the user
> is not one.
>
> This returns the power parameters, if any, configured for a node. For
> some types of power control this will include private information such
> as passwords and secret keys.
>
> Returns 404 if the node is not found.

`GET /api/1.0/nodes/{system_id}/`{.docutils .literal}
`op=query_power_state`{.docutils .literal}

> Query the power state of a node.
>
> Send a request to the node’s power controller which asks it about the
> node’s state. The reply to this could be delayed by up to 30 seconds
> while waiting for the power controller to respond. Use this method
> sparingly as it ties up an appserver thread while waiting.
>
> param system\_id:
>
>  
>
> The node to query.
>
> return:
>
> a dict whose key is “state” with a value of one of ‘on’ or ‘off’.
>
> Returns 400 if the node is not installable. Returns 404 if the node is
> not found. Returns 503 (with explanatory text) if the power state
> could not be queried.

`POST /api/1.0/nodes/{system_id}/`{.docutils .literal}
`op=abort_operation`{.docutils .literal}

> Abort a node’s current operation.
>
> This currently only supports aborting of the ‘Disk Erasing’ operation.
>
> Returns 404 if the node could not be found. Returns 403 if the user
> does not have permission to abort the current operation.

`POST /api/1.0/nodes/{system_id}/`{.docutils .literal}
`op=claim_sticky_ip_address`{.docutils .literal}

> Assign a “sticky” IP address to a Node’s MAC.
>
> param mac\_address:
>
>  
>
> Optional MAC address on the node on which to assign the sticky IP
> address. If not passed, defaults to the primary MAC for the node.
>
> param requested\_address:
>
>  
>
> Optional IP address to claim. Must be in the range defined on a
> cluster interface to which the context MAC is related, or 403
> Forbidden is returned. If the requested address is unavailable for
> use, 404 Not Found is returned.
>
> A sticky IP is one which stays with the node until the IP is
> disassociated with the node, or the node is deleted. It allows an
> admin to give a node a stable IP, since normally an automatic IP is
> allocated to a node only during the time a user has acquired and
> started a node.
>
> Returns 404 if the node is not found. Returns 409 if the node is in an
> allocated state. Returns 400 if the mac\_address is not found on the
> node. Returns 503 if there are not enough IPs left on the cluster
> interface to which the mac\_address is linked.

`POST /api/1.0/nodes/{system_id}/`{.docutils .literal}
`op=commission`{.docutils .literal}

> Begin commissioning process for a node.
>
> A node in the ‘ready’, ‘declared’ or ‘failed test’ state may initiate
> a commissioning cycle where it is checked out and tested in
> preparation for transitioning to the ‘ready’ state. If it is already
> in the ‘ready’ state this is considered a re-commissioning process
> which is useful if commissioning tests were changed after it
> previously commissioned.
>
> Returns 404 if the node is not found.

`POST /api/1.0/nodes/{system_id}/`{.docutils .literal}
`op=mark_broken`{.docutils .literal}

> Mark a node as ‘broken’.
>
> If the node is allocated, release it first.
>
> param error\_description:
>
>  
>
> An optional description of the reason the node is being marked broken.
>
> type error\_description:
>
>  
>
> unicode
>
> Returns 404 if the node is not found. Returns 403 if the user does not
> have permission to mark the node broken.

`POST /api/1.0/nodes/{system_id}/`{.docutils .literal}
`op=mark_fixed`{.docutils .literal}

> Mark a broken node as fixed and set its status as ‘ready’.
>
> Returns 404 if the node is not found. Returns 403 if the user does not
> have permission to mark the node broken.

`POST /api/1.0/nodes/{system_id}/`{.docutils .literal}
`op=release`{.docutils .literal}

> Release a node. Opposite of NodesHandler.acquire.
>
> Returns 404 if the node is not found. Returns 403 if the user does not
> have permission to release the node. Returns 409 if the node is in a
> state where it may not be released.

`POST /api/1.0/nodes/{system_id}/`{.docutils .literal}
`op=release_sticky_ip_address`{.docutils .literal}

> Release a “sticky” IP address from a node’s MAC.
>
> param address:
>
> Optional IP address to release. If left unspecified, will release
> every “sticky” IP address associated with the node.
>
> Returns 400 if the specified addresses could not be deallocated
> Returns 404 if the node is not found. Returns 409 if the node is in an
> allocated state.

`POST /api/1.0/nodes/{system_id}/`{.docutils .literal}
`op=start`{.docutils .literal}

> Power up a node.
>
> param user\_data:
>
>  
>
> If present, this blob of user-data to be made available to the nodes
> through the metadata service.
>
> type user\_data:
>
> base64-encoded unicode
>
> param distro\_series:
>
>  
>
> If present, this parameter specifies the OS release the node will use.
>
> type distro\_series:
>
>  
>
> unicode
>
> Ideally we’d have MIME multipart and content-transfer-encoding etc.
> deal with the encapsulation of binary data, but couldn’t make it work
> with the framework in reasonable time so went for a dumb, manual
> encoding instead.
>
> Returns 404 if the node is not found. Returns 403 if the user does not
> have permission to stop the node. Returns 503 if the start-up
> attempted to allocate an IP address, and there were no IP addresses
> available on the relevant cluster interface.

`POST /api/1.0/nodes/{system_id}/`{.docutils .literal}
`op=stop`{.docutils .literal}

> Shut down a node.
>
> param stop\_mode:
>
>  
>
> An optional power off mode. If ‘soft’, perform a soft power down if
> the node’s power type supports it, otherwise perform a hard power off.
> For all values other than ‘soft’, and by default, perform a hard power
> off. A soft power off generally asks the OS to shutdown the system
> gracefully before powering off, while a hard power off occurs
> immediately without any warning to the OS.
>
> type stop\_mode:
>
> unicode
>
> Returns 404 if the node is not found. Returns 403 if the user does not
> have permission to stop the node.

`PUT /api/1.0/nodes/{system_id}/`{.docutils .literal}
:   Update a specific Node.

    param hostname:

    The new hostname for this node.

    type hostname:

    unicode

    param architecture:

     

    The new architecture for this node.

    type architecture:

     

    unicode

    param power\_type:

     

    The new power type for this node. If you use the default value,
    power\_parameters will be set to the empty string. Available to
    admin users. See the [Power types](#power-types) section for a list
    of the available power types.

    type power\_type:

     

    unicode

    param power\_parameters\_{param1}:

     

    The new value for the ‘param1’ power parameter. Note that this is
    dynamic as the available parameters depend on the selected value of
    the Node’s power\_type. For instance, if the power\_type is
    ‘ether\_wake’, the only valid parameter is ‘power\_address’ so one
    would want to pass ‘myaddress’ as the value of the
    ‘power\_parameters\_power\_address’ parameter. Available to admin
    users. See the [Power types](#power-types) section for a list of the
    available power parameters for each power type.

    type power\_parameters\_{param1}:

     

    unicode

    param power\_parameters\_skip\_check:

     

    Whether or not the new power parameters for this node should be
    checked against the expected power parameters for the node’s power
    type (‘true’ or ‘false’). The default is ‘false’.

    type power\_parameters\_skip\_check:

     

    unicode

    param zone:

    Name of a valid physical zone in which to place this node

    type zone:

    unicode

    param swap\_size:

     

    Specifies the size of the swap file, in bytes. Field accept K, M, G
    and T suffixes for values expressed respectively in kilobytes,
    megabytes, gigabytes and terabytes.

    type swap\_size:

    unicode

    param boot\_type:

     

    The installation type of the node. ‘fastpath’: use the default
    installer. ‘di’ use the debian installer. Note that using ‘di’ is
    now deprecated and will be removed in favor of the default installer
    in MAAS 1.9.

    type boot\_type:

    unicode

    Returns 404 if the node is node found. Returns 403 if the user does
    not have permission to update the node.

### Node MAC address[¶](#node-mac-address "Permalink to this headline")

Manage a Node MAC address.

> The MAC address object is identified by the system\_id for the Node it
> is attached to, plus the MAC address itself.

`DELETE /api/1.0/nodes/{system_id}/macs/{mac_address}/`{.docutils .literal}
:   Delete a specific MAC address for the specified Node.

    Returns 404 if the node or the MAC address is not found. Returns 204
    after the MAC address is successfully deleted.

`GET /api/1.0/nodes/{system_id}/macs/{mac_address}/`{.docutils .literal}
:   Read a MAC address related to a Node.

    Returns 404 if the node or the MAC address is not found.

### Node MAC addresses[¶](#node-mac-addresses "Permalink to this headline")

Manage MAC addresses for a given Node.

> This is where you manage the MAC addresses linked to a Node, including
> associating a new MAC address with the Node.
>
> The Node is identified by its system\_id.

`GET /api/1.0/nodes/{system_id}/macs/`{.docutils .literal}
:   Read all MAC addresses related to a Node.

    Returns 404 if the node is not found.

`POST /api/1.0/nodes/{system_id}/macs/`{.docutils .literal}
:   Create a MAC address for a specified Node.

    Returns 404 if the node is not found.

### Commissioning results[¶](#commissioning-results "Permalink to this headline")

Read the collection of NodeResult in the MAAS.

`GET /api/1.0/installation-results/`{.docutils .literal}
`op=list`{.docutils .literal}

> List NodeResult visible to the user, optionally filtered.
>
> param system\_id:
>
>  
>
> An optional list of system ids. Only the results related to the nodes
> with these system ids will be returned.
>
> type system\_id:
>
> iterable
>
> param name:
>
> An optional list of names. Only the results with the specified names
> will be returned.
>
> type name:
>
> iterable
>
> param result\_type:
>
>  
>
> An optional result\_type. Only the results with the specified
> result\_type will be returned.
>
> type name:
>
> iterable

### Nodes[¶](#nodes "Permalink to this headline")

Manage the collection of all the nodes in the MAAS.

`GET /api/1.0/nodes/`{.docutils .literal}
`op=deployment_status`{.docutils .literal}

> Retrieve deployment status for multiple nodes.
>
> param nodes:
>
> Mandatory list of system IDs for nodes whose status you wish to check.
>
> Returns 400 if mandatory parameters are missing. Returns 403 if the
> user has no permission to view any of the nodes.

`GET /api/1.0/nodes/`{.docutils .literal} `op=list`{.docutils .literal}

> List all nodes.

`GET /api/1.0/nodes/`{.docutils .literal} `op=list_allocated`{.docutils
.literal}

> Fetch Nodes that were allocated to the User/oauth token.

`GET /api/1.0/nodes/`{.docutils .literal}
`op=power_parameters`{.docutils .literal}

> Retrieve power parameters for multiple nodes.
>
> param id:
>
> An optional list of system ids. Only nodes with matching system ids
> will be returned.
>
> type id:
>
> iterable
>
> return:
>
> A dictionary of power parameters, keyed by node system\_id.
>
> Raises 403 if the user is not an admin.

`POST /api/1.0/nodes/`{.docutils .literal} `op=accept`{.docutils
.literal}

> Accept declared nodes into the MAAS.
>
> Nodes can be enlisted in the MAAS anonymously or by non-admin users,
> as opposed to by an admin. These nodes are held in the New state; a
> MAAS admin must first verify the authenticity of these enlistments,
> and accept them.
>
> Enlistments can be accepted en masse, by passing multiple nodes to
> this call. Accepting an already accepted node is not an error, but
> accepting one that is already allocated, broken, etc. is.
>
> param nodes:
>
> system\_ids of the nodes whose enlistment is to be accepted. (An empty
> list is acceptable).
>
> return:
>
> The system\_ids of any nodes that have their status changed by this
> call. Thus, nodes that were already accepted are excluded from the
> result.
>
> Returns 400 if any of the nodes do not exist. Returns 403 if the user
> is not an admin.

`POST /api/1.0/nodes/`{.docutils .literal} `op=accept_all`{.docutils
.literal}

> Accept all declared nodes into the MAAS.
>
> Nodes can be enlisted in the MAAS anonymously or by non-admin users,
> as opposed to by an admin. These nodes are held in the New state; a
> MAAS admin must first verify the authenticity of these enlistments,
> and accept them.
>
> return:
>
> Representations of any nodes that have their status changed by this
> call. Thus, nodes that were already accepted are excluded from the
> result.

`POST /api/1.0/nodes/`{.docutils .literal} `op=acquire`{.docutils
.literal}

> Acquire an available node for deployment.
>
> Constraints parameters can be used to acquire a node that possesses
> certain characteristics. All the constraints are optional and when
> multiple constraints are provided, they are combined using ‘AND’
> semantics.
>
> param name:
>
> Hostname of the returned node.
>
> type name:
>
> unicode
>
> param arch:
>
> Architecture of the returned node (e.g. ‘i386/generic’, ‘amd64’,
> ‘armhf/highbank’, etc.).
>
> type arch:
>
> unicode
>
> param cpu\_count:
>
>  
>
> The minium number of CPUs the returned node must have.
>
> type cpu\_count:
>
> int
>
> param mem:
>
> The minimum amount of memory (expressed in MB) the returned node must
> have.
>
> type mem:
>
> float
>
> param tags:
>
> List of tags the returned node must have.
>
> type tags:
>
> list of unicodes
>
> param not\_tags:
>
> List of tags the acquired node must not have.
>
> type tags:
>
> List of unicodes.
>
> param connected\_to:
>
>  
>
> List of routers’ MAC addresses the returned node must be connected to.
>
> type connected\_to:
>
>  
>
> unicode or list of unicodes
>
> param networks:
>
> List of networks (defined in MAAS) to which the node must be attached.
> A network can be identified by the name assigned to it in MAAS; or by
> an ip: prefix followed by any IP address that falls within the
> network; or a vlan: prefix followed by a numeric VLAN tag, e.g.
> vlan:23 for VLAN number 23. Valid VLAN tags must be in the range of 1
> to 4095 inclusive.
>
> type networks:
>
> list of unicodes
>
> param not\_networks:
>
>  
>
> List of networks (defined in MAAS) to which the node must not be
> attached. The returned noded won’t be attached to any of the specified
> networks. A network can be identified by the name assigned to it in
> MAAS; or by an ip: prefix followed by any IP address that falls within
> the network; or a vlan: prefix followed by a numeric VLAN tag, e.g.
> vlan:23 for VLAN number 23. Valid VLAN tags must be in the range of 1
> to 4095 inclusive.
>
> type not\_networks:
>
>  
>
> list of unicodes
>
> param not\_connected\_to:
>
>  
>
> List of routers’ MAC Addresses the returned node must not be connected
> to.
>
> type connected\_to:
>
>  
>
> list of unicodes
>
> param zone:
>
> An optional name for a physical zone the acquired node should be
> located in.
>
> type zone:
>
> unicode
>
> type not\_in\_zone:
>
>  
>
> Optional list of physical zones from which the node should not be
> acquired.
>
> type not\_in\_zone:
>
>  
>
> List of unicodes.
>
> param agent\_name:
>
>  
>
> An optional agent name to attach to the acquired node.
>
> type agent\_name:
>
>  
>
> unicode
>
> Returns 409 if a suitable node matching the constraints could not be
> found.

`POST /api/1.0/nodes/`{.docutils .literal}
`op=check_commissioning`{.docutils .literal}

> Check all commissioning nodes to see if they are taking too long.
>
> Anything that has been commissioning for longer than
> settings.COMMISSIONING\_TIMEOUT is moved into the
> FAILED\_COMMISSIONING status.

`POST /api/1.0/nodes/`{.docutils .literal} `op=new`{.docutils .literal}

> Create a new Node.
>
> Adding a server to a MAAS puts it on a path that will wipe its disks
> and re-install its operating system, in the event that it PXE boots.
> In anonymous enlistment (and when the enlistment is done by a
> non-admin), the node is held in the “New” state for approval by a MAAS
> admin.
>
> The minimum data required is: architecture=\<arch string\> (e.g.
> “i386/generic”) mac\_addresses=\<value\> (e.g. “aa:bb:cc:dd:ee:ff”)
> autodetect\_nodegroup=True
>
> param architecture:
>
>  
>
> A string containing the architecture type of the node. (For example,
> “i386”, or “amd64”.) To determine the supported architectures, use the
> boot-resources endpoint.
>
> param subarchitecture:
>
>  
>
> A string containing the subarchitecture type of the node. (For
> example, “generic” or “hwe-t”.) To determine the supported
> subarchitectures, use the boot-resources endpoint.
>
> param mac\_addresses:
>
>  
>
> One or more MAC addresses for the node. To specify more than one MAC
> address, the parameter must be specified twice. (such as “nodes new
> mac\_addresses=01:02:03:04:05:06 mac\_addresses=02:03:04:05:06:07”)
>
> param hostname:
>
> A hostname. If not given, one will be generated.
>
> param power\_type:
>
>  
>
> A power management type, if applicable (e.g. “virsh”, “ipmi”).
>
> param autodetect\_nodegroup:
>
>  
>
> (boolean) Whether or not to attempt nodegroup detection for this node.
> The nodegroup is determined based on the requestor’s IP address range.
> (if the API request comes from an IP range within a known nodegroup,
> that nodegroup will be used.)
>
> param nodegroup:
>
>  
>
> The id of the nodegroup this node belongs to.

`POST /api/1.0/nodes/`{.docutils .literal} `op=release`{.docutils
.literal}

> Release multiple nodes.
>
> This places the nodes back into the pool, ready to be reallocated.
>
> param nodes:
>
> system\_ids of the nodes which are to be released. (An empty list is
> acceptable).
>
> return:
>
> The system\_ids of any nodes that have their status changed by this
> call. Thus, nodes that were already released are excluded from the
> result.
>
> Returns 400 if any of the nodes cannot be found. Returns 403 if the
> user does not have permission to release any of the nodes. Returns a
> 409 if any of the nodes could not be released due to their current
> state.

`POST /api/1.0/nodes/`{.docutils .literal} `op=set_zone`{.docutils
.literal}

> Assign multiple nodes to a physical zone at once.
>
> param zone:
>
> Zone name. If omitted, the zone is “none” and the nodes will be taken
> out of their physical zones.
>
> param nodes:
>
> system\_ids of the nodes whose zones are to be set. (An empty list is
> acceptable).
>
> Raises 403 if the user is not an admin.

### SSH Key[¶](#ssh-key "Permalink to this headline")

Manage an SSH key.

> SSH keys can be retrieved or deleted.

`DELETE /api/1.0/account/prefs/sshkeys/{keyid}/`{.docutils .literal}
:   DELETE an SSH key.

    Returns 404 if the key does not exist. Returns 401 if the key does
    not belong to the calling user.

`GET /api/1.0/account/prefs/sshkeys/{keyid}/`{.docutils .literal}
:   GET an SSH key.

    Returns 404 if the key does not exist.

`POST /api/1.0/account/prefs/sshkeys/{keyid}/`{.docutils .literal}
`op=delete`{.docutils .literal}

> DELETE an SSH key.
>
> Returns 404 if the key does not exist. Returns 401 if the key does not
> belong to the calling user.

### SSH Keys[¶](#ssh-keys "Permalink to this headline")

Manage the collection of all the SSH keys in this MAAS.

`GET /api/1.0/account/prefs/sshkeys/`{.docutils .literal}
`op=list`{.docutils .literal}

> List all keys belonging to the requesting user.

`POST /api/1.0/account/prefs/sshkeys/`{.docutils .literal}
`op=new`{.docutils .literal}

> Add a new SSH key to the requesting user’s account.
>
> The request payload should contain the public SSH key data in form
> data whose name is “key”.

### SSL Key[¶](#ssl-key "Permalink to this headline")

Manage an SSL key.

> SSL keys can be retrieved or deleted.

`DELETE /api/1.0/account/prefs/sslkeys/{keyid}/`{.docutils .literal}
:   DELETE an SSL key.

    Returns 401 if the key does not belong to the requesting user.
    Returns 204 if the key is successfully deleted.

`GET /api/1.0/account/prefs/sslkeys/{keyid}/`{.docutils .literal}
:   GET an SSL key.

    Returns 404 if the keyid is not found. Returns 401 if the key does
    not belong to the requesting user.

`GET /api/1.0/account/prefs/sslkeys/{keyid}/`{.docutils .literal}
`op=delete`{.docutils .literal}

> DELETE an SSL key.
>
> Returns 401 if the key does not belong to the requesting user. Returns
> 204 if the key is successfully deleted.

### SSL Keys[¶](#ssl-keys "Permalink to this headline")

Operations on multiple keys.

`GET /api/1.0/account/prefs/sslkeys/`{.docutils .literal}
`op=list`{.docutils .literal}

> List all keys belonging to the requesting user.

`POST /api/1.0/account/prefs/sslkeys/`{.docutils .literal}
`op=new`{.docutils .literal}

> Add a new SSL key to the requesting user’s account.
>
> The request payload should contain the SSL key data in form data whose
> name is “key”.

### Tag[¶](#tag "Permalink to this headline")

Manage a Tag.

> Tags are properties that can be associated with a Node and serve as
> criteria for selecting and allocating nodes.
>
> A Tag is identified by its name.

`DELETE /api/1.0/tags/{name}/`{.docutils .literal}
:   Delete a specific Tag.

    Returns 404 if the tag is not found. Returns 204 if the tag is
    successfully deleted.

`GET /api/1.0/tags/{name}/`{.docutils .literal}
:   Read a specific Tag.

    Returns 404 if the tag is not found.

`GET /api/1.0/tags/{name}/`{.docutils .literal} `op=nodes`{.docutils
.literal}

> Get the list of nodes that have this tag.
>
> Returns 404 if the tag is not found.

`POST /api/1.0/tags/{name}/`{.docutils .literal} `op=rebuild`{.docutils
.literal}

> Manually trigger a rebuild the tag \<=\> node mapping.
>
> This is considered a maintenance operation, which should normally not
> be necessary. Adding nodes or updating a tag’s definition should
> automatically trigger the appropriate changes.
>
> Returns 404 if the tag is not found.

`POST /api/1.0/tags/{name}/`{.docutils .literal}
`op=update_nodes`{.docutils .literal}

> Add or remove nodes being associated with this tag.
>
> param add:
>
> system\_ids of nodes to add to this tag.
>
> param remove:
>
> system\_ids of nodes to remove from this tag.
>
> param definition:
>
>  
>
> (optional) If supplied, the definition will be validated against the
> current definition of the tag. If the value does not match, then the
> update will be dropped (assuming this was just a case of a worker
> being out-of-date)
>
> param nodegroup:
>
>  
>
> A uuid of a nodegroup being processed. This value is optional. If not
> supplied, the requester must be a superuser. If supplied, then the
> requester must be the worker associated with that nodegroup, and only
> nodes that are part of that nodegroup can be updated.
>
> Returns 404 if the tag is not found. Returns 401 if the user does not
> have permission to update the nodes. Returns 409 if ‘definition’
> doesn’t match the current definition.

`PUT /api/1.0/tags/{name}/`{.docutils .literal}
:   Update a specific Tag.

    param name:

    The name of the Tag to be created. This should be a short name, and
    will be used in the URL of the tag.

    param comment:

    A long form description of what the tag is meant for. It is meant as
    a human readable description of the tag.

    param definition:

     

    An XPATH query that will be evaluated against the hardware\_details
    stored for all nodes (output of lshw -xml).

    Returns 404 if the tag is not found.

### Tags[¶](#tags "Permalink to this headline")

Manage the collection of all the Tags in this MAAS.

`GET /api/1.0/tags/`{.docutils .literal} `op=list`{.docutils .literal}

> List Tags.
>
> Get a listing of all tags that are currently defined.

`POST /api/1.0/tags/`{.docutils .literal} `op=new`{.docutils .literal}

> Create a new Tag.
>
> param name:
>
> The name of the Tag to be created. This should be a short name, and
> will be used in the URL of the tag.
>
> param comment:
>
> A long form description of what the tag is meant for. It is meant as a
> human readable description of the tag.
>
> param definition:
>
>  
>
> An XPATH query that will be evaluated against the hardware\_details
> stored for all nodes (output of lshw -xml).
>
> param kernel\_opts:
>
>  
>
> Can be None. If set, nodes associated with this tag will add this
> string to their kernel options when booting. The value overrides the
> global ‘kernel\_opts’ setting. If more than one tag is associated with
> a node, the one with the lowest alphabetical name will be picked (eg
> 01-my-tag will be taken over 99-tag-name).
>
> Returns 401 if the user is not an admin.

### Users[¶](#users "Permalink to this headline")

Manage the user accounts of this MAAS.

`GET /api/1.0/users/`{.docutils .literal}
:   List users.
`POST /api/1.0/users/`{.docutils .literal}
:   Create a MAAS user account.

    This is not safe: the password is sent in plaintext. Avoid it for
    production, unless you are confident that you can prevent
    eavesdroppers from observing the request.

    param username:

    Identifier-style username for the new user.

    type username:

    unicode

    param email:

    Email address for the new user.

    type email:

    unicode

    param password:

    Password for the new user.

    type password:

    unicode

    param is\_superuser:

     

    Whether the new user is to be an administrator.

    type is\_superuser:

     

    bool (‘0’ for False, ‘1’ for True)

    Returns 400 if any mandatory parameters are missing.

### Zone[¶](#zone "Permalink to this headline")

Manage a physical zone.

> Any node is in a physical zone, or “zone” for short. The meaning of a
> physical zone is up to you: it could identify e.g. a server rack, a
> network, or a data centre. Users can then allocate nodes from specific
> physical zones, to suit their redundancy or performance requirements.
>
> This functionality is only available to administrators. Other users
> can view physical zones, but not modify them.

`DELETE /api/1.0/zones/{name}/`{.docutils .literal}
:   DELETE request. Delete zone.

    Returns 404 if the zone is not found. Returns 204 if the zone is
    successfully deleted.

`GET /api/1.0/zones/{name}/`{.docutils .literal}
:   GET request. Return zone.

    Returns 404 if the zone is not found.

`PUT /api/1.0/zones/{name}/`{.docutils .literal}
:   PUT request. Update zone.

    Returns 404 if the zone is not found.

### Zones[¶](#zones "Permalink to this headline")

Manage physical zones.

`GET /api/1.0/zones/`{.docutils .literal}
:   List zones.

    Get a listing of all the physical zones.

`POST /api/1.0/zones/`{.docutils .literal}
:   Create a new physical zone.

    param name:

    Identifier-style name for the new zone.

    type name:

    unicode

    param description:

     

    Free-form description of the new zone.

    type description:

     

    unicode

Power types[¶](#power-types "Permalink to this headline")
---------------------------------------------------------

This is the list of the supported power types and their associated power
parameters. Note that the list of usable power types for a particular
cluster might be a subset of this list if the cluster in question is
from an older version of MAAS.

### ether\_wake (Wake-on-LAN)[¶](#ether-wake-wake-on-lan "Permalink to this headline")

Power parameters:

-   mac\_address (MAC Address).

### virsh (Virsh (virtual systems))[¶](#virsh-virsh-virtual-systems "Permalink to this headline")

Power parameters:

-   power\_address (Power address).
-   power\_id (Power ID).
-   power\_pass (Power password (optional)).

### vmware (VMWare)[¶](#vmware-vmware "Permalink to this headline")

Power parameters:

-   power\_vm\_name (VM Name (if UUID unknown)).
-   power\_uuid (VM UUID (if known)).
-   power\_address (VMware hostname).
-   power\_user (VMware username).
-   power\_pass (VMware password).
-   power\_port (VMware API port (optional)).
-   power\_protocol (VMware API protocol (optional)).

### fence\_cdu (Sentry Switch CDU)[¶](#fence-cdu-sentry-switch-cdu "Permalink to this headline")

Power parameters:

-   power\_address (Power address).
-   power\_id (Power ID).
-   power\_user (Power user).
-   power\_pass (Power password).

### ipmi (IPMI)[¶](#ipmi-ipmi "Permalink to this headline")

Power parameters:

-   power\_driver (Power driver). Choices: ‘LAN’ (LAN [IPMI 1.5]),
    ‘LAN\_2\_0’ (LAN\_2\_0 [IPMI 2.0]) Default: ‘LAN\_2\_0’.
-   power\_address (IP address).
-   power\_user (Power user).
-   power\_pass (Power password).
-   mac\_address (Power MAC).

### moonshot (HP Moonshot - iLO4 (IPMI))[¶](#moonshot-hp-moonshot-ilo4-ipmi "Permalink to this headline")

Power parameters:

-   power\_address (Power address).
-   power\_user (Power user).
-   power\_pass (Power password).
-   power\_hwaddress (Power hardware address).

### sm15k (SeaMicro 15000)[¶](#sm15k-seamicro-15000 "Permalink to this headline")

Power parameters:

-   system\_id (System ID).
-   power\_address (Power address).
-   power\_user (Power user).
-   power\_pass (Power password).
-   power\_control (Power control type). Choices: ‘ipmi’ (IPMI),
    ‘restapi’ (REST API v0.9), ‘restapi2’ (REST API v2.0) Default:
    ‘ipmi’.

### amt (Intel AMT)[¶](#amt-intel-amt "Permalink to this headline")

Power parameters:

-   mac\_address (MAC Address).
-   power\_pass (Power password).
-   power\_address (Power address).

### dli (Digital Loggers, Inc. PDU)[¶](#dli-digital-loggers-inc-pdu "Permalink to this headline")

Power parameters:

-   system\_id (Outlet ID).
-   power\_address (Power address).
-   power\_user (Power user).
-   power\_pass (Power password).

### ucsm (Cisco UCS Manager)[¶](#ucsm-cisco-ucs-manager "Permalink to this headline")

Power parameters:

-   uuid (Server UUID).
-   power\_address (URL for XML API).
-   power\_user (API user).
-   power\_pass (API password).

### mscm (HP Moonshot - iLO Chassis Manager)[¶](#mscm-hp-moonshot-ilo-chassis-manager "Permalink to this headline")

Power parameters:

-   power\_address (IP for MSCM CLI API).
-   power\_user (MSCM CLI API user).
-   power\_pass (MSCM CLI API password).
-   node\_id (Node ID - Must adhere to cXnY format (X=cartridge number,
    Y=node number).).

### msftocs (Microsoft OCS - Chassis Manager)[¶](#msftocs-microsoft-ocs-chassis-manager "Permalink to this headline")

Power parameters:

-   power\_address (Power address).
-   power\_port (Power port).
-   power\_user (Power user).
-   power\_pass (Power password).
-   blade\_id (Blade ID (Typically 1-24)).

### apc (American Power Conversion (APC) PDU)[¶](#apc-american-power-conversion-apc-pdu "Permalink to this headline")

Power parameters:

-   power\_address (IP for APC PDU).
-   node\_outlet (APC PDU node outlet number (1-16)).
-   power\_on\_delay (Power ON outlet delay (seconds)). Default: ‘5’.

[![MAAS
logo](_static/maas-logo-200.png)](index.html "MAAS Documentation Homepage")

MAAS {style="text-align:center;"}
----

Metal As A Service.

\
 \

-   [MAAS API](#)
    -   [API versions](#api-versions)
    -   [HTTP methods and
        parameter-passing](#http-methods-and-parameter-passing)
    -   [Operations](#operations)
        -   [Logged-in user](#logged-in-user)
        -   [Boot images](#boot-images)
        -   [Boot resource](#boot-resource)
        -   [Boot resources](#boot-resources)
        -   [Boot source](#boot-source)
        -   [Boot source selection](#boot-source-selection)
        -   [Boot source selections](#boot-source-selections)
        -   [Boot sources](#boot-sources)
        -   [Commissioning script](#commissioning-script)
        -   [Commissioning scripts](#commissioning-scripts)
        -   [Device](#device)
        -   [Devices](#devices)
        -   [Events](#events)
        -   [File](#file)
        -   [Files](#files)
        -   [IP Addresses](#ip-addresses)
        -   [License Key](#license-key)
        -   [License Keys](#license-keys)
        -   [MAAS server](#maas-server)
        -   [Network](#network)
        -   [Networks](#networks)
        -   [Nodegroup](#nodegroup)
        -   [Nodegroup interface](#nodegroup-interface)
        -   [Nodegroup interfaces](#nodegroup-interfaces)
        -   [Nodegroups](#nodegroups)
        -   [Node](#node)
        -   [Node MAC address](#node-mac-address)
        -   [Node MAC addresses](#node-mac-addresses)
        -   [Commissioning results](#commissioning-results)
        -   [Nodes](#nodes)
        -   [SSH Key](#ssh-key)
        -   [SSH Keys](#ssh-keys)
        -   [SSL Key](#ssl-key)
        -   [SSL Keys](#ssl-keys)
        -   [Tag](#tag)
        -   [Tags](#tags)
        -   [Users](#users)
        -   [Zone](#zone)
        -   [Zones](#zones)
    -   [Power types](#power-types)
        -   [ether\_wake (Wake-on-LAN)](#ether-wake-wake-on-lan)
        -   [virsh (Virsh (virtual
            systems))](#virsh-virsh-virtual-systems)
        -   [vmware (VMWare)](#vmware-vmware)
        -   [fence\_cdu (Sentry Switch
            CDU)](#fence-cdu-sentry-switch-cdu)
        -   [ipmi (IPMI)](#ipmi-ipmi)
        -   [moonshot (HP Moonshot - iLO4
            (IPMI))](#moonshot-hp-moonshot-ilo4-ipmi)
        -   [sm15k (SeaMicro 15000)](#sm15k-seamicro-15000)
        -   [amt (Intel AMT)](#amt-intel-amt)
        -   [dli (Digital Loggers, Inc.
            PDU)](#dli-digital-loggers-inc-pdu)
        -   [ucsm (Cisco UCS Manager)](#ucsm-cisco-ucs-manager)
        -   [mscm (HP Moonshot - iLO Chassis
            Manager)](#mscm-hp-moonshot-ilo-chassis-manager)
        -   [msftocs (Microsoft OCS - Chassis
            Manager)](#msftocs-microsoft-ocs-chassis-manager)
        -   [apc (American Power Conversion (APC)
            PDU)](#apc-american-power-conversion-apc-pdu)

### Related Topics

-   [Documentation overview](index.html)
    -   Previous: [Physical
        Zones](physical-zones.html "previous chapter")
    -   Next: [API
        authentication](api_authentication.html "next chapter")

### This Page

-   [Show Source](_sources/api.txt)

### Quick search

Enter search terms or a module, class or function name.

### Navigation

-   [next](api_authentication.html "API authentication")
-   [previous](physical-zones.html "Physical Zones") |
-   [MAAS 1.8 documentation](index.html) »

© Copyright 2012-2015, MAAS Developers. Ubuntu and Canonical are
registered trademarks of [Canonical Ltd](http://canonical.com).

Revision 4036 (2015-08-05 16:30:57 +0000). Documentation generation
date: 2015-08-12 22:30:33 +0100.
