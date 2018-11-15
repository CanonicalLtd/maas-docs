Title: CLI Resource Pool Management
TODO:  


# CLI resource pool management

This is a list of resource-pool management tasks to perform with the MAAS CLI.
See [MAAS CLI][manage-cli] on how to get started and [Resource
pools][resourcepools] for an explanation of the subject.

## Creating a resource pool

Here's an example that demonstrates how to create a new resource pool named
`myresource`.

```bash
maas $PROFILE resource-pools create name=myresource description="A new resource pool."
```

!!! Note:
    The `description` field is optional.

## List available resource pools

```bash
maas $PROFILE resource-pools read
```

## List a single resource pool

```bash
maas $PROFILE resource-pool read $RESOURCE_POOL_ID
```

## Update a resource pool

```bash
maas $PROFILE resource-pool update $RESOURCE_POOL_ID name=newname description="A new description."
```

!!! Note:
    The `name` and `description` fields are optional.

## Delete a resource pool

```bash
maas $PROFILE resource-pool delete $RESOURCE_POOL_ID
```


<!-- LINKS -->

[resourcepools]: nodes-resource-pools.md
[manage-cli]: manage-cli.md
