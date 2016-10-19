Title: IP Ranges | MAAS
TODO:  Rename image to correspond to this page's name


# Reserved IP Ranges

The two types of *reserved IP ranges* are explained in the
[Concepts and terms](intro-concepts.md#ip-ranges) page. The current page shows how
to manage them. Specifically, it will show how to:

- Create a range
- Edit a range
- Delete a range

All three actions require administrative privileges and begin by accessing the
'Networks' page, selecting the desired subnet, and scrolling down to the
'Reserved' section.


## Create a range

Choose 'Reserve range' or 'Reserve dynamic range'. If the latter is chosen,
MAAS will automatically provide DHCP for enlistment and commissioning provided
that the associated VLAN has [DHCP enabled](installconfig-subnets-dhcp.md).

When either of those two options are chosen a window will appear allowing you
to enter start and end addresses for the range as well as a comment.

Below is an example window when creating a 'Reserved range' (both windows are
actually identical):

![reserved IP range](../media/installconfig-network-static_image-reserved-range.png)

Click the 'Reserve' button when done.

See [MAAS CLI](manage-cli-common.md#create-a-reserved-ip-range) for doing this
with the CLI.


## Edit a range

Click the 'down' arrow at the far right of the row corresponding to the subnet
in question. Edit the fields as desired and click the 'Save' button.


## Delete a range

Click the 'trash bin' icon at the far right of the row corresponding to the
subnet in question. Confirm this action by clicking on the 'Remove' button.
