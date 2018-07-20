

# Select and Import Images

This page explains how to select and import the images that MAAS requires in
order to provision its nodes.

Note that the MAAS CLI can also be used for image management: see
[Select images][cli-select-images] and 
[Import newly-selected images][cli-import-newly-selected-images].

The 'Images' page shows what images and architectures have been selected and
downloaded. By default, MAAS will automatically grab the most recent Ubuntu LTS
releases (and amd64 architecture). Below, two additional releases have been
selected:

![select and import images][img__select-and-import-images]

In the top-right corner there is a toggle switch for the hourly syncing of
images for the region based on the image stream MAAS is configured to use (see
[Boot image sources][images-boot-image-sources]). It is highly recommended to
keep this enabled. Syncing at the rack controller level (from regiond) occurs
every 5 min and cannot be disabled.

Click the 'Save selection' button to initiate the import. Existing images will
be shown in addition to the newly selected ones. The latter will have their
status updated as the import is processed:

![ubuntu images importing][img__ubuntu-images-importing]

To remove an image, simply unselect it and click 'Save selection'.

## Image mirrors

Ubuntu images can also be hosted on a mirror, which is configured by selecting
'Custom' beneath 'Choose source'. Enter the mirror URL and click 'Connect'. 

Advanced options, such as using a GPG key or keyring to validate the mirror
path, are revealed by clicking 'Show advanced options':

![image mirror configuration][img__mirror]

Optionally, a local mirror can be set up as the boot source. MAAS will then use
it instead of the standard internet-based server. This will reduce the time
required to complete the image import step significantly. See 
[Local image mirror][mirror] for instructions on doing this.


## Other images

It is also possible to import and provision images other than Ubuntu. Images
supported and provided by MAAS will appear beneath the 'Other Images' section.
Currently, images for both CentOS 6.6 and CentOS 7.0 are available and these
can be imported and used just like the Ubuntu images above.

![other images importing][img__other-images-importing]


<!-- LINKS -->

[cli-select-images]: manage-cli-images.md#select-images
[cli-import-newly-selected-images]: manage-cli-images.md#import-newly-selected-images
[images-boot-image-sources]: installconfig-images.md#boot-image-sources
[mirror]: installconfig-images-mirror.md

[img__select-and-import-images]: ../media/installconfig-images-import__2.4_select-and-import-images.png
[img__ubuntu-images-importing]: ../media/installconfig-images-import__2.4_ubuntu-images-importing.png
[img__other-images-importing]: ../media/installconfig-images-import__2.4_other-images-importing.png
[img__mirror]: ../media/installconfig-images-import__2.4_mirror.png
