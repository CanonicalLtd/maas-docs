Title: MAAS Tags
TODO:  Cover how tags are used in the web GUI (including XML output for a node)
       Expand to listing and deleting tags
       This text needs a review


# Tags

MAAS implements a system of tags based on the physical properties of the
nodes. During service deployment, the tags can be used to identify machines
most appropriate for that service. Noteworthy is the fact that Juju honours
MAAS tags.

For instance, a tag could identify nodes which possess fast GPUs. Such a tag
would help if you were planning to deploy software which used GPU-accelerated
CUDA or OpenCL libraries. 

Newly-created tags immediately become available as a filter in the nodes view
in the web UI. 


## Tag definitions

A *tag definition* is the criteria by which nodes are labelled by the
corresponding tag. During node enlistment MAAS collects hardware information
using the [lshw](http://ezix.org/project/wiki/HardwareLiSter) utility. The
definition used in creating a tag is then constructed using an *XPath
expression*. See
[w3schools documentation](http://www.w3schools.com/xsl/xpath_intro.asp) for
details on XPath. 

The lshw data for each node, available (in both XML and YAML) in the web UI, is
inspected by you for the desired property. In this example, the property is a
GPU with a clock speed greater than 1GHz. In this case, the output will be
labelled 'display' with a property of 'clock'. After adding the speed criteria
we end up with:

```nohighlight
//node[@id="display"]/clock > 1000000000
```

This is what can be used a tag definition.


## Tag creation and automatic assignment

When a definition is supplied during tag creation the tag is automatically
applied to the nodes that satisfy the definition: 

```bash
maas $PROFILE tags create name='gpu' comment='GPU with clock speed >1GHz for running CUDA type operations.' definition='//node[@id="display"]/clock > 1000000000'
```

We recommend that each tag have a short name but a comment that fully
describes it. Having both will help in terms of, respectively, ease of use
and keeping track of a tag's actual meaning.

To see what nodes (or machines) this tag applies to:

```bash
maas $PROFILE tag nodes gpu
maas $PROFILE tag machines gpu
```


## List all tags

maas $PROFILE tags read


## Use a tag

You can use a tag in the web UI as a node search filter but the main
significance of it is when using Juju to deploy applications.

For example, to use the 'gpu' tag to deploy a (hypothetical) service called
'cuda':

```bash
juju deploy --constraints tags=gpu cuda
```

You can also use multiple tags in addition to the normal Juju constraints:

```bash
juju deploy --constraints "mem=1024 tags=gpu,intel" cuda
```


## Manual tag assignment

It is possible to assign tags to nodes manually by simply omitting the
definition:

```bash
maas $PROFILE tags create name='my_tag' comment='nodes which go ping'
```

Now apply the tag to a specific node referenced by its system id:

```bash
maas $PROFILE tag update-nodes my_tag add=$SYSTEM_ID
```

A tag can be removed from a particular node or both added and removed for
different nodes:

```bash
maas $PROFILE tag update-nodes my_tag add=$SYSTEM_ID_1 add=$SYSTEM_ID_2 remove=$SYSTEM_ID_3
```

!!! Note: If a tag is both added and removed for the same node in one
operation, the node will have the tag removed.


## Hybrid tag assignment

It is also possible to create a tag with a definition (thereby mapping to
certain nodes), removing the definition (but keeping the mapping), and then
adding the tag manually to specific nodes. This is useful if you have hardware
which is conceptually similar but doesn't perfectly fit within a tag
definition.

For example, below we will create a tag with a definition (Intel network
hardware), remove the definition, and manually add the tag to an extra node:

```bash
maas $PROFILE tags create name='new_tag' comment='nodes I like' definition='contains(//node[@id=network]/vendor, "Intel")'
```

Remove the definition:

```bash
maas $PROFILE tag update new_tag definition=''
```

Then apply the tag to the extra node:

```bash
maas $PROFILE tag update-nodes new_tag add=<node-id>
```
