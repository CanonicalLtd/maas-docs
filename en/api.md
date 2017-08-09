Title: MAAS API
table_of_contents: True

# MAAS API

Restful MAAS API.

This is the documentation for the API that lets you control and query MAAS.
The API is "Restful", which means that you access it through normal HTTP
requests.

## API versions

At any given time, MAAS may support multiple versions of its API. The version
number is included in the API's URL, e.g. /api/1.0/

## HTTP methods and parameter-passing

The following HTTP methods are available for accessing the API:
- GET (for information retrieval and queries),
- POST (for asking the system to do things),
- PUT (for updating objects), and
- DELETE (for deleting objects).

All methods except DELETE may take parameters, but they are not all passed in
the same way. GET parameters are passed in the URL, as is normal with a GET:

```bash
"/item/?foo=bar" passes parameter "foo" with value "bar".
```

POST and PUT are different. Your request should have MIME type
"multipart/form-data"; each part represents one parameter (for POST) or
attribute (for PUT). Each part is named after the parameter or attribute it
contains, and its contents are the conveyed value.

All parameters are in text form. If you need to submit binary data to the API,
don't send it as any MIME binary format; instead, send it as a plain text part
containing base64-encoded data.

Most resources offer a choice of GET or POST operations. In those cases these
methods will take one special parameter, called op, to indicate what it is you
want to do.

For example, to list all nodes, you might GET "/api/1.0/nodes/?op=list".

## Operations

### Logged-in user

Manage the current logged-in user.

#### `POST /api/1.0/account/` `op=create_authorisation_token`

Create an authorisation OAuth token and OAuth consumer.

return: a json dict with three keys: 'token_key', 'token_secret' and
        'consumer_key' (e.g. {token_key: 's65244576fgqs', token_secret:
     'qsdfdhv34', consumer_key: '68543fhj854fg'}).

rtype   string (json)


#### `POST /api/1.0/account/` `op=delete_authorisation_token`

Delete an authorisation OAuth token and the related OAuth consumer.

- `param token_key`
   The key of the token to be deleted.

- `type token_key`
   unicode

### Bcache Cache Set

Manage bcache cache set on a node.

#### `DELETE /api/1.0/nodes/{system_id}/bcache-cache-set/{cache_set_id}/`
   Delete cache set on node.

    Returns 400 if the cache set is in use. Returns 404 if the node or cache
    set is not found. Returns 409 if the node is not Ready.

#### `GET /api/1.0/nodes/{system_id}/bcache-cache-set/{cache_set_id}/`
   Read bcache cache set on node.

    Returns 404 if the node or cache set is not found.

#### `PUT /api/1.0/nodes/{system_id}/bcache-cache-set/{cache_set_id}/`
   Delete bcache on node.

- `param cache_device`
       Cache block device to replace current one.

- `param cache_partition`
       Cache partition to replace current one.

    Specifying both a cache_device and a cache_partition is not allowed.

    Returns 404 if the node or the cache set is not found. Returns 409 if the
    node is not Ready.

### Bcache Cache Sets

Manage bcache cache sets on a node.

#### `GET /api/1.0/nodes/{system_id}/bcache-cache-sets/`
   List all bcache cache sets belonging to node.

    Returns 404 if the node is not found.

#### `POST /api/1.0/nodes/{system_id}/bcache-cache-sets/`
   Creates a Bcache Cache Set.

- `param cache_device`
       Cache block device.

- `param cache_partition`
       Cache partition.

    Specifying both a cache_device and a cache_partition is not allowed.

    Returns 404 if the node is not found. Returns 409 if the node is not
    Ready.

### Bcache Device

Manage bcache device on a node.

#### `DELETE /api/1.0/nodes/{system_id}/bcache/{bcache_id}/`
   Delete bcache on node.

    Returns 404 if the node or bcache is not found. Returns 409 if the node is
    not Ready.

#### `GET /api/1.0/nodes/{system_id}/bcache/{bcache_id}/`
   Read bcache device on node.

    Returns 404 if the node or bcache is not found.

#### `PUT /api/1.0/nodes/{system_id}/bcache/{bcache_id}/`
   Delete bcache on node.

- `param name`
       Name of the Bcache.

- `param uuid`
       UUID of the Bcache.

- `param cache_set`
       Cache set to replace current one.

- `param backing_device`
       Backing block device to replace current one.

- `param backing_partition`
       Backing partition to replace current one.

- `param cache_mode`
       Cache mode (writeback, writethrough, writearound).

    Specifying both a device and a partition for a given role (cache or
    backing) is not allowed.

    Returns 404 if the node or the bcache is not found. Returns 409 if the
    node is not Ready.

### Bcache Devices

Manage bcache devices on a node.

#### `GET /api/1.0/nodes/{system_id}/bcaches/`
   List all bcache devices belonging to node.

    Returns 404 if the node is not found.

#### `POST /api/1.0/nodes/{system_id}/bcaches/`
   Creates a Bcache.

- `param name`
       Name of the Bcache.

- `param uuid`
       UUID of the Bcache.

- `param cache_set`
       Cache set.

- `param backing_device`
       Backing block device.

- `param backing_partition`
       Backing partition.

- `param cache_mode`
       Cache mode (WRITEBACK, WRITETHROUGH, WRITEAROUND).

    Specifying both a device and a partition for a given role (cache or
    backing) is not allowed.

    Returns 404 if the node is not found. Returns 409 if the node is not
    Ready.

### Block device

Manage a block device on a node.

#### `DELETE /api/1.0/nodes/{system_id}/blockdevices/{device_id}/`
   Delete block device on node.

    Returns 404 if the node or block device is not found. Returns 403 if the
    user is not allowed to delete the block device. Returns 409 if the node is
    not Ready.

#### `GET /api/1.0/nodes/{system_id}/blockdevices/{device_id}/`
   Read block device on node.

    Returns 404 if the node or block device is not found.

#### `GET /api/1.0/nodes/{system_id}/blockdevices/{device_id}/` `op=add_tag`

Add a tag to block device on node.

- `param tag`
   The tag being added.

Returns 404 if the node or block device is not found. Returns 403 if the
user is not allowed to update the block device. Returns 409 if the node is
not Ready.

#### `GET /api/1.0/nodes/{system_id}/blockdevices/{device_id}/` `op=remove_tag`

Remove a tag from block device on node.

- `param tag`
   The tag being removed.

Returns 404 if the node or block device is not found. Returns 403 if the
user is not allowed to update the block device. Returns 409 if the node is
not Ready.

#### `POST /api/1.0/nodes/{system_id}/blockdevices/{device_id}/` `op=format`

Format block device with filesystem.

- `param fstype`
- `Type of` filesystem.

- `param uuid`
   UUID of the filesystem.

Returns 403 when the user doesn't have the ability to format the block
device. Returns 404 if the node or block device is not found. Returns 409 if
the node is not Ready or Allocated.

#### `POST /api/1.0/nodes/{system_id}/blockdevices/{device_id}/` `op=mount`

Mount the filesystem on block device.

- `param mount_point`
   Path on the filesystem to mount.

Returns 403 when the user doesn't have the ability to mount the block
device. Returns 404 if the node or block device is not found. Returns 409 if
the node is not Ready or Allocated.

#### `POST /api/1.0/nodes/{system_id}/blockdevices/{device_id}/` `op=set_boot_disk`

Set this block device as the boot disk for the node.

Returns 400 if the block device is a virtual block device. Returns 404 if
the node or block device is not found. Returns 403 if the user is not
allowed to update the block device. Returns 409 if the node is not Ready or
Allocated.

#### `POST /api/1.0/nodes/{system_id}/blockdevices/{device_id}/` `op=unformat`

Unformat block device with filesystem.

Returns 400 if the block device is not formatted, currently mounted, or part
of a filesystem group. Returns 403 when the user doesn't have the ability to
unformat the block device. Returns 404 if the node or block device is not
found. Returns 409 if the node is not Ready or Allocated.

#### `POST /api/1.0/nodes/{system_id}/blockdevices/{device_id}/` `op=unmount`

Unmount the filesystem on block device.

Returns 400 if the block device is not formatted or not currently mounted.
Returns 403 when the user doesn't have the ability to unmount the block
device. Returns 404 if the node or block device is not found. Returns 409 if
the node is not Ready or Allocated.

#### `PUT /api/1.0/nodes/{system_id}/blockdevices/{device_id}/`
   Update block device on node.

    Fields for physical block device: :- `param name`: Name of the block device.
    :- `param model`: Model of the block device. :- `param serial`: Serial number of
    the block device. :- `param id_path`: (optional) Only used if model and
    serial cannot be provided. This should be a path that is fixed and doesn't
    change depending on the boot order or kernel version. :- `param size`: Size of
    the block device. :- `param block_size`: Block size of the block device.

    Fields for virtual block device: :- `param name`: Name of the block device.
    :- `param uuid`: UUID of the block device. :- `param size`: Size of the block
    device. (Only allowed for logical volumes.)

    Returns 404 if the node or block device is not found. Returns 403 if the
    user is not allowed to update the block device. Returns 409 if the node is
    not Ready.

### Block devices

Manage block devices on a node.

#### `GET /api/1.0/nodes/{system_id}/blockdevices/`
   List all block devices belonging to node.

    Returns 404 if the node is not found.

#### `POST /api/1.0/nodes/{system_id}/blockdevices/`
   Create a physical block device.

- `param name`
       Name of the block device.

- `param model`
       Model of the block device.

- `param serial`
       Serial number of the block device.

- `param id_path`
       (optional) Only used if model and serial cannot be provided. This
        should be a path that is fixed and doesn't change depending on the
        boot order or kernel version.

- `param size`
       Size of the block device.

- `param block_size`
       Block size of the block device.

    Returns 404 if the node is not found.

### Boot images

Manage the collection of boot images.

#### `GET /api/1.0/nodegroups/{uuid}/boot-images/`
   List boot images.

    Get a listing of a cluster's boot images.

- `param uuid`
       The UUID of the cluster for which the images should be listed.

### Boot resource

Manage a boot resource.

#### `DELETE /api/1.0/boot-resources/{id}/`
   Delete boot resource.

#### `GET /api/1.0/boot-resources/{id}/`
   Read a boot resource.

### Boot resources

Manage the boot resources.

#### `GET /api/1.0/boot-resources/`
   List all boot resources.

- `param type`
       - `Type of` boot resources to list. Default: all

#### `POST /api/1.0/boot-resources/`
   Uploads a new boot resource.

- `param name`
       Name of the boot resource.

- `param title`
       Title for the boot resource.

- `param architecture`
       Architecture the boot resource supports.

- `param filetype`
       File- `type for` uploaded content. (Default: tgz)

- `param content`
       Image content. Note: this is not a normal parameter, but a file
        upload.

#### `POST /api/1.0/boot-resources/` `op=import`

Import the boot resources.

### Boot source

Manage a boot source.

#### `DELETE /api/1.0/boot-sources/{id}/`
   Delete a specific boot source.

#### `GET /api/1.0/boot-sources/{id}/`
   Read a boot source.

#### `PUT /api/1.0/boot-sources/{id}/`
   Update a specific boot source.

- `param url`
       The URL of the BootSource.

- `param keyring_filename`
       The path to the keyring file for this BootSource.

- `param keyring_filename`
       The GPG keyring for this BootSource, base64-encoded data.

### Boot source selection

Manage a boot source selection.

#### `DELETE /api/1.0/boot-sources/{boot_source_id}/selections/{id}/`
   Delete a specific boot source.

#### `GET /api/1.0/boot-sources/{boot_source_id}/selections/{id}/`
   Read a boot source selection.

#### `PUT /api/1.0/boot-sources/{boot_source_id}/selections/{id}/`
   Update a specific boot source selection.

- `param release`
       The release for which to import resources.

- `param arches`
       The list of architectures for which to import resources.

- `param subarches`
       The list of subarchitectures for which to import resources.

- `param labels`
       The list of labels for which to import resources.

### Boot source selections

Manage the collection of boot source selections.

#### `GET /api/1.0/boot-sources/{boot_source_id}/selections/`
   List boot source selections.

    Get a listing of a boot source's selections.

#### `POST /api/1.0/boot-sources/{boot_source_id}/selections/`
   Create a new boot source selection.

- `param release`
       The release for which to import resources.

