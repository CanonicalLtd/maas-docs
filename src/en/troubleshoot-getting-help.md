Title: MAAS Troubleshooting | Getting Help

# Getting help

## Where to get help

The two channels you can use to get help debugging a MAAS issue are:

- [Ask Ubuntu](http://askubuntu.com/questions/ask?tags=maas) web site
- [Freenode \#maas](http://webchat.freenode.net/?channels=maas) IRC channel


## Gathering debugging information

If your question is related to a problem related to a specific MAAS
installation, we encourage you to gather debugging information and make it
available before you head over to Ask Ubuntu or the IRC channel. This way,
you'll have all the required information handy for people who can help you.

Gathering debugging information is a fully automated process that is performed
with the help of [sosreport](https://github.com/sosreport/sosreport).

If your MAAS server is running Ubuntu 14.04 (Trusty) or later, you can get
sosreport from the official archives:

```bash
# Install sosreport.
sudo apt-get install -y sosreport
# Create the report.
sudo sosreport -o maas
```

Alternatively, if your MAAS server is running an older Ubuntu release, you'll
need to install sosreport manually:

```bash
# Install git.
sudo apt-get install -y git
# Get the latest version of sosreport.
git clone https://github.com/sosreport/sosreport.git /tmp/sosreport
# Create the report.
sudo /tmp/sosreport/sosreport -o maas
```

This will create a tarball containing MAAS log files, MAAS configuration files
and a dump of the MAAS database. By default, the tarball will end up in /tmp
but you can change the location, see sosreport's manpage for details. If there
are things you do not wish to share publicly, feel free to edit the tarball.

The last step is to make this file available by any means at your disposal
(openly accessible FTP server, Dropbox, etc.) in order for the people who will
help you to be able to get their hands on it.
