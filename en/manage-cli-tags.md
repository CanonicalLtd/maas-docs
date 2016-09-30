Title: MAAS CLI | Tags
TODO:  Decide whether explicit examples are needed everywhere
       Foldouts cannot be used due to bug: https://git.io/vwbCz


# Tag management

This is a list of advanced tasks to perform with the MAAS CLI. See
[MAAS CLI](manage-cli.md) on how to get started.


## Tag creation and auto-assignment

When a definition is supplied during a tag's creation the tag is automatically
applied to all the nodes that satisfy the definition: 

```bash
maas $PROFILE tags create name=$TAG_NAME \
	comment='$TAG_COMMENT' definition='$TAG_DEFINITION'
```

For example,

```bash
maas $PROFILE tags create name='gpu' \
	comment='GPU with clock speed >1GHz for running CUDA type operations.' \
	definition='//node[@id="display"]/'clock units="Hz"' > 1000000000'
```

We recommend that each tag have a short name and a comment that fully describes
it. Having both will help with usage and for recalling a tag's meaning long
after it was created.


## List all tags

To list all tags present on the region controller:

```bash
maas $PROFILE tags read
```


## List nodes/machines labelled with a tag

To list what nodes (or machines) a tag applies to:

```bash
maas $PROFILE tag nodes $TAG_NAME
maas $PROFILE tag machines $TAG_NAME
```


## Use a tag

Although a tag can be used in the web UI as a node search filter the primary
benefit of tags is realized when Juju is utilized for application deployment.

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
definition and applying the tag to a node by referencing its system id:

```bash
maas $PROFILE tags create name=$TAG_NAME comment='$TAG_COMMENT'
maas $PROFILE tag update-nodes $TAG_NAME add=$SYSTEM_ID
```

To remove a tag:

```bash
maas $PROFILE tag update-nodes $TAG_NAME remove=$SYSTEM_ID
```

In the same operation, a tag can be added to some nodes and removed from others:

```bash
maas $PROFILE tag update-nodes $TAG_NAME \
	add=$SYSTEM_ID_1 add=$SYSTEM_ID_2 remove=$SYSTEM_ID_3
```


## Hybrid tag assignment

It is also possible to create a tag with a definition (thereby map to certain
nodes), remove the definition (but retain the mapping), and then add the tag
manually to specific nodes. This is useful for hardware which is conceptually
similar but do not all satisfy a single tag definition. Here are the commands
you would use to do this:

```bash
maas $PROFILE tags create name=$TAG_NAME \
	comment='$TAG_COMMENT' definition='$TAG_DEFINITION'
maas $PROFILE tag update $TAG_NAME definition=''
maas $PROFILE tag update-nodes $TAG_NAME add=$SYSTEM_ID
```