- `param arches`
       The architecture list for which to import resources.

- `param subarches`
       The subarchitecture list for which to import resources.

- `param labels`
       The label lists for which to import resources.

### Boot sources

Manage the collection of boot sources.

#### `GET /api/1.0/boot-sources/`
   List boot sources.

    Get a listing of boot sources.

#### `POST /api/1.0/boot-sources/`
   Create a new boot source.

- `param url`
       The URL of the BootSource.

- `param keyring_filename`
       The path to the keyring file for this BootSource.

- `param keyring_data`
       The GPG keyring for this BootSource, base64-encoded.

### Commissioning script

Manage a custom commissioning script.

This functionality is only available to administrators.

#### `DELETE /api/1.0/commissioning-scripts/{name}`
   Delete a commissioning script.

#### `GET /api/1.0/commissioning-scripts/{name}`
   Read a commissioning script.

#### `PUT /api/1.0/commissioning-scripts/{name}`
   Update a commissioning script.

### Commissioning scripts

Manage custom commissioning scripts.

This functionality is only available to administrators.

#### `GET /api/1.0/commissioning-scripts/`
   List commissioning scripts.

#### `POST /api/1.0/commissioning-scripts/`
   Create a new commissioning script.

    Each commissioning script is identified by a unique name.

    By convention the name should consist of a two-digit number, a dash, and a
    brief descriptive identifier consisting only of ASCII characters. You
    don't need to follow this convention, but not doing so opens you up to
    risks w.r.t. encoding and ordering. The name must not contain any
    whitespace, quotes, or apostrophes.

    A commissioning node will run each of the scripts in lexicographical
    order. There are no promises about how non-ASCII characters are sorted, or
    even how upper-case letters are sorted relative to lower-case letters. So
    where ordering matters, use unique numbers.

    Scripts built into MAAS will have names starting with "00-maas" or
    "99-maas" to ensure that they run first or last, respectively.

    Usually a commissioning script will be just that, a script. Ideally a
    script should be ASCII text to avoid any confusion over encoding. But in
    some cases a commissioning script might consist of a binary tool provided
    by a hardware vendor. Either way, the script gets passed to the
    commissioning node in the exact form in which it was uploaded.

- `param name`
       Unique identifying name for the script. Names should follow the
        pattern of "25-burn-in-hard-disk" (all ASCII, and with numbers greater
        than zero, and generally no "weird" characters).

- `param content`
       A script file, to be uploaded in binary form. Note: this is not a
        normal parameter, but a file upload. Its filename is ignored; MAAS
        will know it by the name you pass to the request.

### Device

Manage an individual device.

The device is identified by its system_id.

#### `DELETE /api/1.0/devices/{system_id}/`
   Delete a specific Device.

    Returns 404 if the device is not found. Returns 403 if the user does not
    have permission to delete the device. Returns 204 if the device is
    successfully deleted.

#### `GET /api/1.0/devices/{system_id}/`
   Read a specific device.

    Returns 404 if the device is not found.

#### `POST /api/1.0/devices/{system_id}/` `op=claim_sticky_ip_address`

Assign a "sticky" IP address to a device's MAC.

- `param mac_address`
   Optional MAC address on the device on which to assign the sticky IP
    address. If not passed, defaults to the primary MAC for the device.

- `param requested_address`
   Optional IP address to claim. If this isn't passed, this method will
    draw an IP address from the static range of the cluster interface this
    MAC is related to. If passed, this method lets you associate any IP
    address with a MAC address if the MAC isn't related to a cluster
    interface.

Returns 404 if the device is not found. Returns 400 if the mac_address is
not found on the device. Returns 503 if there are not enough IPs left on the
cluster interface to which the mac_address is linked. Returns 503 if the
interface does not have an associated subnet. Returns 503 if the
requested_address falls in a dynamic range. Returns 503 if the
requested_address is already allocated.

#### `POST /api/1.0/devices/{system_id}/` `op=release_sticky_ip_address`

Release a "sticky" IP address from a device's MAC.

- `param address`
   Optional IP address to release. If left unspecified, will release every
    "sticky" IP address associated with the device.

Returns 400 if the specified addresses could not be deallocated Returns 404
if the device is not found.

#### `PUT /api/1.0/devices/{system_id}/`
   Update a specific device.

- `param hostname`
       The new hostname for this device.

- `param parent`
       Optional system_id to indicate this device's parent. If the parent is
        already set and this parameter is omitted, the parent will be
        unchanged.

    - `type hostname`
       unicode

    Returns 404 if the device is not found. Returns 403 if the user does not
    have permission to update the device.

### Devices

Manage the collection of all the devices in the MAAS.

#### `GET /api/1.0/devices/` `op=list`

List devices visible to the user, optionally filtered by criteria.

- `param hostname`
   An optional list of hostnames. Only devices with matching hostnames will
    be returned.

- `type hostname`
   iterable

- `param mac_address`
   An optional list of MAC addresses. Only devices with matching MAC
    addresses will be returned.

- `type mac_address`
   iterable

- `param id`
   An optional list of system ids. Only devices with matching system ids
    will be returned.

- `type id`
   iterable

#### `POST /api/1.0/devices/` `op=new`

Create a new device.

- `param mac_addresses`
   One or more MAC addresses for the device.

- `param hostname`
   A hostname. If not given, one will be generated.

- `param parent`
   The system id of the parent. Optional.

### Events

Retrieve filtered node events.

A specific Node's events is identified by specifying one or more ids,
hostnames, or mac addresses as a list.

#### `GET /api/1.0/events/` `op=query`

List Node events, optionally filtered by various criteria via URL query
parameters.

- `param hostname`
   An optional hostname. Only events relating to the node with the matching
    hostname will be returned. This can be specified multiple times to get
    events relating to more than one node.

- `param mac_address`
   An optional list of MAC addresses. Only nodes with matching MAC
    addresses will be returned.

- `param id`
   An optional list of system ids. Only nodes with matching system ids will
    be returned.

- `param zone`
   An optional name for a physical zone. Only nodes in the zone will be
    returned.

- `param agent_name`
   An optional agent name. Only nodes with matching agent names will be
    returned.

- `param level`
   Desired minimum log level of returned events. Returns this level of
    events and greater. Choose from: DEBUG, INFO, WARNING, CRITICAL, ERROR.
    The default is INFO.

### Fabric

Manage fabric.

#### `DELETE /api/1.0/fabrics/{fabric_id}/`
   Delete fabric.

    Returns 404 if the fabric is not found.

#### `GET /api/1.0/fabrics/{fabric_id}/`
   Read fabric.

    Returns 404 if the fabric is not found.

#### `PUT /api/1.0/fabrics/{fabric_id}/`
   Update fabric.

- `param name`
       Name of the fabric.

- `param class_type`
       Class - `type of` the fabric.

    Returns 404 if the fabric is not found.

### Fabrics

Manage fabrics.

#### `GET /api/1.0/fabrics/`
   List all fabrics.

#### `POST /api/1.0/fabrics/`
   Create a fabric.

- `param name`
       Name of the fabric.

- `param class_type`
       Class - `type of` the fabric.

### Fan Network

Manage Fan Network.

#### `DELETE /api/1.0/fannetworks/{fannetwork_id}/`
   Delete fannetwork.

    Returns 404 if the fannetwork is not found.

#### `GET /api/1.0/fannetworks/{fannetwork_id}/`
   Read fannetwork.

    Returns 404 if the fannetwork is not found.

#### `PUT /api/1.0/fannetworks/{fannetwork_id}/`
   Update fannetwork.

- `param name`
       Name of the fannetwork.

- `param overlay`
       Overlay network

- `param underlay`
       Underlay network

- `param dhcp`
       confiugre dhcp server for overlay net

- `param host_reserve`
       number of IP addresses to reserve for host

- `param bridge`
       override bridge name

- `param off`
       put this int he config, but disable it.

    Returns 404 if the fannetwork is not found.

### Fan Networks

Manage Fan Networks.

#### `GET /api/1.0/fannetworks/`
   List all fannetworks.

#### `POST /api/1.0/fannetworks/`
   Create a fannetwork.

- `param name`
       Name of the fannetwork.

- `param overlay`
       Overlay network

- `param underlay`
       Underlay network

- `param dhcp`
       confiugre dhcp server for overlay net

- `param host_reserve`
       number of IP addresses to reserve for host

- `param bridge`
       override bridge name

- `param off`
       put this int he config, but disable it.

### File

Manage a FileStorage object.

The file is identified by its filename and owner.

#### `DELETE /api/1.0/files/{filename}/`
   Delete a FileStorage object.

#### `GET /api/1.0/files/{filename}/`
   GET a FileStorage object as a json object.

    The 'content' of the file is base64-encoded.

#### `POST /api/1.0/files/{filename}/` `op=delete`

Delete a FileStorage object.

### Files

Manage the collection of all the files in this MAAS.

#### `GET /api/1.0/files/` `op=get`

Get a named file from the file storage.

- `param filename`
   The exact name of the file you want to get.

- `type filename`
   string

return
   The file is returned in the response content.

#### `GET /api/1.0/files/` `op=get_by_key`

Get a file from the file storage using its key.

- `param key`
   The exact key of the file you want to get.

- `type key`
   string

return
   The file is returned in the response content.

#### `GET /api/1.0/files/` `op=list`

List the files from the file storage.

The returned files are ordered by file name and the content is excluded.

- `param prefix`
   Optional prefix used to filter out the returned files.

- `type prefix`
   string

#### `POST /api/1.0/files/` `op=add`

Add a new file to the file storage.

- `param filename`
   The file name to use in the storage.

- `type filename`
   string

- `param file`
   Actual file data with content - `type application`/octet-stream

Returns 400 if any of these conditions apply:
   - The filename is missing from the parameters
    - The file data is missing
    - More than one file is supplied

### IP Addresses

Manage IP addresses allocated by MAAS.

#### `GET /api/1.0/ipaddresses/`
   List IPAddresses.

    Get a listing of all IPAddresses allocated to the requesting user.

#### `POST /api/1.0/ipaddresses/` `op=release`

Release an IP address that was previously reserved by the user.

- `param ip`
   The IP address to release.

- `type ip`
   unicode

Returns 404 if the provided IP address is not found.

#### `POST /api/1.0/ipaddresses/` `op=reserve`

Reserve an IP address for use outside of MAAS.

Returns an IP adddress, which MAAS will not allow any of its known devices
and Nodes to use; it is free for use by the requesting user until released
by the user.

The user may supply either a range matching the subnet of an existing
cluster interface, or a specific IP address within the static IP address
range on a cluster interface.

- `param network`
   CIDR representation of the network on which the IP reservation is
    required. e.g. 10.1.2.0/24

- `param requested_address`
   the requested address, which must be within a static IP address range
    managed by MAAS.

- `param hostname`
   the hostname to use for the specified IP address

- `type network`
   unicode

Returns 400 if there is no network in MAAS matching the provided one, or a
requested_address is supplied, but a corresponding network could not be
found. Returns 503 if there are no more IP addresses available.

### Interface

Manage a node's or device's interface.

#### `DELETE /api/1.0/nodes/{system_id}/interfaces/{interface_id}/`
   Delete interface on node.

    Returns 404 if the node or interface is not found.

#### `GET /api/1.0/nodes/{system_id}/interfaces/{interface_id}/`
   Read interface on node.

    Returns 404 if the node or interface is not found.

#### `POST /api/1.0/nodes/{system_id}/interfaces/{interface_id}/` `op=link_subnet`

Link interface to a subnet.

- `param mode`
   AUTO, DHCP, STATIC or LINK_UP connection to subnet.

- `param subnet`
   Subnet linked to interface.

- `param ip_address`
   IP address for the interface in subnet. Only used when mode is STATIC.
    If not provided an IP address from subnet will be auto selected.

- `param default_gateway`
   True sets the gateway IP address for the subnet as the default gateway
    for the node this interface belongs to. Option can only be used with the
    AUTO and STATIC modes.

Mode definitions: AUTO - Assign this interface a static IP address from the
provided subnet. The subnet must be a managed subnet. The IP address will
not be assigned until the node goes to be deployed.

DHCP - Bring this interface up with DHCP on the given subnet. Only one
subnet can be set to DHCP. If the subnet is managed this interface will pull
from the dynamic IP range.

