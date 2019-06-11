Title: Syslog
TODO:
table_of_contents: True


# Syslog

Syslog can be a useful tool for debugging MAAS issues. MAAS uses syslog to
gather logs from the enlistment, commissioning and deployment processes and
proxies them through the rack controllers, which send them to all region
controllers.

## Path

Syslog data is kept in
`/var/log/maas/rsyslog/<machine-name><yyyy-mm-dd>/messages`. Every machine known
to MAAS will have corresponding syslogs.

## Using a remote syslog server

To add a remote syslog server, click the Settings tab and then click the Network
services tab. Scroll down to the Syslog section, where you can add a syslog URL
or IP:

![remote_syslog][img__remote_syslog]

Click the Save button to save your changes.

!!! Note:
    Note that MAAS controllers' syslogs are *not* forwarded to the external
    syslog server -- only machine syslog information is forwarded.

See [MAAS CLI][cli-remote-syslog] to learn how to add a remote syslog server
using the CLI.


<!-- LINKS -->

[cli-remote-syslog]: manage-cli-advanced.md#add-or-update-a-remote-syslog-server

[img__remote_syslog]: ../media/installconfig-syslog__2.6-remote-syslog.png
