Title: User Accounts
TODO:  This requires a full treatment (delete user, other user preferences)
       Needs a better explanation of admin vs. non-admin
table_of_contents: True


# User Accounts

User accounts are managed from the 'Settings' page under the 'General' tab. In
the 'Users and Keys' section the list of current users will be shown.

![current users][img__2.2_current-users]

!!! Note: 
    A currently logged in user cannot delete himself from the web UI.


## Add a user

Clicking the 'Add user' button will result in a form to be displayed:

![add user][img__2.2_add-user]

Fill in the fields and hit 'Add user' when done.

An administrator can manage all aspects of MAAS, whereas a non-administrator
user can perform a subset of tasks on machines they acquire and deploy. A
non-admin user is also limited in the details they can view, such as nodes
allocated to other users, and they have no access to the global settings page
in the web UI nor any of the equivalent API calls from the command line.


## User preferences

Clicking the MAAS username in the top right corner will show that user's
preferences.

### SSH keys

Before either a user can deploy a machine they must import at least one public
SSH key into MAAS. This is so the deployed machine can be accessed. Obviously
the user will need to be in possession of the corresponding private key. See
[Public key authentication][ssh.com-what-is-public-key-auth] (ssh.com) if
you're not familiar with SSH keys.

!!! Note:
    An initial SSH key is normally imported during a user's initial login to the
    web UI (see [Configuration journey][config-journey]).

To add a locally generated public key, select 'Upload' from the 'Source' menu
and paste the complete contents of your key file, usually called `id_rsa.pub`,
into the 'Public key' field. Click 'Import' to add the key to MAAS.

Public keys residing on either [Launchpad][help.launchpad.net-accounts] or
[GitHub][help.github.com-ssh] can also be added. Select either from the
'Source' menu and specify the key user ID. Press the 'Import' button to
download the key to the current user's MAAS account.

![add user SSH key][img__2.2_add-user-ssh-key]


### API key

The user preferences page includes an API key for the currently active user.
This can be copied and regenerated as needed. The API key is used to log in to
the API from the [MAAS CLI][manage-cli]. Other services connecting to MAAS such as
[Juju][juju-maas-cloud] will also need this key.


### Change password

The password for the current user can be changed at the bottom of the page by
entering the old password and entering the new password (twice). Click 'Save
password' to finish. 

![change user password][img__2.2_change-user-password]

!!! Note:
    An administrator can change any user's password from within the 'Settings'
    page. 


<!-- LINKS -->

[config-journey]: installconfig-webui-conf-journey.md
[help.launchpad.net-accounts]: https://help.launchpad.net/YourAccount
[help.github.com-ssh]: https://help.github.com/articles/connecting-to-github-with-ssh/
[ssh.com-what-is-public-key-auth]: https://www.ssh.com/ssh/public-key-authentication
[manage-cli]: manage-cli.md
[juju-maas-cloud]: https://jujucharms.com/docs/stable/clouds-maas

[img__2.2_current-users]: ../media/manage-user-accounts__2.2_current-users.png
[img__2.2_add-user]: ../media/manage-user-accounts__2.2_add-user.png
[img__2.2_add-user-ssh-key]: ../media/manage-user-accounts__2.2_add-user-ssh-key.png
[img__2.2_change-user-password]: ../media/manage-user-accounts__2.2_change-user-password.png
