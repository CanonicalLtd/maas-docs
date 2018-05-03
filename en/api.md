Title: API | MAAS
table_of_contents: True

# MAAS API

Restful MAAS API.

This is the documentation for the API that lets you control and query MAAS.
The API is "Restful", which means that you access it through normal HTTP
requests.

## API versions

At any given time, MAAS may support multiple versions of its API. The version
number is included in the API's URL, e.g. /api/2.0/

For now, 2.0 is the only supported version.

The current API version number can be retrieved by issuing a GET to
"/api/version/". Accessing an old or unknown API version URL will result in a
"410 GONE" being returned, along with a descriptive error message. Both the
error message and the api version are returned as plaintext.

## HTTP methods and parameter-passing

The following HTTP methods are available for accessing the API:
   -   GET (for information retrieval and queries),
   -   POST (for asking the system to do things),
   -   PUT (for updating objects), and
   -   DELETE (for deleting objects).

All methods except DELETE may take parameters, but they are not all passed in
the same way. GET parameters are passed in the URL, as is normal with a GET:
"/item/?foo=bar" passes parameter "foo" with value "bar".

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

For example, to list all machines, you might GET "/api/2.0/machines".

## Operations

### Logged-in user

Manage the current logged-in user.

##### `GET /api/2.0/account/ op=list_authorisation_tokens`

List authorisation tokens available to the currently logged-in user.

- `return`
   list of dictionaries representing each key's name and token.

##### `POST /api/2.0/account/ op=create_authorisation_token`

Create an authorisation OAuth token and OAuth consumer.

- `param name`
   Optional name of the token that will be generated.

- `type name`
   unicode

- `return`
   a json dict with four keys: 'token_key',
   'token_secret', 'consumer_key' and 'name'
   (e.g. {token_key: 's65244576fgqs', token_secret: 'qsdfdhv34',
   consumer_key: '68543fhj854fg', name: 'MAAS consumer'}).

- `rtype`
   string (json)

##### `POST /api/2.0/account/ op=delete_authorisation_token`

Delete an authorisation OAuth token and the related OAuth consumer.

- `param token_key`
   The key of the token to be deleted.

- `type token_key`
   unicode

##### `POST /api/2.0/account/ op=update_token_name`

Modify the consumer name of an authorisation OAuth token.

- `param token`
   Can be the whole token or only the token key.

- `type token`
   unicode

- `param name`
   New name of the token.

- `type name`
   unicode

### Bcache Cache Set

Manage bcache cache set on a machine.

##### `DELETE /api/2.0/nodes/{system_id}/bcache-cache-set/{id}/`

Delete cache set on a machine.

Returns 400 if the cache set is in use. Returns 404 if the machine or cache
set is not found. Returns 409 if the machine is not Ready.

##### `GET /api/2.0/nodes/{system_id}/bcache-cache-set/{id}/`

Read bcache cache set on a machine.

Returns 404 if the machine or cache set is not found.

##### `PUT /api/2.0/nodes/{system_id}/bcache-cache-set/{id}/`

Delete bcache on a machine.

- `param cache_device`
   Cache block device to replace current one.

- `param cache_partition`
   Cache partition to replace current one.

Specifying both a cache_device and a cache_partition is not allowed.

Returns 404 if the machine or the cache set is not found. Returns 409 if the
machine is not Ready.

### Bcache Cache Sets

Manage bcache cache sets on a machine.

##### `GET /api/2.0/nodes/{system_id}/bcache-cache-sets/`

List all bcache cache sets belonging to a machine.

Returns 404 if the machine is not found.

##### `POST /api/2.0/nodes/{system_id}/bcache-cache-sets/`

Creates a Bcache Cache Set.

- `param cache_device`
   Cache block device.

- `param cache_partition`
   Cache partition.

Specifying both a cache_device and a cache_partition is not allowed.

Returns 404 if the machine is not found. Returns 409 if the machine is not
Ready.

### Bcache Device

Manage bcache device on a machine.

##### `DELETE /api/2.0/nodes/{system_id}/bcache/{id}/`

Delete bcache on a machine.

Returns 404 if the machine or bcache is not found. Returns 409 if the machine
is not Ready.

##### `GET /api/2.0/nodes/{system_id}/bcache/{id}/`

Read bcache device on a machine.

Returns 404 if the machine or bcache is not found.

##### `PUT /api/2.0/nodes/{system_id}/bcache/{id}/`

Delete bcache on a machine.

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

Specifying both a device and a partition for a given role (cache or backing)
is not allowed.

Returns 404 if the machine or the bcache is not found. Returns 409 if the
machine is not Ready.

### Bcache Devices

Manage bcache devices on a machine.

##### `GET /api/2.0/nodes/{system_id}/bcaches/`

List all bcache devices belonging to a machine.

Returns 404 if the machine is not found.

##### `POST /api/2.0/nodes/{system_id}/bcaches/`

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

Specifying both a device and a partition for a given role (cache or backing)
is not allowed.

Returns 404 if the machine is not found. Returns 409 if the machine is not
Ready.

### Block device

Manage a block device on a machine.

##### `DELETE /api/2.0/nodes/{system_id}/blockdevices/{id}/`

Delete block device on a machine.

Returns 404 if the machine or block device is not found. Returns 403 if the
user is not allowed to delete the block device. Returns 409 if the machine is
not Ready.

##### `GET /api/2.0/nodes/{system_id}/blockdevices/{id}/`

Read block device on node.

Returns 404 if the machine or block device is not found.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/{id}/ op=add_tag`

Add a tag to block device on a machine.

- `param tag`
   The tag being added.

Returns 404 if the machine or block device is not found. Returns 403 if the
user is not allowed to update the block device. Returns 409 if the machine is
not Ready.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/{id}/ op=format`

Format block device with filesystem.

- `param fstype`
   Type of filesystem.

- `param uuid`
   UUID of the filesystem.

Returns 403 when the user doesn't have the ability to format the block device.
Returns 404 if the machine or block device is not found. Returns 409 if the
machine is not Ready or Allocated.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/{id}/ op=mount`

Mount the filesystem on block device.

- `param mount_point`
   Path on the filesystem to mount.

- `param mount_options`
   Options to pass to mount(8).

Returns 403 when the user doesn't have the ability to mount the block device.
Returns 404 if the machine or block device is not found. Returns 409 if the
machine is not Ready or Allocated.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/{id}/ op=remove_tag`

Remove a tag from block device on a machine.

- `param tag`
   The tag being removed.

Returns 404 if the machine or block device is not found. Returns 403 if the
user is not allowed to update the block device. Returns 409 if the machine is
not Ready.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/{id}/ op=set_boot_disk`

Set this block device as the boot disk for the machine.

Returns 400 if the block device is a virtual block device. Returns 404 if the
machine or block device is not found. Returns 403 if the user is not allowed
to update the block device. Returns 409 if the machine is not Ready or
Allocated.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/{id}/ op=unformat`

Unformat block device with filesystem.

Returns 400 if the block device is not formatted, currently mounted, or part
of a filesystem group. Returns 403 when the user doesn't have the ability to
unformat the block device. Returns 404 if the machine or block device is not
found. Returns 409 if the machine is not Ready or Allocated.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/{id}/ op=unmount`

Unmount the filesystem on block device.

Returns 400 if the block device is not formatted or not currently mounted.
Returns 403 when the user doesn't have the ability to unmount the block
device. Returns 404 if the machine or block device is not found. Returns 409
if the machine is not Ready or Allocated.

##### `PUT /api/2.0/nodes/{system_id}/blockdevices/{id}/`

Update block device on a machine.

Machines must have a status of Ready to have access to all options. Machines
with Deployed status can only have the name, model, serial, and/or id_path
updated for a block device. This is intented to allow a bad block device to be
replaced while the machine remains deployed.

Fields for physical block device:

- `param name`
   Name of the block device.

- `param model`
   Model of the block device.

- `param serial`
   Serial number of the block device.

- `param id_path`
   (optional) Only used if model and serial cannot be provided. This should
   be a path that is fixed and doesn't change depending on the boot order or
   kernel version.

- `param size`
   Size of the block device.

- `param block_size`
   Block size of the block device.

Fields for virtual block device:

- `param name`
   Name of the block device.

- `param uuid`
   UUID of the block device.

- `param size`
   Size of the block device. (Only allowed for logical volumes.)

Returns 404 if the machine or block device is not found. Returns 403 if the
user is not allowed to update the block device. Returns 409 if the machine is
not Ready.

### Block devices

Manage block devices on a machine.

##### `GET /api/2.0/nodes/{system_id}/blockdevices/`

List all block devices belonging to a machine.

Returns 404 if the machine is not found.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/`

Create a physical block device.

- `param name`
   Name of the block device.

- `param model`
   Model of the block device.

- `param serial`
   Serial number of the block device.

- `param id_path`
   (optional) Only used if model and serial cannot be
   provided. This should be a path that is fixed and doesn't change
   depending on the boot order or kernel version.

- `param size`
   Size of the block device.

- `param block_size`
   Block size of the block device.

Returns 404 if the node is not found.

### Boot resource

Manage a boot resource.

##### `DELETE /api/2.0/boot-resources/{id}/`

Delete boot resource.

##### `GET /api/2.0/boot-resources/{id}/`

Read a boot resource.

### Boot resources

Manage the boot resources.

##### `GET /api/2.0/boot-resources/`

List all boot resources.

- `param type`
   Type of boot resources to list. Default: all

##### `GET /api/2.0/boot-resources/ op=is_importing`

Return import status.

##### `POST /api/2.0/boot-resources/`

Uploads a new boot resource.

- `param name`
   Name of the boot resource.

- `param title`
   Title for the boot resource.

- `param architecture`
   Architecture the boot resource supports.