STATIC - Bring this interface up with a STATIC IP address on the given
subnet. Any number of STATIC links can exist on an interface.

LINK_UP - Bring this interface up only on the given subnet. No IP address
will be assigned to this interface. The interface cannot have any current
AUTO, DHCP or STATIC links.

Returns 404 if the node or interface is not found.

#### `POST /api/1.0/nodes/{system_id}/interfaces/{interface_id}/`
`op=set_default_gateway`

Set the node to use this interface as the default gateway.

If this interface has more than one subnet with a gateway IP in the same IP
address family then specifying the ID of the link on this interface is
required.

- `param link_id`
   ID of the link on this interface to select the default gateway IP
    address from.

Returns 400 if the interface has not AUTO or STATIC links. Returns 404 if
the node or interface is not found.

#### `POST /api/1.0/nodes/{system_id}/interfaces/{interface_id}/`
`op=unlink_subnet`

Unlink interface to a subnet.

- `param id`
   ID of the link on the interface to remove.

Returns 404 if the node or interface is not found.

#### `PUT /api/1.0/nodes/{system_id}/interfaces/{interface_id}/`
   Update interface on node.

    Fields for physical interface: :- `param name`: Name of the interface. :param
    mac_address: MAC address of the interface. :- `param tags`: Tags for the
    interface. :- `param vlan`: Untagged VLAN the interface is connected to.

    Fields for bond interface: :- `param name`: Name of the interface. :param
    mac_address: MAC address of the interface. :- `param tags`: Tags for the
    interface. :- `param vlan`: Tagged VLAN the interface is connected to. :param
    parents: Parent interfaces that make this bond.

    Fields for VLAN interface: :- `param tags`: Tags for the interface. :param
    vlan: VLAN the interface is connected to. :- `param parent`: Parent interface
    for this VLAN interface.

    Following are extra parameters that can be set on all interface types:

- `param mtu`
       Maximum transmission unit.

- `param accept_ra`
       Accept router advertisements. (IPv6 only)

- `param autoconf`
       Perform stateless autoconfiguration. (IPv6 only)

    Following are parameters specific to bonds:

- `param bond`-mode
       The operating mode of the bond. (Default: active-backup).

- `param bond`-miimon
       The link monitoring freqeuncy in milliseconds. (Default: 100).

- `param bond`-downdelay
       Specifies the time, in milliseconds, to wait before disabling a slave
        after a link failure has been detected.

- `param bond`-updelay
       Specifies the time, in milliseconds, to wait before enabling a slave
        after a link recovery has been detected.

- `param bond`-lacp_rate
       Option specifying the rate in which we'll ask our link partner to
        transmit LACPDU packets in 802.3ad mode. Available options are fast or
        slow. (Default: slow).

- `param bond`-xmit_hash_policy
       The transmit hash policy to use for slave selection in balance-xor,
        802.3ad, and tlb modes.

    Supported bonding modes (bond-mode): balance-rr - Transmit packets in
    sequential order from the first available slave through the last. This
    mode provides load balancing and fault tolerance.

    active-backup - Only one slave in the bond is active. A different slave
    becomes active if, and only if, the active slave fails. The bond's MAC
    address is externally visible on only one port (network adapter) to avoid
    confusing the switch.

    balance-xor - Transmit based on the selected transmit hash policy. The
    default policy is a simple \[(source MAC address XOR'd with destination
    MAC address XOR packet - `type ID`) modulo slave count\].

    broadcast - Transmits everything on all slave interfaces. This mode
    provides fault tolerance.

    802.3ad - IEEE 802.3ad Dynamic link aggregation. Creates aggregation
    groups that share the same speed and duplex settings. Utilizes all slaves
    in the active aggregator according to the 802.3ad specification.

    balance-tlb - Adaptive transmit load balancing: channel bonding that does
    not require any special switch support.

    balance-alb - Adaptive load balancing: includes balance-tlb plus receive
    load balancing (rlb) for IPV4 traffic, and does not require any special
    switch support. The receive load balancing is achieved by ARP negotiation.

    Returns 404 if the node or interface is not found.

### Interfaces

Manage interfaces on a node or device.

#### `GET /api/1.0/nodes/{system_id}/interfaces/`
   List all interfaces belonging to a node or device.

    Returns 404 if the node is not found.

#### `POST /api/1.0/nodes/{system_id}/interfaces/` `op=create_bond`

Create a bond interface on node.

- `param name`
   Name of the interface.

- `param mac_address`
   MAC address of the interface.

- `param tags`
   Tags for the interface.

- `param vlan`
   VLAN the interface is connected to.

- `param parents`
   Parent interfaces that make this bond.

Following are parameters specific to bonds:

- `param bond_mode`
   The operating mode of the bond. (Default: active-backup).

- `param bond_miimon`
   The link monitoring freqeuncy in milliseconds. (Default: 100).

- `param bond_downdelay`
   Specifies the time, in milliseconds, to wait before disabling a slave
    after a link failure has been detected.

- `param bond_updelay`
   Specifies the time, in milliseconds, to wait before enabling a slave
    after a link recovery has been detected.

- `param bond_lacp_rate`
   Option specifying the rate in which we'll ask our link partner to
    transmit LACPDU packets in 802.3ad mode. Available options are fast or
    slow. (Default: slow).

- `param bond_xmit_hash_policy`
   The transmit hash policy to use for slave selection in balance-xor,
    802.3ad, and tlb modes. (Default: layer2)

Supported bonding modes (bond-mode): balance-rr - Transmit packets in
sequential order from the first available slave through the last. This mode
provides load balancing and fault tolerance.

active-backup - Only one slave in the bond is active. A different slave
becomes active if, and only if, the active slave fails. The bond's MAC
address is externally visible on only one port (network adapter) to avoid
confusing the switch.

balance-xor - Transmit based on the selected transmit hash policy. The
default policy is a simple \[(source MAC address XOR'd with destination MAC
address XOR packet type ID) modulo slave count\].

broadcast - Transmits everything on all slave interfaces. This mode provides
fault tolerance.

802.3ad - IEEE 802.3ad Dynamic link aggregation. Creates aggregation groups
that share the same speed and duplex settings. Utilizes all slaves in the
active aggregator according to the 802.3ad specification.

balance-tlb - Adaptive transmit load balancing: channel bonding that does
not require any special switch support.

balance-alb - Adaptive load balancing: includes balance-tlb plus receive
load balancing (rlb) for IPV4 traffic, and does not require any special
switch support. The receive load balancing is achieved by ARP negotiation.

Following are extra parameters that can be set on the interface:

- `param mtu`
   Maximum transmission unit.

- `param accept_ra`
   Accept router advertisements. (IPv6 only)

- `param autoconf`
   Perform stateless autoconfiguration. (IPv6 only)

Returns 404 if the node is not found.

#### `POST /api/1.0/nodes/{system_id}/interfaces/` `op=create_physical`

Create a physical interface on a node or device.

- `param name`
   Name of the interface.

- `param mac_address`
   MAC address of the interface.

- `param tags`
   Tags for the interface.

- `param vlan`
   Untagged VLAN the interface is connected to.

Following are extra parameters that can be set on the interface:

- `param mtu`
   Maximum transmission unit.

- `param accept_ra`
   Accept router advertisements. (IPv6 only)

- `param autoconf`
   Perform stateless autoconfiguration. (IPv6 only)

Returns 404 if the node is not found.

#### `POST /api/1.0/nodes/{system_id}/interfaces/` `op=create_vlan`

Create a VLAN interface on node.

- `param tags`
   Tags for the interface.

- `param vlan`
   Tagged VLAN the interface is connected to.

- `param parent`
   Parent interface for this VLAN interface.

Following are extra parameters that can be set on the interface:

- `param mtu`
   Maximum transmission unit.

- `param accept_ra`
   Accept router advertisements. (IPv6 only)

- `param autoconf`
   Perform stateless autoconfiguration. (IPv6 only)

Returns 404 if the node is not found.

### License Key

Manage a license key.

#### `DELETE /api/1.0/license-key/{osystem}/{distro_series}`
   Delete license key.

#### `GET /api/1.0/license-key/{osystem}/{distro_series}`
   Read license key.

#### `PUT /api/1.0/license-key/{osystem}/{distro_series}`
   Update license key.

- `param osystem`
       Operating system that the key belongs to.

- `param distro_series`
       OS release that the key belongs to.

- `param license_key`
       License key for osystem/distro_series combo.

### License Keys

Manage the license keys.

#### `GET /api/1.0/license-keys/`
   List license keys.

#### `POST /api/1.0/license-keys/`
   Define a license key.

- `param osystem`
       Operating system that the key belongs to.

- `param distro_series`
       OS release that the key belongs to.

- `param license_key`
       License key for osystem/distro_series combo.

### MAAS server

Manage the MAAS server.

#### `GET /api/1.0/maas/` `op=get_config`

Get a config value.

- `param name`
   The name of the config item to be retrieved.

- `type name`
   unicode

Available configuration items: - enable_http_proxy: Enable the use of an
APT and HTTP/HTTPS proxy. Provision nodes to use the built-in HTTP proxy (or
user specified proxy) for APT. MAAS also uses the proxy for downloading boot
images. - upstream_dns: Upstream DNS used to resolve domains not managed by
this MAAS (space-separated IP addresses). Only used when MAAS is running its
own DNS server. This value is used as the value of 'forwarders' in the DNS
server config. - default_storage_layout: Default storage layout. Storage
layout that is applied to a node when it is commissioned. Available choices
are: 'lvm' (LVM layout), 'flat' (Flat layout), 'bcache' (Bcache layout). -
default_osystem: Default operating system used for deployment. -
ports_archive: Ports archive. Archive used by nodes to retrieve packages
for non-Intel architectures. E.g. <http://ports.ubuntu.com/ubuntu-ports. -
http_proxy: Proxy for APT and HTTP/HTTPS. This will be passed onto
provisioned nodes to use as a proxy for APT traffic. MAAS also uses the
proxy for downloading boot images. If no URL is provided, the built-in MAAS
proxy will be used. - boot_images_auto_import: Automatically
import/refresh the boot images every 60 minutes. -
enable_third_party_drivers: Enable the installation of proprietary
drivers (i.e. HPVSA). - kernel_opts: Boot parameters to pass to the kernel
by default. - main_archive: Main archive. Archive used by nodes to retrieve
packages for Intel architectures. E.g. <http://archive.ubuntu.com/ubuntu. -
maas_name: MAAS name. - curtin_verbose: Run the fast-path installer with
higher verbosity. This provides more detail in the installation logs.. -
dnssec_validation: Enable DNSSEC validation of upstream zones. Only used
when MAAS is running its own DNS server. This value is used as the value of
'dnssec_validation' in the DNS server config. -
commissioning_distro_series: Default Ubuntu release used for
commissioning. - windows_kms_host: Windows KMS activation host. FQDN or IP
address of the host that provides the KMS Windows activation service. (Only
needed for Windows deployments using KMS activation.) -
enable_disk_erasing_on_release: Erase nodes' disks prior to releasing..
- default_distro_series: Default OS release used for deployment. -
ntp_server: Address of NTP server for nodes. NTP server address passed to
nodes via a DHCP response. e.g. ntp.ubuntu.com - default_min_hwe_kernel:
Default Minimum Kernel Version. The default minimum kernel version used on
all new and commissioned nodes.

#### `POST /api/1.0/maas/` `op=set_config`

Set a config value.

- `param name`
   The name of the config item to be set.

- `type name`
   unicode

- `param value`
   The value of the config item to be set.

- `type value`
   json object

