Title: Custom node setup
table_of_contents: True

# Custom node setup (preseed)

During node [enlistment][node-enlistment], [deployment][node-deployment],
[commissioning][node-commission] and node installation, MAAS sends
[Tempita-derived][tempita] configuration files to the [cloud-init][cloud-init]
process running on the target node. MAAS refers to this process as
**preseeding**.

These *preseed* files are used to configure a node's ephemeral and
installation environments and can be modified or augmented to perform your own
custom node configuration.

Customisation in MAAS happens in two ways:

1. [Curtin][curtin], a preseeding system similar to Kickstart or d-i (Debian
   Installer), applies customisations during operating system (OS) image
   installation. These changes are performed on every deployment, while the OS
   image is being installed, before the machine reboots into the installed OS.
   Curtin customisations are perfect for administrators who want their
   deployments to have identical setups all the time, every time.
   [This blog post][blog] contains an excellent high-level overview of custom
   MAAS installs using Curtin.
2. [Cloud-init][cloud-init], a system for setting up machines immediately after
   they've been instantiated, applies customisations after the first boot, post
   OS installation, after MAAS changes a machine's status to 'Deployed.'
   Customisations are performed on a per-instances basis, which means that
   user-supplied scripts  must be specified again on redeployment. Cloud-init
   customisations are the best way for MAAS users to customize their
   deployments, similar to how the various cloud services prepare VMs when
   launching instances.

## Curtin

### Templates

The [Tempita][tempita] template files are found within the
`/etc/maas/preseeds/` directory on the region controller. Each template uses a
filename prefix that corresponds to a particular *phase* of MAAS node
deployment:

|     Phase     |        Filename prefix               |
|:-------------:|:------------------------------------:|
| 1. Enlistment    | enlist                            |
| 2. Commissioning | commissioning                     |
| 3. Installation  | curtin ([Curtin][curtin])         |


Additionally, the template for each phase typically consist of two files. The
first is a higher-level file that often contains little more than a URL or a
link to further credentials while a second file contains the logic to be
executed. 

The `enlist` template, for example, contains only minimal variables whereas the
contents of `enlist_userdata` includes both user variables and initialisation
logic.

!!! Note:
    Tempita’s inheritance mechanism is the reverse of what might be expected.
    Inherited files, such as `enlist_userdata`, become the new template which
    can then reference variables from the higher level file, such as `enlist`.


### Template naming

Templates are interpreted in order of their file name, allowing for base
configuration options and parameters to be overridden on an operating system,
architecture, sub-architecture, release and node name basis.

To maintain backward compatibility with earlier versions of MAAS that only
support Ubuntu, if the node operating system is Ubuntu then file names
without `{os}` will also be tried.

Consequently, template files are interpreted in the following order:

1. `{prefix}_{os}_{node_arch}_{node_subarch}_{release}_{node_name}`
or `{prefix}_{node_arch}_{node_subarch}_{release}_{node_name}`

1. `{prefix}_{os}_{node_arch}_{node_subarch}_{release}`
or `{prefix}_{node_arch}_{node_subarch}_{release}`

1. `{prefix}_{os}_{node_arch}_{node_subarch}`
or `{prefix}_{node_arch}_{node_subarch}`

1. `{prefix}_{os}_{node_arch}`
or `{prefix}_{node_arch}`

1. `{prefix}_{os}`

1. `{prefix}`

1. `generic`

The *node* needs to be the node name, as shown in the web UI URL or the [system
ID][system-id] as output from the API. For example, the following web UI URL
displays a node name of `7gan3t`:

```bash
http://<MAAS-IP>:5240/MAAS/#/node/7gan3t
```

The prefix can be either `enlist`, `enlist_userdata`, `commissioning`,
`curtin`, `curtin_userdata` or `preseed_master`. Alternatively, the prefix and
the following underscore can be omitted. 

For example, to create a *generic* configuration template for Ubuntu 16.04
Xenial running on a x64 architecture, the file would need to be called
`ubuntu_amd64_generic_xenial_node`.

