Title: Hardware Testing Script Metadata
table_of_contents: True

# Hardware Testing Script Metadata

Hardware testing scripts are used to evaluate system hardware, and you can run
your own from both the [web UI][maas-scripts] and from the 
[command line][maas-scripts-cli].

This page explains the various metadata fields used within these scripts, along
with how parameters are passed to scripts and how any results are returned.

## Metadata fields

Metadata fields tell MAAS when the script should be used, how it should be run,
and what information a script is gathering. A script can have the following fields:

- `name`: Corresponds to the script's filename.
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
    - **node**: Not associated with any hardware type. This is the default.
    - **cpu**: Configures or tests the CPUs on the node.
    - **memory**: Configures or tests memory on the node.
    - **storage**: Configures or test storage on the node. Each storage
      result may be associated with a block device on the system.
- `parallel`: Enables scripts to be run in parallel and can be one of the
  following:
    - **disabled**: The script will run serially on its own.
    - **instance**: Runs in parallel only with other instances of the same
      script.
    - **any**: Runs in parallel alongside any other scripts with *parallel* set
      to *any*.
- `packages`: List of packages to be installed or extracted before running the
  script. Packages may be specified as a JSON string, a list of strings, or as
  a dictionary. For example, `packages: {apt: stress-ng}`, would ask **apt** to
  install *stress-ng*. Package sources can be any of the following:
    - **apt**: Used by default if the source is omitted.
    - **snap**: Installs packages using [snap][snapcraft]. May also be a list of
      dictionaries. The dictionary must define the *name* of the package to be
      installed, and optionally, the `channel`, `mode` and `revision`.
    - **url**: The archive will be downloaded and, if possible, extracted.
      **URL_DIR** will be exported to the script as an environment variable.

## Environment variables

The following environment variables are available when a script is run within
the MAAS environment:

- **OUTPUT_STDOUT_PATH**: The path to the log of *STDOUT* from the script.
- **OUTPUT_STDERR_PATH**: The path to the log of *STDERR* from the script.
- **OUTPUT_COMBINED_PATH**: The path to the log of the combined *STDOUT* and *STDERR*
  from the script.
- **RESULT_PATH**: Path for the script to write a result YAML to.

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
    - **storage**: Allows the selection of a strong device on the node being
      run.
    - **runtime**: The amount of time the script should run for. This will be
      passed to the script in seconds.
- `min`: The minimum numeric value an input is allowed to have. Only
  applicable to runtime and defaults to 0.
- `max`: The maximum numeric value an input is allowed to have. Only applicable
  to runtime. The default is unlimited.
- `title`: The title of the parameter field when displayed in the UI. The
  following types have the following default values:
    - **storage**: Storage device.
    - **runtime**: Runtime.
- `argument-format`: Specifies how the argument should be passed to the script.
  Input is described as `{input}`.
   The storage type may also use `{name}`, `{path}`, `{model}` or
   `{serial}`. MAAS will lookup the values of path, model, and serial based on
   user selection. For storage, `{input}` is synonymous with `{path}`.
   The following types have the following default values:
    - **storage**: `--storage={path}`
    - **runtime**: `--runtime={input}`
- `default`: The default value of the parameter. The following types have
  the following default values. Setting these to '' or *None* will override
  these values:
    - **storage**: all.
    - **runtime**: If set, the runtime value of the script.
- `required`: Whether or not user input is required. If set to *false*, no default
  is set and no user input will mean the parameter is not passed to the script.
  Defaults to `true`.
- `results`: What results the script will return on completion. This may only
  be defined within the embedded YAML of the script. Results may be a list of
  strings or a dictionary of dictionaries.

## Results

A script can output its results to a YAML file and those results will be associated
with the hardware type defined within the script. 

If the hardware type is *storage*, for example, and the script accepts a
*storage type* parameter, the result will be associated with a specific storage
device.

The YAML file must represent a dictionary with the following fields:

- `result`: The completion status of the script. This can be either **passed**,
  **failed** or **degraded**. If no status is defined, an exit code of `0`
  indicates a pass while a non-zero value indicates a failure.
- `results`: A dictionary of results. The key may map to a results key defined
  as embedded YAML within the script. The value of each result must be a string
  or a list of strings.


<!-- LINKS -->
[snapcraft]: https://snapcraft.io/
[maas-scripts]: nodes-hw-scripts.md
[maas-scripts-cli]: nodes-hw-scripts-cli.md
