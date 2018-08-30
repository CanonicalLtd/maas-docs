Title: Commissioning and Hardware Testing Scripts
table_of_contents: True

# Commissioning and Hardware Testing Scripts

Commissioning and hardware testing scripts are used by MAAS while
commissioning and testing a node respectively. *Commissioning scripts* are used
to configure hardware or perform other tasks during commissioning, such as
updating firmware, whereas *hardware testing scripts* are used to evaluate system
hardware and report its status. 

Scripts can be selected to run from web UI 
[during commissioning][maas-commission], by [testing
hardware][hardware-testing] or from the [command line][maas-scripts-cli].

This page explains the various metadata fields used within these scripts, how
parameters are passed to scripts and how any results are returned, along with
examples of both commissioning and hardware testing scripts.

!!! Note:
    By default, all commissioning scripts will be run except those which use the
    `for_hardware` feature. Similarly, any test script tagged `commissioning` will
    be run during commissioning or testing. 
    [See below](#automatic-script-selection-by-hardware-type) for more details.


## Metadata fields

Metadata fields tell MAAS when the script should be used, how it should be run,
and what information a script is gathering. A script can have the following fields:

- `name`: The name of the script.
- `title`: Human-friendly descriptive version of name, used within the web UI.
- `description`: Brief outline of what the script does.
- `tags`: List of tags associated with the script.
- `type`: Either *commissioning* or *testing*.
- `timeout`: Length of time before MAAS automatically fails and kills execution
  of the script.
- `destructive`: *True* or *False*, depending on whether the script will
  overwrite system data.
- `comment`: Describes changes made in this revision of the script.
- `hardware_type`: Defines the type of hardware the script configures or tests.
  If the script returns results, *hardware type* dictates what hardware the results
  are associated with. The following types are valid:
    - `node`: Not associated with any hardware type. This is the default.
    - `cpu`: Configures or tests the CPUs on the node.
    - `memory`: Configures or tests memory on the node.
    - `storage`: Configures or test storage on the node. Each storage
      result may be associated with a block device on the system.
- `parallel`: Enables scripts to be run in parallel and can be one of the
  following:
    - `disabled`: The script will run serially on its own.
    - `instance`: Runs in parallel only with other instances of the same
      script.
    - `any`: Runs in parallel alongside any other scripts with *parallel* set
      to *any*.
- `parameters`: What [parameters](#parameters) the script accepts.
- `packages`: List of packages to be installed or extracted before running the
  script. Packages may be specified as a JSON string, a list of strings, or as
  a dictionary. For example, `packages: {apt: stress-ng}`, would ask `apt` to
  install *stress-ng*. Package sources can be any of the following:
    - `apt`: Used by default if the source is omitted.
    - `snap`: Installs packages using [snap][snapcraft]. May also be a list of
      dictionaries. The dictionary must define the *name* of the package to be
      installed, and optionally, the `channel`, `mode` and `revision`.
    - `url`: The archive will be downloaded and, if possible, extracted or
      installed when a Debian package or [snap][snapcraft].
- `timeout`: The amount of time the script has to run before being timing out.
  The time may be specified in seconds or using HH:MM:SS format.
- `destructive`: When True indicates the script may overwrite existing data to
  the disks. Destructive tests can not be run on a deployed machine.
- `for_hardware`: Specifies the hardware that must be on the machine for the
  script to run. May be a single string or list of strings of the following:
    - `modalias`: Starts with 'modalias:' may optionally contain wild cards.
    - `PCI ID`: Must be in the format of 'pci:VVVV:PPPP' where VVVV is the
      vendor ID and PPPP is the product ID.
    - `USB ID`: Must be in the format of 'usb:VVVV:PPPP' where VVVV is the
      vendor ID and PPPP is the product ID.
    - `System Vendor`: Starts with 'system_vendor:'.
    - `System Product`: Starts with 'system_product:'.
    - `System Version`: Starts with 'system_version:'.
    - `Mainboard Vendor`: Starts with 'mainboard_vendor:'.
    - `Mainboard Product`: Starts with 'mainboard_product:'.
- `may_reboot`: When True indicates to MAAS the script may reboot the machine.
  MAAS will allow up to 20 minutes between heatbeats while running a script
  with `may_reboot` set to True.
- `recommission`: After all commissioning scripts have finished running rerun
  the builtin commissioning scripts to rediscover hardware.


## Parameters

Scripts can accept values defined within the `parameters` field.  Parameter values
can then be set by users before commissioning or before testing. The default
values are used if they are run as a group action, or automatically by MAAS.

Parameters may only be defined within the embedded YAML of the script, and they
take the form of a dictionary of dictionaries.

The key of the dictionary must be a string and it's this string that's used by
the UI and API when users are setting parameter values during commissioning or
testing.

The value is a dictionary with the following fields:

- `type`: Every parameter must contain a type field. This describes what
   the parameter may accept and its default values. It may be one of the
   following:
    - `storage`: Allows the selection of a strong device on the node being
      run.
    - `runtime`: The amount of time the script should run for. This will be
      passed to the script in seconds.
- `min`: The minimum numeric value an input is allowed to have. Only
  applicable to runtime and defaults to 0.
- `max`: The maximum numeric value an input is allowed to have. Only applicable
  to runtime. The default is unlimited.
- `title`: The title of the parameter field when displayed in the UI. The
  following types have the following default values:
    - `storage`: Storage device.
    - `runtime`: Runtime.
- `argument-format`: Specifies how the argument should be passed to the script.
  Input is described as `{input}`.
   The storage type may also use `{name}`, `{path}`, `{model}` or
   `{serial}`. MAAS will lookup the values of path, model, and serial based on
   user selection. For storage, `{input}` is synonymous with `{path}`.
   The following types have the following default values:
    - `storage`: `--storage={path}`
    - `runtime`: `--runtime={input}`
- `default`: The default value of the parameter. The following types have
  the following default values. Setting these to '' or *None* will override
  these values:
    - `storage`: all.
    - `runtime`: If set, the runtime value of the script.
- `required`: Whether or not user input is required. If set to *false*, no default
  is set and no user input will mean the parameter is not passed to the script.
  Defaults to `true`.
- `results`: What results the script will return on completion. This may only
  be defined within the embedded YAML of the script. Results may be a list of
  strings or a dictionary of dictionaries.

## Environment variables

The following environment variables are available when a script is run within
the MAAS environment:

- `OUTPUT_STDOUT_PATH`: The path to the log of *STDOUT* from the script.
- `OUTPUT_STDERR_PATH`: The path to the log of *STDERR* from the script.
- `OUTPUT_COMBINED_PATH`: The path to the log of the combined *STDOUT* and *STDERR*
  from the script.
- `RESULT_PATH`: Path for the script to write a result YAML to.
- `DOWNLOAD_PATH`: The path where all files have been downloaded to.
- `RUNTIME`: The amount of time the script has to run in seconds.
- `HAS_STARTED`: When True MAAS has run the script once before but not to
  completion. Indicates the machine has been rebooted.


## Script examples

### Commissioning script: Configure HPA

Below is a sample script to configure an Intel C610/X99 HPA controller on an HP
system. The script will only run on systems with an Intel C610/X99 controller
identified by the PCI ID **8086:8d06**.

Before the script runs, MAAS will download and install the 
[HP RESTful Interface Tool][hp-rest] package from HP.  After the script
successfully completes, the built-in commissioning scripts will be re-run to
capture the new configuration.

```bash
#!/bin/bash -ex
# --- Start MAAS 1.0 script metadata ---
# name: hp_c610_x99_ahci
# title: Configure Intel C610/X99 controller on HP systems
# description: Configure Intel C610/X99 controller on HP systems to AHCI
# script_type: commissioning
# tags: configure_hpa
# packages:
#  url: http://downloads.linux.hpe.com/SDR/repo/hprest/pool/non-free/hprest-1.5-26_amd64.deb
# for_hardware: pci:8086:8d06
# recommission: True
# --- End MAAS 1.0 script metadata ---
output=$(sudo hprest get EmbeddedSata --selector HpBios.)
echo $output
if [ $(echo $output | grep -c 'EmbeddedSata=Raid') ]; then
    echo "Server is in Dynamic Smart Array RAID mode. Changing to SATA AHCI support mode."
    sudo hprest set EmbeddedSata=Ahci --selector HpBios. --commit
else:
    echo "No changes made to the system, Server is Already in AHCI Mode"
fi
```

### Commissioning script: Update firmware

Below is a sample script to update the mainboard firmware on an ASUS P8P67 Pro
using a vendor provided tool. The tool will be automatically downloaded an
extracted by MAAS. The script reboots the system to complete the update. The
system will boot back into the MAAS ephemeral environment to finish
commissioning and optionally testing.

!!! Note:
    Vendor tools which use UEFI boot capsules or need to store resource files
    on disk while rebooting are not currently supported.

```bash
#!/bin/bash -ex
# --- Start MAAS 1.0 script metadata ---
# name: update_asus_p8p67_firmware
# title: Firmware update for the ASUS P8P67 mainboard
# description: Firmware update for the ASUS P8P67 mainboard
# script_type: commissioning
# tags: update_firmware
# packages:
#  url: http://example.com/firmware.tar.gz
# for_hardware: mainboard_product:P8P67 PRO
# may_reboot: True
# --- End MAAS 1.0 script metadata ---
$DOWNLOAD_PATH/update_firmware
reboot
```

### Hardware test script: CPU stress test

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

### Automatic script selection by hardware type

When selecting multiple machines in the [web UI][maas-nodes], scripts which
declare the `for_hardware` field will only run on machines with matching
hardware. To automatically run a script when 'Update firmware' or 'Configure
HBA' is selected the script must be tagged with 'update_firmware' or
'configure_hba'.

Similarly, scripts selected by tag on the [command line][maas-scripts-cli]
which specify the `for_hardware` field will only run on matching hardware.


## Results

A script can output its results to a YAML file and those results will be associated
with the hardware type defined within the script. 

If the hardware type is *storage*, for example, and the script accepts a
*storage type* parameter, the result will be associated with a specific storage
device.

The YAML file must represent a dictionary with the following fields:

- `result`: The completion status of the script. This can be either `passed`,
  `failed` or `degraded`. If no status is defined, an exit code of `0`
  indicates a pass while a non-zero value indicates a failure.
- `results`: A dictionary of results. The key may map to a results key defined
  as embedded YAML within the script. The value of each result must be a string
  or a list of strings.

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

Clicking on the title of a completed or failed script will reveal the output
from that specific script.

![failed script output][nodes-hw-scripts__2.2_fail]

If you need further details, especially when writing and running your own
scripts, connect to a node and examine its logs and environment.

To do this, enable *Allow SSH access and prevent machine from powering off*
from the 'Test hardware' page of the web UI before starting commissioning or
testing.

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
[hp-rest]: https://downloads.linux.hpe.com/SDR/project/hprest/
[maas-nodes]: nodes-overview.md 
[maas-commission]: nodes-commission.md
[script-selection]: nodes-scripts.md#automatic-script-selection-by-hardware-type
[maas-scripts-cli]: nodes-scripts-cli.md

<!-- IMAGES -->
[nodes-hw-scripts__2.2_select]: ../media/nodes-hw-scripts__2.2_select.png
[nodes-hw-scripts__2.2_fail]: ../media/nodes-hw-scripts__2.2_fail.png
[nodes-hw-scripts__2.2_ssh]: ../media/nodes-hw-scripts__2.2_ssh.png
