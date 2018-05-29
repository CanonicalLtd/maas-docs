Title: What's new in 2.4
table_of_contents: True

# What's new in 2.4

Welcome to MAAS 2.4, a major update to [Canonical's][canonical] *Metal as a
Service* - the smartest way to manage bare metal.

This release improves performance, runs scripts for both hardware
tests and firmware updates, composes virtual hardware and enables audit
logging. See below for more details on each of these.

If you're new to MAAS, take a look at [Explore MAAS][explore-maas] to
get an overview of its installation and capabilities, and if you need a more
comprehensive review of the changes in this release, take a look at the
[release notes][release-notes].

## Performance improvements

Refining performance has been the emphasis for this release, with many 
internal and external optimisations. As a result, MAAS 2.4 is now both
noticeably more efficient and more responsive than earlier versions, especially
in larger environments.

Performance improvements include:

- migration from *Twisted* to *AsyncIO* for event loop handling
- database query optimisations include the reduction of boot source image cache queries
  from 100 to under 5, timestamp queries from 2 to 1 and the ability to track
  changes across specific fields when saving machines
- rack controllers now commence image downloads immediately after the region
  controller has finished downloading images
- *regiond* workers are now scaled automatically. This allows MAAS to handle an
  increased number of internal operations in larger environments

## Pods for composable hardware

KVM (virtual machine) pods are now a fully fledged part of the MAAS ecosystem,
with support for AZs, tagging, over-commit ratios and storage pools, letting
users compose virtual resources just as easily as physical resources.

![pod compose machine commissioning][img__pod-compose-machine-commissioning]

See the [Pods][pods-doc] documentation for more details.

## Firmware updates and hardware testing scripts 

Addressing some of the challenges administrators face when performing tasks at
scale, the scripting and testing framework has been expanded to support custom
scripts as well as firmware upgrades. These are in addition to the many scripts
already bundled with MAAS.

![select custom script][nodes-hw-scripts__select]

See [Commissioning and Hardware Testing Scripts][test-scripts] for more
information on creating and running your own scripts.

MAAS 2.4 also introduces [audit logging][audit-logging], enabling
administrators to monitor when a user changes permissions or settings.

## Web UI overhaul

Finally, the web-based user interface has had a comprehensive overhaul,
featuring a reorganised main menu and settings page alongside many new options
and refinements. The CSS framework has also been completely replaced, with the
new version offering a cleaner and more concise user experience.

![new web UI][whatsnew]


<!-- LINKS -->
[explore-maas]: intro-explore.md
[canonical]: https://www.canonical.com/
[release-notes]: release-notes.md
[pods-doc]: https://docs.maas.io/2.4/en/nodes-comp-hw
[test-scripts]: https://docs.maas.io/2.4/en/nodes-scripts
[audit-logging]: https://docs.maas.io/2.4/en/manage-audit-events

[img__pod-compose-machine-commissioning]: ../media/nodes-comp-hw__2.4_pod-compose-machine-commissioning.png
[nodes-hw-scripts__select]: ../media/nodes-hw-scripts__2.4_select.png
[whatsnew]: ../media/whats-new__2.4_webui.png
