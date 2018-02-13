Title: Audit Event Logs
TODO:  Update when all audit event logs have landed in MAAS master.
table_of_contents: True


# Audit Event Logs

This page provides examples for working with audit event logs in MAAS.
There are many user initiated events in MAAS that an administrator or user
would want to audit, such as someone updating the settings or changing a
user's permissions, for example.  This section details how to query these
events.

Let's take a look at some examples to get a better understanding of how to
query audit event logs and the type of information that it can give us. For the
below issued commands, we will be using `admin` as the MAAS API login profile.

## List Audit Event Logs For All Users

```bash
maas admin events query level=AUDIT
```
Note: Non-administrators will only see their own audit event logs listed.

*example:*
```bash
# maas admin events query level=AUDIT
Success.
Machine-readable output follows:
{
    "count": 1,
    "events": [
        {
            "username": "admin",
            "node": null,
            "hostname": "",
            "id": 2569,
            "level": "AUDIT",
            "created": "Thu, 01 Feb. 2018 22:28:18",
            "type": "Authorisation",
            "description": "User admin logged in."
        }
    ],
    "next_uri": "/MAAS/api/2.0/events/?op=query&level=AUDIT&after=2569",
    "prev_uri": "/MAAS/api/2.0/events/?op=query&level=AUDIT&before=2558"
}
```

This shows us that there is only currently one audit event log for the user
`admin` and was created when they logged into the WebUI.


## List Audit Event Logs For A Specific User

To list the audit event logs for a specific user that you have permissions for,
supply the `owner=$USERNAME` parameter to the query command.

```bash
maas admin events query level=AUDIT owner=$USERNAME
```


As there is only one audit event log in the database (seen in previous example)
let us create some more by performing these actions:

- Create new non-administrator user `johnnybegood` with `admin` user.
- Logout of WebUI as `admin` user and login with `johnnybegood` user.
- Change password of `johnnybegood` user.
- Log back into WebUI (Django forces a re-login when currently logged in user
changes their password).

Let's take a look and see what type of audit event logs we have now, filtering
on with `owner=johnnybegood`.

*example:*
```bash
# maas admin events query level=AUDIT owner=johnnybegood
Success.
Machine-readable output follows:
{
    "count": 3,
    "events": [
        {
            "username": "johnnybegood",
            "node": null,
            "hostname": "",
            "id": 2877,
            "level": "AUDIT",
            "created": "Mon, 12 Feb. 2018 22:34:46",
            "type": "Authorisation",
            "description": "User 'johnnybegood' logged in."
        },
        {
            "username": "johnnybegood",
            "node": null,
            "hostname": "",
            "id": 2876,
            "level": "AUDIT",
            "created": "Mon, 12 Feb. 2018 22:34:35",
            "type": "Authorisation",
            "description": "Password changed for 'johnnybegood'."
        },
        {
            "username": "johnnybegood",
            "node": null,
            "hostname": "",
            "id": 2875,
            "level": "AUDIT",
            "created": "Mon, 12 Feb. 2018 22:33:56",
            "type": "Authorisation",
            "description": "User 'johnnybegood' logged in."
        }
    ],
    "next_uri": "/MAAS/api/2.0/events/?op=query&level=AUDIT&owner=johnnybegood&after=2877",
    "prev_uri": "/MAAS/api/2.0/events/?op=query&level=AUDIT&owner=johnnybegood&before=2875"
}
```


As we can see above, only audit event logs for the user `johnnybegood` are
shown. The audit event logs show us the user of the event, whether the event is
associated with a particular node, the node's hostname, the event id, the level
of the event, when the event was created, the event type for this event, and the
event's description.


## Types of Audit Event Logs

Here is a list of the types of audit event logs that are currently part of MAAS:

- Password changes.
- Permission changes.
- API (OAuth) tokens created/deleted.
- Login and Logouts.
- SSH keys imported from GH or LP.
- SSL key changes.
- User profile changes.
- Commissioning script changes.
- Test script changes.