Available configuration items: - enable_http_proxy: Enable the use of an
APT and HTTP/HTTPS proxy. Provision nodes to use the built-in HTTP proxy (or
user specified proxy) for APT. MAAS also uses the proxy for downloading boot
images. - upstream_dns: Upstream DNS used to resolve domains not managed by
this MAAS (space-separated IP addresses). Only used when MAAS is running its
own DNS server. This value is used as the value of 'forwarders' in the DNS
server config. - default_storage_layout: Default storage layout. Storage
layout that is applied to a node when it is commissioned. Available choices
are: 'lvm' (LVM layout), 'flat' (Flat layout), 'bcache' (Bcache layout). -
default_osystem: Default operating system used for deployment. -
ports_archive: Ports archive. Archive used by nodes to retrieve packages
for non-Intel architectures. E.g. <http://ports.ubuntu.com/ubuntu-ports. -
http_proxy: Proxy for APT and HTTP/HTTPS. This will be passed onto
provisioned nodes to use as a proxy for APT traffic. MAAS also uses the
proxy for downloading boot images. If no URL is provided, the built-in MAAS
proxy will be used. - boot_images_auto_import: Automatically
import/refresh the boot images every 60 minutes. -
enable_third_party_drivers: Enable the installation of proprietary
drivers (i.e. HPVSA). - kernel_opts: Boot parameters to pass to the kernel
by default. - main_archive: Main archive. Archive used by nodes to retrieve
packages for Intel architectures. E.g. <http://archive.ubuntu.com/ubuntu. -
maas_name: MAAS name. - curtin_verbose: Run the fast-path installer with
higher verbosity. This provides more detail in the installation logs.. -
dnssec_validation: Enable DNSSEC validation of upstream zones. Only used
when MAAS is running its own DNS server. This value is used as the value of
'dnssec_validation' in the DNS server config. -
commissioning_distro_series: Default Ubuntu release used for
commissioning. - windows_kms_host: Windows KMS activation host. FQDN or IP
address of the host that provides the KMS Windows activation service. (Only
needed for Windows deployments using KMS activation.) -
enable_disk_erasing_on_release: Erase nodes' disks prior to releasing..
- default_distro_series: Default OS release used for deployment. -
ntp_server: Address of NTP server for nodes. NTP server address passed to
nodes via a DHCP response. e.g. ntp.ubuntu.com - default_min_hwe_kernel:
Default Minimum Kernel Version. The default minimum kernel version used on
all new and commissioned nodes.

### Network

Manage a network.

This endpoint is deprecated. Use the new 'subnet' endpoint instead.

#### `DELETE /api/1.0/networks/{name}/`
   Delete network definition.

    This endpoint is no longer available. Use the 'subnet' endpoint instead.

#### `GET /api/1.0/networks/{name}/`
   Read network definition.

#### `GET /api/1.0/networks/{name}/` `op=list_connected_macs`

Returns the list of MAC addresses connected to this network.

Only MAC addresses for nodes visible to the requesting user are returned.

#### `POST /api/1.0/networks/{name}/` `op=connect_macs`

Connect the given MAC addresses to this network.

This endpoint is no longer available. Use the 'subnet' endpoint instead.

#### `POST /api/1.0/networks/{name}/` `op=disconnect_macs`

Disconnect the given MAC addresses from this network.

This endpoint is no longer available. Use the 'subnet' endpoint instead.

#### `PUT /api/1.0/networks/{name}/`
   Update network definition.

    This endpoint is no longer available. Use the 'subnet' endpoint instead.

- `param name`
       A simple name for the network, to make it easier to refer to. Must
        consist only of letters, digits, dashes, and underscores.

- `param ip`
       Base IP address for the network, e.g. 10.1.0.0. The host bits will be
        zeroed.

- `param netmask`
       Subnet mask to indicate which parts of an IP address are part of the
        network address. For example, 255.255.255.0.

- `param vlan_tag`
       Optional VLAN tag: a number between 1 and 0xffe (4094) inclusive, or
        zero for an untagged network.

- `param description`
       Detailed description of the network for the benefit of users and
        administrators.

### Networks

Manage the networks.

This endpoint is deprecated. Use the new 'subnets' endpoint instead.

#### `GET /api/1.0/networks/`
   List networks.

- `param node`
       Optionally, nodes which must be attached to any returned networks. If
        more than one node is given, the result will be restricted to networks
        that these nodes have in common.

#### `POST /api/1.0/networks/`
   Define a network.

    This endpoint is no longer available. Use the 'subnets' endpoint instead.

### Nodegroup

Manage a NodeGroup.

NodeGroup is the internal name for a cluster.

The NodeGroup is identified by its UUID, a random identifier that looks
something like:

5977f6ab-9160-4352-b4db-d71a99066c4f

Each NodeGroup has its own uuid.

#### `GET /api/1.0/nodegroups/{uuid}/`
   GET a node group.

    Returns 404 if the nodegroup (cluster) is not found.

#### `GET /api/1.0/nodegroups/{uuid}/` `op=list_nodes`

Get the list of node ids that are part of this group.

Returns 404 if the nodegroup (cluster) is not found.

#### `POST /api/1.0/nodegroups/{uuid}/` `op=details`

Obtain various system details for each node specified.

For example, LLDP and `lshw` XML dumps.

Returns a `{system_id: {detail_type: xml, ...}, ...}` map, where
`detail_type` is something like "lldp" or "lshw".

- `param system_ids`
   System ids of nodes for which to get system details.

Note that this is returned as BSON and not JSON. This is for efficiency, but
mainly because JSON can't do binary content without applying additional
encoding like base-64.

For security purposes:

a)  Requests are only fulfilled for the worker assigned to the nodegroup.
b)  Requests for nodes that are not part of the nodegroup are just ignored.

Returns 404 if the nodegroup (cluster) is not found. Returns 403 if the user
does not have access to the nodegroup.

#### `POST /api/1.0/nodegroups/{uuid}/` `op=import_boot_images`

Import the pxe files on this cluster controller.

Returns 404 if the nodegroup (cluster) is not found.

#### `POST /api/1.0/nodegroups/{uuid}/` `op=probe_and_enlist_hardware`

Add special hardware types.

- `param model`
   The - `type of` hardware. 'seamicro15k', 'virsh', 'vmware', 'powerkvm',
    'mscm', 'msftocs' and 'ucsm' are supported.

    seamicro15k is the model for the Seamicro 1500 Chassis. virsh is the
    model for Virtual Machines managed by Virsh. powerkvm is the model for
    Virtual Machines on Power KVM, managed by Virsh. mscm is the model for
    the Moonshot Chassis Manager. msftocs is the model for the Microsoft OCS
    Chassis Manager. ucsm is the model for the Cisco UCS Manager.

- `type model`
   unicode

The following are optional for all models:

- `param accept_all`
   If true, all enlisted nodes will be commissioned.

- `type accept_all`
   unicode

The following are required if you are probing seamicro15k:

- `param mac`
   The MAC of the seamicro15k chassis.

- `type mac`
   unicode

- `param username`
   The username for the chassis.

- `type username`
   unicode

- `param password`
   The password for the chassis.

- `type password`
   unicode

The following are optional if you are probing seamicro15k:

- `param power_control`
   The power_control to use, either ipmi (default) or restapi.

- `type power_control`
   unicode

The following are required if you are probing virsh:

- `param power_address`
   The connection string to virsh.

- `type power_address`
   unicode

The following are optional if you are probing virsh:

- `param power_pass`
   The password to use, when qemu+ssh is given as a connection string and
    ssh key authentication is not being used.

- `type power_pass`
   unicode

- `param prefix_filter`
   Filter nodes with supplied prefix.

- `type prefix_filter`
   unicode

The following are required if you are probing vmware:

- `param host`
   The VMware hostname or IP address

- `type host`
   unicode

- `param username`
   The VMware API username

- `type username`
   unicode

- `param password`
   The VMware API password

- `type password`
   unicode

The following are optional if you are probing vmware:

- `param protocol`
   The VMware API protocol (default: https)

- `type protocol`
   unicode

- `param port`
   The VMware API port (default: 443)

- `type port`
   integer

- `param prefix_filter`
   Filter nodes with supplied prefix.

- `type prefix_filter`
   unicode

The following are required if you are probing mscm:

- `param host`
   IP Address for the Moonshot Chassis Manager.

- `type host`
   unicode

- `param username`
   The username for the Moonshot Chassis Manager.

- `type username`
   unicode

- `param password`
   The password for the Moonshot Chassis Manager.

- `type password`
   unicode

The followeing are required if you are probing msftocs:

- `param ip`
   IP Address for the Microsoft OCS Chassis.

- `type ip`
   unicode

- `param port`
   Port for the Microsoft OCS Chassis.

- `type port`
   unicode

- `param username`
   The username for the Microsoft OCS Chassis.

- `type username`
   unicode

- `param password`
   The password for the Microsoft OCS Chassis.

- `type password`
   unicode

The followeing are required if you are probing a ucsm:

- `param url`
   The URL of the UCS Manager API.

- `type url`
   unicode

- `param username`
   The username for the UCS Manager API.

- `type username`
   unicode

- `param password`
   The password for the UCS Manager API.

- `type password`
   unicode

Returns 404 if the nodegroup (cluster) is not found. Returns 403 if the user
does not have access to the nodegroup. Returns 400 if the required
parameters were not passed.

#### `POST /api/1.0/nodegroups/{uuid}/` `op=probe_and_enlist_mscm`

Add the nodes from a Moonshot HP iLO Chassis Manager (MSCM).

**Warning: this API is deprecated in favor of
probe_and_enlist_hardware.**

- `param host`
   IP Address for the MSCM.

- `type host`
   unicode

- `param username`
   The username for the MSCM.

- `type username`
   unicode

- `param password`
   The password for the MSCM.

- `type password`
   unicode

- `param accept_all`
   If true, all enlisted nodes will be commissioned.

- `type accept_all`
   unicode

Returns 404 if the nodegroup (cluster) is not found. Returns 403 if the user
does not have access to the nodegroup. Returns 400 if the required
parameters were not passed.

#### `POST /api/1.0/nodegroups/{uuid}/` `op=probe_and_enlist_ucsm`

Add the nodes from a Cisco UCS Manager.

**Warning: this API is deprecated in favor of
probe_and_enlist_hardware.**

- `param url`
   The URL of the UCS Manager API.

- `type url`
   unicode

- `param username`
   The username for the API.

- `type username`
   unicode

- `param password`
   The password for the API.

- `type password`
   unicode

- `param accept_all`
   If true, all enlisted nodes will be commissioned.

- `type accept_all`
   unicode

Returns 404 if the nodegroup (cluster) is not found. Returns 403 if the user
does not have access to the nodegroup. Returns 400 if the required
parameters were not passed.

#### `POST /api/1.0/nodegroups/{uuid}/` `op=report_download_progress`

Report progress of a download.

Cluster controllers can call this to update the region controller on file
downloads they need to perform, such as kernels and initrd files. This gives
the administrator insight into what downloads are in progress, how well
downloads are going, and what failures may have occurred.

A file is identified by an arbitrary name, which must be consistent. It
could be a URL, or a filesystem path, or even a symbolic name that the
cluster controller makes up. A cluster controller can download the same file
many times over, but not simultaneously.

Before downloading a file, a cluster controller first reports progress
without the bytes_downloaded parameter. It may optionally report progress
while downloading, passing the number of bytes downloaded so far. Finally,
if the download succeeded, it should report one final time with the full
number of bytes downloaded.

If the download fails, the cluster controller should report progress with an
error string (and either the number of bytes that were successfully
downloaded, or zero).

Progress reports should include the file's size, if known. The final report
after a successful download must include the size.

- `param filename`
   Arbitrary identifier for the file being downloaded.

- `type filename`
   unicode

- `param size`
   Optional size of the file, in bytes. Must be passed at least once,
    though it can still be passed on subsequent calls. If file size is not
    known, pass it at the end when reporting successful completion. Do not
    change the size once given.

- `param bytes_downloaded`
   Number of bytes that have been successfully downloaded. Cannot exceed
    size, if known. This parameter must be omitted from the initial progress
    report before download starts, and must be included for all subsequent
    progress reports for that download.

- `type bytes_downloaded`
   int

- `param error`
   Optional error string. A download that has submitted an error with its
    last progress report is considered to have failed.

- `type error`
   unicode

Returns 404 if the nodegroup (cluster) is not found. Returns 403 if the user
does not have access to the nodegroup. Returns 400 if the required
parameters were not passed.

#### `PUT /api/1.0/nodegroups/{uuid}/`
   Update a specific cluster.

- `param name`
       The new DNS name for this cluster.

    - `type name`
       unicode

- `param cluster_name`
       The new name for this cluster.

    - `type cluster_name`
       unicode

- `param status`
       The new status for this cluster (see vocabulary NODEGROUP_STATUS).

    - `type status`
       int

    Returns 404 if the nodegroup (cluster) is not found.

### Nodegroup interface

Manage a NodeGroupInterface.

