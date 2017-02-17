Title: 2.2 Release Notes | MAAS
table_of_contents: False


See [Historical release notes][historical-release-notes] for release notes for
all versions.


# 2.2.0 (beta2) Release Notes

## Important announcements

### Composable hardware

MAAS now supports composable hardware - The Intel Rack Scale Design
The MAAS team is excited to announce the support for the Intel Rack Scale
Design (RSD). Intel Rack Scale Design (RSD) is a hardware architecture that
allows the dynamic composition of physical systems from a pool of available
hardware resources. 

MAAS, as a cloud-like, scale-out bare-metal provisioning system, will leverage
the use of Intel RSD to compose (create) and provision systems. With the
support for RSD, MAAS introduces the ability to manually or dynamically compose
(create) new machines from an available pool of resources. It will allow
administrators to request machines with specific resources on demand and be
able to deploy their workloads on them.


## Major new features

### MAAS support for Intel RSD - API only

MAAS 2.2b2 introduces initial support for Intel RSD. It provides the ability
to :

- Add a new Intel RSD POD into MAAS, allowing users to have a full view of the
  available and used resources. 
- Add the ability to discover pre-composed resources, allowing MAAS to discover
  machines that have been created before adding the Intel RSD POD into MAAS.
- Add the ability to create (compose) new machines.

### Notifications

MAAS 2.2b2 introduces a new notification system. The notification system
surfaces various messages to the user via the web UI, allowing to have more
visibility as to what’s going on with the system. Initially, users will be
notified when :

- When Rack Controllers get disconnected
- When image import fails on your region controller.
- When Rack Controllers have images that the Region Controller does not.

### Web UI Visual updates

MAAS 2.2b2 now has an updated web UI that includes:

- Updated all icons and colour set within the framework. This will keep inline
  with the Vanilla Framework and the new visual update which is going across
  all products
- Links have changed from black to blue. This keeps MAAS inline with Juju and
  other Cloud products also improves the visual UX.
- Improved the responsive nature of MAAS. Tables especially have been improved.
- The new card view and label using aria-label improves the readability and
  uses on mobile / small screens.
- Navigation responsive issues have been resolved.
- Flash messages has been removed and now replaced with the improved
  notification pattern.
- New utility classes u-display--mobile & u-display--desktop have been added
  for extra responsive development / design flexibility.
- Accordion styles have been improved. Removing the cross style and keeping it
  consistent with our remove style.


<!-- ===================================================================== -->


# 2.2.0 (beta1) Release Notes

## Important announcements

### Migrating MAAS L3 to L2 spaces

MAAS 2.2 has changed the definition of spaces from a Layer 3 concept to a Layer
2 concept.

The spaces definition in MAAS (first introduced in MAAS 1.9) is "a set of
subnets that can mutually communicate". The assumption is that these spaces can
route to each other, and have appropriate firewall rules for their purposes.
(For example, a dmz space might contain subnets with internet access, and a
storage space might contain subnets that can access the same storage networks.)
Juju uses the current definition in order to ensure that deployed applications
have access to networks appropriate for the services they provide.

The current definition of spaces as a L3 concept is problematic, in that
sometimes Juju wants to deploy applications that themselves create a Layer 3
subnet. Therefore, it was decided that the concept of spaces will be pushed
down a layer (to apply to VLANs in MAAS).

With spaces as a Layer 2 concept, it is is now "a set of VLANs whose subnets
can mutually communicate".

As such, starting from MAAS 2.2b1 :

- VLANs will gain a 'space' reference, and subnets will have their spaces
  migrated to the VLANs they are on. On upgrades, if two subnets on the same
  VLAN are in different spaces, the most recently created space will be used for
  both.

- Spaces will become optional. Fresh installs will not have a default space
  (e.g. space-0). On upgrades, if only the default space (space-0) exists, it
  will be removed.

The following API changes will occur in MAAS 2.2 :

- Editing a subnet's space will no longer be possible (breaks backwards
  compatibility). Spaces must now be edited each VLAN.

- For backward compatibility, the subnets endpoint will present the underlying
  VLAN’s space.

Recommended actions for MAAS administrators prior to upgrading to MAAS 2.2 :

- Ensure that no two subnets in the same VLAN are in different spaces, so that
  the upgrade path migrates the expected space to the VLAN.

- Ensure that each VLAN with an assigned space will contain subnets which can
  mutually communicate with other subnets whose VLAN is in the same space. This
  will allow backward compatibility with Juju charms which use the Layer 3
  definition of spaces.[2]

NOTE: Please note that not breakage is expected, provided that most people are
not using spaces. For those who we know are, they are using them in a
compatible way. If you experience some type of issue, please contact us.


## Major new features

### DHCP Relay support

The ability to model the usage of DHCP relays in your networking configuration
has been added to MAAS. The allows an administrator to identify which VLANs
will be relayed through another VLAN running a MAAS DHCP server. This will
configure the MAAS DHCP server running on the primary and/or secondary rack
controller to include the shared network statement for that VLAN. Note: MAAS
does not run a DHCP relay service, it is up to the administrator to configure
the DHCP relay service on the VLAN and point it at the primary and/or secondary
rack controller running the MAAS DHCP.

### Unmanaged subnets

In MAAS 2.0, the concept of a “static range” (a specific range of addresses in
which MAAS was allowed to freely allocate addresses from) was removed from
MAAS, in favor of the idea that MAAS managing entire subnets. As such, the only
way to tell MAAS to not allocate certain sections of a subnet is to add a
reserved IP range.

Starting from MAAS 2.2b1, however, MAAS enhances this functionality by
introducing a new concept, called unamanged subnets. Setting a Subnet in MAAS
as unmanaged, allows administrators to prevent MAAS from using that subnet for
automatic IP assignment. In other words, it is a way to tell MAAS that it knows
about a subnet but that it shouldn’t use it. 

### MAAS is now responsive

For all of those users that use (or would like to use) MAAS web UI from their
Phone or Tablet, will now have a better user experience, provided that starting
from 2.2b1, MAAS is now responsive. 

Phone or Table users will see a new slick design for those devices. Thanks for
the Ubuntu Web team for putting the effort into making MAAS look great in
smaller devices.


## Known issues and workarounds

Cannot add a device from the dashboard
https://bugs.launchpad.net/maas/+bug/1659959

Cannot add a device with parent from the dashboard


<!-- LINKS -->

[historical-release-notes]: release-notes-all.md
