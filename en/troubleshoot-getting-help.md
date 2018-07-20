

# Getting Help

The two channels you can use to get help debugging a MAAS issue are:

- [Ask Ubuntu][askubuntu-maas] web site
- [Freenode \#maas][freenode-maas] IRC channel


## Gathering debugging information

If your question is related to a problem related to a specific MAAS
installation, we encourage you to gather debugging information and make it
available while asking for help. This will make it much easier for people to
assist.

A big step on the way to doing this is by using [sosreport][github-sosreport],
an automated information-gathering utility. It is available in the Ubuntu
archives:

```bash
sudo apt install -y sosreport
sudo sosreport -o maas
```

This will create a tarball containing MAAS log files, MAAS configuration files
and a dump of the MAAS database. By default, the tarball will end up in /tmp
but you can change the location. See the
[sosreport man page][sosrepot-man-page] for details. If there are things you do
not wish to share publicly, feel free to edit the tarball.

The last step is to make this file available by any means at your disposal
(openly accessible FTP server, Dropbox, etc.) in order for helpers to be able
to get their hands on it.


<!-- LINKS -->

[askubuntu-maas]: http://askubuntu.com/questions/ask?tags=maas
[freenode-maas]: http://webchat.freenode.net/?channels=maas
[github-sosreport]: https://github.com/sosreport/sosreport
[sosrepot-man-page]: http://manpages.ubuntu.com/cgi-bin/search.py?q=sosreport