- `param filetype`
   Filetype for uploaded content. (Default: tgz,
   Supported: tgz, ddtgz, ddtbz, ddtxz, ddtar, ddbz2, ddgz, ddxz, ddraw

- `param content`
   Image content. Note: this is not a normal parameter,
   but a file upload.

##### `POST /api/2.0/boot-resources/ op=import`

Import the boot resources.

##### `POST /api/2.0/boot-resources/ op=stop_import`

Stop import of boot resources.

### Boot source

Manage a boot source.

##### `DELETE /api/2.0/boot-sources/{id}/`

Delete a specific boot source.

##### `GET /api/2.0/boot-sources/{id}/`

Read a boot source.

##### `PUT /api/2.0/boot-sources/{id}/`

Update a specific boot source.

- `param url`
   The URL of the BootSource.

- `param keyring_filename`
   The path to the keyring file for this
   BootSource.

- `param keyring_data`
   The GPG keyring for this BootSource,
   base64-encoded data.

### Boot source selection

Manage a boot source selection.

##### `DELETE /api/2.0/boot-sources/{boot_source_id}/selections/{id}/`

Delete a specific boot source.

##### `GET /api/2.0/boot-sources/{boot_source_id}/selections/{id}/`

Read a boot source selection.

##### `PUT /api/2.0/boot-sources/{boot_source_id}/selections/{id}/`

Update a specific boot source selection.

- `param os`
   The OS (e.g. ubuntu, centos) for which to import resources.

- `param release`
   The release for which to import resources.

- `param arches`
   The list of architectures for which to import resources.

- `param subarches`
   The list of subarchitectures for which to import
   resources.

- `param labels`
   The list of labels for which to import resources.

### Boot source selections

Manage the collection of boot source selections.

##### `GET /api/2.0/boot-sources/{boot_source_id}/selections/`

List boot source selections.

Get a listing of a boot source's selections.

##### `POST /api/2.0/boot-sources/{boot_source_id}/selections/`

Create a new boot source selection.

- `param os`
   The OS (e.g. ubuntu, centos) for which to import resources.

- `param release`
   The release for which to import resources.

- `param arches`
   The architecture list for which to import resources.

- `param subarches`
   The subarchitecture list for which to import
   resources.

- `param labels`
   The label lists for which to import resources.

### Boot sources

Manage the collection of boot sources.

##### `GET /api/2.0/boot-sources/`

List boot sources.

Get a listing of boot sources.

##### `POST /api/2.0/boot-sources/`

Create a new boot source.

- `param url`
   The URL of the BootSource.

- `param keyring_filename`
   The path to the keyring file for
   this BootSource.

- `param keyring_data`
   The GPG keyring for this BootSource,
   base64-encoded.

### Commissioning script

Manage a custom commissioning script.

> This functionality is only available to administrators.
>
> This endpoint has been deprecated in favor of the node-script endpoint.

##### `DELETE /api/2.0/commissioning-scripts/{name}`

Delete a commissioning script.

##### `GET /api/2.0/commissioning-scripts/{name}`

Read a commissioning script.

##### `PUT /api/2.0/commissioning-scripts/{name}`

Update a commissioning script.

### Commissioning scripts

Manage custom commissioning scripts.

> This functionality is only available to administrators.
>
> This endpoint has been deprecated in favor of the node-scripts endpoint.

##### `GET /api/2.0/commissioning-scripts/`

List commissioning scripts.

##### `POST /api/2.0/commissioning-scripts/`

Create a new commissioning script.

Each commissioning script is identified by a unique name.

By convention the name should consist of a two-digit number, a dash, and a
brief descriptive identifier consisting only of ASCII characters. You don't
need to follow this convention, but not doing so opens you up to risks w.r.t.
encoding and ordering. The name must not contain any whitespace, quotes, or
apostrophes.

A commissioning machine will run each of the scripts in lexicographical order.
There are no promises about how non-ASCII characters are sorted, or even how
upper-case letters are sorted relative to lower-case letters. So where
ordering matters, use unique numbers.

Scripts built into MAAS will have names starting with "00-maas" or "99-maas"
to ensure that they run first or last, respectively.

Usually a commissioning script will be just that, a script. Ideally a script
should be ASCII text to avoid any confusion over encoding. But in some cases a
commissioning script might consist of a binary tool provided by a hardware
vendor. Either way, the script gets passed to the commissioning machine in the
exact form in which it was uploaded.

- `param name`
   Unique identifying name for the script. Names should
   follow the pattern of "25-burn-in-hard-disk" (all ASCII, and with
   numbers greater than zero, and generally no "weird" characters).

- `param content`
   A script file, to be uploaded in binary form. Note:
   this is not a normal parameter, but a file upload. Its filename is
   ignored; MAAS will know it by the name you pass to the request.

### DHCP Snippet

Manage an individual DHCP snippet.

> The DHCP snippet is identified by its id.

##### `DELETE /api/2.0/dhcp-snippets/{id}/`

Delete a DHCP snippet.

Returns 404 if the DHCP snippet is not found.

##### `GET /api/2.0/dhcp-snippets/{id}/`

Read DHCP snippet.

Returns 404 if the snippet is not found.

##### `POST /api/2.0/dhcp-snippets/{id}/ op=revert`

Revert the value of a DHCP snippet to an earlier revision.

- `param to`
   What revision in the DHCP snippet's history to revert to.
   This can either be an ID or a negative number representing how far
   back to go.

- `type to`
   integer

Returns 404 if the DHCP snippet is not found.

##### `PUT /api/2.0/dhcp-snippets/{id}/`

Update a DHCP snippet.

- `param name`
   The name of the DHCP snippet.

- `type name`
   unicode

- `param value`
   The new value of the DHCP snippet to be used in
   dhcpd.conf. Previous values are stored and can be reverted.

- `type value`
   unicode

- `param description`
   A description of what the DHCP snippet does.

- `type description`
   unicode

- `param enabled`
   Whether or not the DHCP snippet is currently enabled.

- `type enabled`
   boolean

- `param node`
   The node the DHCP snippet is to be used for. Can not be
   set if subnet is set.

- `type node`
   unicode

- `param subnet`
   The subnet the DHCP snippet is to be used for. Can not
   be set if node is set.

- `type subnet`
   unicode

- `param global_snippet`
   Set the DHCP snippet to be a global option. This
   removes any node or subnet links.

- `type global_snippet`
   boolean

Returns 404 if the DHCP snippet is not found.

### DHCP Snippets

Manage the collection of all DHCP snippets in MAAS.

##### `GET /api/2.0/dhcp-snippets/`

List all DHCP snippets.

##### `POST /api/2.0/dhcp-snippets/`

Create a DHCP snippet.

- `param name`
   The name of the DHCP snippet. This is required to create
   a new DHCP snippet.

- `type name`
   unicode

- `param value`
   The snippet of config inserted into dhcpd.conf. This is
   required to create a new DHCP snippet.

- `type value`
   unicode

- `param description`
   A description of what the snippet does.

- `type description`
   unicode

- `param enabled`
   Whether or not the snippet is currently enabled.

- `type enabled`
   boolean

- `param node`
   The node this snippet applies to. Cannot be used with
   subnet or global_snippet.

- `type node`
   unicode

- `param subnet`
   The subnet this snippet applies to. Cannot be used with
   node or global_snippet.

- `type subnet`
   unicode

- `param global_snippet`
   Whether or not this snippet is to be applied
   globally. Cannot be used with node or subnet.

- `type global_snippet`
   boolean

Returns 404 if the DHCP snippet is not found.

### DNSResource

Manage dnsresource.

##### `DELETE /api/2.0/dnsresources/{id}/`

Delete dnsresource.

Returns 403 if the user does not have permission to delete the dnsresource.
Returns 404 if the dnsresource is not found.

##### `GET /api/2.0/dnsresources/{id}/`

Read dnsresource.

Returns 404 if the dnsresource is not found.

##### `PUT /api/2.0/dnsresources/{id}/`

Update dnsresource.

- `param fqdn`
   Hostname (with domain) for the dnsresource.

- `param ip_address`
   Address to assign to the dnsresource.

Returns 403 if the user does not have permission to update the dnsresource.
Returns 404 if the dnsresource is not found.

### DNSResourceRecord

Manage dnsresourcerecord.

##### `DELETE /api/2.0/dnsresourcerecords/{id}/`

Delete dnsresourcerecord.

Returns 403 if the user does not have permission to delete the
dnsresourcerecord. Returns 404 if the dnsresourcerecord is not found.

##### `GET /api/2.0/dnsresourcerecords/{id}/`

Read dnsresourcerecord.

Returns 404 if the dnsresourcerecord is not found.

##### `PUT /api/2.0/dnsresourcerecords/{id}/`

Update dnsresourcerecord.

- `param rrtype`
   Resource Type

- `param rrdata`
   Resource Data (everything to the right of Type.)

Returns 403 if the user does not have permission to update the
dnsresourcerecord. Returns 404 if the dnsresourcerecord is not found.

### DNSResourceRecords

Manage DNS resource records (e.g. CNAME, MX, NS, SRV, TXT)

##### `GET /api/2.0/dnsresourcerecords/`

List all dnsresourcerecords.

- `param domain`
   restrict the listing to entries for the domain.

- `param name`
   restrict the listing to entries of the given name.

- `param rrtype`
   restrict the listing to entries which have
   records of the given rrtype.

##### `POST /api/2.0/dnsresourcerecords/`

Create a DNS resource record.

- `param fqdn`
   Hostname (with domain) for the dnsresource. Either fqdn
   or (name, domain) must be specified. Fqdn is ignored if either name or
   domain is given (e.g. www.your-maas.maas).

- `param name`
   The name (or hostname without a domain) of the DNS
   resource record (e.g. www.your-maas)

- `param domain`
   The domain (name or id) where to create the DNS
   resource record (Domain (e.g. 'maas')

- `param rrtype`
   The resource record type (e.g 'cname', 'mx', 'ns',
   'srv', 'sshfp', 'txt')

- `param rrdata`
   The resource record data (e.g. 'your-maas',
   '10 mail.your-maas.maas')

### DNSResources

Manage dnsresources.

##### `GET /api/2.0/dnsresources/`

List all resources for the specified criteria.

- `param domain`
   restrict the listing to entries for the domain.

- `param name`
   restrict the listing to entries of the given name.

- `param rrtype`
   restrict the listing to entries which have
   records of the given rrtype.

##### `POST /api/2.0/dnsresources/`

Create a dnsresource.

- `param fqdn`
   Hostname (with domain) for the dnsresource. Either fqdn
   or (name, domain) must be specified. Fqdn is ignored if either name or
   domain is given.

- `param name`
   Hostname (without domain)

- `param domain`
   Domain (name or id)

- `param address_ttl`
   Default ttl for entries in this zone.

- `param ip_addresses`
   (optional) Address (ip or id) to assign to the
   dnsresource.

### Device

Manage an individual device.

> The device is identified by its system_id.

##### `DELETE /api/2.0/devices/{system_id}/`

Delete a specific Device.

Returns 404 if the device is not found. Returns 403 if the user does not have
permission to delete the device. Returns 204 if the device is successfully
deleted.

##### `GET /api/2.0/devices/{system_id}/`

Read a specific Node.

Returns 404 if the node is not found.

##### `GET /api/2.0/devices/{system_id}/ op=details`

Obtain various system details.

For example, LLDP and `lshw` XML dumps.

Returns a `{detail_type: xml, ...}` map, where `detail_type` is something like
"lldp" or "lshw".

Note that this is returned as BSON and not JSON. This is for efficiency, but
mainly because JSON can't do binary content without applying additional
encoding like base-64.

Returns 404 if the node is not found.

##### `GET /api/2.0/devices/{system_id}/ op=power_parameters`

Obtain power parameters.

This method is reserved for admin users and returns a 403 if the user is not
one.

This returns the power parameters, if any, configured for a node. For some
types of power control this will include private information such as passwords
and secret keys.

Returns 404 if the node is not found.

##### `POST /api/2.0/devices/{system_id}/ op=restore_default_configuration`

Reset a device's configuration to its initial state.

Returns 404 if the device is not found. Returns 403 if the user does not have
permission to reset the device.

##### `POST /api/2.0/devices/{system_id}/ op=restore_networking_configuration`

Reset a device's network options.

Returns 404 if the device is not found Returns 403 if the user does not have
permission to reset the device.

##### `POST /api/2.0/devices/{system_id}/ op=set_owner_data`

Set key/value data for the current owner.

Pass any key/value data to this method to add, modify, or remove. A key is
removed when the value for that key is set to an empty string.

This operation will not remove any previous keys unless explicitly passed with
an empty string. All owner data is removed when the machine is no longer
allocated to a user.

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission.

##### `PUT /api/2.0/devices/{system_id}/`

Update a specific device.

- `param hostname`
   The new hostname for this device.

- `type hostname`
   unicode

- `param domain`
   The domain for this device.

- `type domain`
   unicode

- `param parent`
   Optional system_id to indicate this device's parent.
   If the parent is already set and this parameter is omitted, the parent
   will be unchanged.

- `type parent`
   unicode

- `param zone`
   Name of a valid physical zone in which to place this
   node.

- `type zone`
   unicode

Returns 404 if the device is not found. Returns 403 if the user does not have
permission to update the device.

### Devices

Manage the collection of all the devices in the MAAS.

##### `GET /api/2.0/devices/`

List Nodes visible to the user, optionally filtered by criteria.

Nodes are sorted by id (i.e. most recent last) and grouped by type.

- `param hostname`
   An optional hostname. Only nodes relating to the node
   with the matching hostname will be returned. This can be specified
   multiple times to see multiple nodes.

- `type hostname`
   unicode

- `param mac_address`
   An optional MAC address. Only nodes relating to the
   node owning the specified MAC address will be returned. This can be
   specified multiple times to see multiple nodes.

- `type mac_address`
   unicode

- `param id`
   An optional list of system ids. Only nodes relating to the
   nodes with matching system ids will be returned.

- `type id`
   unicode

- `param domain`
   An optional name for a dns domain. Only nodes relating
   to the nodes in the domain will be returned.

- `type domain`
   unicode

- `param zone`
   An optional name for a physical zone. Only nodes relating
   to the nodes in the zone will be returned.

- `type zone`
   unicode

- `param agent_name`
   An optional agent name. Only nodes relating to the
   nodes with matching agent names will be returned.

- `type agent_name`
   unicode

##### `GET /api/2.0/devices/ op=is_registered`

Returns whether or not the given MAC address is registered within this MAAS
(and attached to a non-retired node).

- `param mac_address`
   The mac address to be checked.

- `type mac_address`
   unicode

- `return`
   'true' or 'false'.

- `rtype`
   unicode

Returns 400 if any mandatory parameters are missing.

##### `POST /api/2.0/devices/`

Create a new device.

- `param hostname`
   A hostname. If not given, one will be generated.

- `type hostname`
   unicode

- `param domain`
   The domain of the device. If not given the default
   domain is used.

- `type domain`
   unicode

- `param mac_addresses`
   One or more MAC addresses for the device.

- `type mac_addresses`
   unicode

- `param parent`
   The system id of the parent. Optional.

- `type parent`
   unicode

##### `POST /api/2.0/devices/ op=set_zone`

Assign multiple nodes to a physical zone at once.

- `param zone`
   Zone name. If omitted, the zone is "none" and the nodes
   will be taken out of their physical zones.

- `param nodes`
   system_ids of the nodes whose zones are to be set.
   (An empty list is acceptable).

Raises 403 if the user is not an admin.

### Discoveries

Query observed discoveries.

##### `GET /api/2.0/discovery/`

Lists all the devices MAAS has discovered.

Discoveries are listed in the order they were last observed on the network
(most recent first).

##### `GET /api/2.0/discovery/ op=by_unknown_ip`

Lists all discovered devices which have an unknown IP address.

Filters the list of discovered devices by excluding any discoveries where a
known MAAS node is configured with the IP address of the discovery, or has
been observed using it after it was assigned by a MAAS-managed DHCP server.

Discoveries are listed in the order they were last observed on the network
(most recent first).

##### `GET /api/2.0/discovery/ op=by_unknown_ip_and_mac`

Lists all discovered devices which are completely unknown to MAAS.

Filters the list of discovered devices by excluding any discoveries where a
known MAAS node is configured with either the MAC address or the IP address of
the discovery.

Discoveries are listed in the order they were last observed on the network
(most recent first).

##### `GET /api/2.0/discovery/ op=by_unknown_mac`

Lists all discovered devices which have an unknown IP address.

Filters the list of discovered devices by excluding any discoveries where an
interface known to MAAS is configured with MAC address of the discovery.

Discoveries are listed in the order they were last observed on the network
(most recent first).

##### `POST /api/2.0/discovery/ op=clear`

Deletes all discovered neighbours and/or mDNS entries.

- `param mdns`
   if True, deletes all mDNS entries.

- `param neighbours`
   if True, deletes all neighbour entries.

- `param all`
   if True, deletes all discovery data.

##### `POST /api/2.0/discovery/ op=scan`

Immediately run a neighbour discovery scan on all rack networks.

This command causes each connected rack controller to execute the 'maas-rack
scan-network' command, which will scan all CIDRs configured on the rack
controller using 'nmap' (if it is installed) or 'ping'.

Network discovery must not be set to 'disabled' for this command to be useful.

Scanning will be started in the background, and could take a long time on rack
controllers that do not have 'nmap' installed and are connected to large
networks.

If the call is a success, this method will return a dictionary of results as
follows:

result: A human-readable string summarizing the results. scan_attempted_on:
A list of rack 'system_id' values where a scan was attempted. (That is, an
RPC connection was successful and a subsequent call was intended.)

failed_to_connect_to: A list of rack 'system_id' values where the RPC
connection failed.

scan_started_on: A list of rack 'system_id' values where a scan was
successfully started.

scan_failed_on: A list of rack 'system_id' values where a scan was
attempted, but failed because a scan was already in progress.

rpc_call_timed_out_on: A list of rack 'system_id' values where the RPC
connection was made, but the call timed out before a ten second timeout
elapsed.

- `param cidr`
   The subnet CIDR(s) to scan (can be specified multiple
   times). If not specified, defaults to all networks.

- `param force`
   If True, will force the scan, even if all networks are
   specified. (This may not be the best idea, depending on acceptable use
   agreements, and the politics of the organization that owns the
   network.) Default: False.

- `param always_use_ping`
   If True, will force the scan to use 'ping' even
   if 'nmap' is installed. Default: False.

- `param slow`
   If True, and 'nmap' is being used, will limit the scan
   to nine packets per second. If the scanner is 'ping', this option has
   no effect. Default: False.

- `param threads`
   The number of threads to use during scanning. If 'nmap'
   is the scanner, the default is one thread per 'nmap' process. If
   'ping' is the scanner, the default is four threads per CPU.

### Discovery

Read or delete an observed discovery.

##### `GET /api/2.0/discovery/{discovery_id}/`

### Domain

Manage domain.

##### `DELETE /api/2.0/domains/{id}/`

Delete domain.

Returns 403 if the user does not have permission to update the dnsresource.
Returns 404 if the domain is not found.

##### `GET /api/2.0/domains/{id}/`

Read domain.

Returns 404 if the domain is not found.

##### `PUT /api/2.0/domains/{id}/`

Update domain.

- `param name`
   Name of the domain.

- `param authoritative`
   True if we are authoritative for this domain.

- `param ttl`
   The default TTL for this domain.

Returns 403 if the user does not have permission to update the dnsresource.
Returns 404 if the domain is not found.

### Domains

Manage domains.

##### `GET /api/2.0/domains/`

List all domains.

##### `POST /api/2.0/domains/`

Create a domain.

- `param name`
   Name of the domain.

- `param authoritative`
   Class type of the domain.

##### `POST /api/2.0/domains/ op=set_serial`

Set the SOA serial number (for all DNS zones.)

- `param serial`
   serial number to use next.

### Events

Retrieve filtered node events.

> A specific Node's events is identified by specifying one or more ids,
> hostnames, or mac addresses as a list.

##### `GET /api/2.0/events/ op=query`

List Node events, optionally filtered by various criteria via URL query
parameters.

- `param hostname`
   An optional hostname. Only events relating to the node
   with the matching hostname will be returned. This can be specified
   multiple times to get events relating to more than one node.

- `param mac_address`
   An optional list of MAC addresses. Only
   nodes with matching MAC addresses will be returned.

- `param id`
   An optional list of system ids. Only nodes with
   matching system ids will be returned.

- `param zone`
   An optional name for a physical zone. Only nodes in the
   zone will be returned.

- `param agent_name`
   An optional agent name. Only nodes with
   matching agent names will be returned.

- `param level`
   Desired minimum log level of returned events. Returns
   this level of events and greater. Choose from: AUDIT, CRITICAL, DEBUG,
   ERROR, INFO, WARNING. The default is INFO.

- `param limit`
   Optional number of events to return. Default 100.
   Maximum: 1000.

- `param before`
   Optional event id. Defines where to start returning
   older events.

- `param after`
   Optional event id. Defines where to start returning
   newer events.

- `param owner`
   If specified, filters the list to show only events
   owned by the specified username.

### Fabric

Manage fabric.

##### `DELETE /api/2.0/fabrics/{id}/`

Delete fabric.

Returns 404 if the fabric is not found.

##### `GET /api/2.0/fabrics/{id}/`

Read fabric.

Returns 404 if the fabric is not found.

##### `PUT /api/2.0/fabrics/{id}/`

Update fabric.

- `param name`
   Name of the fabric.

- `param description`
   Description of the fabric.

- `param class_type`
   Class type of the fabric.

Returns 404 if the fabric is not found.

### Fabrics

Manage fabrics.

##### `GET /api/2.0/fabrics/`

List all fabrics.

##### `POST /api/2.0/fabrics/`

Create a fabric.

- `param name`
   Name of the fabric.

- `param description`
   Description of the fabric.

- `param class_type`
   Class type of the fabric.

### Fan Network

Manage Fan Network.

##### `DELETE /api/2.0/fannetworks/{id}/`

Delete fannetwork.

Returns 404 if the fannetwork is not found.

##### `GET /api/2.0/fannetworks/{id}/`

Read fannetwork.

Returns 404 if the fannetwork is not found.

##### `PUT /api/2.0/fannetworks/{id}/`

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

##### `GET /api/2.0/fannetworks/`

List all fannetworks.

##### `POST /api/2.0/fannetworks/`

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

> The file is identified by its filename and owner.

##### `DELETE /api/2.0/files/{filename}/`

Delete a FileStorage object.

##### `GET /api/2.0/files/{filename}/`

GET a FileStorage object as a json object.

The 'content' of the file is base64-encoded.

### Files

Manage the collection of all the files in this MAAS.

##### `DELETE /api/2.0/files/`

Delete a FileStorage object.

- `param filename`
   The filename of the object to be deleted.

- `type filename`
   unicode

##### `GET /api/2.0/files/`

List the files from the file storage.

The returned files are ordered by file name and the content is excluded.

- `param prefix`
   Optional prefix used to filter out the returned files.

- `type prefix`
   string

##### `GET /api/2.0/files/ op=get`

Get a named file from the file storage.

- `param filename`
   The exact name of the file you want to get.

- `type filename`
   string

- `return`
   The file is returned in the response content.

##### `GET /api/2.0/files/ op=get_by_key`

Get a file from the file storage using its key.

- `param key`
   The exact key of the file you want to get.

- `type key`
   string

- `return`
   The file is returned in the response content.

##### `POST /api/2.0/files/`

Add a new file to the file storage.

- `param filename`
   The file name to use in the storage.

- `type filename`
   string

- `param file`
   Actual file data with content type
   application/octet-stream

Returns 400 if any of these conditions apply:
   -   The filename is missing from the parameters
   -   The file data is missing
   -   More than one file is supplied

### IP Addresses

Manage IP addresses allocated by MAAS.

##### `GET /api/2.0/ipaddresses/`

List IP addresses known to MAAS.

By default, gets a listing of all IP addresses allocated to the requesting
user.

- `param ip`
   If specified, will only display information for the
   specified IP address.

- `type ip`
   unicode (must be an IPv4 or IPv6 address)

If the requesting user is a MAAS administrator, the following options may also
be supplied:

- `param all`
   If True, all reserved IP addresses will be shown. (By
   default, only addresses of type 'User reserved' that are assigned to
   the requesting user are shown.)

- `type all`
   bool

- `param owner`
   If specified, filters the list to show only IP addresses
   owned by the specified username.

- `type user`
   unicode

##### `POST /api/2.0/ipaddresses/ op=release`

Release an IP address that was previously reserved by the user.

- `param ip`
   The IP address to release.

- `type ip`
   unicode

- `param force`
   If True, allows a MAAS administrator to force an IP
   address to be released, even if it is not a user-reserved IP address
   or does not belong to the requesting user. Use with caution.

- `type force`
   bool

- `param discovered`
   If True, allows a MAAS administrator to release
   a discovered address. Only valid if 'force' is specified. If not
   specified, MAAS will attempt to release any type of address except for
   discovered addresses.

Returns 404 if the provided IP address is not found.

##### `POST /api/2.0/ipaddresses/ op=reserve`

Reserve an IP address for use outside of MAAS.

Returns an IP adddress, which MAAS will not allow any of its known nodes to
use; it is free for use by the requesting user until released by the user.

The user may supply either a subnet or a specific IP address within a subnet.

- `param subnet`
   CIDR representation of the subnet on which the IP
   reservation is required. e.g. 10.1.2.0/24

- `param ip`
   The IP address, which must be within
   a known subnet.

- `param ip_address`
   (Deprecated.) Alias for 'ip' parameter. Provided
   for backward compatibility.

- `param hostname`
   The hostname to use for the specified IP address. If
   no domain component is given, the default domain will be used.

- `param mac`
   The MAC address that should be linked to this reservation.

Returns 400 if there is no subnet in MAAS matching the provided one, or a
ip_address is supplied, but a corresponding subnet could not be found.
Returns 503 if there are no more IP addresses available.

### IP Range

Manage IP range.

##### `DELETE /api/2.0/ipranges/{id}/`

Delete IP range.

Returns 403 if not owner of IP range. Returns 404 if the IP range is not
found.

##### `GET /api/2.0/ipranges/{id}/`

Read IP range.

Returns 404 if the IP range is not found.

##### `PUT /api/2.0/ipranges/{id}/`

Update IP range.

- `param start_ip`
   Start IP address of this range (inclusive).

- `param end_ip`
   End IP address of this range (inclusive).

- `param comment`
   A description of this range. (optional)

Returns 403 if not owner of IP range. Returns 404 if the IP Range is not
found.

### IP Ranges

Manage IP ranges.

##### `GET /api/2.0/ipranges/`

List all IP ranges.

##### `POST /api/2.0/ipranges/`

Create an IP range.

- `param type`
   Type of this range. (dynamic or reserved)

- `param start_ip`
   Start IP address of this range (inclusive).

- `param end_ip`
   End IP address of this range (inclusive).

- `param subnet`
   Subnet this range is associated with. (optional)

- `param comment`
   A description of this range. (optional)

Returns 403 if standard users tries to create a dynamic IP range.

### Interface

Manage a node's or device's interface.

##### `DELETE /api/2.0/nodes/{system_id}/interfaces/{id}/`

Delete interface on node.

Returns 404 if the node or interface is not found.

##### `GET /api/2.0/nodes/{system_id}/interfaces/{id}/`

Read interface on node.

Returns 404 if the node or interface is not found.

##### `POST /api/2.0/nodes/{system_id}/interfaces/{id}/ op=add_tag`

Add a tag to interface on a node.

- `param tag`
   The tag being added.

Returns 404 if the node or interface is not found. Returns 403 if the user is
not allowed to update the interface.

##### `POST /api/2.0/nodes/{system_id}/interfaces/{id}/ op=disconnect`

Disconnect an interface.

Deletes any linked subnets and IP addresses, and disconnects the interface
from any associated VLAN.

Returns 404 if the node or interface is not found.

##### `POST /api/2.0/nodes/{system_id}/interfaces/{id}/ op=link_subnet`

Link interface to a subnet.

- `param mode`
   AUTO, DHCP, STATIC or LINK_UP connection to subnet.

- `param subnet`
   Subnet linked to interface.

- `param ip_address`
   IP address for the interface in subnet. Only used
   when mode is STATIC. If not provided an IP address from subnet will be
   auto selected.

- `param force`
   If True, allows LINK_UP to be set on the interface
   even if other links already exist. Also allows the selection of any
   VLAN, even a VLAN MAAS does not believe the interface to currently be
   on. Using this option will cause all other links on the interface to
   be deleted. (Defaults to False.)

- `param default_gateway`
   True sets the gateway IP address for the subnet
   as the default gateway for the node this interface belongs to. Option
   can only be used with the AUTO and STATIC modes.

Mode definitions: AUTO - Assign this interface a static IP address from the
provided subnet. The subnet must be a managed subnet. The IP address will not
be assigned until the node goes to be deployed.

DHCP - Bring this interface up with DHCP on the given subnet. Only one subnet
can be set to DHCP. If the subnet is managed this interface will pull from the
dynamic IP range.

STATIC - Bring this interface up with a STATIC IP address on the given subnet.
Any number of STATIC links can exist on an interface.

LINK_UP - Bring this interface up only on the given subnet. No IP address
will be assigned to this interface. The interface cannot have any current
AUTO, DHCP or STATIC links.

Returns 404 if the node or interface is not found.

##### `POST /api/2.0/nodes/{system_id}/interfaces/{id}/ op=remove_tag`

Remove a tag from interface on a node.

- `param tag`
   The tag being removed.

Returns 404 if the node or interface is not found. Returns 403 if the user is
not allowed to update the interface.

##### `POST /api/2.0/nodes/{system_id}/interfaces/{id}/ op=set_default_gateway`

Set the node to use this interface as the default gateway.

If this interface has more than one subnet with a gateway IP in the same IP
address family then specifying the ID of the link on this interface is
required.

- `param link_id`
   ID of the link on this interface to select the
   default gateway IP address from.

Returns 400 if the interface has not AUTO or STATIC links. Returns 404 if the
node or interface is not found.

##### `POST /api/2.0/nodes/{system_id}/interfaces/{id}/ op=unlink_subnet`

Unlink interface to a subnet.

- `param id`
   ID of the link on the interface to remove.

Returns 404 if the node or interface is not found.

##### `PUT /api/2.0/nodes/{system_id}/interfaces/{id}/`

Update interface on node.

Machines must have a status of Ready or Broken to have access to all options.
Machines with Deployed status can only have the name and/or mac_address
updated for an interface. This is intented to allow a bad interface to be
replaced while the machine remains deployed.

Fields for physical interface:

- `param name`
   Name of the interface.

- `param mac_address`
   MAC address of the interface.

- `param tags`
   Tags for the interface.

- `param vlan`
   Untagged VLAN the interface is connected to. If not set
   then the interface is considered disconnected.

Fields for bond interface:

- `param name`
   Name of the interface.

- `param mac_address`
   MAC address of the interface.

- `param tags`
   Tags for the interface.

- `param vlan`
   Untagged VLAN the interface is connected to. If not set
   then the interface is considered disconnected.

- `param parents`
   Parent interfaces that make this bond.

Fields for VLAN interface:

- `param tags`
   Tags for the interface.

- `param vlan`
   Tagged VLAN the interface is connected to.

- `param parent`
   Parent interface for this VLAN interface.

Fields for bridge interface:

- `param name`
   Name of the interface.

- `param mac_address`
   MAC address of the interface.

- `param tags`
   Tags for the interface.

- `param vlan`
   VLAN the interface is connected to.

- `param parent`
   Parent interface for this bridge interface.

Following are extra parameters that can be set on all interface types:

- `param mtu`
   Maximum transmission unit.

- `param accept_ra`
   Accept router advertisements. (IPv6 only)

- `param autoconf`
   Perform stateless autoconfiguration. (IPv6 only)

Following are parameters specific to bonds:

- `param bond_mode`
   The operating mode of the bond.
   (Default: active-backup).

- `param bond_miimon`
   The link monitoring freqeuncy in milliseconds.
   (Default: 100).

- `param bond_downdelay`
   Specifies the time, in milliseconds, to wait
   before disabling a slave after a link failure has been detected.

- `param bond_updelay`
   Specifies the time, in milliseconds, to wait
   before enabling a slave after a link recovery has been detected.

- `param bond_lacp_rate`
   Option specifying the rate in which we'll ask
   our link partner to transmit LACPDU packets in 802.3ad mode. Available
   options are fast or slow. (Default: slow).

- `param bond_xmit_hash_policy`
   The transmit hash policy to use for
   slave selection in balance-xor, 802.3ad, and tlb modes.

Supported bonding modes (bond-mode):

balance-rr - Transmit packets in sequential order from the first available
slave through the last. This mode provides load balancing and fault tolerance.

active-backup - Only one slave in the bond is active. A different slave
becomes active if, and only if, the active slave fails. The bond's MAC address
is externally visible on only one port (network adapter) to avoid confusing
the switch.

balance-xor - Transmit based on the selected transmit hash policy. The default
policy is a simple \[(source MAC address XOR'd with destination MAC address
XOR packet type ID) modulo slave count\].

broadcast - Transmits everything on all slave interfaces. This mode provides
fault tolerance.

802.3ad - IEEE 802.3ad Dynamic link aggregation. Creates aggregation groups
that share the same speed and duplex settings. Utilizes all slaves in the
active aggregator according to the 802.3ad specification.

balance-tlb - Adaptive transmit load balancing: channel bonding that does not
require any special switch support.

balance-alb - Adaptive load balancing: includes balance-tlb plus receive load
balancing (rlb) for IPV4 traffic, and does not require any special switch
support. The receive load balancing is achieved by ARP negotiation.

Following are parameters specific to bridges:

- `param bridge_stp`
   Turn spanning tree protocol on or off.
   (Default: False).

- `param bridge_fd`
   Set bridge forward delay to time seconds.
   (Default: 15).

Returns 404 if the node or interface is not found.

### Interfaces

Manage interfaces on a node.

##### `GET /api/2.0/nodes/{system_id}/interfaces/`

List all interfaces belonging to a machine, device, or rack controller.

Returns 404 if the node is not found.

##### `POST /api/2.0/nodes/{system_id}/interfaces/ op=create_bond`

Create a bond interface on a machine.

- `param name`
   Name of the interface.

- `param mac_address`
   MAC address of the interface.

- `param tags`
   Tags for the interface.

- `param vlan`
   VLAN the interface is connected to. If not
   provided then the interface is considered disconnected.

- `param parents`
   Parent interfaces that make this bond.

Following are parameters specific to bonds:

- `param bond_mode`
   The operating mode of the bond.
   (Default: active-backup).

- `param bond_miimon`
   The link monitoring freqeuncy in milliseconds.
   (Default: 100).

- `param bond_downdelay`
   Specifies the time, in milliseconds, to wait
   before disabling a slave after a link failure has been detected.

- `param bond_updelay`
   Specifies the time, in milliseconds, to wait
   before enabling a slave after a link recovery has been detected.

- `param bond_lacp_rate`
   Option specifying the rate in which we'll ask
   our link partner to transmit LACPDU packets in 802.3ad mode. Available
   options are fast or slow. (Default: slow).

- `param bond_xmit_hash_policy`
   The transmit hash policy to use for
   slave selection in balance-xor, 802.3ad, and tlb modes. (Default:
   layer2)

- `param bond_num_grat_arp`
   The number of peer notifications (IPv4 ARP
   or IPv6 Neighbour Advertisements) to be issued after a failover.
   (Default: 1)

Supported bonding modes (bond-mode): balance-rr - Transmit packets in
sequential order from the first available slave through the last. This mode
provides load balancing and fault tolerance.

active-backup - Only one slave in the bond is active. A different slave
becomes active if, and only if, the active slave fails. The bond's MAC address
is externally visible on only one port (network adapter) to avoid confusing
the switch.

balance-xor - Transmit based on the selected transmit hash policy. The default
policy is a simple \[(source MAC address XOR'd with destination MAC address
XOR packet type ID) modulo slave count\].

broadcast - Transmits everything on all slave interfaces. This mode provides
fault tolerance.

802.3ad - IEEE 802.3ad Dynamic link aggregation. Creates aggregation groups
that share the same speed and duplex settings. Utilizes all slaves in the
active aggregator according to the 802.3ad specification.

balance-tlb - Adaptive transmit load balancing: channel bonding that does not
require any special switch support.

balance-alb - Adaptive load balancing: includes balance-tlb plus receive load
balancing (rlb) for IPV4 traffic, and does not require any special switch
support. The receive load balancing is achieved by ARP negotiation.

Following are extra parameters that can be set on the interface:

- `param mtu`
   Maximum transmission unit.

- `param accept_ra`
   Accept router advertisements. (IPv6 only)

- `param autoconf`
   Perform stateless autoconfiguration. (IPv6 only)

Returns 404 if the node is not found.

##### `POST /api/2.0/nodes/{system_id}/interfaces/ op=create_bridge`

Create a bridge interface on a machine.

- `param name`
   Name of the interface.

- `param mac_address`
   MAC address of the interface.

- `param tags`
   Tags for the interface.

- `param vlan`
   VLAN the interface is connected to.

- `param parent`
   Parent interface for this bridge interface.

Following are parameters specific to bridges:

- `param bridge_stp`
   Turn spanning tree protocol on or off.
   (Default: False).

- `param bridge_fd`
   Set bridge forward delay to time seconds.
   (Default: 15).

Following are extra parameters that can be set on the interface:

- `param mtu`
   Maximum transmission unit.

- `param accept_ra`
   Accept router advertisements. (IPv6 only)

- `param autoconf`
   Perform stateless autoconfiguration. (IPv6 only)

Returns 404 if the node is not found.

##### `POST /api/2.0/nodes/{system_id}/interfaces/ op=create_physical`

Create a physical interface on a machine and device.

- `param name`
   Name of the interface.

- `param mac_address`
   MAC address of the interface.

- `param tags`
   Tags for the interface.

- `param vlan`
   Untagged VLAN the interface is connected to. If not
   provided then the interface is considered disconnected.

Following are extra parameters that can be set on the interface:

- `param mtu`
   Maximum transmission unit.

- `param accept_ra`
   Accept router advertisements. (IPv6 only)

- `param autoconf`
   Perform stateless autoconfiguration. (IPv6 only)

Returns 404 if the node is not found.

##### `POST /api/2.0/nodes/{system_id}/interfaces/ op=create_vlan`

Create a VLAN interface on a machine.

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

##### `DELETE /api/2.0/license-key/{osystem}/{distro_series}`

Delete license key.

##### `GET /api/2.0/license-key/{osystem}/{distro_series}`

Read license key.

##### `PUT /api/2.0/license-key/{osystem}/{distro_series}`

Update license key.

- `param osystem`
   Operating system that the key belongs to.

- `param distro_series`
   OS release that the key belongs to.

- `param license_key`
   License key for osystem/distro_series combo.

### License Keys

Manage the license keys.

##### `GET /api/2.0/license-keys/`

List license keys.

##### `POST /api/2.0/license-keys/`

Define a license key.

- `param osystem`
   Operating system that the key belongs to.

- `param distro_series`
   OS release that the key belongs to.

- `param license_key`
   License key for osystem/distro_series combo.

### MAAS server

Manage the MAAS server.

##### `GET /api/2.0/maas/ op=get_config`

Get a config value.

- `param name`
   The name of the config item to be retrieved.

Available configuration items:

- `active_discovery_interval`
   Active subnet mapping interval. When enabled, each rack will scan subnets
   enabled for active mapping. This helps ensure discovery information is
   accurate and complete.

- `boot_images_auto_import`
   Automatically import/refresh the boot images every 60 minutes.

- `commissioning_distro_series`
   Default Ubuntu release used for commissioning.

- `completed_intro`
   Marks if the initial intro has been completed.

- `curtin_verbose`
   Run the fast-path installer with higher verbosity. This provides more
   detail in the installation logs.

- `default_distro_series`
   Default OS release used for deployment.

- `default_dns_ttl`
   Default Time-To-Live for the DNS. If no TTL value is specified at a more
   specific point this is how long DNS responses are valid, in seconds.

- `default_min_hwe_kernel`
   Default Minimum Kernel Version. The default minimum kernel version used on
   all new and commissioned nodes.

- `default_osystem`
   Default operating system used for deployment.

- `default_storage_layout`
   Default storage layout. Storage layout that is applied to a node when it
   is commissioned. Available choices are: 'bcache' (Bcache layout), 'flat'
   (Flat layout), 'lvm' (LVM layout).

- `disk_erase_with_quick_erase`
   Use quick erase by default when erasing disks.. This is not a secure
   erase; it wipes only the beginning and end of each disk.

- `disk_erase_with_secure_erase`
   Use secure erase by default when erasing disks. Will only be used on
   devices that support secure erase. Other devices will fall back to full
   wipe or quick erase depending on the selected options.

- `dnssec_validation`
   Enable DNSSEC validation of upstream zones. Only used when MAAS is running
   its own DNS server. This value is used as the value of
   'dnssec_validation' in the DNS server config.

- `enable_analytics`
   Enable Google Analytics in MAAS UI to shape improvements in user
   experience.

- `enable_disk_erasing_on_release`
   Erase nodes' disks prior to releasing. Forces users to always erase disks
   when releasing.

- `enable_http_proxy`
   Enable the use of an APT and HTTP/HTTPS proxy. Provision nodes to use the
   built-in HTTP proxy (or user specified proxy) for APT. MAAS also uses the
   proxy for downloading boot images.

- `enable_third_party_drivers`
   Enable the installation of proprietary drivers (i.e. HPVSA).

- `http_proxy`
   Proxy for APT and HTTP/HTTPS. This will be passed onto provisioned nodes
   to use as a proxy for APT traffic. MAAS also uses the proxy for
   downloading boot images. If no URL is provided, the built-in MAAS proxy
   will be used.

- `kernel_opts`
   Boot parameters to pass to the kernel by default.

- `maas_name`
   MAAS name.

- `max_node_commissioning_results`
   The maximum number of commissioning results runs which are stored.

- `max_node_installation_results`
   The maximum number of installation result runs which are stored.

- `max_node_testing_results`
   The maximum number of testing results runs which are stored.

- `network_discovery`
   . When enabled, MAAS will use passive techniques (such as listening to ARP
   requests and mDNS advertisements) to observe networks attached to rack
   controllers. Active subnet mapping will also be available to be enabled on
   the configured subnets.

- `ntp_external_only`
   Use external NTP servers only. Configure all region controller hosts, rack
   controller hosts, and subsequently deployed machines to refer directly to
   the configured external NTP servers. Otherwise only region controller
   hosts will be configured to use those external NTP servers, rack contoller
   hosts will in turn refer to the regions' NTP servers, and deployed
   machines will refer to the racks' NTP servers.

- `ntp_servers`
   Addresses of NTP servers. NTP servers, specified as IP addresses or
   hostnames delimited by commas and/or spaces, to be used as time references
   for MAAS itself, the machines MAAS deploys, and devices that make use of
   MAAS's DHCP services.

- `prefer_v4_proxy`
   Sets IPv4 DNS resolution before IPv6. If prefer_v4_proxy is set, the
   proxy will be set to prefer IPv4 DNS resolution before it attempts to
   perform IPv6 DNS resolution.

- `subnet_ip_exhaustion_threshold_count`
   If the number of free IP addresses on a subnet becomes less than or equal
   to this threshold, an IP exhaustion warning will appear for that subnet.

- `upstream_dns`
   Upstream DNS used to resolve domains not managed by this MAAS
   (space-separated IP addresses). Only used when MAAS is running its own DNS
   server. This value is used as the value of 'forwarders' in the DNS server
   config.

- `use_peer_proxy`
   Use the built-in proxy with an external proxy as a peer. If
   enable_http_proxy is set, the built-in proxy will be configured to use
   http_proxy as a peer proxy. The deployed machines will be configured to
   use the built-in proxy.

- `windows_kms_host`
   Windows KMS activation host. FQDN or IP address of the host that provides
   the KMS Windows activation service. (Only needed for Windows deployments
   using KMS activation.)

##### `POST /api/2.0/maas/ op=set_config`

Set a config value.

- `param name`
   The name of the config item to be set.

- `param value`
   The value of the config item to be set.

Available configuration items:

- `active_discovery_interval`
   Active subnet mapping interval. When enabled, each rack will scan subnets
   enabled for active mapping. This helps ensure discovery information is
   accurate and complete.

- `boot_images_auto_import`
   Automatically import/refresh the boot images every 60 minutes.

- `commissioning_distro_series`
   Default Ubuntu release used for commissioning.

- `completed_intro`
   Marks if the initial intro has been completed.

- `curtin_verbose`
   Run the fast-path installer with higher verbosity. This provides more
   detail in the installation logs.

- `default_distro_series`
   Default OS release used for deployment.

- `default_dns_ttl`
   Default Time-To-Live for the DNS. If no TTL value is specified at a more
   specific point this is how long DNS responses are valid, in seconds.

- `default_min_hwe_kernel`
   Default Minimum Kernel Version. The default minimum kernel version used on
   all new and commissioned nodes.

- `default_osystem`
   Default operating system used for deployment.

- `default_storage_layout`
   Default storage layout. Storage layout that is applied to a node when it
   is commissioned. Available choices are: 'bcache' (Bcache layout), 'flat'
   (Flat layout), 'lvm' (LVM layout).

- `disk_erase_with_quick_erase`
   Use quick erase by default when erasing disks.. This is not a secure
   erase; it wipes only the beginning and end of each disk.

- `disk_erase_with_secure_erase`
   Use secure erase by default when erasing disks. Will only be used on
   devices that support secure erase. Other devices will fall back to full
   wipe or quick erase depending on the selected options.

- `dnssec_validation`
   Enable DNSSEC validation of upstream zones. Only used when MAAS is running
   its own DNS server. This value is used as the value of
   'dnssec_validation' in the DNS server config.

- `enable_analytics`
   Enable Google Analytics in MAAS UI to shape improvements in user
   experience.

- `enable_disk_erasing_on_release`
   Erase nodes' disks prior to releasing. Forces users to always erase disks
   when releasing.

- `enable_http_proxy`
   Enable the use of an APT and HTTP/HTTPS proxy. Provision nodes to use the
   built-in HTTP proxy (or user specified proxy) for APT. MAAS also uses the
   proxy for downloading boot images.

- `enable_third_party_drivers`
   Enable the installation of proprietary drivers (i.e. HPVSA).

- `http_proxy`
   Proxy for APT and HTTP/HTTPS. This will be passed onto provisioned nodes
   to use as a proxy for APT traffic. MAAS also uses the proxy for
   downloading boot images. If no URL is provided, the built-in MAAS proxy
   will be used.

- `kernel_opts`
   Boot parameters to pass to the kernel by default.

- `maas_name`
   MAAS name.

- `max_node_commissioning_results`
   The maximum number of commissioning results runs which are stored.

- `max_node_installation_results`
   The maximum number of installation result runs which are stored.

- `max_node_testing_results`
   The maximum number of testing results runs which are stored.

- `network_discovery`
   . When enabled, MAAS will use passive techniques (such as listening to ARP
   requests and mDNS advertisements) to observe networks attached to rack
   controllers. Active subnet mapping will also be available to be enabled on
   the configured subnets.

- `ntp_external_only`
   Use external NTP servers only. Configure all region controller hosts, rack
   controller hosts, and subsequently deployed machines to refer directly to
   the configured external NTP servers. Otherwise only region controller
   hosts will be configured to use those external NTP servers, rack contoller
   hosts will in turn refer to the regions' NTP servers, and deployed
   machines will refer to the racks' NTP servers.

- `ntp_servers`
   Addresses of NTP servers. NTP servers, specified as IP addresses or
   hostnames delimited by commas and/or spaces, to be used as time references
   for MAAS itself, the machines MAAS deploys, and devices that make use of
   MAAS's DHCP services.

- `prefer_v4_proxy`
   Sets IPv4 DNS resolution before IPv6. If prefer_v4_proxy is set, the
   proxy will be set to prefer IPv4 DNS resolution before it attempts to
   perform IPv6 DNS resolution.

- `subnet_ip_exhaustion_threshold_count`
   If the number of free IP addresses on a subnet becomes less than or equal
   to this threshold, an IP exhaustion warning will appear for that subnet.

- `upstream_dns`
   Upstream DNS used to resolve domains not managed by this MAAS
   (space-separated IP addresses). Only used when MAAS is running its own DNS
   server. This value is used as the value of 'forwarders' in the DNS server
   config.

- `use_peer_proxy`
   Use the built-in proxy with an external proxy as a peer. If
   enable_http_proxy is set, the built-in proxy will be configured to use
   http_proxy as a peer proxy. The deployed machines will be configured to
   use the built-in proxy.

- `windows_kms_host`
   Windows KMS activation host. FQDN or IP address of the host that provides
   the KMS Windows activation service. (Only needed for Windows deployments
   using KMS activation.)

### Machine

Manage an individual Machine.

> The Machine is identified by its system_id.

##### `DELETE /api/2.0/machines/{system_id}/`

Delete a specific Node.

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to delete the node. Returns 204 if the node is successfully
deleted.

##### `GET /api/2.0/machines/{system_id}/`

Read a specific Node.

Returns 404 if the node is not found.

##### `GET /api/2.0/machines/{system_id}/ op=details`

Obtain various system details.

For example, LLDP and `lshw` XML dumps.

Returns a `{detail_type: xml, ...}` map, where `detail_type` is something like
"lldp" or "lshw".

Note that this is returned as BSON and not JSON. This is for efficiency, but
mainly because JSON can't do binary content without applying additional
encoding like base-64.

Returns 404 if the node is not found.

##### `GET /api/2.0/machines/{system_id}/ op=get_curtin_config`

Return the rendered curtin configuration for the machine.

Returns 404 if the machine could not be found. Returns 403 if the user does
not have permission to get the curtin configuration.

##### `GET /api/2.0/machines/{system_id}/ op=power_parameters`

Obtain power parameters.

This method is reserved for admin users and returns a 403 if the user is not
one.

This returns the power parameters, if any, configured for a node. For some
types of power control this will include private information such as passwords
and secret keys.

Returns 404 if the node is not found.

##### `GET /api/2.0/machines/{system_id}/ op=query_power_state`

Query the power state of a node.

Send a request to the node's power controller which asks it about the node's
state. The reply to this could be delayed by up to 30 seconds while waiting
for the power controller to respond. Use this method sparingly as it ties up
an appserver thread while waiting.

- `param system_id`
   The node to query.

- `return`
   a dict whose key is "state" with a value of one of
   'on' or 'off'.

Returns 404 if the node is not found. Returns node's power state.

##### `POST /api/2.0/machines/{system_id}/ op=abort`

Abort a node's current operation.

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Returns 404 if the node could not be found. Returns 403 if the user does not
have permission to abort the current operation.

##### `POST /api/2.0/machines/{system_id}/ op=clear_default_gateways`

Clear any set default gateways on the machine.

This will clear both IPv4 and IPv6 gateways on the machine. This will
transition the logic of identifing the best gateway to MAAS. This logic is
determined based the following criteria:

1.  Managed subnets over unmanaged subnets.
2.  Bond interfaces over physical interfaces.
3.  Machine's boot interface over all other interfaces except bonds.
4.  Physical interfaces over VLAN interfaces.
5.  Sticky IP links over user reserved IP links.
6.  User reserved IP links over auto IP links.

If the default gateways need to be specific for this machine you can set which
interface and subnet's gateway to use when this machine is deployed with the
interfaces set-default-gateway API.

Returns 404 if the machine could not be found. Returns 403 if the user does
not have permission to clear the default gateways.

##### `POST /api/2.0/machines/{system_id}/ op=commission`

Begin commissioning process for a machine.

- `param enable_ssh`
   Whether to enable SSH for the commissioning
   environment using the user's SSH key(s).

- `type enable_ssh`
   bool ('0' for False, '1' for True)

- `param skip_bmc_config`
   Whether to skip re-configuration of the BMC
   for IPMI based machines.

- `type skip_bmc_config`
   bool ('0' for False, '1' for True)

- `param skip_networking`
   Whether to skip re-configuring the networking
   on the machine after the commissioning has completed.

- `type skip_networking`
   bool ('0' for False, '1' for True)

- `param skip_storage`
   Whether to skip re-configuring the storage
   on the machine after the commissioning has completed.

- `type skip_storage`
   bool ('0' for False, '1' for True)

- `param commissioning_scripts`
   A comma seperated list of commissioning
   script names and tags to be run. By default all custom commissioning
   scripts are run. Builtin commissioning scripts always run. Selecting
   'update_firmware' or 'configure_hba' will run firmware updates or
   configure HBA's on matching machines.

- `type commissioning_scripts`
   string

- `param testing_scripts`
   A comma seperated list of testing script names
   and tags to be run. By default all tests tagged 'commissioning' will
   be run. Set to 'none' to disable running tests.

- `type testing_scripts`
   string

A machine in the 'ready', 'declared' or 'failed test' state may initiate a
commissioning cycle where it is checked out and tested in preparation for
transitioning to the 'ready' state. If it is already in the 'ready' state this
is considered a re-commissioning process which is useful if commissioning
tests were changed after it previously commissioned.

Returns 404 if the machine is not found.

##### `POST /api/2.0/machines/{system_id}/ op=deploy`

Deploy an operating system to a machine.

- `param user_data`
   If present, this blob of user-data to be made
   available to the machines through the metadata service.

- `type user_data`
   base64-encoded unicode

- `param distro_series`
   If present, this parameter specifies the
   OS release the machine will use.

- `type distro_series`
   unicode

- `param hwe_kernel`
   If present, this parameter specified the kernel to
   be used on the machine

- `type hwe_kernel`
   unicode

- `param agent_name`
   An optional agent name to attach to the
   acquired machine.

- `type agent_name`
   unicode

- `param bridge_all`
   Optionally create a bridge interface for every
   configured interface on the machine. The created bridges will be
   removed once the machine is released. (Default: False)

- `type bridge_all`
   boolean

- `param bridge_stp`
   Optionally turn spanning tree protocol on or off
   for the bridges created on every configured interface. (Default: off)

- `type bridge_stp`
   boolean

- `param bridge_fd`
   Optionally adjust the forward delay to time seconds.
   (Default: 15)

- `type bridge_fd`
   integer

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

- `param install_rackd`
   If True, the Rack Controller will be installed on
   this machine.

- `type install_rackd`
   boolean

Ideally we'd have MIME multipart and content-transfer-encoding etc. deal with
the encapsulation of binary data, but couldn't make it work with the framework
in reasonable time so went for a dumb, manual encoding instead.

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission to start the machine. Returns 503 if the start-up attempted to
allocate an IP address, and there were no IP addresses available on the
relevant cluster interface.

##### `POST /api/2.0/machines/{system_id}/ op=exit_rescue_mode`

Exit rescue mode process for a machine.

A machine in the 'rescue mode' state may exit the rescue mode process.

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission to exit the rescue mode process for this machine.

##### `POST /api/2.0/machines/{system_id}/ op=lock`

Mark a deployed machine as locked, to prevent changes.

A locked machine cannot be released or modified.

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission lock the machine.

##### `POST /api/2.0/machines/{system_id}/ op=mark_broken`

Mark a node as 'broken'.

If the node is allocated, release it first.

- `param comment`
   Optional comment for the event log. Will be
   displayed on the node as an error description until marked fixed.

- `type comment`
   unicode

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to mark the node broken.

##### `POST /api/2.0/machines/{system_id}/ op=mark_fixed`

Mark a broken node as fixed and set its status as 'ready'.

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission to mark the machine fixed.

##### `POST /api/2.0/machines/{system_id}/ op=mount_special`

Mount a special-purpose filesystem, like tmpfs.

- `param fstype`
   The filesystem type. This must be a filesystem that
   does not require a block special device.

- `param mount_point`
   Path on the filesystem to mount.

- `param mount_option`
   Options to pass to mount(8).

Returns 403 when the user is not permitted to mount the partition.

##### `POST /api/2.0/machines/{system_id}/ op=override_failed_testing`

Ignore failed tests and put node back into a usable state.

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission to ignore tests for the node.

##### `POST /api/2.0/machines/{system_id}/ op=power_off`

Power off a node.

- `param stop_mode`
   An optional power off mode. If 'soft',
   perform a soft power down if the node's power type supports it,
   otherwise perform a hard power off. For all values other than 'soft',
   and by default, perform a hard power off. A soft power off generally
   asks the OS to shutdown the system gracefully before powering off,
   while a hard power off occurs immediately without any warning to the
   OS.

- `type stop_mode`
   unicode

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to stop the node.

##### `POST /api/2.0/machines/{system_id}/ op=power_on`

Turn on a node.

- `param user_data`
   If present, this blob of user-data to be made
   available to the nodes through the metadata service.

- `type user_data`
   base64-encoded unicode

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Ideally we'd have MIME multipart and content-transfer-encoding etc. deal with
the encapsulation of binary data, but couldn't make it work with the framework
in reasonable time so went for a dumb, manual encoding instead.

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to start the machine. Returns 503 if the start-up attempted to
allocate an IP address, and there were no IP addresses available on the
relevant cluster interface.

##### `POST /api/2.0/machines/{system_id}/ op=release`

Release a machine. Opposite of Machines.allocate.

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

- `param erase`
   Erase the disk when releasing.

- `type erase`
   boolean

- `param secure_erase`
   Use the drive's secure erase feature if available.
   In some cases this can be much faster than overwriting the drive. Some
   drives implement secure erasure by overwriting themselves so this
   could still be slow.

- `type secure_erase`
   boolean

- `param quick_erase`
   Wipe 2MiB at the start and at the end of the drive
   to make data recovery inconvenient and unlikely to happen by accident.
   This is not secure.

- `type quick_erase`
   boolean

If neither secure_erase nor quick_erase are specified, MAAS will overwrite
the whole disk with null bytes. This can be very slow.

If both secure_erase and quick_erase are specified and the drive does NOT
have a secure erase feature, MAAS will behave as if only quick_erase was
specified.

If secure_erase is specified and quick_erase is NOT specified and the drive
does NOT have a secure erase feature, MAAS will behave as if secure_erase was
NOT specified, i.e. will overwrite the whole disk with null bytes. This can be
very slow.

Returns 404 if the machine is not found. Returns 403 if the user doesn't have
permission to release the machine. Returns 409 if the machine is in a state
where it may not be released.

##### `POST /api/2.0/machines/{system_id}/ op=rescue_mode`

Begin rescue mode process for a machine.

A machine in the 'deployed' or 'broken' state may initiate the rescue mode
process.

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission to start the rescue mode process for this machine.

##### `POST /api/2.0/machines/{system_id}/ op=restore_default_configuration`

Reset a machine's configuration to its initial state.

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission to reset the machine.

##### `POST /api/2.0/machines/{system_id}/ op=restore_networking_configuration`

Reset a machine's networking options to its initial state.

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission to reset the machine.

##### `POST /api/2.0/machines/{system_id}/ op=restore_storage_configuration`

Reset a machine's storage options to its initial state.

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission to reset the machine.

##### `POST /api/2.0/machines/{system_id}/ op=set_owner_data`

Set key/value data for the current owner.

Pass any key/value data to this method to add, modify, or remove. A key is
removed when the value for that key is set to an empty string.

This operation will not remove any previous keys unless explicitly passed with
an empty string. All owner data is removed when the machine is no longer
allocated to a user.

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission.

##### `POST /api/2.0/machines/{system_id}/ op=set_storage_layout`

Changes the storage layout on the machine.

This operation can only be performed on a machine with a status of 'Ready'.

Note: This will clear the current storage layout and any extra configuration
and replace it will the new layout.

- `param storage_layout`
   Storage layout for the machine. (flat, lvm,
   and bcache)

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
   Cache mode for bcache device. (writeback,
   writethrough, writearound)

- `param cache_size`
   Size of the cache partition to create on the cache
   device.

- `param cache_no_part`
   Don't create a partition on the cache device.
   Use the entire disk as the cache device.

Returns 400 if the machine is currently not allocated. Returns 404 if the
machine could not be found. Returns 403 if the user does not have permission
to set the storage layout.

##### `POST /api/2.0/machines/{system_id}/ op=test`

Begin testing process for a node.

- `param enable_ssh`
   Whether to enable SSH for the testing environment
   using the user's SSH key(s).

- `type enable_ssh`
   bool ('0' for False, '1' for True)

- `param testing_scripts`
   A comma seperated list of testing script names
   and tags to be run. By default all tests tagged 'commissioning' will
   be run.

- `type testing_scripts`
   string

A node in the 'ready', 'allocated', 'deployed', 'broken', or any failed state
may run tests. If testing is started and successfully passes from a 'broken',
or any failed state besides 'failed commissioning' the node will be returned
to a ready state. Otherwise the node will return to the state it was when
testing started.

Returns 404 if the node is not found.

##### `POST /api/2.0/machines/{system_id}/ op=unlock`

Mark a machine as unlocked, allowing changes.

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission unlock the machine.

##### `POST /api/2.0/machines/{system_id}/ op=unmount_special`

Unmount a special-purpose filesystem, like tmpfs.

- `param mount_point`
   Path on the filesystem to unmount.

Returns 403 when the user is not permitted to unmount the partition.

##### `PUT /api/2.0/machines/{system_id}/`

Update a specific Machine.

- `param hostname`
   The new hostname for this machine.

- `type hostname`
   unicode

- `param domain`
   The domain for this machine. If not given the default
   domain is used.

- `type domain`
   unicode

- `param architecture`
   The new architecture for this machine.

- `type architecture`
   unicode

- `param min_hwe_kernel`
   A string containing the minimum kernel version
   allowed to be ran on this machine.

- `type min_hwe_kernel`
   unicode

- `param power_type`
   The new power type for this machine. If you use the
   default value, power_parameters will be set to the empty string.
   Available to admin users. See the [Power types]() section for a list
   of the available power types.

- `type power_type`
   unicode

- `param power_parameters_{param1}`
   The new value for the 'param1'
   power parameter. Note that this is dynamic as the available parameters
   depend on the selected value of the Machine's power_type. Available
   to admin users. See the [Power types]() section for a list of the
   available power parameters for each power type.

- `type power_parameters_{param1}`
   unicode

- `param power_parameters_skip_check`
   Whether or not the new power
   parameters for this machine should be checked against the expected
   power parameters for the machine's power type ('true' or 'false'). The
   default is 'false'.

- `type power_parameters_skip_check`
   unicode

- `param zone`
   Name of a valid physical zone in which to place this
   machine.

- `type zone`
   unicode

- `param swap_size`
   Specifies the size of the swap file, in bytes. Field
   accept K, M, G and T suffixes for values expressed respectively in
   kilobytes, megabytes, gigabytes and terabytes.

- `type swap_size`
   unicode

- `param disable_ipv4`
   Deprecated. If specified, must be False.

- `type disable_ipv4`
   boolean

- `param cpu_count`
   The amount of CPU cores the machine has.

- `type cpu_count`
   integer

- `param memory`
   How much memory the machine has.

- `type memory`
   unicode

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission to update the machine.

### Machines

Manage the collection of all the machines in the MAAS.

##### `GET /api/2.0/machines/`

List Nodes visible to the user, optionally filtered by criteria.

Nodes are sorted by id (i.e. most recent last) and grouped by type.

- `param hostname`
   An optional hostname. Only nodes relating to the node
   with the matching hostname will be returned. This can be specified
   multiple times to see multiple nodes.

- `type hostname`
   unicode

- `param mac_address`
   An optional MAC address. Only nodes relating to the
   node owning the specified MAC address will be returned. This can be
   specified multiple times to see multiple nodes.

- `type mac_address`
   unicode

- `param id`
   An optional list of system ids. Only nodes relating to the
   nodes with matching system ids will be returned.

- `type id`
   unicode

- `param domain`
   An optional name for a dns domain. Only nodes relating
   to the nodes in the domain will be returned.

- `type domain`
   unicode

- `param zone`
   An optional name for a physical zone. Only nodes relating
   to the nodes in the zone will be returned.

- `type zone`
   unicode

- `param agent_name`
   An optional agent name. Only nodes relating to the
   nodes with matching agent names will be returned.

- `type agent_name`
   unicode

##### `GET /api/2.0/machines/ op=is_registered`

Returns whether or not the given MAC address is registered within this MAAS
(and attached to a non-retired node).

- `param mac_address`
   The mac address to be checked.

- `type mac_address`
   unicode

- `return`
   'true' or 'false'.

- `rtype`
   unicode

Returns 400 if any mandatory parameters are missing.

##### `GET /api/2.0/machines/ op=list_allocated`

Fetch Machines that were allocated to the User/oauth token.

##### `GET /api/2.0/machines/ op=power_parameters`

Retrieve power parameters for multiple machines.

- `param id`
   An optional list of system ids. Only machines with
   matching system ids will be returned.

- `type id`
   iterable

- `return`
   A dictionary of power parameters, keyed by machine system_id.

Raises 403 if the user is not an admin.

##### `POST /api/2.0/machines/`

Create a new Machine.

Adding a server to MAAS puts it on a path that will wipe its disks and
re-install its operating system, in the event that it PXE boots. In anonymous
enlistment (and when the enlistment is done by a non-admin), the machine is
held in the "New" state for approval by a MAAS admin.

The minimum data required is: architecture=&lt;arch string&gt; (e.g.
"i386/generic") mac_addresses=&lt;value&gt; (e.g. "aa:bb: cc:dd:ee:ff")

- `param architecture`
   A string containing the architecture type of
   the machine. (For example, "i386", or "amd64".) To determine the
   supported architectures, use the boot-resources endpoint.

- `type architecture`
   unicode

- `param min_hwe_kernel`
   A string containing the minimum kernel version
   allowed to be ran on this machine.

- `type min_hwe_kernel`
   unicode

- `param subarchitecture`
   A string containing the subarchitecture type
   of the machine. (For example, "generic" or "hwe-t".) To determine the
   supported subarchitectures, use the boot-resources endpoint.

- `type subarchitecture`
   unicode

- `param mac_addresses`
   One or more MAC addresses for the machine. To
   specify more than one MAC address, the parameter must be specified
   twice. (such as "machines new mac_addresses=01:02:

03:04:05:06
   mac_addresses=02:03:

> 04:05:06:07")

- `type mac_addresses`
   unicode

- `param hostname`
   A hostname. If not given, one will be generated.

- `type hostname`
   unicode

- `param domain`
   The domain of the machine. If not given the default
   domain is used.

- `type domain`
   unicode

- `param power_type`
   A power management type, if applicable (e.g.
   "virsh", "ipmi").

- `type power_type`
   unicode

##### `POST /api/2.0/machines/ op=accept`

Accept declared machines into the MAAS.

Machines can be enlisted in the MAAS anonymously or by non-admin users, as
opposed to by an admin. These machines are held in the New state; a MAAS admin
must first verify the authenticity of these enlistments, and accept them.

Enlistments can be accepted en masse, by passing multiple machines to this
call. Accepting an already accepted machine is not an error, but accepting one
that is already allocated, broken, etc. is.

- `param machines`
   system_ids of the machines whose enlistment is to be
   accepted. (An empty list is acceptable).

- `return`
   The system_ids of any machines that have their status changed
   by this call. Thus, machines that were already accepted are excluded
   from the result.

Returns 400 if any of the machines do not exist. Returns 403 if the user is
not an admin.

##### `POST /api/2.0/machines/ op=accept_all`

Accept all declared machines into the MAAS.

Machines can be enlisted in the MAAS anonymously or by non-admin users, as
opposed to by an admin. These machines are held in the New state; a MAAS admin
must first verify the authenticity of these enlistments, and accept them.

- `return`
   Representations of any machines that have their status changed
   by this call. Thus, machines that were already accepted are excluded
   from the result.

##### `POST /api/2.0/machines/ op=add_chassis`

Add special hardware types.

- `param chassis_type`
   The type of hardware.
   mscm is the type for the Moonshot Chassis Manager. msftocs is the type
   for the Microsoft OCS Chassis Manager. powerkvm is the type for
   Virtual Machines on Power KVM, managed by Virsh. recs_box is the type
   for the christmann RECS|Box servers. seamicro15k is the type for the
   Seamicro 1500 Chassis. ucsm is the type for the Cisco UCS Manager.
   virsh is the type for virtual machines managed by Virsh. vmware is the
   type for virtual machines managed by VMware.

- `type chassis_type`
   unicode

- `param hostname`
   The URL, hostname, or IP address to access the
   chassis.

- `type url`
   unicode

- `param username`
   The username used to access the chassis. This field
   is required for the recs_box, seamicro15k, vmware, mscm, msftocs, and
   ucsm chassis types.

- `type username`
   unicode

- `param password`
   The password used to access the chassis. This field
   is required for the recs_box, seamicro15k, vmware, mscm, msftocs, and
   ucsm chassis types.

- `type password`
   unicode

- `param accept_all`
   If true, all enlisted machines will be
   commissioned.

- `type accept_all`
   unicode

- `param rack_controller`
   The system_id of the rack controller to send
   the add chassis command through. If none is specifed MAAS will
   automatically determine the rack controller to use.

- `type rack_controller`
   unicode

- `param domain`
   The domain that each new machine added should use.

- `type domain`
   unicode

The following are optional if you are adding a virsh, vmware, or powerkvm
chassis:

- `param prefix_filter`
   Filter machines with supplied prefix.

- `type prefix_filter`
   unicode

The following are optional if you are adding a seamicro15k chassis:

- `param power_control`
   The power_control to use, either ipmi (default),
   restapi, or restapi2.

- `type power_control`
   unicode

The following are optional if you are adding a recs_box, vmware or msftocs
chassis.

- `param port`
   The port to use when accessing the chassis.

- `type port`
   integer

The following are optioanl if you are adding a vmware chassis:

- `param protocol`
   The protocol to use when accessing the VMware
   chassis (default: https).

- `type protocol`
   unicode

- `return`
   A string containing the chassis powered on by which rack
   controller.

Returns 404 if no rack controller can be found which has access to the given
URL. Returns 403 if the user does not have access to the rack controller.
Returns 400 if the required parameters were not passed.

##### `POST /api/2.0/machines/ op=allocate`

Allocate an available machine for deployment.

Constraints parameters can be used to allocate a machine that possesses
certain characteristics. All the constraints are optional and when multiple
constraints are provided, they are combined using 'AND' semantics.

- `param name`
   Hostname or FQDN of the desired machine. If a FQDN is
   specified, both the domain and the hostname portions must match.

- `type name`
   unicode

- `param system_id`
   system_id of the desired machine.

- `type system_id`
   unicode

- `param arch`
   Architecture of the returned machine (e.g. 'i386/generic',
   'amd64', 'armhf/highbank', etc.).

   If multiple architectures are specified, the machine to acquire may
   match any of the given architectures. To request multiple
   architectures, this parameter must be repeated in the request with
   each value.

- `type arch`
   unicode (accepts multiple)

- `param cpu_count`
   Minimum number of CPUs a returned machine must have.

   > A machine with additional CPUs may be allocated if there is no exact
   > match, or if the 'mem' constraint is not also specified.

- `type cpu_count`
   positive integer

- `param mem`
   The minimum amount of memory (expressed in MB) the
   returned machine must have. A machine with additional memory may be
   allocated if there is no exact match, or the 'cpu_count' constraint
   is not also specified.

- `type mem`
   positive integer

- `param tags`
   Tags the machine must match in order to be acquired.

   > If multiple tag names are specified, the machine must be tagged with all
   > of them. To request multiple tags, this parameter must be repeated in
   > the request with each value.

- `type tags`
   unicode (accepts multiple)

- `param not_tags`
   Tags the machine must NOT match.

   > If multiple tag names are specified, the machine must NOT be tagged with
   > ANY of them. To request exclusion of multiple tags, this parameter must
   > be repeated in the request with each value.

- `type tags`
   unicode (accepts multiple)

- `param zone`
   Physical zone name the machine must be located in.

- `type zone`
   unicode

- `param not_in_zone`
   List of physical zones from which the machine must
   not be acquired.

   If multiple zones are specified, the machine must NOT be associated
   with ANY of them. To request multiple zones to exclude, this parameter
   must be repeated in the request with each value.

- `type not_in_zone`
   unicode (accepts multiple)

- `param pod`
   Pod the machine must be located in.

- `type pod`
   unicode

- `param not_pod`
   Pod the machine must not be located in.

- `type not_pod`
   unicode

- `param pod_type`
   Pod type the machine must be located in.

- `type pod_type`
   unicode

- `param not_pod_type`
   Pod type the machine must not be located in.

- `type not_pod_type`
   unicode

- `param subnets`
   Subnets that must be linked to the machine.

   > "Linked to" means the node must be configured to acquire an address in
   > the specified subnet, have a static IP address in the specified subnet,
   > or have been observed to DHCP from the specified subnet during
   > commissioning time (which implies that it *could* have an address on the
   > specified subnet).
   >
   > Subnets can be specified by one of the following criteria:
   >
   > -   &lt;id&gt;: match the subnet by its 'id' field
   > -   fabric:&lt;fabric-spec&gt;:

   match all subnets in a given fabric.
   -   ip:&lt;ip-address&gt;:

   Match the subnet containing &lt;ip-address&gt; with
   the with the longest-prefix match.

   > -   name:&lt;subnet-name&gt;:

   Match a subnet with the given name.
   -   space:&lt;space-spec&gt;:

   Match all subnets in a given space.
   -   vid:&lt;vid-integer&gt;:

   Match a subnet on a VLAN with the specified
   VID. Valid values range from 0 through 4094 (inclusive). An untagged
   VLAN can be specified by using the value "0".

   > -   vlan:&lt;vlan-spec&gt;:

   Match all subnets on the given VLAN.

   > Note that (as of this writing), the 'fabric', 'space', 'vid', and 'vlan'
   > specifiers are only useful for the 'not_spaces' version of this
   > constraint, because they will most likely force the query to match ALL
   > the subnets in each fabric, space, or VLAN, and thus not return any
   > nodes. (This is not a particularly useful behavior, so may be changed in
   > the future.)
   >
   > If multiple subnets are specified, the machine must be associated with
   > all of them. To request multiple subnets, this parameter must be
   > repeated in the request with each value.
   >
   > Note that this replaces the leagcy 'networks' constraint in MAAS 1.x.

- `type subnets`
   unicode (accepts multiple)

- `param not_subnets`
   Subnets that must NOT be linked to the machine.

   > See the 'subnets' constraint documentation above for more information
   > about how each subnet can be specified.
   >
   > If multiple subnets are specified, the machine must NOT be associated
   > with ANY of them. To request multiple subnets to exclude, this parameter
   > must be repeated in the request with each value. (Or a fabric, space, or
   > VLAN specifier may be used to match multiple subnets).
   >
   > Note that this replaces the leagcy 'not_networks' constraint in MAAS
   > 1.x.

- `type not_subnets`
   unicode (accepts multiple)

- `param storage`
   A list of storage constraint identifiers, in the form:
   &lt;label&gt;:&lt;size&gt;(&lt;tag&gt;\[,&lt;tag&gt;\[,...\])\]\[,&lt;label&gt;:

> ...\]

- `type storage`
   unicode

- `param interfaces`
   A labeled constraint map associating constraint
   labels with interface properties that should be matched. Returned
   nodes must have one or more interface matching the specified
   constraints. The labeled constraint map must be in the format:
   `<label>:<key>=<value>[,<key2>=<value2>[,...]]`

   Each key can be one of the following:

   -   id: Matches an interface with the specific id
   -   fabric: Matches an interface attached to the specified fabric.
   -   fabric_class: Matches an interface attached to a fabric with the
       specified class.
   -   ip: Matches an interface with the specified IP address assigned to
       it.
   -   mode: Matches an interface with the specified mode. (Currently,
       the only supported mode is "unconfigured".)
   -   name: Matches an interface with the specified name. (For example,
       "eth0".)
   -   hostname: Matches an interface attached to the node with the
       specified hostname.
   -   subnet: Matches an interface attached to the specified subnet.
   -   space: Matches an interface attached to the specified space.
   -   subnet_cidr: Matches an interface attached to the specified
       subnet CIDR. (For example, "192.168.0.0/24".)
   -   type: Matches an interface of the specified type. (Valid types:
       "physical", "vlan", "bond", "bridge", or "unknown".)
   -   vlan: Matches an interface on the specified VLAN.
   -   vid: Matches an interface on a VLAN with the specified VID.
   -   tag: Matches an interface tagged with the specified tag.

- `type interfaces`
   unicode

- `param fabrics`
   Set of fabrics that the machine must be associated with
   in order to be acquired.

   If multiple fabrics names are specified, the machine can be in any of
   the specified fabrics. To request multiple possible fabrics to match,
   this parameter must be repeated in the request with each value.

- `type fabrics`
   unicode (accepts multiple)

- `param not_fabrics`
   Fabrics the machine must NOT be associated with in
   order to be acquired.

   If multiple fabrics names are specified, the machine must NOT be in
   ANY of them. To request exclusion of multiple fabrics, this parameter
   must be repeated in the request with each value.

- `type not_fabrics`
   unicode (accepts multiple)

- `param fabric_classes`
   Set of fabric class types whose fabrics the
   machine must be associated with in order to be acquired.

   If multiple fabrics class types are specified, the machine can be in
   any matching fabric. To request multiple possible fabrics class types
   to match, this parameter must be repeated in the request with each
   value.

- `type fabric_classes`
   unicode (accepts multiple)

- `param not_fabric_classes`
   Fabric class types whose fabrics the machine
   must NOT be associated with in order to be acquired.

   If multiple fabrics names are specified, the machine must NOT be in
   ANY of them. To request exclusion of multiple fabrics, this parameter
   must be repeated in the request with each value.

- `type not_fabric_classes`
   unicode (accepts multiple)

- `param agent_name`
   An optional agent name to attach to the
   acquired machine.

- `type agent_name`
   unicode

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

- `param bridge_all`
   Optionally create a bridge interface for every
   configured interface on the machine. The created bridges will be
   removed once the machine is released. (Default: False)

- `type bridge_all`
   boolean

- `param bridge_stp`
   Optionally turn spanning tree protocol on or off
   for the bridges created on every configured interface. (Default: off)

- `type bridge_stp`
   boolean

- `param bridge_fd`
   Optionally adjust the forward delay to time seconds.
   (Default: 15)

- `type bridge_fd`
   integer

- `param dry_run`
   Optional boolean to indicate that the machine should
   not actually be acquired (this is for support/troubleshooting, or
   users who want to see which machine would match a constraint, without
   acquiring a machine). Defaults to False.

- `type dry_run`
   bool

- `param verbose`
   Optional boolean to indicate that the user would like
   additional verbosity in the constraints_by_type field (each
   constraint will be prefixed by verbose_, and contain the full data
   structure that indicates which machine(s) matched).

- `type verbose`
   bool

Returns 409 if a suitable machine matching the constraints could not be found.

##### `POST /api/2.0/machines/ op=release`

Release multiple machines.

This places the machines back into the pool, ready to be reallocated.

- `param machines`
   system_ids of the machines which are to be released.
   (An empty list is acceptable).

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

- `return`
   The system_ids of any machines that have their status
   changed by this call. Thus, machines that were already released are
   excluded from the result.

Returns 400 if any of the machines cannot be found. Returns 403 if the user
does not have permission to release any of the machines. Returns a 409 if any
of the machines could not be released due to their current state.

##### `POST /api/2.0/machines/ op=set_zone`

Assign multiple nodes to a physical zone at once.

- `param zone`
   Zone name. If omitted, the zone is "none" and the nodes
   will be taken out of their physical zones.

- `param nodes`
   system_ids of the nodes whose zones are to be set.
   (An empty list is acceptable).

Raises 403 if the user is not an admin.

### Network

Manage a network.

> This endpoint is deprecated. Use the new 'subnet' endpoint instead.

##### `DELETE /api/2.0/networks/{name}/`

Delete network definition.

This endpoint is no longer available. Use the 'subnet' endpoint instead.

##### `GET /api/2.0/networks/{name}/`

Read network definition.

##### `GET /api/2.0/networks/{name}/ op=list_connected_macs`

Returns the list of MAC addresses connected to this network.

Only MAC addresses for nodes visible to the requesting user are returned.

##### `POST /api/2.0/networks/{name}/ op=connect_macs`

Connect the given MAC addresses to this network.

This endpoint is no longer available. Use the 'subnet' endpoint instead.

##### `POST /api/2.0/networks/{name}/ op=disconnect_macs`

Disconnect the given MAC addresses from this network.

This endpoint is no longer available. Use the 'subnet' endpoint instead.

##### `PUT /api/2.0/networks/{name}/`

Update network definition.

This endpoint is no longer available. Use the 'subnet' endpoint instead.

- `param name`
   A simple name for the network, to make it easier to
   refer to. Must consist only of letters, digits, dashes, and
   underscores.

- `param ip`
   Base IP address for the network, e.g. 10.1.0.0. The host
   bits will be zeroed.

- `param netmask`
   Subnet mask to indicate which parts of an IP address
   are part of the network address. For example, 255.255.255.0.

- `param vlan_tag`
   Optional VLAN tag: a number between 1 and 0xffe (4094)
   inclusive, or zero for an untagged network.

- `param description`
   Detailed description of the network for the benefit
   of users and administrators.

### Networks

Manage the networks.

> This endpoint is deprecated. Use the new 'subnets' endpoint instead.

##### `GET /api/2.0/networks/`

List networks.

- `param node`
   Optionally, nodes which must be attached to any returned
   networks. If more than one node is given, the result will be
   restricted to networks that these nodes have in common.

##### `POST /api/2.0/networks/`

Define a network.

This endpoint is no longer available. Use the 'subnets' endpoint instead.

### Node

Manage an individual Node.

> The Node is identified by its system_id.

##### `DELETE /api/2.0/nodes/{system_id}/`

Delete a specific Node.

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to delete the node. Returns 204 if the node is successfully
deleted.

##### `GET /api/2.0/nodes/{system_id}/`

Read a specific Node.

Returns 404 if the node is not found.

##### `GET /api/2.0/nodes/{system_id}/ op=details`

Obtain various system details.

For example, LLDP and `lshw` XML dumps.

Returns a `{detail_type: xml, ...}` map, where `detail_type` is something like
"lldp" or "lshw".

Note that this is returned as BSON and not JSON. This is for efficiency, but
mainly because JSON can't do binary content without applying additional
encoding like base-64.

Returns 404 if the node is not found.

##### `GET /api/2.0/nodes/{system_id}/ op=power_parameters`

Obtain power parameters.

This method is reserved for admin users and returns a 403 if the user is not
one.

This returns the power parameters, if any, configured for a node. For some
types of power control this will include private information such as passwords
and secret keys.

Returns 404 if the node is not found.

### Commissioning results

Read the collection of NodeResult in the MAAS.

##### `GET /api/2.0/installation-results/`

List NodeResult visible to the user, optionally filtered.

- `param system_id`
   An optional list of system ids. Only the
   results related to the nodes with these system ids will be returned.

- `type system_id`
   iterable

- `param name`
   An optional list of names. Only the results
   with the specified names will be returned.

- `type name`
   iterable

- `param result_type`
   An optional result_type. Only the results
   with the specified result_type will be returned.

- `type name`
   iterable

### Node Script

Manage or view a custom script.

##### `DELETE /api/2.0/scripts/{name}`

Delete a script.

##### `GET /api/2.0/scripts/{name}`

Return a script's metadata.

- `param include_script`
   Include the base64 encoded script content.

- `type include_script`
   bool

##### `GET /api/2.0/scripts/{name} op=download`

Download a script.

- `param revision`
   What revision to download, latest by default. Can use
   rev as a shortcut.

- `type revision`
   integer

##### `POST /api/2.0/scripts/{name} op=add_tag`

Add a single tag to a script.

- `param tag`
   The tag being added.

- `type tag`
   unicode

Returns 404 if the script is not found.

##### `POST /api/2.0/scripts/{name} op=remove_tag`

Remove a single tag to a script.

- `param tag`
   The tag being removed.

- `type tag`
   unicode

Returns 404 if the script is not found.

##### `POST /api/2.0/scripts/{name} op=revert`

Revert a script to an earlier version.

- `param to`
   What revision in the script's history to revert to. This can
   either be an ID or a negative number representing how far back to go.

- `type to`
   integer

Returns 404 if the script is not found.

##### `PUT /api/2.0/scripts/{name}`

Update a commissioning script.

- `param name`
   The name of the script.

- `type name`
   unicode

- `param title`
   The title of the script.

- `type title`
   unicode

- `param description`
   A description of what the script does.

- `type description`
   unicode

- `param tags`
   A comma seperated list of tags for this script.

- `type tags`
   unicode

- `param type`
   The type defines when the script should be used. Can be
   testing or commissioning, defaults to testing.

- `type script_type`
   unicode

- `param hardware_type`
   The hardware_type defines what type of hardware
   the script is assoicated with. May be CPU, memory, storage, or node.

- `type hardware_type`
   unicode

- `param parallel`
   Whether the script may be run in parallel with other
   scripts. May be disabled to run by itself, instance to run along
   scripts with the same name, or any to run along any script.

- `type parallel`
   unicode

- `param timeout`
   How long the script is allowed to run before failing.
   0 gives unlimited time, defaults to 0.

- `type timeout`
   unicode

- `param timeout`
   How long the script is allowed to run before failing.
   0 gives unlimited time, defaults to 0.

- `type timeout`
   unicode

- `param destructive`
   Whether or not the script overwrites data on any
   drive on the running system. Destructive scripts can not be run on
   deployed systems. Defaults to false.

- `type destructive`
   boolean

- `param script`
   The content of the script to be uploaded in binary form.
   note: this is not a normal parameter, but a file upload. Its filename
   is ignored; MAAS will know it by the name you pass to the request.
   Optionally you can ignore the name and script parameter in favor of
   uploading a single file as part of the request.

- `param comment`
   A comment about what this change does.

- `type comment`
   unicode

- `param for_hardware`
   A list of modalias, PCI IDs, and/or USB IDs the
   script will automatically run on. Must start with modalias:, pci:

,
   or usb:.

- `type for_hardware`
   unicode

- `param may_reboot`
   Whether or not the script may reboot the system
   while running.

- `type may_reboot`
   boolean

- `param recommission`
   Whether builtin commissioning scripts should be
   rerun after successfully running this scripts.

- `type recommission`
   boolean

### Node Script Result

Manage node script results.

##### `DELETE /api/2.0/nodes/{system_id}/results/{id}/`

Delete a set of results.

id can either by the script set id, current-commissioning, current-testing, or
current-installation.

##### `GET /api/2.0/nodes/{system_id}/results/{id}/`

View a specific set of results.

id can either by the script set id, current-commissioning, current-testing, or
current-installation.

- `param hardware_type`
   Only return scripts for the given hardware type.
   Can be node, cpu, memory, or storage. Defaults to all.

- `type script_type`
   unicode

- `param include_output`
   Include base64 encoded output from the script.

- `type include_output`
   bool

- `param filters`
   A comma seperated list to show only results that ran
   with a script name, tag, or id.

- `type filters`
   unicode

##### `GET /api/2.0/nodes/{system_id}/results/{id}/ op=download`

Download a compressed tar containing all results.

id can either by the script set id, current-commissioning, current-testing, or
current-installation.

- `param hardware_type`
   Only return scripts for the given hardware type.
   Can be node, cpu, memory, or storage. Defaults to all.

- `type script_type`
   unicode

- `param filters`
   A comma seperated list to show only results that ran
   with a script name or tag.

- `type filters`
   unicode

- `param output`
   Can be either combined, stdout, stderr, or all. By
   default only the combined output is returned.

- `type output`
   unicode

- `param filetype`
   Filetype to output, can be txt or tar.xz

- `type format`
   unicode

### Node Script Result

Manage node script results.

##### `GET /api/2.0/nodes/{system_id}/results/`

Return a list of script results grouped by run.

- `param type`
   Only return scripts with the given type. This can be
   commissioning, testing, or installion. Defaults to showing all.

- `type type`
   unicode

- `param hardware_type`
   Only return scripts for the given hardware type.
   Can be node, cpu, memory, or storage. Defaults to all.

- `type script_type`
   unicode

- `param include_output`
   Include base64 encoded output from the script.

- `type include_output`
   bool

- `param filters`
   A comma seperated list to show only results
   with a script name or tag.

- `type filters`
   unicode

### Node Scripts

Manage custom scripts.

> This functionality is only available to administrators.

##### `GET /api/2.0/scripts/`

Return a list of stored scripts.

- `param type`
   Only return scripts with the given type. This can be
   testing or commissioning. Defaults to showing both.

- `type type`
   unicode

- `param hardware_type`
   Only return scripts for the given hardware type.
   Can be node, cpu, memory, or storage. Defaults to all.

- `type hardware_type`
   unicode

- `param include_script`
   Include the base64 encoded script content.

- `type include_script`
   bool

- `param filters`
   A comma seperated list to show only results
   with a script name or tag.

- `type filters`
   unicode

##### `POST /api/2.0/scripts/`

Create a new script.

- `param name`
   The name of the script.

- `type name`
   unicode

- `param title`
   The title of the script.

- `type title`
   unicode

- `param description`
   A description of what the script does.

- `type description`
   unicode

- `param tags`
   A comma seperated list of tags for this script.

- `type tags`
   unicode

- `param type`
   The script_type defines when the script should be used.
   Can be testing or commissioning, defaults to testing.

- `type script_type`
   unicode

- `param hardware_type`
   The hardware_type defines what type of hardware
   the script is assoicated with. May be CPU, memory, storage, or node.

- `type hardware_type`
   unicode

- `param parallel`
   Whether the script may be run in parallel with other
   scripts. May be disabled to run by itself, instance to run along
   scripts with the same name, or any to run along any script.

- `type parallel`
   unicode

- `param timeout`
   How long the script is allowed to run before failing.
   0 gives unlimited time, defaults to 0.

- `type timeout`
   unicode

- `param destructive`
   Whether or not the script overwrites data on any
   drive on the running system. Destructive scripts can not be run on
   deployed systems. Defaults to false.

- `type destructive`
   boolean

- `param script`
   The content of the script to be uploaded in binary form.
   note: this is not a normal parameter, but a file upload. Its filename
   is ignored; MAAS will know it by the name you pass to the request.
   Optionally you can ignore the name and script parameter in favor of
   uploading a single file as part of the request.

- `type script`
   unicode

- `param comment`
   A comment about what this change does.

- `type comment`
   unicode

- `param for_hardware`
   A list of modalias, PCI IDs, and/or USB IDs the
   script will automatically run on. Must start with modalias:, pci:

,
   or usb:.

- `type for_hardware`
   unicode

- `param may_reboot`
   Whether or not the script may reboot the system
   while running.

- `type may_reboot`
   boolean

- `param recommission`
   Whether builtin commissioning scripts should be
   rerun after successfully running this scripts.

- `type recommission`
   boolean

### Nodes

Manage the collection of all the nodes in the MAAS.

##### `GET /api/2.0/nodes/`

List Nodes visible to the user, optionally filtered by criteria.

Nodes are sorted by id (i.e. most recent last) and grouped by type.

- `param hostname`
   An optional hostname. Only nodes relating to the node
   with the matching hostname will be returned. This can be specified
   multiple times to see multiple nodes.

- `type hostname`
   unicode

- `param mac_address`
   An optional MAC address. Only nodes relating to the
   node owning the specified MAC address will be returned. This can be
   specified multiple times to see multiple nodes.

- `type mac_address`
   unicode

- `param id`
   An optional list of system ids. Only nodes relating to the
   nodes with matching system ids will be returned.

- `type id`
   unicode

- `param domain`
   An optional name for a dns domain. Only nodes relating
   to the nodes in the domain will be returned.

- `type domain`
   unicode

- `param zone`
   An optional name for a physical zone. Only nodes relating
   to the nodes in the zone will be returned.

- `type zone`
   unicode

- `param agent_name`
   An optional agent name. Only nodes relating to the
   nodes with matching agent names will be returned.

- `type agent_name`
   unicode

##### `GET /api/2.0/nodes/ op=is_registered`

Returns whether or not the given MAC address is registered within this MAAS
(and attached to a non-retired node).

- `param mac_address`
   The mac address to be checked.

- `type mac_address`
   unicode

- `return`
   'true' or 'false'.

- `rtype`
   unicode

Returns 400 if any mandatory parameters are missing.

##### `POST /api/2.0/nodes/ op=set_zone`

Assign multiple nodes to a physical zone at once.

- `param zone`
   Zone name. If omitted, the zone is "none" and the nodes
   will be taken out of their physical zones.

- `param nodes`
   system_ids of the nodes whose zones are to be set.
   (An empty list is acceptable).

Raises 403 if the user is not an admin.

### Notification

Manage an individual notification.

##### `DELETE /api/2.0/notifications/{id}/`

Delete a specific notification.

##### `GET /api/2.0/notifications/{id}/`

Read a specific notification.

##### `POST /api/2.0/notifications/{id}/ op=dismiss`

Dismiss a specific notification.

Returns HTTP 403 FORBIDDEN if this notification is not relevant (targeted) to
the invoking user.

It is safe to call multiple times for the same notification.

##### `PUT /api/2.0/notifications/{id}/`

Update a specific notification.

See NotificationsHandler.create for field information.

### Notifications

Manage the collection of all the notifications in MAAS.

##### `GET /api/2.0/notifications/`

List notifications relevant to the invoking user.

Notifications that have been dismissed are *not* returned.

##### `POST /api/2.0/notifications/`

Create a notification.

This is available to admins *only*.

- `param message`
   The message for this notification. May contain basic
   HTML; this will be sanitised before display.

- `param context`
   Optional JSON context. The root object *must* be an
   object (i.e. a mapping). The values herein can be referenced by
   message with Python's "format" (not %) codes.

- `param category`
   Optional category. Choose from: error, warning,
   success, or info. Defaults to info.

- `param ident`
   Optional unique identifier for this notification.

- `param user`
   Optional user ID this notification is intended for. By
   default it will not be targeted to any individual user.

- `param users`
   Optional boolean, true to notify all users, defaults to
   false, i.e. not targeted to all users.

- `param admins`
   Optional boolean, true to notify all admins, defaults to
   false, i.e. not targeted to all admins.

Note: if neither user nor users nor admins is set, the notification will not
be seen by anyone.

### Package Repositories

Manage the collection of all Package Repositories in MAAS.

##### `GET /api/2.0/package-repositories/`

List all Package Repositories.

##### `POST /api/2.0/package-repositories/`

Create a Package Repository.

- `param name`
   The name of the Package Repository.

- `type name`
   unicode

- `param url`
   The url of the Package Repository.

- `type url`
   unicode

- `param distributions`
   Which package distributions to include.

- `type distributions`
   unicode

- `param disabled_pockets`
   The list of pockets to disable.

- `param disabled_components`
   The list of components to disable. Only
   applicable to the default Ubuntu repositories.

- `param components`
   The list of components to enable. Only applicable
   to custom repositories.

- `param arches`
   The list of supported architectures.

- `param key`
   The authentication key to use with the repository.

- `type key`
   unicode

- `param enabled`
   Whether or not the repository is enabled.

- `type enabled`
   boolean

### Package Repository

Manage an individual Package Repository.

> The Package Repository is identified by its id.

##### `DELETE /api/2.0/package-repositories/{id}/`

Delete a Package Repository.

Returns 404 if the Package Repository is not found.

##### `GET /api/2.0/package-repositories/{id}/`

Read Package Repository.

Returns 404 if the repository is not found.

##### `PUT /api/2.0/package-repositories/{id}/`

Update a Package Repository.

- `param name`
   The name of the Package Repository.

- `type name`
   unicode

- `param url`
   The url of the Package Repository.

- `type url`
   unicode

- `param distributions`
   Which package distributions to include.

- `type distributions`
   unicode

- `param disabled_pockets`
   The list of pockets to disable.

- `param disabled_components`
   The list of components to disable. Only
   applicable to the default Ubuntu repositories.

- `param components`
   The list of components to enable. Only applicable
   to custom repositories.

- `param arches`
   The list of supported architectures.

- `param key`
   The authentication key to use with the repository.

- `type key`
   unicode

- `param enabled`
   Whether or not the repository is enabled.

- `type enabled`
   boolean

Returns 404 if the Package Repository is not found.

### Partitions

Manage partition on a block device.

##### `DELETE /api/2.0/nodes/{system_id}/blockdevices/{device_id}/partition/{id}`

Delete partition.

Returns 404 if the node, block device, or partition are not found.

##### `GET /api/2.0/nodes/{system_id}/blockdevices/{device_id}/partition/{id}`

Read partition.

Returns 404 if the node, block device, or partition are not found.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/{device_id}/partition/{id} op=format`

Format a partition.

- `param fstype`
   Type of filesystem.

- `param uuid`
   The UUID for the filesystem.

- `param label`
   The label for the filesystem.

Returns 403 when the user doesn't have the ability to format the partition.
Returns 404 if the node, block device, or partition is not found.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/{device_id}/partition/{id} op=mount`

Mount the filesystem on partition.

- `param mount_point`
   Path on the filesystem to mount.

- `param mount_options`
   Options to pass to mount(8).

Returns 403 when the user doesn't have the ability to mount the partition.
Returns 404 if the node, block device, or partition is not found.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/{device_id}/partition/{id} op=unformat`

Unformat a partition.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/{device_id}/partition/{id} op=unmount`

Unmount the filesystem on partition.

Returns 400 if the partition is not formatted or not currently mounted.
Returns 403 when the user doesn't have the ability to unmount the partition.
Returns 404 if the node, block device, or partition is not found.

### Partitions

Manage partitions on a block device.

##### `GET /api/2.0/nodes/{system_id}/blockdevices/{device_id}/partitions/`

List all partitions on the block device.

Returns 404 if the node or the block device are not found.

##### `POST /api/2.0/nodes/{system_id}/blockdevices/{device_id}/partitions/`

Create a partition on the block device.

- `param size`
   The size of the partition. If not specified, all
   available space will be used.

- `param uuid`
   UUID for the partition. Only used if the partition table
   type for the block device is GPT.

- `param bootable`
   If the partition should be marked bootable.

Returns 404 if the node or the block device are not found.

### Pod

Manage an individual pod.

> The pod is identified by its id.

##### `DELETE /api/2.0/pods/{id}/`

Delete a specific Pod.

Returns 404 if the pod is not found. Returns 403 if the user does not have
permission to delete the pod. Returns 204 if the pod is successfully deleted.

##### `GET /api/2.0/pods/{id}/`

##### `GET /api/2.0/pods/{id}/ op=parameters`

Obtain pod parameters.

This method is reserved for admin users and returns a 403 if the user is not
one.

This returns the pod parameters, if any, configured for a pod. For some types
of pod this will include private information such as passwords and secret
keys.

Returns 404 if the pod is not found.

##### `POST /api/2.0/pods/{id}/ op=add_tag`

Add a tag to Pod.

- `param tag`
   The tag being added.

Returns 404 if the Pod is not found. Returns 403 if the user is not allowed to
update the Pod.

##### `POST /api/2.0/pods/{id}/ op=compose`

Compose a machine from Pod.

All fields below are optional:

- `param cores`
   Minimum number of CPU cores.

- `param memory`
   Minimum amount of memory (MiB).

- `param cpu_speed`
   Minimum amount of CPU speed (MHz).

- `param architecture`
   Architecture for the machine. Must be an
   architecture that the pod supports.

- `param storage`
   A list of storage constraint identifiers, in the form:
   &lt;label&gt;:&lt;size&gt;(&lt;tag&gt;\[,&lt;tag&gt;\[,...\])\]\[,&lt;label&gt;:

> ...\]

- `type storage`
   unicode

- `param hostname`
   Hostname for the newly composed machine.

- `type hostname`
   unicode

- `param domain`
   ID of domain to place the newly composed machine in.

- `param zone`
   ID of zone place the newly composed machine in.

Returns 404 if the pod is not found. Returns 403 if the user does not have
permission to compose machine.

##### `POST /api/2.0/pods/{id}/ op=refresh`

Refresh a specific Pod.

Performs pod discovery and updates all discovered information and discovered
machines.

Returns 404 if the pod is not found. Returns 403 if the user does not have
permission to refresh the pod.

##### `POST /api/2.0/pods/{id}/ op=remove_tag`

Remove a tag from Pod.

- `param tag`
   The tag being removed.

Returns 404 if the Pod is not found. Returns 403 if the user is not allowed to
update the Pod.

##### `PUT /api/2.0/pods/{id}/`

Update a specific Pod.

- `param name`
   Name for the pod (optional).

- `param cpu_over_commit_ratio`
   CPU over commit ratio (optional).

- `param memory_over_commit_ratio`
   Memory over commit ratio (optional).

Note: 'type' cannot be updated on a Pod. The Pod must be deleted and re-added
to change the type.

Returns 404 if the pod is not found. Returns 403 if the user does not have
permission to update the pod.

### Pods

Manage the collection of all the pod in the MAAS.

##### `GET /api/2.0/pods/`

List pods.

Get a listing of all the pods.

##### `POST /api/2.0/pods/`

Create a Pod.

- `param type`
   Type of pod to create (rsd, virsh).

- `param name`
   Name for the pod (optional).

- `param zone`
   Name of the zone for the pod (optional).

- `param tags`
   A tag or tags (separated by comma) for the pod.

- `param cpu_over_commit_ratio`
   CPU over commit ratio for the
   pod (optional).

- `param memory_over_commit_ratio`
   Memory over commit ratio for
   the pod (optional).

Returns 503 if the pod could not be discovered. Returns 404 if the pod is not
found. Returns 403 if the user does not have permission to create a pod.

### RackController

Manage an individual rack controller.

> The rack controller is identified by its system_id.

##### `DELETE /api/2.0/rackcontrollers/{system_id}/`

Delete a specific Node.

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to delete the node. Returns 204 if the node is successfully
deleted.

##### `GET /api/2.0/rackcontrollers/{system_id}/`

Read a specific Node.

Returns 404 if the node is not found.

##### `GET /api/2.0/rackcontrollers/{system_id}/ op=details`

Obtain various system details.

For example, LLDP and `lshw` XML dumps.

Returns a `{detail_type: xml, ...}` map, where `detail_type` is something like
"lldp" or "lshw".

Note that this is returned as BSON and not JSON. This is for efficiency, but
mainly because JSON can't do binary content without applying additional
encoding like base-64.

Returns 404 if the node is not found.

##### `GET /api/2.0/rackcontrollers/{system_id}/ op=list_boot_images`

List all available boot images.

Shows all available boot images and lists whether they are in sync with the
region.

Returns 404 if the rack controller is not found.

##### `GET /api/2.0/rackcontrollers/{system_id}/ op=power_parameters`

Obtain power parameters.

This method is reserved for admin users and returns a 403 if the user is not
one.

This returns the power parameters, if any, configured for a node. For some
types of power control this will include private information such as passwords
and secret keys.

Returns 404 if the node is not found.

##### `GET /api/2.0/rackcontrollers/{system_id}/ op=query_power_state`

Query the power state of a node.

Send a request to the node's power controller which asks it about the node's
state. The reply to this could be delayed by up to 30 seconds while waiting
for the power controller to respond. Use this method sparingly as it ties up
an appserver thread while waiting.

- `param system_id`
   The node to query.

- `return`
   a dict whose key is "state" with a value of one of
   'on' or 'off'.

Returns 404 if the node is not found. Returns node's power state.

##### `POST /api/2.0/rackcontrollers/{system_id}/ op=abort`

Abort a node's current operation.

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Returns 404 if the node could not be found. Returns 403 if the user does not
have permission to abort the current operation.

##### `POST /api/2.0/rackcontrollers/{system_id}/ op=import_boot_images`

Import the boot images on this rack controller.

Returns 404 if the rack controller is not found.

##### `POST /api/2.0/rackcontrollers/{system_id}/ op=override_failed_testing`

Ignore failed tests and put node back into a usable state.

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Returns 404 if the machine is not found. Returns 403 if the user does not have
permission to ignore tests for the node.

##### `POST /api/2.0/rackcontrollers/{system_id}/ op=power_off`

Power off a node.

- `param stop_mode`
   An optional power off mode. If 'soft',
   perform a soft power down if the node's power type supports it,
   otherwise perform a hard power off. For all values other than 'soft',
   and by default, perform a hard power off. A soft power off generally
   asks the OS to shutdown the system gracefully before powering off,
   while a hard power off occurs immediately without any warning to the
   OS.

- `type stop_mode`
   unicode

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to stop the node.

##### `POST /api/2.0/rackcontrollers/{system_id}/ op=power_on`

Turn on a node.

- `param user_data`
   If present, this blob of user-data to be made
   available to the nodes through the metadata service.

- `type user_data`
   base64-encoded unicode

- `param comment`
   Optional comment for the event log.

- `type comment`
   unicode

Ideally we'd have MIME multipart and content-transfer-encoding etc. deal with
the encapsulation of binary data, but couldn't make it work with the framework
in reasonable time so went for a dumb, manual encoding instead.

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to start the machine. Returns 503 if the start-up attempted to
allocate an IP address, and there were no IP addresses available on the
relevant cluster interface.

##### `POST /api/2.0/rackcontrollers/{system_id}/ op=test`

Begin testing process for a node.

- `param enable_ssh`
   Whether to enable SSH for the testing environment
   using the user's SSH key(s).

- `type enable_ssh`
   bool ('0' for False, '1' for True)

- `param testing_scripts`
   A comma seperated list of testing script names
   and tags to be run. By default all tests tagged 'commissioning' will
   be run.

- `type testing_scripts`
   string

A node in the 'ready', 'allocated', 'deployed', 'broken', or any failed state
may run tests. If testing is started and successfully passes from a 'broken',
or any failed state besides 'failed commissioning' the node will be returned
to a ready state. Otherwise the node will return to the state it was when
testing started.

Returns 404 if the node is not found.

##### `PUT /api/2.0/rackcontrollers/{system_id}/`

Update a specific Rack controller.

- `param power_type`
   The new power type for this rack controller. If you
   use the default value, power_parameters will be set to the empty
   string. Available to admin users. See the [Power types]() section for
   a list of the available power types.

- `type power_type`
   unicode

- `param power_parameters_{param1}`
   The new value for the 'param1'
   power parameter. Note that this is dynamic as the available parameters
   depend on the selected value of the rack controller's power_type.
   Available to admin users. See the [Power types]() section for a list
   of the available power parameters for each power type.

- `type power_parameters_{param1}`
   unicode

- `param power_parameters_skip_check`
   Whether or not the new power
   parameters for this rack controller should be checked against the
   expected power parameters for the rack controller's power type ('true'
   or 'false'). The default is 'false'.

- `type power_parameters_skip_check`
   unicode

- `param zone`
   Name of a valid physical zone in which to place this
   rack controller.

- `type zone`
   unicode

Returns 404 if the rack controller is not found. Returns 403 if the user does
not have permission to update the rack controller.

### RackControllers

Manage the collection of all rack controllers in MAAS.

##### `GET /api/2.0/rackcontrollers/`

List Nodes visible to the user, optionally filtered by criteria.

Nodes are sorted by id (i.e. most recent last) and grouped by type.

- `param hostname`
   An optional hostname. Only nodes relating to the node
   with the matching hostname will be returned. This can be specified
   multiple times to see multiple nodes.

- `type hostname`
   unicode

- `param mac_address`
   An optional MAC address. Only nodes relating to the
   node owning the specified MAC address will be returned. This can be
   specified multiple times to see multiple nodes.

- `type mac_address`
   unicode

- `param id`
   An optional list of system ids. Only nodes relating to the
   nodes with matching system ids will be returned.

- `type id`
   unicode

- `param domain`
   An optional name for a dns domain. Only nodes relating
   to the nodes in the domain will be returned.

- `type domain`
   unicode

- `param zone`
   An optional name for a physical zone. Only nodes relating
   to the nodes in the zone will be returned.

- `type zone`
   unicode

- `param agent_name`
   An optional agent name. Only nodes relating to the
   nodes with matching agent names will be returned.

- `type agent_name`
   unicode

##### `GET /api/2.0/rackcontrollers/ op=describe_power_types`

Query all of the rack controllers for power information.

- `return`
   a list of dicts that describe the power types in this format.

##### `GET /api/2.0/rackcontrollers/ op=is_registered`

Returns whether or not the given MAC address is registered within this MAAS
(and attached to a non-retired node).

- `param mac_address`
   The mac address to be checked.

- `type mac_address`
   unicode

- `return`
   'true' or 'false'.

- `rtype`
   unicode

Returns 400 if any mandatory parameters are missing.

##### `GET /api/2.0/rackcontrollers/ op=power_parameters`

Retrieve power parameters for multiple machines.

- `param id`
   An optional list of system ids. Only machines with
   matching system ids will be returned.

- `type id`
   iterable

- `return`
   A dictionary of power parameters, keyed by machine system_id.

Raises 403 if the user is not an admin.

##### `POST /api/2.0/rackcontrollers/ op=import_boot_images`

Import the boot images on all rack controllers.

##### `POST /api/2.0/rackcontrollers/ op=set_zone`

Assign multiple nodes to a physical zone at once.

- `param zone`
   Zone name. If omitted, the zone is "none" and the nodes
   will be taken out of their physical zones.

- `param nodes`
   system_ids of the nodes whose zones are to be set.
   (An empty list is acceptable).

Raises 403 if the user is not an admin.

### RAID Device

Manage a specific RAID device on a machine.

##### `DELETE /api/2.0/nodes/{system_id}/raid/{id}/`

Delete RAID on a machine.

Returns 404 if the machine or RAID is not found. Returns 409 if the machine is
not Ready.

##### `GET /api/2.0/nodes/{system_id}/raid/{id}/`

Read RAID device on a machine.

Returns 404 if the machine or RAID is not found.

##### `PUT /api/2.0/nodes/{system_id}/raid/{id}/`

Update RAID on a machine.

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
   Spare block devices to remove
   from the RAID.

- `param add_partitions`
   Partitions to add to the RAID.

- `param remove_partitions`
   Partitions to remove from the RAID.

- `param add_spare_partitions`
   Spare partitions to add to the RAID.

- `param remove_spare_partitions`
   Spare partitions to remove from the
   RAID.

Returns 404 if the machine or RAID is not found. Returns 409 if the machine is
not Ready.

### RAID Devices

Manage all RAID devices on a machine.

##### `GET /api/2.0/nodes/{system_id}/raids/`

List all RAID devices belonging to a machine.

Returns 404 if the machine is not found.

##### `POST /api/2.0/nodes/{system_id}/raids/`

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

Returns 404 if the machine is not found. Returns 409 if the machine is not
Ready.

### RegionController

Manage an individual region controller.

> The region controller is identified by its system_id.

##### `DELETE /api/2.0/regioncontrollers/{system_id}/`

Delete a specific Node.

Returns 404 if the node is not found. Returns 403 if the user does not have
permission to delete the node. Returns 204 if the node is successfully
deleted.

##### `GET /api/2.0/regioncontrollers/{system_id}/`

Read a specific Node.

Returns 404 if the node is not found.

##### `GET /api/2.0/regioncontrollers/{system_id}/ op=details`

Obtain various system details.

For example, LLDP and `lshw` XML dumps.

Returns a `{detail_type: xml, ...}` map, where `detail_type` is something like
"lldp" or "lshw".

Note that this is returned as BSON and not JSON. This is for efficiency, but
mainly because JSON can't do binary content without applying additional
encoding like base-64.

Returns 404 if the node is not found.

##### `GET /api/2.0/regioncontrollers/{system_id}/ op=power_parameters`

Obtain power parameters.

This method is reserved for admin users and returns a 403 if the user is not
one.

This returns the power parameters, if any, configured for a node. For some
types of power control this will include private information such as passwords
and secret keys.

Returns 404 if the node is not found.

##### `PUT /api/2.0/regioncontrollers/{system_id}/`

Update a specific Region controller.

- `param power_type`
   The new power type for this region controller. If
   you use the default value, power_parameters will be set to the empty
   string. Available to admin users. See the [Power types]() section for
   a list of the available power types.

- `type power_type`
   unicode

- `param power_parameters_{param1}`
   The new value for the 'param1'
   power parameter. Note that this is dynamic as the available parameters
   depend on the selected value of the region controller's power_type.
   Available to admin users. See the [Power types]() section for a list
   of the available power parameters for each power type.

- `type power_parameters_{param1}`
   unicode

- `param power_parameters_skip_check`
   Whether or not the new power
   parameters for this region controller should be checked against the
   expected power parameters for the region controller's power type
   ('true' or 'false'). The default is 'false'.

- `type power_parameters_skip_check`
   unicode

- `param zone`
   Name of a valid physical zone in which to place this
   region controller.

- `type zone`
   unicode

Returns 404 if the region controller is not found. Returns 403 if the user
does not have permission to update the region controller.

### RegionControllers

Manage the collection of all region controllers in MAAS.

##### `GET /api/2.0/regioncontrollers/`

List Nodes visible to the user, optionally filtered by criteria.

Nodes are sorted by id (i.e. most recent last) and grouped by type.

- `param hostname`
   An optional hostname. Only nodes relating to the node
   with the matching hostname will be returned. This can be specified
   multiple times to see multiple nodes.

- `type hostname`
   unicode

- `param mac_address`
   An optional MAC address. Only nodes relating to the
   node owning the specified MAC address will be returned. This can be
   specified multiple times to see multiple nodes.

- `type mac_address`
   unicode

- `param id`
   An optional list of system ids. Only nodes relating to the
   nodes with matching system ids will be returned.

- `type id`
   unicode

- `param domain`
   An optional name for a dns domain. Only nodes relating
   to the nodes in the domain will be returned.

- `type domain`
   unicode

- `param zone`
   An optional name for a physical zone. Only nodes relating
   to the nodes in the zone will be returned.

- `type zone`
   unicode

- `param agent_name`
   An optional agent name. Only nodes relating to the
   nodes with matching agent names will be returned.

- `type agent_name`
   unicode

##### `GET /api/2.0/regioncontrollers/ op=is_registered`

Returns whether or not the given MAC address is registered within this MAAS
(and attached to a non-retired node).

- `param mac_address`
   The mac address to be checked.

- `type mac_address`
   unicode

- `return`
   'true' or 'false'.

- `rtype`
   unicode

Returns 400 if any mandatory parameters are missing.

##### `POST /api/2.0/regioncontrollers/ op=set_zone`

Assign multiple nodes to a physical zone at once.

- `param zone`
   Zone name. If omitted, the zone is "none" and the nodes
   will be taken out of their physical zones.

- `param nodes`
   system_ids of the nodes whose zones are to be set.
   (An empty list is acceptable).

Raises 403 if the user is not an admin.

### SSH Key

Manage an SSH key.

> SSH keys can be retrieved or deleted.

##### `DELETE /api/2.0/account/prefs/sshkeys/{id}/`

DELETE an SSH key.

Returns 404 if the key does not exist. Returns 401 if the key does not belong
to the calling user.

##### `GET /api/2.0/account/prefs/sshkeys/{id}/`

GET an SSH key.

Returns 404 if the key does not exist.

### SSH Keys

Manage the collection of all the SSH keys in this MAAS.

##### `GET /api/2.0/account/prefs/sshkeys/`

List all keys belonging to the requesting user.

##### `POST /api/2.0/account/prefs/sshkeys/`

Add a new SSH key to the requesting user's account.

The request payload should contain the public SSH key data in form data whose
name is "key".

##### `POST /api/2.0/account/prefs/sshkeys/ op=import`

Import the requesting user's SSH keys.

Import SSH keys for a given protocol and authorization ID in protocol:auth_id
format.

### SSL Key

Manage an SSL key.

> SSL keys can be retrieved or deleted.

##### `DELETE /api/2.0/account/prefs/sslkeys/{id}/`

DELETE an SSL key.

Returns 401 if the key does not belong to the requesting user. Returns 204 if
the key is successfully deleted.

##### `GET /api/2.0/account/prefs/sslkeys/{id}/`

GET an SSL key.

Returns 404 if the key with id is not found. Returns 401 if the key does not
belong to the requesting user.

### SSL Keys

Operations on multiple keys.

##### `GET /api/2.0/account/prefs/sslkeys/`

List all keys belonging to the requesting user.

##### `POST /api/2.0/account/prefs/sslkeys/`

Add a new SSL key to the requesting user's account.

The request payload should contain the SSL key data in form data whose name is
"key".

### Space

Manage space.

##### `DELETE /api/2.0/spaces/{id}/`

Delete space.

Returns 404 if the space is not found.

##### `GET /api/2.0/spaces/{id}/`

Read space.

Returns 404 if the space is not found.

##### `PUT /api/2.0/spaces/{id}/`

Update space.

- `param name`
   Name of the space.

- `param description`
   Description of the space.

Returns 404 if the space is not found.

### Spaces

Manage spaces.

##### `GET /api/2.0/spaces/`

List all spaces.

##### `POST /api/2.0/spaces/`

Create a space.

- `param name`
   Name of the space.

- `param description`
   Description of the space.

### Static route

Manage static route.

##### `DELETE /api/2.0/static-routes/{id}/`

Delete static route.

Returns 404 if the static route is not found.

##### `GET /api/2.0/static-routes/{id}/`

Read static route.

Returns 404 if the static route is not found.

##### `PUT /api/2.0/static-routes/{id}/`

Update static route.

- `param source`
   Source subnet for the route.

- `param destination`
   Destination subnet for the route.

- `param gateway_ip`
   IP address of the gateway on the source subnet.

- `param metric`
   Weight of the route on a deployed machine.

Returns 404 if the static route is not found.

### Static routes

Manage static routes.

##### `GET /api/2.0/static-routes/`

List all static routes.

##### `POST /api/2.0/static-routes/`

Create a static route.

- `param source`
   Source subnet for the route.

- `param destination`
   Destination subnet for the route.

- `param gateway_ip`
   IP address of the gateway on the source subnet.

- `param metric`
   Weight of the route on a deployed machine.

### Subnet

Manage subnet.

##### `DELETE /api/2.0/subnets/{id}/`

Delete subnet.

Returns 404 if the subnet is not found.

##### `GET /api/2.0/subnets/{id}/`

Read subnet.

Returns 404 if the subnet is not found.

##### `GET /api/2.0/subnets/{id}/ op=ip_addresses`

Returns a summary of IP addresses assigned to this subnet.

###### Optional parameters

with_username
   If False, suppresses the display of usernames associated with each
   address. (Default: True)

with_summary
   If False, suppresses the display of nodes, BMCs, and and DNS records
   associated with each address. (Default: True)

with_node_summary
   Deprecated form of with_summary.

##### `GET /api/2.0/subnets/{id}/ op=reserved_ip_ranges`

Lists IP ranges currently reserved in the subnet.

Returns 404 if the subnet is not found.

##### `GET /api/2.0/subnets/{id}/ op=statistics`

Returns statistics for the specified subnet, including:

num_available: the number of available IP addresses largest_available: the
largest number of contiguous free IP addresses num_unavailable: the number of
unavailable IP addresses total_addresses: the sum of the available plus
unavailable addresses usage: the (floating point) usage percentage of this
subnet usage_string: the (formatted unicode) usage percentage of this subnet
ranges: the specific IP ranges present in ths subnet (if specified)

###### Optional parameters

include_ranges
   If True, includes detailed information about the usage of this range.

include_suggestions
   If True, includes the suggested gateway and dynamic range for this subnet,
   if it were to be configured.

Returns 404 if the subnet is not found.

##### `GET /api/2.0/subnets/{id}/ op=unreserved_ip_ranges`

Lists IP ranges currently unreserved in the subnet.

Returns 404 if the subnet is not found.

##### `PUT /api/2.0/subnets/{id}/`

Update the specified subnet.

Please see the documentation for the 'create' operation for detailed
descriptions of each parameter.

###### Optional parameters

name
   Name of the subnet.

description
   Description of the subnet.

vlan
   VLAN this subnet belongs to.

space
   Space this subnet is in.

cidr
   The network CIDR for this subnet.

gateway_ip
   The gateway IP address for this subnet.

rdns_mode
   How reverse DNS is handled for this subnet.

allow_proxy
   Configure maas-proxy to allow requests from this subnet.

dns_servers
   Comma-seperated list of DNS servers for this subnet.

managed
   If False, MAAS should not manage this subnet. (Default: True)

Returns 404 if the subnet is not found.

### Subnets

Manage subnets.

##### `GET /api/2.0/subnets/`

List all subnets.

##### `POST /api/2.0/subnets/`

Create a subnet.

###### Required parameters

cidr
   The network CIDR for this subnet.

###### Optional parameters

name
   Name of the subnet.

description
   Description of the subnet.

vlan
   VLAN this subnet belongs to. Defaults to the default VLAN for the provided
   fabric or defaults to the default VLAN in the default fabric (if
   unspecified).

fabric
   Fabric for the subnet. Defaults to the fabric the provided VLAN belongs
   to, or defaults to the default fabric.

vid
   VID of the VLAN this subnet belongs to. Only used when vlan is not
   provided. Picks the VLAN with this VID in the provided fabric or the
   default fabric if one is not given.

space
   Space this subnet is in. Defaults to the default space.

gateway_ip
   The gateway IP address for this subnet.

rdns_mode
   How reverse DNS is handled for this subnet. One of: 0 (Disabled), 1
   (Enabled), or 2 (RFC2317). Disabled means no reverse zone is created;
   Enabled means generate the reverse zone; RFC2317 extends Enabled to create
   the necessary parent zone with the appropriate CNAME resource records for
   the network, if the network is small enough to require the support
   described in RFC2317.

allow_proxy
   Configure maas-proxy to allow requests from this subnet.

dns_servers
   Comma-seperated list of DNS servers for this subnet.

managed
   In MAAS 2.0+, all subnets are assumed to be managed by default.

   Only managed subnets allow DHCP to be enabled on their related dynamic
   ranges. (Thus, dynamic ranges become "informational only"; an indication
   that another DHCP server is currently handling them, or that MAAS will
   handle them when the subnet is enabled for management.)

   Managed subnets do not allow IP allocation by default. The meaning of a
   "reserved" IP range is reversed for an unmanaged subnet. (That is, for
   managed subnets, "reserved" means "MAAS cannot allocate any IP address
   within this reserved block". For unmanaged subnets, "reserved" means "MAAS
   must allocate IP addresses only from reserved IP ranges".

### Tag

Manage a Tag.

> Tags are properties that can be associated with a Node and serve as criteria
> for selecting and allocating nodes.
>
> A Tag is identified by its name.

##### `DELETE /api/2.0/tags/{name}/`

Delete a specific Tag.

Returns 404 if the tag is not found. Returns 204 if the tag is successfully
deleted.

##### `GET /api/2.0/tags/{name}/`

Read a specific Tag.

Returns 404 if the tag is not found.

##### `GET /api/2.0/tags/{name}/ op=devices`

Get the list of devices that have this tag.

Returns 404 if the tag is not found.

##### `GET /api/2.0/tags/{name}/ op=machines`

Get the list of machines that have this tag.

Returns 404 if the tag is not found.

##### `GET /api/2.0/tags/{name}/ op=nodes`

Get the list of nodes that have this tag.

Returns 404 if the tag is not found.

##### `GET /api/2.0/tags/{name}/ op=rack_controllers`

Get the list of rack controllers that have this tag.

Returns 404 if the tag is not found.

##### `GET /api/2.0/tags/{name}/ op=region_controllers`

Get the list of region controllers that have this tag.

Returns 404 if the tag is not found.

##### `POST /api/2.0/tags/{name}/ op=rebuild`

Manually trigger a rebuild the tag &lt;=&gt; node mapping.

This is considered a maintenance operation, which should normally not be
necessary. Adding nodes or updating a tag's definition should automatically
trigger the appropriate changes.

Returns 404 if the tag is not found.

##### `POST /api/2.0/tags/{name}/ op=update_nodes`

Add or remove nodes being associated with this tag.

- `param add`
   system_ids of nodes to add to this tag.

- `param remove`
   system_ids of nodes to remove from this tag.

- `param definition`
   (optional) If supplied, the definition will be
   validated against the current definition of the tag. If the value does
   not match, then the update will be dropped (assuming this was just a
   case of a worker being out-of-date)

- `param rack_controller`
   A system ID of a rack controller that did the
   processing. This value is optional. If not supplied, the requester
   must be a superuser. If supplied, then the requester must be the rack
   controller.

Returns 404 if the tag is not found. Returns 401 if the user does not have
permission to update the nodes. Returns 409 if 'definition' doesn't match the
current definition.

##### `PUT /api/2.0/tags/{name}/`

Update a specific Tag.

- `param name`
   The name of the Tag to be created. This should be a short
   name, and will be used in the URL of the tag.

- `param comment`
   A long form description of what the tag is meant for.
   It is meant as a human readable description of the tag.

- `param definition`
   An XPATH query that will be evaluated against the
   hardware_details stored for all nodes (output of lshw -xml).

Returns 404 if the tag is not found.

### Tags

Manage the collection of all the Tags in this MAAS.

##### `GET /api/2.0/tags/`

List Tags.

Get a listing of all tags that are currently defined.

##### `POST /api/2.0/tags/`

Create a new Tag.

- `param name`
   The name of the Tag to be created. This should be a short
   name, and will be used in the URL of the tag.

- `param comment`
   A long form description of what the tag is meant for.
   It is meant as a human readable description of the tag.

- `param definition`
   An XPATH query that will be evaluated against the
   hardware_details stored for all nodes (output of lshw -xml).

- `param kernel_opts`
   Can be None. If set, nodes associated with this tag
   will add this string to their kernel options when booting. The value
   overrides the global 'kernel_opts' setting. If more than one tag is
   associated with a node, the one with the lowest alphabetical name will
   be picked (eg 01-my-tag will be taken over 99-tag-name).

Returns 401 if the user is not an admin.

### User

Manage a user account.

##### `DELETE /api/2.0/users/{username}/`

Deletes a user

##### `GET /api/2.0/users/{username}/`

### Users

Manage the user accounts of this MAAS.

##### `GET /api/2.0/users/`

List users.

##### `GET /api/2.0/users/ op=whoami`

Returns the currently logged in user.

##### `POST /api/2.0/users/`

Create a MAAS user account.

This is not safe: the password is sent in plaintext. Avoid it for production,
unless you are confident that you can prevent eavesdroppers from observing the
request.

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

> This returns a JSON dictionary with information about this MAAS instance:
>
>     {
>         'version': '1.8.0',
>         'subversion': 'alpha10+bzr3750',
>         'capabilities': ['capability1', 'capability2', ...]
>     }

##### `GET /api/2.0/version/`

Version and capabilities of this MAAS instance.

### VLAN

Manage VLAN on a fabric.

##### `DELETE /api/2.0/fabrics/{fabric_id}/vlans/{vid}/`

Delete VLAN on fabric.

Returns 404 if the fabric or VLAN is not found.

##### `GET /api/2.0/fabrics/{fabric_id}/vlans/{vid}/`

Read VLAN on fabric.

Returns 404 if the fabric or VLAN is not found.

##### `PUT /api/2.0/fabrics/{fabric_id}/vlans/{vid}/`

Update VLAN.

- `param name`
   Name of the VLAN.

- `type name`
   unicode

- `param description`
   Description of the VLAN.

- `type description`
   unicode

- `param vid`
   VLAN ID of the VLAN.

- `type vid`
   integer

- `param mtu`
   The MTU to use on the VLAN.

- `type mtu`
   integer

- `param dhcp_on`
   Whether or not DHCP should be managed on the VLAN.

- `type dhcp_on`
   boolean

- `param primary_rack`
   The primary rack controller managing the VLAN.

- `type primary_rack`
   system_id

- `param secondary_rack`
   The secondary rack controller manging the VLAN.

- `type secondary_rack`
   system_id

- `param relay_vlan`
   Only set when this VLAN will be using a DHCP relay
   to forward DHCP requests to another VLAN that MAAS is or will run the
   DHCP server. MAAS will not run the DHCP relay itself, it must be
   configured to proxy reqests to the primary and/or secondary rack
   controller interfaces for the VLAN specified in this field.

- `type relay_vlan`
   ID of VLAN

- `param space`
   The space this VLAN should be placed in. Passing in an
   empty string (or the string 'undefined') will cause the VLAN to be
   placed in the 'undefined' space.

- `type space`
   unicode

Returns 404 if the fabric or VLAN is not found.

### VLANs

Manage VLANs on a fabric.

##### `GET /api/2.0/fabrics/{fabric_id}/vlans/`

List all VLANs belonging to fabric.

Returns 404 if the fabric is not found.

##### `POST /api/2.0/fabrics/{fabric_id}/vlans/`

Create a VLAN.

- `param name`
   Name of the VLAN.

- `type name`
   unicode

- `param description`
   Description of the VLAN.

- `type description`
   unicode

- `param vid`
   VLAN ID of the VLAN.

- `type vid`
   integer

- `param mtu`
   The MTU to use on the VLAN.

- `type mtu`
   integer

- `param space`
   The space this VLAN should be placed in. Passing in an
   empty string (or the string 'undefined') will cause the VLAN to be
   placed in the 'undefined' space.

- `type space`
   unicode

### Volume group

Manage volume group on a machine.

##### `DELETE /api/2.0/nodes/{system_id}/volume-group/{id}/`

Delete volume group on a machine.

Returns 404 if the machine or volume group is not found. Returns 409 if the
machine is not Ready.

##### `GET /api/2.0/nodes/{system_id}/volume-group/{id}/`

Read volume group on a machine.

Returns 404 if the machine or volume group is not found.

##### `POST /api/2.0/nodes/{system_id}/volume-group/{id}/ op=create_logical_volume`

Create a logical volume in the volume group.

- `param name`
   Name of the logical volume.

- `param uuid`
   (optional) UUID of the logical volume.

- `param size`
   Size of the logical volume.

Returns 404 if the machine or volume group is not found. Returns 409 if the
machine is not Ready.

##### `POST /api/2.0/nodes/{system_id}/volume-group/{id}/ op=delete_logical_volume`

Delete a logical volume in the volume group.

- `param id`
   ID of the logical volume.

Returns 403 if no logical volume with id. Returns 404 if the machine or volume
group is not found. Returns 409 if the machine is not Ready.

##### `PUT /api/2.0/nodes/{system_id}/volume-group/{id}/`

Read volume group on a machine.

- `param name`
   Name of the volume group.

- `param uuid`
   UUID of the volume group.

- `param add_block_devices`
   Block devices to add to the volume group.

- `param remove_block_devices`
   Block devices to remove from the
   volume group.

- `param add_partitions`
   Partitions to add to the volume group.

- `param remove_partitions`
   Partitions to remove from the volume group.

Returns 404 if the machine or volume group is not found. Returns 409 if the
machine is not Ready.

### Volume groups

Manage volume groups on a machine.

##### `GET /api/2.0/nodes/{system_id}/volume-groups/`

List all volume groups belonging to a machine.

Returns 404 if the machine is not found.

##### `POST /api/2.0/nodes/{system_id}/volume-groups/`

Create a volume group belonging to machine.

- `param name`
   Name of the volume group.

- `param uuid`
   (optional) UUID of the volume group.

- `param block_devices`
   Block devices to add to the volume group.

- `param partitions`
   Partitions to add to the volume group.

Returns 404 if the machine is not found. Returns 409 if the machine is not
Ready.

### Zone

Manage a physical zone.

> Any node is in a physical zone, or "zone" for short. The meaning of a
> physical zone is up to you: it could identify e.g. a server rack, a network,
> or a data centre. Users can then allocate nodes from specific physical
> zones, to suit their redundancy or performance requirements.
>
> This functionality is only available to administrators. Other users can view
> physical zones, but not modify them.

##### `DELETE /api/2.0/zones/{name}/`

DELETE request. Delete zone.

Returns 404 if the zone is not found. Returns 204 if the zone is successfully
deleted.

##### `GET /api/2.0/zones/{name}/`

GET request. Return zone.

Returns 404 if the zone is not found.

##### `PUT /api/2.0/zones/{name}/`

PUT request. Update zone.

Returns 404 if the zone is not found.

### Zones

Manage physical zones.

##### `GET /api/2.0/zones/`

List zones.

Get a listing of all the physical zones.

##### `POST /api/2.0/zones/`

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
parameters. Note that the list of usable power types for a particular rack
controller might be a subset of this list if the rack controller in question
is from an older version of MAAS.

### amt (Intel AMT)

Power parameters:

-   power_pass (Power password).
-   power_address (Power address).

### apc (American Power Conversion (APC) PDU)

Power parameters:

-   power_address (IP for APC PDU).
-   node_outlet (APC PDU node outlet number (1-16)).
-   power_on_delay (Power ON outlet delay (seconds)). Default: '5'.

### dli (Digital Loggers, Inc. PDU)

Power parameters:

-   outlet_id (Outlet ID).
-   power_address (Power address).
-   power_user (Power user).
-   power_pass (Power password).

### fence_cdu (Sentry Switch CDU)

Power parameters:

-   power_address (Power address).
-   power_id (Power ID).
-   power_user (Power user).
-   power_pass (Power password).

### hmc (IBM Hardware Management Console (HMC))

Power parameters:

-   power_address (IP for HMC).
-   power_user (HMC username).
-   power_pass (HMC password).
-   server_name (HMC Managed System server name).
-   lpar (HMC logical partition).

### ipmi (IPMI)

Power parameters:

-   power_driver (Power driver). Choices: 'LAN' (LAN \[IPMI 1.5\]),
   'LAN_2_0' (LAN_2_0 \[IPMI 2.0\]) Default: 'LAN_2_0'.
-   power_boot_type (Power boot type). Choices: 'auto' (Automatic), 'legacy'
   (Legacy boot), 'efi' (EFI boot) Default: 'auto'.
-   power_address (IP address).
-   power_user (Power user).
-   power_pass (Power password).
-   mac_address (Power MAC).

### manual (Manual)

Power parameters:

### moonshot (HP Moonshot - iLO4 (IPMI))

Power parameters:

-   power_address (Power address).
-   power_user (Power user).
-   power_pass (Power password).
-   power_hwaddress (Power hardware address).

### mscm (HP Moonshot - iLO Chassis Manager)

Power parameters:

-   power_address (IP for MSCM CLI API).
-   power_user (MSCM CLI API user).
-   power_pass (MSCM CLI API password).
-   node_id (Node ID - Must adhere to cXnY format (X=cartridge number, Y=node
   number).).

### msftocs (Microsoft OCS - Chassis Manager)

Power parameters:

-   power_address (Power address).
-   power_port (Power port).
-   power_user (Power user).
-   power_pass (Power password).
-   blade_id (Blade ID (Typically 1-24)).

### nova (OpenStack Nova)

Power parameters:

-   nova_id (Host UUID).
-   os_tenantname (Tenant name).
-   os_username (Username).
-   os_password (Password).
-   os_authurl (Auth URL).

### recs_box (Christmann RECS|Box Power Driver)

Power parameters:

-   node_id (Node ID).
-   power_address (Power address).
-   power_port (Power port).
-   power_user (Power user).
-   power_pass (Power password).

### sm15k (SeaMicro 15000)

Power parameters:

-   system_id (System ID).
-   power_address (Power address).
-   power_user (Power user).
-   power_pass (Power password).
-   power_control (Power control type). Choices: 'ipmi' (IPMI), 'restapi'
   (REST API v0.9), 'restapi2' (REST API v2.0) Default: 'ipmi'.

### ucsm (Cisco UCS Manager)

Power parameters:

-   uuid (Server UUID).
-   power_address (URL for XML API).
-   power_user (API user).
-   power_pass (API password).

### virsh (Virsh (virtual systems))

Power parameters:

-   power_address (Virsh address).
-   power_pass (Virsh password (optional)).
-   power_id (Virsh VM ID).

### vmware (VMware)

Power parameters:

-   power_vm_name (VM Name (if UUID unknown)).
-   power_uuid (VM UUID (if known)).
-   power_address (VMware hostname).
-   power_user (VMware username).
-   power_pass (VMware password).
-   power_port (VMware API port (optional)).
-   power_protocol (VMware API protocol (optional)).

### wedge (Facebook's Wedge)

Power parameters:

-   power_address (IP address).
-   power_user (Power user).
-   power_pass (Power password).

### rsd (Rack Scale Design)

Power parameters:

-   power_address (Pod address).
-   power_user (Pod user).
-   power_pass (Pod password).
-   node_id (Node ID).

## Pod types

This is the list of the supported pod types and their associated parameters.
Note that the list of usable pod types for a particular rack controller might
be a subset of this list if the rack controller in question is from an older
version of MAAS.

### rsd (Rack Scale Design)

Parameters:

-   power_address (Pod address).
-   power_user (Pod user).
-   power_pass (Pod password).
-   node_id (Node ID).

### virsh (Virsh (virtual systems))

Parameters:

-   power_address (Virsh address).
-   power_pass (Virsh password (optional)).
-   power_id (Virsh VM ID).

