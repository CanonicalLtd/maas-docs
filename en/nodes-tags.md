Title: Tags
TODO:  Cover how tags are used in the web UI (including XML output for a node)
       Track bug: https://bugs.launchpad.net/maas/+bug/1608629 (UI and tags)
table_of_contents: True


# Tags

Using MAAS tags, you can easily deploy services on machines that meet certain
criteria. Tags are a convenient way to assign descriptive words to machines,
interfaces, and storage devices.

MAAS supports XPath expressions in tags (see below), which makes auto-assigning
tags to matching hardware possible. For instance, you could tag nodes that
possess fast GPUs and then deploy software that used GPU-accelerated CUDA or
OpenCL libraries.

Because [Juju][about-juju] is the recommended way to deploy services on machines
managed by MAAS (see [below][tag-manage]), it supports MAAS tags for application
deployments.

To understand the true power of MAAS tags, it is important to understand tag
definitions.

## Tag definitions

A *tag definition* is the criteria by which nodes are auto-labelled by the
corresponding tag. During node enlistment MAAS collects hardware information
(using the [lshw][upstream-lshw] utility). The definition used in creating a
tag is then constructed using an *XPath expression* based on that information.
See [w3schools documentation][upstream-w3schools] for details on XPath.

The collected data for each node, viewable (in both XML and YAML) in the web
UI, is inspected by you for the desired property. Building on the example
alluded to above, a property can be a GPU with a clock speed greater than 1GHz.
In this case, the following excerpt from a node's data (in XML format) is
pertinent:

```nohighlight
      <lshw:node id="display" class="display" handle="PCI:0000:00:02.0">
       <lshw:description>VGA compatible controller</lshw:description>
       <lshw:product>GD 5446</lshw:product>
       <lshw:vendor>Cirrus Logic</lshw:vendor>
       <lshw:physid>2</lshw:physid>
       <lshw:businfo>pci@0000:00:02.0</lshw:businfo>
       <lshw:version>00</lshw:version>
       <lshw:width units="bits">32</lshw:width>
       <lshw:clock units="Hz">33000000</lshw:clock>
       <lshw:configuration>
        <lshw:setting id="latency" value="0"/>
       </lshw:configuration>
       <lshw:capabilities>
        <lshw:capability id="vga_controller"/>
       </lshw:capabilities>
       <lshw:resources>
        <lshw:resource type="memory" value="fc000000-fdffffff"/>
        <lshw:resource type="memory" value="febd0000-febd0fff"/>
        <lshw:resource type="memory" value="febc0000-febcffff"/>
       </lshw:resources>
      </lshw:node>
```

MAAS nodes will be selected based on these XPath *predicates*:

- *element* of 'node'
- with an *attribute* of 'id'
- whose *value* is 'display'
- and has a *child element* of 'clock units="Hz"'

After adding the speed criteria via an XPath *operator* we end up with this as
our tag definition:

```nohighlight
//node[@id="display"]/'clock units="Hz"' > 1000000000
```
## Tag listing and tags as search filters

To list all tags visit the 'Machines' tab and expand the 'Tags' subsection in the
left pane.

This view is also where one can use tags as node search filters. Select one, or
several, tags. The nodes that satisfy all selected tags will display on the
right pane. Notice there is a search field at the top of the right pane. This
is where one can type in a search expression.

Below, tag 'virtual' has been selected (with the mouse) and the search field
automatically reflects this. Five nodes satisfy this search filter.

![tags: search][img__tags-search]

Remove a tag from the search filter by either hitting the 'x' character
alongside a tag or editing the search expression.

## Tag assignment

To view a node's currently assigned tags stay on the 'Machines' page and click
on the node in question. Tags that are currently assigned will be displayed in
the *Tags* pane of the 'Machine summary'.

Select the 'Configuration' tab and then the 'Edit' button alongside 'Machine
configuration' to edit tags:

- To unassign a tag hit the 'x' character alongside a tag.
- To create a rudimentary tag type the name of the new tag in the 'Add a tag'
  field and hit Enter. The tag will be created and automatically assigned to the
  node. Repeat if desired.
- To assign an existing tag type at least three characters to trigger a
  real-time search. Any resulting tags will show up in a drop-down menu.
  Select as desired.

![tags: add & remove][img__tags-add-remove]

Changes are applied by pressing the 'Save changes' button.

!!! Note:
    New tags become available as a filter in the 'Machines' page in the web UI
    immediately after you add them.

### Tags for network interfaces

It's also possible to assign tags to specific network interfaces. These tags
can be used when searching for nodes within the web UI and when allocating
machines from the API.

Network interface tags can only be assigned when a node is in either a 'Ready'
or a 'Broken' state.

With the machine selected from the 'Machines' page, on the 'Interfaces' tab use
the 'Edit Physical' button from the 'Actions' menu icon to the right of an
interface:

![tags: net interface][img__tags-net-interface]

To add a tag, type its name into the 'Tags' field and press Enter. Repeat as
desired. Use the small 'x' next to a tag to unassign the tag.

Changes are applied by pressing the 'Save' button.

### Tags for storage configuration

Alongside tags for an entire node and network interfaces, tags can also be
defined for storage devices. As with other tags, these can be used when
searching for nodes within the web UI, where they appear beneath the 'Storage
tag' filter, and when allocating machines from the API.

To add a tag to a storage device, click on the machine with the storage you
wish to tag on the 'Machines' page of the web UI and open the 'Storage' tab.
Use the menu in the 'Actions' column beneath 'Available disks and partitions'
to select 'Edit disk' for your chosen device:

![tags: storage][img__tags-storage]

To add a tag, type its name into the 'Tags' field and press Enter. Repeat as
desired. Use the small 'x' next to a tag to unassign the tag.

Changes are applied by pressing the 'Save' button.


## Tag management

At this time, other than simple tag assignemts as demonstrated above, the best
way to manage MAAS tags is by using the CLI (see [CLI Tag management][cli-tags]).
Juju integration is also covered there.

![tags: multiple][img__tags-multiple]

<!-- LINKS -->

[tag-manage]: #tag-management
[about-juju]: https://jujucharms.com/docs/stable/about-juju.html
[upstream-lshw]: http://ezix.org/project/wiki/HardwareLiSter
[upstream-w3schools]: https://www.w3schools.com/xml/xpath_intro.asp
[cli-example-tag-creation-and-auto-assignment]: manage-cli-tags.md#tag-creation-and-auto-assignment
[cli-tags]: manage-cli-tags.md

[img__tags-search]: ../media/nodes-tags__2.6-tags-filter.png
[img__tags-add-remove]: ../media/nodes-tags__2.6-tags-add_remove.png
[img__tags-net-interface]: ../media/nodes-tags__2.6-tags-net-interfaces.png
[img__tags-storage]: ../media/nodes-tags__2.6-tags-storage.png
[img__tags-multiple]: ../media/node-tags__2.6-tag-multiple.png