A NodeGroupInterface is identified by the uuid for its NodeGroup, and the
name of the network interface it represents: "eth0" for example.

#### `DELETE /api/1.0/nodegroups/{uuid}/interfaces/{name}/`
   Delete a specific NodeGroupInterface.

    Returns 404 if the nodegroup (cluster) is not found. Returns 403 if the
    user does not have permission to access the interface.

#### `GET /api/1.0/nodegroups/{uuid}/interfaces/{name}/`
   List of NodeGroupInterfaces of a NodeGroup.

    Returns 404 if the nodegroup (cluster) is not found.

#### `PUT /api/1.0/nodegroups/{uuid}/interfaces/{name}/`
   Update a specific NodeGroupInterface.

- `param name`
       Identifying name for the cluster interface.

- `param ip`
       Static IP of the interface.

    - `type ip`
       unicode (IP Address)

- `param interface`
       Network interface.

    - `type interface`
       unicode

- `param management`
       The service(s) MAAS should manage on this interface.

    - `type management`
       Vocabulary NODEGROUPINTERFACE_MANAGEMENT

- `param subnet_mask`
       Subnet mask, e.g. 255.0.0.0.

    - `type subnet_mask`
       unicode (IP Address)

- `param broadcast_ip`
       Broadcast address for this subnet.

    - `type broadcast_ip`
       unicode (IP Address)

- `param router_ip`
       Address of default gateway.

    - `type router_ip`
       unicode (IP Address)

- `param ip_range_low`
       Lowest dynamic IP address to assign to clients.

    - `type ip_range_low`
       unicode (IP Address)

- `param ip_range_high`
       Highest dynamic IP address to assign to clients.

    - `type ip_range_high`
       unicode (IP Address)

- `param static_ip_range_low`
       Lowest static IP address to assign to clients.

    - `type static_ip_range_low`
       unicode (IP Address)

- `param static_ip_range_high`
       Highest static IP address to assign to clients.

    - `type static_ip_range_high`
       unicode (IP Address)

    Returns 404 if the nodegroup (cluster) is not found. Returns 403 if the
    user does not have permission to access the interface.

### Nodegroup interfaces

Manage the collection of all the NodeGroupInterfaces in this MAAS.

A NodeGroupInterface is a network interface attached to a cluster
controller, with its network properties.

#### `GET /api/1.0/nodegroups/{uuid}/interfaces/` `op=list`

List of NodeGroupInterfaces of a NodeGroup.

#### `POST /api/1.0/nodegroups/{uuid}/interfaces/` `op=new`

Create a new NodeGroupInterface for this NodeGroup.

- `param name`
   Name for the interface. Must be unique within this cluster. Only
    letters, digits, dashes, and colons are allowed.

- `param ip`
   Static IP of the interface.

- `type ip`
   unicode (IP Address)

- `param interface`
   Name of the network interface that connects the cluster controller to
    this network.

- `type interface`
   unicode

- `param management`
   The service(s) MAAS should manage on this interface.

- `type management`
   Vocabulary NODEGROUPINTERFACE_MANAGEMENT

- `param subnet_mask`
   Subnet mask, e.g. 255.0.0.0.

- `type subnet_mask`
   unicode (IP Address)

- `param broadcast_ip`
   Broadcast address for this subnet.

- `type broadcast_ip`
   unicode (IP Address)

- `param router_ip`
   Address of default gateway.

- `type router_ip`
   unicode (IP Address)

- `param ip_range_low`
   Lowest dynamic IP address to assign to clients.

- `type ip_range_low`
   unicode (IP Address)

- `param ip_range_high`
   Highest dynamic IP address to assign to clients.

- `type ip_range_high`
   unicode (IP Address)

- `param static_ip_range_low`
   Lowest static IP address to assign to clients.

- `type static_ip_range_low`
   unicode (IP Address)

- `param static_ip_range_high`
   Highest static IP address to assign to clients.

- `type static_ip_range_high`
   unicode (IP Address)

Returns 404 if the node group (cluster) is not found. Returns 403 if the
user does not have permission to access the interface.

### Nodegroups

Manage the collection of all the nodegroups in this MAAS.

#### `GET /api/1.0/nodegroups/` `op=describe_power_types`

Query all the cluster controllers for power information.

return
   a list of dicts that describe the power types in this format.

#### `GET /api/1.0/nodegroups/` `op=list`

List nodegroups.

#### `POST /api/1.0/nodegroups/` `op=accept`

Accept nodegroup enlistment(s).

- `param uuid`
   The UUID (or list of UUIDs) of the nodegroup(s) to accept.

- `type name`
   unicode (or list of unicodes)

This method is reserved to admin users and returns 403 if the user is not an
admin.

Returns 404 if the nodegroup (cluster) is not found.

#### `POST /api/1.0/nodegroups/` `op=import_boot_images`

Import the boot images on all the accepted cluster controllers.

#### `POST /api/1.0/nodegroups/` `op=reject`

Reject nodegroup enlistment(s).

- `param uuid`
   The UUID (or list of UUIDs) of the nodegroup(s) to reject.

- `type name`
   unicode (or list of unicodes)

This method is reserved to admin users and returns 403 if the user is not an
admin.

Returns 404 if the nodegroup (cluster) is not found.

### Node

Manage an individual Node.

The Node is identified by its system_id.

#### `DELETE /api/1.0/nodes/{system_id}/`
   Delete a specific Node.

    Returns 404 if the node is not found. Returns 403 if the user does not
    have permission to delete the node. Returns 204 if the node is
    successfully deleted.

#### `GET /api/1.0/nodes/{system_id}/`
   Read a specific Node.

    Returns 404 if the node is not found.

#### `GET /api/1.0/nodes/{system_id}/` `op=details`

Obtain various system details.

For example, LLDP and `lshw` XML dumps.

Returns a `{detail_type: xml, ...}` map, where `detail_type` is something
like "lldp" or "lshw".

Note that this is returned as BSON and not JSON. This is for efficiency, but
mainly because JSON can't do binary content without applying additional
encoding like base-64.

Returns 404 if the node is not found.

#### `GET /api/1.0/nodes/{system_id}/` `op=get_curtin_config`

Return the rendered curtin configuration for the node.

Returns 404 if the node could not be found. Returns 403 if the user does not
have permission to get the curtin configuration.

#### `GET /api/1.0/nodes/{system_id}/` `op=power_parameters`

Obtain power parameters.

This method is reserved for admin users and returns a 403 if the user is not
one.

This returns the power parameters, if any, configured for a node. For some
types of power control this will include private information such as
passwords and secret keys.

Returns 404 if the node is not found.

#### `GET /api/1.0/nodes/{system_id}/` `op=query_power_state`

Query the power state of a node.

Send a request to the node's power controller which asks it about the node's
state. The reply to this could be delayed by up to 30 seconds while waiting
for the power controller to respond. Use this method sparingly as it ties up
an appserver thread while waiting.

- `param system_id`
   The node to query.

return
   a dict whose key is "state" with a value of one of 'on' or 'off'.

Returns 400 if the node is not installable. Returns 404 if the node is not
found. Returns 503 (with explanatory text) if the power state could not be
queried.

#### `POST /api/1.0/nodes/{system_id}/` `op=abort_operation`

Abort a node's current operation.

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

This currently only supports aborting of the 'Disk Erasing' operation.

Returns 404 if the node could not be found. Returns 403 if the user does not
have permission to abort the current operation.

#### `POST /api/1.0/nodes/{system_id}/` `op=claim_sticky_ip_address`

Assign a "sticky" IP address to a Node's MAC.

- `param mac_address`
   Optional MAC address on the node on which to assign the sticky IP
    address. If not passed, defaults to the PXE MAC for the node.

- `param requested_address`
   Optional IP address to claim. Must be in the range defined on a cluster
    interface to which the context MAC is related, or 403 Forbidden is
    returned. If the requested address is unavailable for use, 404 Not Found
    is returned.

A sticky IP is one which stays with the node until the IP is disassociated
with the node, or the node is deleted. It allows an admin to give a node a
stable IP, since normally an automatic IP is allocated to a node only during
the time a user has acquired and started a node.

Returns 404 if the node is not found. Returns 409 if the node is in an
allocated state. Returns 400 if the mac_address is not found on the node.
Returns 503 if there are not enough IPs left on the cluster interface to
which the mac_address is linked.

#### `POST /api/1.0/nodes/{system_id}/` `op=clear_default_gateways`

Clear any set default gateways on the node.

This will clear both IPv4 and IPv6 gateways on the node. This will
transition the logic of identifing the best gateway to MAAS. This logic is
determined based the following criteria:

1.  Managed subnets over unmanaged subnets.
2.  Bond interfaces over physical interfaces.
3.  Node's boot interface over all other interfaces except bonds.
4.  Physical interfaces over VLAN interfaces.
5.  Sticky IP links over user reserved IP links.
6.  User reserved IP links over auto IP links.

If the default gateways need to be specific for this node you can set which
interface and subnet's gateway to use when this node is deployed with the
node-interfaces set-default-gateway API.

Returns 404 if the node could not be found. Returns 403 if the user does not
have permission to clear the default gateways.

#### `POST /api/1.0/nodes/{system_id}/` `op=commission`

Begin commissioning process for a node.

- `param enable_ssh`
   Whether to enable SSH for the commissioning environment using the user's
    SSH key(s).

- `type enable_ssh`
   bool ('0' for False, '1' for True)

- `param skip_networking`
   Whether to skip re-configuring the networking on the node after the
    commissioning has completed.

- `type skip_networking`
   bool ('0' for False, '1' for True)

- `param skip_storage`
   Whether to skip re-configuring the storage on the node after the
    commissioning has completed.

- `type skip_storage`
   bool ('0' for False, '1' for True)

A node in the 'ready', 'declared' or 'failed test' state may initiate a
commissioning cycle where it is checked out and tested in preparation for
transitioning to the 'ready' state. If it is already in the 'ready' state
this is considered a re-commissioning process which is useful if
commissioning tests were changed after it previously commissioned.

Returns 404 if the node is not found.

#### `POST /api/1.0/nodes/{system_id}/` `op=mark_broken`

Mark a node as 'broken'.

If the node is allocated, release it first.

- `param comment`
   Optional comment for the event log. Will be displayed on the Node as an
    error description until marked fixed.

- `type comment`
   unicode

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to mark the node broken.

#### `POST /api/1.0/nodes/{system_id}/` `op=mark_fixed`

Mark a broken node as fixed and set its status as 'ready'.

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to mark the node fixed.

#### `POST /api/1.0/nodes/{system_id}/` `op=release`

Release a node. Opposite of NodesHandler.acquire.

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to release the node. Returns 409 if the node is in a state where
it may not be released.

#### `POST /api/1.0/nodes/{system_id}/` `op=release_sticky_ip_address`

Release a "sticky" IP address from a node's MAC.

- `param address`
   Optional IP address to release. If left unspecified, will release every
    "sticky" IP address associated with the node.

Returns 400 if the specified addresses could not be deallocated Returns 404
if the node is not found. Returns 409 if the node is in an allocated state.

#### `POST /api/1.0/nodes/{system_id}/` `op=set_storage_layout`

Changes the storage layout on the node.

This can only be preformed on an allocated node.

Note: This will clear the current storage layout and any extra configuration
and replace it will the new layout.

- `param storage_layout`
   Storage layout for the node. (flat, lvm and bcache)

The following are optional for all layouts:

- `param boot_size`
   Size of the boot partition.

- `param root_size`
   Size of the root partition.

- `param root_device`
   Physical block device to place the root partition.

The following are optional for LVM:

- `param vg_name`
   Name of created volume group.

- `param lv_name`
   Name of created logical volume.

- `param lv_size`
   Size of created logical volume.

The following are optional for Bcache:

- `param cache_device`
   Physical block device to use as the cache device.

- `param cache_mode`
   Cache mode for bcache device. (writeback, writethrough, writearound)

- `param cache_size`
   Size of the cache partition to create on the cache device.

- `param cache_no_part`
   Don't create a partition on the cache device. Use the entire disk as the
    cache device.

Returns 400 if the node is currently not allocated. Returns 404 if the node
could not be found. Returns 403 if the user does not have permission to set
the storage layout.

#### `POST /api/1.0/nodes/{system_id}/` `op=start`

Power up a node.