To create the equivalent template for *curtin_userdata*, the file would be called
`curtin_userdata_ubuntu_amd64_generic_xenial_node`.

!!! Note:
    Any file targetting a specific node will replace the values and
    configuration held within any generic files. If those values are needed,
    the generic template values will need to be copied into your new file. 

### Configuration

You can customise the Curtin installation by either editing the existing
`curtin_userdata` template or by adding a custom file as described above.

Curtin provides hooks to execute custom code before and after installation
takes place. These hooks are named `early` and `late` respectively, and they
can both be overridden to execute the Curtin configuration in the ephemeral
environment. Additionally, the `late` hook can be used to execute a
configuration for a machine being installed, a state known as *in-target*.

Curtin commands look like this:

```
foo: ["command", "--command-arg", "command-arg-value"]
```

Each component of the given command makes up an item in an array. Note, however
that the following won't work:

```
foo: ["sh", "-c", "/bin/echo", "foobar"]
```

This is because the value of `sh`'s `-c` argument is itself an entire command.
The correct way to express this is:

```
foo: ["sh", "-c", "/bin/echo foobar"]
```

The following is an example of an *early* command that will run before the
installation takes place in the ephemeral environment. The command pings an
external machine to signal that the installation is about to start:

```bash
early_commands:
  signal: [wget, "--no-proxy", "http://example.com/", "--post-data", "system_id=&signal=starting_install", "-O", "/dev/null"]
```

The following is an example of two late commands that will run after the
installation has been performed. Both run *in-target*, on the machine being
installed.

The first command adds a PPA to the machine. The second command creates a file
containing the node’s system ID:

```bash
late_commands:
  add_repo: ["curtin", "in-target", "--", "add-apt-repository", "-y", "ppa:my/ppa"]
  custom: ["curtin", "in-target", "--", "sh", "-c", "/bin/echo -en 'Installed ' > /tmp/maas_system_id"]
```

## Cloud-init

Using cloud-init to customize a node after deployment is relatively easy. If
you're not familiar with the MAAS command-line interface (CLI), start by
reviewing the [MAAS CLI][cli] page.

After you're logged in, use the following command to deploy a machine with a
custom script you've written:

```
maas $PROFILE machine deploy $SYSTEM_ID user_data=<base-64-encoded-script>
```

* `$PROFILE`: Your MAAS login. E.g. `admin`
* `$SYSTEM_ID`: The machine's [system ID][system-id].
* `<base-64-encoded-script>`: A base-64 encoded copy of your customisation
  script. See below for an example.

E.g.:

Suppose you would like to import an SSH key immediately after your machine is
deployed. You might use this script, called `import_key.sh`:

```bash
#!/bin/bash
(
echo === $date ===
ssh-import-id foobar_user
) | tee /ssh-key-import.log
```

This script echos the date in addition to the output of the `ssh-import-key`
command. It also adds that output to a file, `/ssh-key-import.log`.

Base-64 encoding is required because the MAAS command-line interacts with the
MAAS API, and base-64 encoding allows MAAS to send the script inside a POST HTTP
command.

Use the `base64` command to output a base-64 encoded version of your script:

```
base64 ./import_key.sh
```

Putting it together:

```
maas $PROFILE machine deploy $SYSTEM_ID user_data=$(base64 ./import_key.sh)
```

After MAAS deploys the machine, you'll find `/ssh-key-import.log` on the node
you deployed.

<!-- LINKS -->
[blog]: https://blog.ubuntu.com/2017/06/02/customising-maas-installs
[curtin]: https://launchpad.net/curtin
[cloud-init]: https://launchpad.net/cloud-init
[node-enlistment]: nodes-add.html#enlistment
[node-deployment]: nodes-deploy.md
[node-commission]: nodes-commission.md
[tempita]: https://raw.githubusercontent.com/ravenac95/tempita/master/docs/index.txt
[system-id]: manage-cli-common.md#determine-a-node-system-id
[user-data]: api#post-maasapi20machinessystem_id-opdeploy
[cli]: manage-cli.md
