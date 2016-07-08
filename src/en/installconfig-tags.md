Title: Making use of Tags
TODO:  Cover how tags are used in the web GUI (including XML output for a node)
       Expand to listing and deleting tags
       This text needs a review

# Tags

MAAS implements a system of tags based on the physical properties of the
nodes. The idea behind this is that you can use the tags to identify nodes
with particular abilities which may be useful when it comes to deploying
services.

A real world example of using tags might be to identify nodes which have fast GPUs
installed. A tag for 'GPU', for instance,  would help if you were planning to
deploy software which used GPU-accelerated CUDA or OpenCL libraries. 

## Tag definitions

Before we can create a tag we need to know how we will select which nodes it
gets applied to. MAAS collects hardware information from the nodes using the
[lshw](http://ezix.org/project/wiki/HardwareLiSter) utility, which returns 
detailed information in XML format. The definitions used in creating a tag are
then constructed using XPath expressions. If you are unfamiliar with XPath
expressions, it is well worth checking out the [w3schools
documentation](http://www.w3schools.com/xpath/xpath_syntax.asp). 

For the lshw XML, we will just check all the available nodes for some
properties - you can see the lshw output for each node in the web interface. In
our example, we might want to find GPUs with a clock speed of over 1GHz.
In this case, the relevant XML node from the output will be labelled "display"
with a property called 'clock' and look like the following:

```nohighlight
//node[@id="display"]/clock > 1000000000
```

We now have a definition and can go ahead and create a tag.

## Create a tag

Once we have sorted out what definition we will be using, creating the tag is
easy using the `maas` command:

```bash
maas admin tags create name='gpu' comment='GPU with clock speed >1GHz for running CUDA type operations.' definition='//node[@id="display"]/clock > 1000000000'
```
The output from the previous command will look like the following:

```nohighlight
Success.
Machine-readable output follows:
{
    "kernel_opts": "",
    "resource_uri": "/MAAS/api/2.0/tags/gpu/",
    "comment": "GPU with clock speed >1GHz for running CUDA type operations.",
    "definition": "//node[@id=\"display\"]/clock > 1000000000",
    "name": "gpu"
}
```

The comment part of the tag definition is for your benefit. It pays to keep the
actual tag name short and to the point as you will be using it frequently in
commands, but it may subsequently be hard to work out what exactly was the
difference between tags like "gpu" and "fastgpu" unless you have a good
comment. Something which explains the definition in plain language is always a
good idea!

To check which nodes this tag applies to we can use the tag command:

```bash
maas admin tag nodes gpu
```

The process of updating the tags does take some time - not a lot of time, but
if nothing shows up straight away, try running the command again after a
minute or so. When there are nodes that satisfy a tag's conditions they will be
listed in the output, and the tag will also be listed as a filter in the nodes
view of the web interface. 

## Use the tag

You can use the tag in the web interface to discover applicable nodes, but the
real significance of it is when using [Juju](https://jujucharms.com/docs) to
deploy services. Tags can be used with Juju constraints to make sure that a
particular service only gets deployed on hardware with the tag you have
created.

For example, to use the 'gpu' tag we created to run a (hypothetical) service
called 'cuda', we would use:

```bash
juju deploy --constraints tags=gpu cuda
```

You could also list several tags if required, and mix in other Juju constraints
if needed:

```bash
juju deploy --constraints "mem=1024 tags=gpu,intel" cuda
```

## Assign tags

MAAS supports the creation of arbitrary tags which don't depend on XPath
definitions - you may want to tag nodes which make a lot of noise, for
instance. If a tag is created without specifying the definition parameter then
it will simply be ignored by tag refresh mechanism, but the MAAS administrator
will be able to manually add and remove the tag from specific nodes.

In this example we are assuming you are using the 'admin' profile and you want
to create a tag called 'my\_tag':

```bash
maas admin tags create name='my_tag' comment='nodes which go ping'
```
The above line creates a new tag but omits the definition, so no nodes are
not automatically added to it. The following command applies that tag to a
specific node referenced by its node id property:

```bash
maas admin tag update-nodes my_tag add="<node-id>"
```

You can easily remove a tag from a particular node, or indeed add and remove
them at the same time:

```bash
maas admin tag update-nodes my_tag add=<system_id_1> add=<system_id_2> add=<system_id_3> remove=<system_id_4>
```

The output from the command will verify how tags were added and removed:

```bash
Success.
Machine-readable output follows:
{
    "added": 3,
    "removed": 1
}
```

As tags without a definition are ignored when rebuilds are done, it is also
possible to create a normal tag with a definition, and then subsequently edit
it to remove the definition. From this point the tag behaves as if you had
manually created it, but it still retains all the existing associations it has
with nodes. This is particularly useful if you have some hardware which is
conceptually similar but doesn't easily fit within a single tag definition:


For example, the following three commands will creates a tag with a specific
definition (for Intel network hardware), remove this definition and manually
adding the same tag to a single extra node:

```bash
maas admin tags create name='new_tag' comment='nodes I like' definition='contains(//node[@id=network]/vendor, "Intel")'
```
The output from this will look like the following:

```nohighlight
Success.
Machine-readable output follows:
{
    "kernel_opts": "",
    "resource_uri": "/MAAS/api/2.0/tags/new_tag/",
    "name": "new_tag",
    "comment": "nodes I like ",
    "definition": "contains(//node[@id=network]/vendor, \"Intel\")"
}
```

Next, blank the definition:

```bash
maas admin tag update new_tag definition=''
```

The output will show that the definition field is now blank:

```nohighlight
Success.
Machine-readable output follows:
{
    "kernel_opts": "",
    "resource_uri": "/MAAS/api/2.0/tags/new_tag/",
    "comment": "nodes I like ",
    "definition": "",
    "name": "new_tag"
}
```

Then apply the tag to a node that would not have otherwise met the original
definition:

```bash
maas admin tag update-nodes new_tag add=<node-id>
```
```nohighlight
Success.
Machine-readable output follows:
{
    "added": 1,
    "removed": 0
}
```

!!! Note: If you add and remove the same node in one operation, it ends up
having the tag removed (even if the tag was in place before the operation).
