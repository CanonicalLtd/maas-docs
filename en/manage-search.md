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

You can also filter your searches to major categories by selecting one from the
Filters dropdown menu next to the search bar.

![filters][img__filters]

For example, to find all "New" machines containing the name or tag 'quail',
select Status/New from the dropdown Filters menu, and then type the word 'quail'
next to it:

![filterresult][img__filterresult]

You can also enter the filters manually in the search bar, using the form:

```no-highlight
<filter-name>:(=<value1>,=<value2>,...,=<valuen>)
```

For example, suppose you recently created several VMs inside a new KVM pod and,
in addition to the 'virtual' tag automatically assigned by MAAS, you tagged each
with 'mypod'. You could search for both of those tags at once by entering:

```no-highlight
tags:(=virtual,=mypod)
```

Or, you could simply select both tags from the Filters dropdown menu.

Note that MAAS treats the selection of multiple search parameters as an OR
condition. That is, using the example above, MAAS presents all machines tagged
'virtual' OR 'mypod'.

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
