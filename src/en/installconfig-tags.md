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


## Tag definitions

A *tag definition* is the criteria by which nodes are labelled by the
corresponding tag. During node enlistment MAAS collects hardware information
using the [lshw](http://ezix.org/project/wiki/HardwareLiSter) utility, which
returns detailed information in XML format. The definition used in creating a
tag is then constructed using XPath expressions. See
[w3schools documentation](http://www.w3schools.com/xpath/xpath_syntax.asp) for
details on XPath expressions. 

The XML output for each node, available in the web UI, is parsed for the
desired property. In this example, the property is a GPU with a clock speed
greater than 1GHz. In this case, the output will be labelled 'display' with a
property of 'clock'. After adding the speed criteria we end up with:

```nohighlight
//node[@id="display"]/clock > 1000000000
```

This is what can be used a tag definition.


## Create a tag

Create the tag with the `maas` command:

```bash
maas $PROFILE tags create name='gpu' comment='GPU with clock speed >1GHz for running CUDA type operations.' definition='//node[@id="display"]/clock > 1000000000'
```

A newly-created tag will become available as a filter in the nodes view in the
web UI. 

We recommend that each tag have a short name but a fully descriptive comment.
Doing both will help in terms of, respectively, ease of use and keeping track
of a tag's actual meaning.

To see what nodes this tag applies to:

```bash
maas $PROFILE tag nodes gpu
```


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


## Assign a tag

MAAS supports the creation of arbitrary tags which don't depend on XPath
definitions - you may want to tag nodes which make a lot of noise, for
instance. If a tag is created without specifying the definition parameter then
it will simply be ignored by the tag refresh mechanism, yet the MAAS
administrator will be able to manually add and remove the tag from specific
nodes.

Create a tag called 'my\_tag':

```bash
maas $PROFILE tags create name='my_tag' comment='nodes which go ping'
```

The above line creates a new tag but omits the definition, so no nodes are
automatically added to it. The following command applies that tag to a specific
node referenced by its node id property:

```bash
maas $PROFILE tag update-nodes my_tag add="<node-id>"
```

You can remove a tag from a particular node or both add and remove for
different nodes:

```bash
maas $PROFILE tag update-nodes my_tag add=<system_id_1> add=<system_id_2> add=<system_id_3> remove=<system_id_4>
```

!!! Note: If you both add and remove a tag for the same node in one operation,
the node will have the tag removed.

It is also possible to create a tag with a definition (thereby mapping to
certain nodes), removing the definition, and then adding the tag manually to
specific nodes. This is useful if you have hardware which is conceptually
similar but don't perfectly fit within a single tag definition.

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