- `param user_data`
   If present, this blob of user-data to be made available to the nodes
    through the metadata service.

- `type user_data`
   base64-encoded unicode

- `param distro_series`
   If present, this parameter specifies the OS release the node will use.

- `type distro_series`
   unicode

- `param hwe_kernel`
   If present, this parameter specified the kernel to be used on the node

- `type hwe_kernel`
   unicode

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Ideally we'd have MIME multipart and content-transfer-encoding etc. deal
with the encapsulation of binary data, but couldn't make it work with the
framework in reasonable time so went for a dumb, manual encoding instead.

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to start the node. Returns 503 if the start-up attempted to
allocate an IP address, and there were no IP addresses available on the
relevant cluster interface.

#### `POST /api/1.0/nodes/{system_id}/` `op=stop`

Shut down a node.

- `param stop_mode`
   An optional power off mode. If 'soft', perform a soft power down if the
    node's power - `type supports` it, otherwise perform a hard power off. For
    all values other than 'soft', and by default, perform a hard power off.
    A soft power off generally asks the OS to shutdown the system gracefully
    before powering off, while a hard power off occurs immediately without
    any warning to the OS.

- `type stop_mode`
   unicode

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to stop the node.

#### `PUT /api/1.0/nodes/{system_id}/`
   Update a specific Node.

- `param hostname`
       The new hostname for this node.

    - `type hostname`
       unicode

- `param architecture`
       The new architecture for this node.

    - `type architecture`
       unicode

- `param min_hwe_kernel`
       A string containing the minimum kernel version allowed to be ran on
        this node.

    - `type min_hwe_kernel`
       unicode

- `param power_type`
       The new power - `type for` this node. If you use the default value,
        power_parameters will be set to the empty string. Available to admin
        users. See the [Power types]() section for a list of the available
        power types.

    - `type power_type`
       unicode

param [power_parameters](){param1}
       The new value for the 'param1' power parameter. Note that this is
        dynamic as the available parameters depend on the selected value of
        the Node's power_type. For instance, if the power_- `type is`
        'ether_wake', the only valid parameter is 'power_address' so one
        would want to pass 'myaddress' as the value of the
        'power_parameters_power_address' parameter. Available to admin
        users. See the [Power types]() section for a list of the available
        power parameters for each power type.

    type [power_parameters](){param1}
       unicode

- `param power_parameters_skip_check`
       Whether or not the new power parameters for this node should be
        checked against the expected power parameters for the node's power
        type ('true' or 'false'). The default is 'false'.

    - `type power_parameters_skip_check`
       unicode

- `param zone`
       Name of a valid physical zone in which to place this node

    - `type zone`
       unicode

- `param swap_size`
       Specifies the size of the swap file, in bytes. Field accept K, M, G
        and T suffixes for values expressed respectively in kilobytes,
        megabytes, gigabytes and terabytes.

    - `type swap_size`
       unicode

- `param boot_type`
       The installation - `type of` the node. 'fastpath': use the default
        installer. 'di' use the debian installer. Note that using 'di' is now
        deprecated and will be removed in favor of the default installer in
        MAAS 1.9.

    - `type boot_type`
       unicode

    Returns 404 if the node is node found. Returns 403 if the user does not
    have permission to update the node.

### Node Interface

Manage a node's interface. (Deprecated)

#### `DELETE /api/1.0/nodes/{system_id}/interfaces/{interface_id}/`
   Delete interface on node.

    Returns 404 if the node or interface is not found.

#### `GET /api/1.0/nodes/{system_id}/interfaces/{interface_id}/`
   Read interface on node.

    Returns 404 if the node or interface is not found.

#### `PUT /api/1.0/nodes/{system_id}/interfaces/{interface_id}/`
   Update interface on node.

    Fields for physical interface: :- `param name`: Name of the interface. :param
    mac_address: MAC address of the interface. :- `param tags`: Tags for the
    interface. :- `param vlan`: Untagged VLAN the interface is connected to.

    Fields for bond interface: :- `param name`: Name of the interface. :param
    mac_address: MAC address of the interface. :- `param tags`: Tags for the
    interface. :- `param vlan`: Tagged VLAN the interface is connected to. :param
    parents: Parent interfaces that make this bond.

    Fields for VLAN interface: :- `param tags`: Tags for the interface. :param
    vlan: VLAN the interface is connected to. :- `param parent`: Parent interface
    for this VLAN interface.

    Following are extra parameters that can be set on all interface types:

- `param mtu`
       Maximum transmission unit.

- `param accept_ra`
       Accept router advertisements. (IPv6 only)

- `param autoconf`
       Perform stateless autoconfiguration. (IPv6 only)

    Following are parameters specific to bonds:

- `param bond`-mode
       The operating mode of the bond. (Default: active-backup).

- `param bond`-miimon
       The link monitoring freqeuncy in milliseconds. (Default: 100).

- `param bond`-downdelay
       Specifies the time, in milliseconds, to wait before disabling a slave
        after a link failure has been detected.

- `param bond`-updelay
       Specifies the time, in milliseconds, to wait before enabling a slave
        after a link recovery has been detected.

- `param bond`-lacp_rate
       Option specifying the rate in which we'll ask our link partner to
        transmit LACPDU packets in 802.3ad mode. Available options are fast or
        slow. (Default: slow).

- `param bond`-xmit_hash_policy
       The transmit hash policy to use for slave selection in balance-xor,
        802.3ad, and tlb modes.

    Supported bonding modes (bond-mode): balance-rr - Transmit packets in
    sequential order from the first available slave through the last. This
    mode provides load balancing and fault tolerance.

    active-backup - Only one slave in the bond is active. A different slave
    becomes active if, and only if, the active slave fails. The bond's MAC
    address is externally visible on only one port (network adapter) to avoid
    confusing the switch.

    balance-xor - Transmit based on the selected transmit hash policy. The
    default policy is a simple \[(source MAC address XOR'd with destination
    MAC address XOR packet - `type ID`) modulo slave count\].

    broadcast - Transmits everything on all slave interfaces. This mode
    provides fault tolerance.

    802.3ad - IEEE 802.3ad Dynamic link aggregation. Creates aggregation
    groups that share the same speed and duplex settings. Utilizes all slaves
    in the active aggregator according to the 802.3ad specification.

    balance-tlb - Adaptive transmit load balancing: channel bonding that does
    not require any special switch support.

    balance-alb - Adaptive load balancing: includes balance-tlb plus receive
    load balancing (rlb) for IPV4 traffic, and does not require any special
    switch support. The receive load balancing is achieved by ARP negotiation.

    Returns 404 if the node or interface is not found.

### Node Interfaces

Manage interfaces on a node. (Deprecated)

#### `GET /api/1.0/nodes/{system_id}/interfaces/`
   List all interfaces belonging to a node or device.

    Returns 404 if the node is not found.

### Commissioning results

Read the collection of NodeResult in the MAAS.

#### `GET /api/1.0/installation-results/` `op=list`

List NodeResult visible to the user, optionally filtered.

- `param system_id`
   An optional list of system ids. Only the results related to the nodes
    with these system ids will be returned.

- `type system_id`
   iterable

- `param name`
   An optional list of names. Only the results with the specified names
    will be returned.

- `type name`
   iterable

- `param result_type`
   An optional result_type. Only the results with the specified
    result_- `type will` be returned.

- `type name`
   iterable

### Nodes

Manage the collection of all the nodes in the MAAS.

#### `GET /api/1.0/nodes/` `op=deployment_status`

Retrieve deployment status for multiple nodes.

- `param nodes`
   Mandatory list of system IDs for nodes whose status you wish to check.

Returns 400 if mandatory parameters are missing. Returns 403 if the user has
no permission to view any of the nodes.

#### `GET /api/1.0/nodes/` `op=list`

List all nodes.

#### `GET /api/1.0/nodes/` `op=list_allocated`

Fetch Nodes that were allocated to the User/oauth token.

#### `GET /api/1.0/nodes/` `op=power_parameters`

Retrieve power parameters for multiple nodes.

- `param id`
   An optional list of system ids. Only nodes with matching system ids will
    be returned.

- `type id`
   iterable

return
   A dictionary of power parameters, keyed by node system_id.

Raises 403 if the user is not an admin.

#### `POST /api/1.0/nodes/` `op=accept`

Accept declared nodes into the MAAS.

Nodes can be enlisted in the MAAS anonymously or by non-admin users, as
opposed to by an admin. These nodes are held in the New state; a MAAS admin
must first verify the authenticity of these enlistments, and accept them.

Enlistments can be accepted en masse, by passing multiple nodes to this
call. Accepting an already accepted node is not an error, but accepting one
that is already allocated, broken, etc. is.

- `param nodes`
   system_ids of the nodes whose enlistment is to be accepted. (An empty
    list is acceptable).

return
   The system_ids of any nodes that have their status changed by this
    call. Thus, nodes that were already accepted are excluded from the
    result.

Returns 400 if any of the nodes do not exist. Returns 403 if the user is not
an admin.

#### `POST /api/1.0/nodes/` `op=accept_all`

Accept all declared nodes into the MAAS.

Nodes can be enlisted in the MAAS anonymously or by non-admin users, as
opposed to by an admin. These nodes are held in the New state; a MAAS admin
must first verify the authenticity of these enlistments, and accept them.

return
   Representations of any nodes that have their status changed by this
    call. Thus, nodes that were already accepted are excluded from the
    result.

#### `POST /api/1.0/nodes/` `op=acquire`

Acquire an available node for deployment.

Constraints parameters can be used to acquire a node that possesses certain
characteristics. All the constraints are optional and when multiple
constraints are provided, they are combined using 'AND' semantics.

- `param name`
   Hostname of the returned node.

- `type name`
   unicode

- `param arch`
   Architecture of the returned node (e.g. 'i386/generic', 'amd64',
    'armhf/highbank', etc.).

- `type arch`
   unicode

- `param cpu_count`
   The minium number of CPUs the returned node must have.

- `type cpu_count`
   int

- `param mem`
   The minimum amount of memory (expressed in MB) the returned node must
    have.

- `type mem`
   float

- `param tags`
   List of tags the returned node must have.

- `type tags`
   list of unicodes

- `param not_tags`
   List of tags the acquired node must not have.

- `type tags`
   List of unicodes.

- `param connected_to`
   List of routers' MAC addresses the returned node must be connected to.

- `type connected_to`
   unicode or list of unicodes

- `param networks`
   List of networks (defined in MAAS) to which the node must be attached. A
    network can be identified by the name assigned to it in MAAS; or by an
    ip: prefix followed by any IP address that falls within the network; or
    a vlan: prefix followed by a numeric VLAN tag, e.g. vlan:23 for VLAN
    number 23. Valid VLAN tags must be in the range of 1 to 4095 inclusive.

- `type networks`
   list of unicodes

- `param not_networks`
   List of networks (defined in MAAS) to which the node must not be
    attached. The returned noded won't be attached to any of the specified
    networks. A network can be identified by the name assigned to it in
    MAAS; or by an ip: prefix followed by any IP address that falls within
    the network; or a vlan: prefix followed by a numeric VLAN tag, e.g.
    vlan:23 for VLAN number 23. Valid VLAN tags must be in the range of 1 to
    4095 inclusive.

- `type not_networks`
   list of unicodes

- `param not_connected_to`
   List of routers' MAC Addresses the returned node must not be connected
    to.

- `type connected_to`
   list of unicodes

- `param zone`
   An optional name for a physical zone the acquired node should be located
    in.

- `type zone`
   unicode

- `type not_in_zone`
   Optional list of physical zones from which the node should not be
    acquired.

- `type not_in_zone`
   List of unicodes.

- `param agent_name`
   An optional agent name to attach to the acquired node.

- `type agent_name`
   unicode

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

- `param dry_run`
   Optional boolean to indicate that the node should not actually be
    acquired (this is for support/troubleshooting, or users who want to see
    which node would match a constraint, without acquiring a node). Defaults
    to False.

- `type dry_run`
   bool

- `param verbose`
   Optional boolean to indicate that the user would like additional
    verbosity in the constraints_by_- `type field` (each constraint will be
    prefixed by verbose_, and contain the full data structure that
    indicates which node(s) matched).

- `type verbose`
   bool

Returns 409 if a suitable node matching the constraints could not be found.

#### `POST /api/1.0/nodes/` `op=check_commissioning`

