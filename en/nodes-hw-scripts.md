Title: Hardware Testing Scripts
TODO: Expand definitions for metadata and add guidelines for their use
table_of_contents: True

# Hardware Testing Scripts

[Hardware Testing][hardware-testing] scripts can be run directly after [node
commissioning][commission-nodes], or from a node in a ready, deployed or broken
state. Your own scripts can be uploaded and run during commissioning or the
testing phase, alongside scripts [bundled with MAAS][bundled-scripts].

Scripts typically evaluate system hardware, collate data and report results
back to MAAS. As scripts are run within an ephemeral Ubuntu environment, they
can be written in Bash, Python, Perl, or any other language installed via a
*deb* or *Snap* package.

## Script example 

As a simple example, here's a functional Bash script replicating part of the
**stress-ng** script bundled with MAAS:

```bash
#!/bin/bash -e
# --- Start MAAS 1.0 script metadata ---
# name: stress-ng-cpu-test
# title: CPU validation
# description: Run stress-ng memory tests for 5 minutes.
# script_type: test
# hardware_type: cpu
# packages: {apt: stress-ng}
# tags: cpu
# timeout: 00:05:00
# --- End MAAS 1.0 script metadata ---

sudo -n stress-ng --matrix 0 --ignite-cpu --log-brief --metrics-brief --times \
    --tz --verify --timeout 2m
```

The above Bash script contains comment-delineated metadata that configures the
script environment and installs any dependencies, plus a single line of
functionality that runs **stress-ng** (a CPU stress-test utility) with various
arguments.

For further details on which metadata fields can be used, and what they do, see
[Hardware Testing Script Metadata][maas-scripts-fields].

!!! Note: 
    Many metadata elements can optionally be defined from the 
    [commmand line][maas-scripts-cli], including `title`, `description`, `tags`,
    `timeout`, `comment` and `destructive`.

## Upload procedure

Scripts can be uploaded to MAAS using the web UI. Select the 'Settings' page and
look for the 'Commissioning scripts' section near the top. Within the
Commissioning scripts section, use the *Choose file* button to open a
requester, locate the script, and select *Upload script* to upload it to MAAS. 

A status message of *Commissioning script created* will appear and you'll now
be able to select your script from the Node's '[Test hardware][hardware-testing]' page. 

![select custom script][nodes-hw-scripts__2.2_select]

!!! Note: 
    MAAS executes scripts in lexicographical order. This allows you to control
    when your scripts are executed and if they run before or after the standard
    MAAS scripts.

## Debugging

Clicking on the title of a completed or failed hardware test will reveal the
output from that specific script.

![failed script output][nodes-hw-scripts__2.2_fail]

If you need further details, especially when writing and running your own
scripts, connect to a node and examine its logs and environment.

To do this, enable *Allow SSH access and prevent machine from powering off*
from the 'Test hardware' page of the web UI before running scripts.

![enable SSH within Test Hardware][nodes-hw-scripts__2.2_ssh]

As scripts operate within an ephemeral version of Ubuntu, enabling this option
stops the node from shutting down, allowing you to connect and probe a script's
status. 

As long as you've added your [SSH key][ssh-keys] to MAAS, you can simply
connect with SSH to the node's IP with a username of `ubuntu`. Type `sudo -i`
to get root access, and navigate to the `/tmp/user_data.sh.*` directory. This
holds the scripts, output and tools for current session, in particular:

- `output/`: Contains standard (**.out**) and error (**.err**) output for each script
- `testing/`: Contains the scripts MAAS attempts to execute

## Command line access

If you need more control over the running and management of testing scripts,
the [MAAS CLI][maas-cli] includes options not available from the web UI. See
the [CLI Hardware Testing Scripts][maas-scripts-cli] documentation for details.

<!-- LINKS -->
[commission-nodes]: nodes-commission.md
[hardware-testing]: nodes-hw-testing.md
[bundled-scripts]: nodes-hw-testing.md#included-scripts
[maas-cli]: manage-cli.md
[ssh-keys]: manage-account.md#ssh-keys
[maas-scripts-cli]: nodes-scripts-cli.md
[maas-scripts-fields]: nodes-hw-scripts-fields.md

<!-- IMAGES -->
[nodes-hw-scripts__2.2_select]: ../media/nodes-hw-scripts__2.2_select.png
[nodes-hw-scripts__2.2_fail]: ../media/nodes-hw-scripts__2.2_fail.png
[nodes-hw-scripts__2.2_ssh]: ../media/nodes-hw-scripts__2.2_ssh.png

