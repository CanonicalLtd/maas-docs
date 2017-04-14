Title: NTP


# NTP

MAAS provides managed NTP services (with `ntpd`) for all region and rack
controllers. This allows MAAS to both keep its own controllers synchronized,
and keep deployed machines synchronized as well. NTP is configured on the
Settings page.

The region controller configures the NTP service to keep its time synchronized
from one or more external sources. By default, the MAAS region controller uses
`ntp.ubuntu.com`.

The rack controllers also configure the NTP service. They synchronize their
time with the region controllers.

Rack controllers also configure DHCP with the correct NTP information. Any
machine on the network that obtains a DHCP lease from MAAS will benefit from
NTP support.

External sites can be used directly as a time source for both rack controllers
and machines. This also allows an existing NTP infrastructure to be used for
the above systems. This is done by choosing the NTP server(s) and selecting the
'External Only' option. The region controller *always* uses an external site.

On the 'Settings' page, select the 'General' tab and scroll down to the
'Network Configuration' section:

![configure NTP][img__2.2_configure-ntp]

Apply any changes by pressing the 'Save' button.


<!-- LINKS -->

[img__2.2_configure-ntp]: ../media/installconfig-network-ntp__2.2_configure-ntp.png