Check all commissioning nodes to see if they are taking too long.

Anything that has been commissioning for longer than
settings.COMMISSIONING_TIMEOUT is moved into the FAILED_COMMISSIONING
status.

#### `POST /api/1.0/nodes/` `op=new`

Create a new Node.

Adding a server to a MAAS puts it on a path that will wipe its disks and
re-install its operating system, in the event that it PXE boots. In
anonymous enlistment (and when the enlistment is done by a non-admin), the
node is held in the "New" state for approval by a MAAS admin.

The minimum data required is: architecture=&lt;arch string&gt; (e.g.
"i386/generic") mac_addresses=&lt;value&gt; (e.g. "aa:bb:cc:dd:ee:ff")
autodetect_nodegroup=True

- `param architecture`
   A string containing the architecture - `type of` the node. (For example,
    "i386", or "amd64".) To determine the supported architectures, use the
    boot-resources endpoint.

- `param min_hwe_kernel`
   A string containing the minimum kernel version allowed to be ran on this
    node.

- `param subarchitecture`
   A string containing the subarchitecture - `type of` the node. (For example,
    "generic" or "hwe-t".) To determine the supported subarchitectures, use
    the boot-resources endpoint.

- `param mac_addresses`
   One or more MAC addresses for the node. To specify more than one MAC
    address, the parameter must be specified twice. (such as "nodes new
    mac_addresses=01:02:03:04:05:06 mac_addresses=02:03:04:05:06:07")

- `param hostname`
   A hostname. If not given, one will be generated.

- `param power_type`
   A power management type, if applicable (e.g. "virsh", "ipmi").

- `param autodetect_nodegroup`
   (boolean) Whether or not to attempt nodegroup detection for this node.
    The nodegroup is determined based on the requestor's IP address range.
    (if the API request comes from an IP range within a known nodegroup,
    that nodegroup will be used.)

- `param nodegroup`
   The id of the nodegroup this node belongs to.

#### `POST /api/1.0/nodes/` `op=release`

Release multiple nodes.

This places the nodes back into the pool, ready to be reallocated.

- `param nodes`
   system_ids of the nodes which are to be released. (An empty list is
    acceptable).

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

return
   The system_ids of any nodes that have their status changed by this
    call. Thus, nodes that were already released are excluded from the
    result.

Returns 400 if any of the nodes cannot be found. Returns 403 if the user
does not have permission to release any of the nodes. Returns a 409 if any
of the nodes could not be released due to their current state.

#### `POST /api/1.0/nodes/` `op=set_zone`

Assign multiple nodes to a physical zone at once.

- `param zone`
   Zone name. If omitted, the zone is "none" and the nodes will be taken
    out of their physical zones.

- `param nodes`
   system_ids of the nodes whose zones are to be set. (An empty list is
    acceptable).

Raises 403 if the user is not an admin.

### Partitions

Manage partition on a block device.

#### `DELETE /api/1.0/nodes/{system_id}/blockdevices/{device_id}/partition/{partition_id}`
   Delete partition.

    Returns 404 if the node, block device, or partition are not found.

#### `GET /api/1.0/nodes/{system_id}/blockdevices/{device_id}/partition/{partition_id}`
   Read partition.

    Returns 404 if the node, block device, or partition are not found.

#### `POST /api/1.0/nodes/{system_id}/blockdevices/{device_id}/partition/{partition_id}`
`op=format`

Format a partition.

- `param fstype`
   - `Type of` filesystem.

- `param uuid`
   The UUID for the filesystem.

- `param label`
   The label for the filesystem.

Returns 403 when the user doesn't have the ability to format the partition.
Returns 404 if the node, block device, or partition is not found.

#### `POST /api/1.0/nodes/{system_id}/blockdevices/{device_id}/partition/{partition_id}`
`op=mount`

Mount the filesystem on partition.

- `param mount_point`
   Path on the filesystem to mount.

Returns 403 when the user doesn't have the ability to mount the partition.
Returns 404 if the node, block device, or partition is not found.

#### `POST /api/1.0/nodes/{system_id}/blockdevices/{device_id}/partition/{partition_id}`
`op=unformat`

Unformat a partition.

#### `POST /api/1.0/nodes/{system_id}/blockdevices/{device_id}/partition/{partition_id}`
`op=unmount`

Unmount the filesystem on partition.

Returns 400 if the partition is not formatted or not currently mounted.
Returns 403 when the user doesn't have the ability to unmount the partition.
Returns 404 if the node, block device, or partition is not found.

### Partitions

Manage partitions on a block device.

#### `GET /api/1.0/nodes/{system_id}/blockdevices/{device_id}/partitions/`
   List all partitions on the block device.

    Returns 404 if the node or the block device are not found.

#### `POST /api/1.0/nodes/{system_id}/blockdevices/{device_id}/partitions/`
   Create a partition on the block device.

- `param size`
       The size of the partition.

- `param uuid`
       UUID for the partition. Only used if the partition table - `type for` the
        block device is GPT.

- `param bootable`
       If the partition should be marked bootable.

    Returns 404 if the node or the block device are not found.

### RAID Device

Manage a specific RAID device on a node.

#### `DELETE /api/1.0/nodes/{system_id}/raid/{raid_id}/`
   Delete RAID on node.

    Returns 404 if the node or RAID is not found. Returns 409 if the node is
    not Ready.

#### `GET /api/1.0/nodes/{system_id}/raid/{raid_id}/`
   Read RAID device on node.

    Returns 404 if the node or RAID is not found.

#### `PUT /api/1.0/nodes/{system_id}/raid/{raid_id}/`
   Update RAID on node.

- `param name`
       Name of the RAID.

- `param uuid`
       UUID of the RAID.

- `param add_block_devices`
       Block devices to add to the RAID.

- `param remove_block_devices`
       Block devices to remove from the RAID.

- `param add_spare_devices`
       Spare block devices to add to the RAID.

- `param remove_spare_devices`
       Spare block devices to remove from the RAID.

- `param add_partitions`
       Partitions to add to the RAID.

- `param remove_partitions`
       Partitions to remove from the RAID.

- `param add_spare_partitions`
       Spare partitions to add to the RAID.

- `param remove_spare_partitions`
       Spare partitions to remove from the RAID.

    Returns 404 if the node or RAID is not found. Returns 409 if the node is
    not Ready.

### RAID Devices

Manage all RAID devices on a node.

#### `GET /api/1.0/nodes/{system_id}/raids/`
   List all RAID devices belonging to node.

    Returns 404 if the node is not found.

#### `POST /api/1.0/nodes/{system_id}/raids/`
   Creates a RAID

- `param name`
       Name of the RAID.

- `param uuid`
       UUID of the RAID.

- `param level`
       RAID level.

- `param block_devices`
       Block devices to add to the RAID.

- `param spare_devices`
       Spare block devices to add to the RAID.

- `param partitions`
       Partitions to add to the RAID.

- `param spare_partitions`
       Spare partitions to add to the RAID.

    Returns 404 if the node is not found. Returns 409 if the node is not
    Ready.

### SSH Key

Manage an SSH key.

SSH keys can be retrieved or deleted.

#### `DELETE /api/1.0/account/prefs/sshkeys/{keyid}/`
   DELETE an SSH key.

    Returns 404 if the key does not exist. Returns 401 if the key does not
    belong to the calling user.

#### `GET /api/1.0/account/prefs/sshkeys/{keyid}/`
   GET an SSH key.

    Returns 404 if the key does not exist.

#### `POST /api/1.0/account/prefs/sshkeys/{keyid}/` `op=delete`

DELETE an SSH key.

Returns 404 if the key does not exist. Returns 401 if the key does not
belong to the calling user.

### SSH Keys

Manage the collection of all the SSH keys in this MAAS.

#### `GET /api/1.0/account/prefs/sshkeys/` `op=list`

List all keys belonging to the requesting user.

#### `POST /api/1.0/account/prefs/sshkeys/` `op=new`

Add a new SSH key to the requesting user's account.

The request payload should contain the public SSH key data in form data
whose name is "key".

### SSL Key

Manage an SSL key.

SSL keys can be retrieved or deleted.

#### `DELETE /api/1.0/account/prefs/sslkeys/{keyid}/`
   DELETE an SSL key.

    Returns 401 if the key does not belong to the requesting user. Returns 204
    if the key is successfully deleted.

#### `GET /api/1.0/account/prefs/sslkeys/{keyid}/`
   GET an SSL key.

    Returns 404 if the keyid is not found. Returns 401 if the key does not
    belong to the requesting user.

#### `GET /api/1.0/account/prefs/sslkeys/{keyid}/` `op=delete`

DELETE an SSL key.

Returns 401 if the key does not belong to the requesting user. Returns 204
if the key is successfully deleted.

### SSL Keys

Operations on multiple keys.

#### `GET /api/1.0/account/prefs/sslkeys/` `op=list`

List all keys belonging to the requesting user.

#### `POST /api/1.0/account/prefs/sslkeys/` `op=new`

Add a new SSL key to the requesting user's account.

The request payload should contain the SSL key data in form data whose name
is "key".

### Space

Manage space.

#### `DELETE /api/1.0/spaces/{space_id}/`
   Delete space.

    Returns 404 if the space is not found.

#### `GET /api/1.0/spaces/{space_id}/`
   Read space.

    Returns 404 if the space is not found.

#### `PUT /api/1.0/spaces/{space_id}/`
   Update space.

- `param name`
       Name of the space.

    Returns 404 if the space is not found.

### Spaces

Manage spaces.

#### `GET /api/1.0/spaces/`
   List all spaces.

#### `POST /api/1.0/spaces/`
   Create a space.

- `param name`
       Name of the space.

### Subnet

Manage subnet.

#### `DELETE /api/1.0/subnets/{subnet_id}/`
   Delete subnet.

    Returns 404 if the subnet is not found.

#### `GET /api/1.0/subnets/{subnet_id}/`
   Read subnet.

    Returns 404 if the subnet is not found.

#### `GET /api/1.0/subnets/{subnet_id}/` `op=ip_addresses`

Returns a summary of IP addresses assigned to this subnet.

Optional arguments: with_username: (default=True) if False, suppresses the
display of usernames associated with each address. with_node_summary:
(default=True) if False, suppresses the display of any node associated with
each address.

#### `GET /api/1.0/subnets/{subnet_id}/` `op=reserved_ip_ranges`

Lists IP ranges currently reserved in the subnet.

Returns 404 if the subnet is not found.

#### `GET /api/1.0/subnets/{subnet_id}/` `op=statistics`

Returns statistics for the specified subnet, including:

num_available - the number of available IP addresses largest_available -
the largest number of contiguous free IP addresses num_unavailable - the
number of unavailable IP addresses total_addresses - the sum of the
available plus unavailable addresses usage - the (floating point) usage
percentage of this subnet usage_string - the (formatted unicode) usage
percentage of this subnet ranges - the specific IP ranges present in ths
subnet (if specified)

Optional arguments: include_ranges: if True, includes detailed information
about the usage of this range.

Returns 404 if the subnet is not found.

#### `GET /api/1.0/subnets/{subnet_id}/` `op=unreserved_ip_ranges`

Lists IP ranges currently unreserved in the subnet.

Returns 404 if the subnet is not found.

#### `PUT /api/1.0/subnets/{subnet_id}/`
   Update subnet.

- `param name`
       Name of the subnet.

- `param vlan`
       VLAN this subnet belongs to.

- `param space`
       Space this subnet is in.

- `param cidr`
       The network CIDR for this subnet.

- `param gateway_ip`
       The gateway IP address for this subnet.

- `param dns_servers`
       Comma-seperated list of DNS servers for this subnet.

    Returns 404 if the subnet is not found.

### Subnets

Manage subnets.

#### `GET /api/1.0/subnets/`
   List all subnets.

#### `POST /api/1.0/subnets/`
   Create a subnet.

- `param name`
       Name of the subnet.

- `param fabric`
       Fabric for the subnet. Defaults to the fabric the provided VLAN
        belongs to or defaults to the default fabric.

- `param vlan`
       VLAN this subnet belongs to. Defaults to the default VLAN for the
        provided fabric or defaults to the default VLAN in the default fabric.

- `param vid`
       VID of the VLAN this subnet belongs to. Only used when vlan is not
        provided. Picks the VLAN with this VID in the provided fabric or the
        default fabric if one is not given.

- `param space`
       Space this subnet is in. Defaults to the default space.

- `param cidr`
       The network CIDR for this subnet.

- `param gateway_ip`
       The gateway IP address for this subnet.

- `param dns_servers`
       Comma-seperated list of DNS servers for this subnet.

### Tag

Manage a Tag.

Tags are properties that can be associated with a Node and serve as criteria
for selecting and allocating nodes.

A Tag is identified by its name.

#### `DELETE /api/1.0/tags/{name}/`
   Delete a specific Tag.

    Returns 404 if the tag is not found. Returns 204 if the tag is
    successfully deleted.

#### `GET /api/1.0/tags/{name}/`
   Read a specific Tag.

    Returns 404 if the tag is not found.

#### `GET /api/1.0/tags/{name}/` `op=nodes`

Get the list of nodes that have this tag.

Returns 404 if the tag is not found.

#### `POST /api/1.0/tags/{name}/` `op=rebuild`

Manually trigger a rebuild the tag &lt;=&gt; node mapping.

This is considered a maintenance operation, which should normally not be
necessary. Adding nodes or updating a tag's definition should automatically
trigger the appropriate changes.

Returns 404 if the tag is not found.

#### `POST /api/1.0/tags/{name}/` `op=update_nodes`

Add or remove nodes being associated with this tag.

- `param add`
   system_ids of nodes to add to this tag.

- `param remove`
   system_ids of nodes to remove from this tag.

- `param definition`
   (optional) If supplied, the definition will be validated against the
    current definition of the tag. If the value does not match, then the
    update will be dropped (assuming this was just a case of a worker being
    out-of-date)

- `param nodegroup`
   A uuid of a nodegroup being processed. This value is optional. If not
    supplied, the requester must be a superuser. If supplied, then the
    requester must be the worker associated with that nodegroup, and only
    nodes that are part of that nodegroup can be updated.

Returns 404 if the tag is not found. Returns 401 if the user does not have
permission to update the nodes. Returns 409 if 'definition' doesn't match
the current definition.

#### `PUT /api/1.0/tags/{name}/`
   Update a specific Tag.

- `param name`
       The name of the Tag to be created. This should be a short name, and
        will be used in the URL of the tag.

- `param comment`
       A long form description of what the tag is meant for. It is meant as a
        human readable description of the tag.

- `param definition`
       An XPATH query that will be evaluated against the hardware_details
        stored for all nodes (output of lshw -xml).

    Returns 404 if the tag is not found.

### Tags

Manage the collection of all the Tags in this MAAS.

#### `GET /api/1.0/tags/` `op=list`

List Tags.

Get a listing of all tags that are currently defined.

#### `POST /api/1.0/tags/` `op=new`

Create a new Tag.

- `param name`
   The name of the Tag to be created. This should be a short name, and will
    be used in the URL of the tag.

- `param comment`
   A long form description of what the tag is meant for. It is meant as a
    human readable description of the tag.

- `param definition`
   An XPATH query that will be evaluated against the hardware_details
    stored for all nodes (output of lshw -xml).

- `param kernel_opts`
   Can be None. If set, nodes associated with this tag will add this string
    to their kernel options when booting. The value overrides the global
    'kernel_opts' setting. If more than one tag is associated with a node,
    the one with the lowest alphabetical name will be picked (eg 01-my-tag
    will be taken over 99-tag-name).

Returns 401 if the user is not an admin.

### Users

Manage the user accounts of this MAAS.

#### `GET /api/1.0/users/`
   List users.

#### `POST /api/1.0/users/`
   Create a MAAS user account.

    This is not safe: the password is sent in plaintext. Avoid it for
    production, unless you are confident that you can prevent eavesdroppers
    from observing the request.

- `param username`
       Identifier-style username for the new user.

    - `type username`
       unicode

- `param email`
       Email address for the new user.

    - `type email`
       unicode

- `param password`
       Password for the new user.

    - `type password`
       unicode

- `param is_superuser`
       Whether the new user is to be an administrator.

    - `type is_superuser`
       bool ('0' for False, '1' for True)

    Returns 400 if any mandatory parameters are missing.

### MAAS version

Information about this MAAS instance.

This returns a JSON dictionary with information about this MAAS instance:

    {
        'version': '1.8.0',
        'subversion': 'alpha10+bzr3750',
        'capabilities': ['capability1', 'capability2', ...]
    }

#### `GET /api/1.0/version/`
   Version and capabilities of this MAAS instance.

### VLAN

Manage VLAN on a fabric.

#### `DELETE /api/1.0/fabrics/{fabric_id}/vlans/{vid}/`
   Delete VLAN on fabric.

    Returns 404 if the fabric or VLAN is not found.

#### `GET /api/1.0/fabrics/{fabric_id}/vlans/{vid}/`
   Read VLAN on fabric.

    Returns 404 if the fabric or VLAN is not found.

#### `PUT /api/1.0/fabrics/{fabric_id}/vlans/{vid}/`
   Update VLAN.

- `param name`
       Name of the VLAN.

- `param vid`
       VLAN ID of the VLAN.

    - `type vid`
       integer

- `param mtu`
       The MTU to use on the VLAN.

    - `type mtu`
       integer

    Returns 404 if the fabric or VLAN is not found.

### VLANs

Manage VLANs on a fabric.

#### `GET /api/1.0/fabrics/{fabric_id}/vlans/`
   List all VLANs belonging to fabric.

    Returns 404 if the fabric is not found.

#### `POST /api/1.0/fabrics/{fabric_id}/vlans/`
   Create a VLAN.

- `param name`
       Name of the VLAN.

- `param vid`
       VLAN ID of the VLAN.

### Volume group

Manage volume group on a node.

#### `DELETE /api/1.0/nodes/{system_id}/volume-group/{volume_group_id}/`
   Delete volume group on node.

    Returns 404 if the node or volume group is not found. Returns 409 if the
    node is not Ready.

#### `GET /api/1.0/nodes/{system_id}/volume-group/{volume_group_id}/`
   Read volume group on node.

    Returns 404 if the node or volume group is not found.

#### `POST /api/1.0/nodes/{system_id}/volume-group/{volume_group_id}/`
`op=create_logical_volume`

Create a logical volume in the volume group.

- `param name`
   Name of the logical volume.

- `param uuid`
   (optional) UUID of the logical volume.

- `param size`
   Size of the logical volume.

Returns 404 if the node or volume group is not found. Returns 409 if the
node is not Ready.

#### `POST /api/1.0/nodes/{system_id}/volume-group/{volume_group_id}/`
`op=delete_logical_volume`

Delete a logical volume in the volume group.

- `param id`
   ID of the logical volume.

Returns 403 if no logical volume with id. Returns 404 if the node or volume
group is not found. Returns 409 if the node is not Ready.

#### `PUT /api/1.0/nodes/{system_id}/volume-group/{volume_group_id}/`
   Read volume group on node.

- `param name`
       Name of the volume group.

- `param uuid`
       UUID of the volume group.

- `param add_block_devices`
       Block devices to add to the volume group.

- `param remove_block_devices`
       Block devices to remove from the volume group.

- `param add_partitions`
       Partitions to add to the volume group.

- `param remove_partitions`
       Partitions to remove from the volume group.

    Returns 404 if the node or volume group is not found. Returns 409 if the
    node is not Ready.

### Volume groups

Manage volume groups on a node.

#### `GET /api/1.0/nodes/{system_id}/volume-groups/`
   List all volume groups belonging to node.

    Returns 404 if the node is not found.

#### `POST /api/1.0/nodes/{system_id}/volume-groups/`
   Create a volume group belonging to node.

- `param name`
       Name of the volume group.

- `param uuid`
       (optional) UUID of the volume group.

- `param block_devices`
       Block devices to add to the volume group.

- `param partitions`
       Partitions to add to the volume group.

    Returns 404 if the node is not found. Returns 409 if the node is not
    Ready.

### Zone

Manage a physical zone.

Any node is in a physical zone, or "zone" for short. The meaning of a
physical zone is up to you: it could identify e.g. a server rack, a network,
or a data centre. Users can then allocate nodes from specific physical
zones, to suit their redundancy or performance requirements.

This functionality is only available to administrators. Other users can view
physical zones, but not modify them.

#### `DELETE /api/1.0/zones/{name}/`
   DELETE request. Delete zone.

    Returns 404 if the zone is not found. Returns 204 if the zone is
    successfully deleted.

#### `GET /api/1.0/zones/{name}/`
   GET request. Return zone.

    Returns 404 if the zone is not found.

#### `PUT /api/1.0/zones/{name}/`
   PUT request. Update zone.

    Returns 404 if the zone is not found.

### Zones

Manage physical zones.

#### `GET /api/1.0/zones/`
   List zones.

    Get a listing of all the physical zones.

#### `POST /api/1.0/zones/`
   Create a new physical zone.

- `param name`
       Identifier-style name for the new zone.

    - `type name`
       unicode

- `param description`
       Free-form description of the new zone.

    - `type description`
       unicode

## Power types

This is the list of the supported power types and their associated power
parameters. Note that the list of usable power types for a particular cluster
might be a subset of this list if the cluster in question is from an older
version of MAAS.

### ether_wake (Wake-on-LAN)

Power parameters:

- mac_address (MAC Address).

### virsh (Virsh (virtual systems))

Power parameters:

- power_address (Power address).
- power_id (Power ID).
- power_pass (Power password (optional)).

### vmware (VMWare)

Power parameters:

- power_vm_name (VM Name (if UUID unknown)).
- power_uuid (VM UUID (if known)).
- power_address (VMware hostname).
- power_user (VMware username).
- power_pass (VMware password).
- power_port (VMware API port (optional)).
- power_protocol (VMware API protocol (optional)).

### fence_cdu (Sentry Switch CDU)

Power parameters:

- power_address (Power address).
- power_id (Power ID).
- power_user (Power user).
- power_pass (Power password).

### ipmi (IPMI)

Power parameters:

- power_driver (Power driver). Choices: 'LAN' (LAN \[IPMI 1.5\]),
    'LAN_2_0' (LAN_2_0 \[IPMI 2.0\]) Default: 'LAN_2_0'.
- power_address (IP address).
- power_user (Power user).
- power_pass (Power password).
- mac_address (Power MAC).

### moonshot (HP Moonshot - iLO4 (IPMI))

Power parameters:

- power_address (Power address).
- power_user (Power user).
- power_pass (Power password).
- power_hwaddress (Power hardware address).

### sm15k (SeaMicro 15000)

Power parameters:

- system_id (System ID).
- power_address (Power address).
- power_user (Power user).
- power_pass (Power password).
- power_control (Power control type). Choices: 'ipmi' (IPMI), 'restapi'
    (REST API v0.9), 'restapi2' (REST API v2.0) Default: 'ipmi'.

### amt (Intel AMT)

Power parameters:

- mac_address (MAC Address).
- power_pass (Power password).
- power_address (Power address).

### dli (Digital Loggers, Inc. PDU)

Power parameters:

- outlet_id (Outlet ID).
- power_address (Power address).
- power_user (Power user).
- power_pass (Power password).

### ucsm (Cisco UCS Manager)

Power parameters:

- uuid (Server UUID).
- power_address (URL for XML API).
- power_user (API user).
- power_pass (API password).

### mscm (HP Moonshot - iLO Chassis Manager)

Power parameters:

- power_address (IP for MSCM CLI API).
- power_user (MSCM CLI API user).
- power_pass (MSCM CLI API password).
- node_id (Node ID - Must adhere to cXnY format (X=cartridge number, Y=node
    number).).

### msftocs (Microsoft OCS - Chassis Manager)

Power parameters:

- power_address (Power address).
- power_port (Power port).
- power_user (Power user).
- power_pass (Power password).
- blade_id (Blade ID (Typically 1-24)).

### apc (American Power Conversion (APC) PDU)

Power parameters:

- power_address (IP for APC PDU).
- node_outlet (APC PDU node outlet number (1-16)).
- power_on_delay (Power ON outlet delay (seconds)). Default: '5'.

### hmc (IBM Hardware Management Console (HMC))

Power parameters:

- power_address (IP for HMC).
- power_user (HMC username).
- power_pass (HMC password).
- server_name (HMC Managed System server name).
- lpar (HMC logical partition).

