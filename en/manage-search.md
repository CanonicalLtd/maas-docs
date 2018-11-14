Title: Interactive search
TODO:  
table_of_contents: True


# Interactive search

See [Web UI][webui] for how to get started with the web UI.

The Machines and Devices pages contain a powerful interactive search bar that
lets you filter machines and devices.

## Simple searches

To begin searching, simply enter the text you're interested in. As you type,
MAAS will update search results in real time. You can search across virtually
every parameter, including domain, name, tag, power type, IP, status, zone, and
so on.

![searchbar][img__searchbar]

## Filtered searches

Filter your searches to major categories by selecting one from the Filters
dropdown menu next to the search bar.

![filters][img__filters]

For example, to find all "New" machines containing the name or tag 'quail',
select Status/New from the dropdown Filters menu, and then type the word 'quail'
next to it:

![filterresult][img__filterresult]

### Manual filters

Enter filters manually in the search bar to more precisely control your
searches:

```no-highlight
filter-name:([=]val1,...,[=]val2)
```

!!! Note:

    Parentheses surrounding the value list are only necessary when a value has a
    space and might be misinterpreted as the start of an additional search term.
    E.g.  `status:(failed testing)`.

#### Exact matching

If you need an exact match, preface the search value with an equal sign. For
example, to find machines belonging to a pod named `able-cattle`:

```no-highlight
pod:=able-cattle
```

#### Partial matching

Without an equal sign, MAAS returns partial matches. For example, the following
will display all machines belonging to pods with names containing `able` or
`cattle`:

```no-highlight
pod:able,cattle
```

#### Multiple search terms

MAAS uses boolean AND logic to evaluate multiple search terms. That is, when you
provide multiple search terms, e.g. `pod:able,cattle cpu:=5`, MAAS displays
machines that belong to pods with names containing `able` OR `cattle` AND having
5 CPU cores. Similarly, if you provide multiple string searches, `steady able`,
MAAS will display machines matching `steady` AND `able`.

#### Filter properties

In addition to the major filtering categories available in the Filter dropdown
menu, the following machine properties are available as filters:

- actions
- architecture
- commissioning\_script\_count
- commissioning\_status
- commissioning\_status\_tooltip
- cores
- cpu
- dhcp\_on
- distro\_series
- extra\_macs
- fabrics
- fqdn
- has\_logs
- ip\_addresses
- link\_type
- mac
- metadata
- node\_type\_display
- osystem
- physical\_disk\_count
- pod
- pod-id
- pool
- power
- pxe\_mac
- pxe\_mac\_vendor
- ram
- release
- spaces
- status
- status\_code
- storage
- storage\_tags
- subnets
- tags
- testing\_script\_count
- testing\_status
- testing\_status\_tooltip
- vlan
- zone

For example, the following will search for a machine that has an interface with
a specific MAC address marked for PXE booting:

```no-highlight
pxe_mac:=9e:b0:e4:15:ae:1e
```

## CLI

See [List nodes][cli-list-nodes] for more information about how to use the MAAS
CLI to perform similar searches or [CLI][maas-cli] for how to get started with
the MAAS CLI.

<!-- LINKS -->

[img__filterresult]: ../media/manage-search__2.5_filtered-search.png
[img__filters]: ../media/manage-search__2.5_filters.png
[img__searchbar]: ../media/manage-search__2.5_searchbar.png

[cli-list-nodes]: manage-cli-common.md#list-nodes
[maas-cli]: manage-cli.md
[webui]: installconfig-webui.md
