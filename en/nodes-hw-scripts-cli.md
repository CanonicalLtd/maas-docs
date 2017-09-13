Title: CLI Hardware Testing Scripts
table_of_contents: True

# CLI Hardware Testing Scripts

The [web UI][hardware-testing] enables you to easily write, upload and execute
your own hardware testing scripts and see the results.

However, the [MAAS CLI][maas-cli] supports options not available from the web
UI, including access to earlier versions of your scripts, script deletion and
result automation.

To use the CLI, first make sure you are [logged in][maas-cli-login].

## Script management

To upload a hardware testing script to MAAS, enter the following:

```bash
maas $PROFILE node-scripts create name=$SCRIPT_NAME name> \
 script=$PATH_TO_SCRIPT type=testing
```

Changing the type to *commissioning* adds the test script to the
commissioning process.

All uploaded scripts can be listed with the following command:

```bash
maas $PROFILE node-scripts read type=testing filters=$TAG
```

The optional *filters* argument lets you search for tags assigned to a script,
such as using `TAG=cpu` with the above example.

A [script's metadata][script-example], and even the script itself, can be
updated from the command line:

```bash
maas $PROFILE node-script update \ 
 $SCRIPT_NAME script=$PATH_TO_SCRIPT comment=$COMMENT
```

The JSON formatted output to the above command will include 'history'
dictionary entries for when the script was modified along with any comments for
those modifications:

```json
"history": [
    {
        "id": 40,
        "created": "Tue, 12 Sep 2017 12:12:08 -0000",
        "comment": "Updated version"
    },
    {
        "id": 34,
        "created": "Fri, 08 Sep 2017 17:07:46 -0000",
        "comment": null
    }
]
```

MAAS keeps a history of all uploaded script versions, allowing you to easily
revert to a previous version using the `id` of the version you wish to revert
to:

```bash
maas $PROFILE node-script revert $SCRIPT_NAME to=$VERSION_ID
```

!!! Warning:
    The history for later modifications will be lost when reverting to an earlier
    version of the script.

To download a script, enter the following:

```bash
maas $PROFILE node-script download $SCRIPT_NAME > $LOCAL_FILENAME
```

To delete a script, use `delete`:

```bash
maas $PROFILE node-script delete $SCRIPT_NAME
```

## Tags

As with general [tag management][tag-management], tags make scripts easier to
manage, such as by grouping scripts together for commissioning and testing:

```bash
maas $PROFILE node-script add-tag $SCRIPT_NAME tag=$TAG
maas $PROFILE node-script remove-tag $SCRIPT_NAME tag=$TAG
```

MAAS runs all commissioning scripts by default. However, you can select which
custom scripts to run during commissioning by name or tag:

```bash
maas $PROFILE machine commission \ 
 commissioning_scripts=$SCRIPT_NAME,$SCRIPT_TAG
```

Similarly, all testing scripts tagged with *commissioning* are also run during
commissioning or testing. Like commissioning you can select testing scripts by
name or tag:


```bash
maas $PROFILE machine commission \ 
 testing_scripts=$SCRIPT_NAME,$SCRIPT_TAG
maas $PROFILE machine test \ 
 testing_scripts=$SCRIPT_NAME,$SCRIPT_TAG
```

## Results

The command line allows you to not only view the current script's progress but
you can also retrieve the verbatim output from previous runs as well.   


If you only want to see the latest or currently running result you can use
`current-commissioning`, `current-testing`, or `current-installation` instead
of an id:

```bash
maas $PROFILE node-script-result read $SYSTEM_ID $RESULTS
```

You can also limit which results are returned by type (commissioning, testing,
or installation), script name, or script run:

```bash
maas $PROFILE node-script-results read \ 
 $SYSTEM_ID type=$SCRIPT_TYPE filters=$SCRIPT_NAME,$TAGS
```
 
Finally, results can be downloaded, either to stdout, stderr, as combined output or as a tar.xz:

```bash
maas $PROFILE node-script-result download $SYSTEM_ID $RUN_ID output=all \
 filetype=tar.xz > $LOCAL_FILENAME
```

!!! Note:
    See [Determine a node's system ID][system-id] for details on retrieving
    the system ID.

<!-- LINKS -->
[hardware-testing]: nodes-hw-scripts.md
[script-example]: nodes-hw-scripts.md#script-example
[maas-cli]: manage-cli.md
[maas-cli-login]: manage-cli.md#log-in-(required)
[system-id]: manage-cli-common#determine-a-node's-system-id
[tag-management]: manage-cli-tags.md
