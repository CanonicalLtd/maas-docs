Title: Package Repositories | MAAS
TODO:  Add link for setting up a private package repository
table_of_contents: True


# Package Repositories

Package repositories managed within MAAS can be of two types:

- Ubuntu package repositories
- Personal Package Archives (PPA)

Configuration for repositories is done on the 'Package repositories' sub-tab on
the Settings page. Any repository listed on this page will become automatically
available to any subsequently deployed nodes.

MAAS further simplifies the addition of third-party repositories by also
allowing the administrator to input their respective GPG keys here. This means
that nodes will have instant access to these repositories (i.e. no need to
import the keys into APT).

An added repository can be disabled and re-enabled using a toggle switch to the
right of it.


## Ubuntu package repositories

An Ubuntu package repository is a repository that makes available Ubuntu
packages to computers able to connect to it over the network, whether that
network is private or public (e.g. the Internet).

MAAS comes equipped with the official Ubuntu repository `archive.ubuntu.com` as
well as the equivalent for architectures other than i386 and amd64:
`ports.ubuntu.com` as is evident in the default configuration below:

![default repositories config][img__2.1_default-repo-config]

Adding a third-party repository is elementary. Begin basing the configuration
on a line you would normally place in a system's `/etc/apt/sources.list` file.
For instance, for the Google Chrome repository the line would look like:

`deb http://dl.google.com/linux/chrome/deb stable main`

You will also need the GPG public key that is associated with the private key
that signed this particular repository. Typically, the project's website is
consulted to obtain this information. For this example, the key was downloaded
in this way:

```bash
wget https://dl.google.com/linux/linux_signing_key.pub
```

The key now resides in the saved file `linux_signing_key.pub`, the contents of
which will be used later on.

To add this repository, then, hit the 'Add repository' button and fill in the
fields using the gathered information. Note that the 'Name' is an arbitrary
label to give the repository.

Before saving, the form should look very similar to this:

![3rd-party repository config][img__2.1_3rd-party-repo-config]

Click 'Add repository' again to save the configuration.

To assist with offline operations a private repository can be built based on the
official repository. Such a repository can also contain custom packages.


## Personal Package Archives (PPA)

A Personal Package Archive (PPA) is a [Launchpad][launchpad]-based method for
any individual (or team) to build and distribute packages for Ubuntu.

Adding a PPA is equally straightforward. The [`sosreport` PPA][sosreport-ppa]
will be used as an example. First, acquire the PPA's address from its page on
Launchpad:

`ppa:canonical-support/support-tools`

Like before, a public GPG key will be needed. Also get this from the PPA's
Launchpad page: 'Technical details about this PPA' > '1024R/9360754F' >
'9360754F'.

To add this PPA, then, hit the 'Add repository' button and fill in the
fields. Before saving, the form should look something like this:

![PPA repository config][img__2.1_add-ppa]

Click 'Add repository' again to save the configuration.

See [Launchpad PPAs][launchpad-ppa-help] for more details on PPAs.


<!-- LINKS -->

[launchpad]: https://launchpad.net
[sosreport-ppa]: https://launchpad.net/~canonical-support/+archive/ubuntu/support-tools
[launchpad-ppa-help]: https://help.launchpad.net/Packaging/PPA

[img__2.1_default-repo-config]: ../media/manage-repos__default-config.png
[img__2.1_3rd-party-repo-config]: ../media/manage-repos__add-repo.png
[img__2.1_add-ppa]: ../media/manage-repos__add-ppa.png
