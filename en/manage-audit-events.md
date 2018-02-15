Title: Audit Event Logs
TODO:  Update when all audit event logs have landed in MAAS master.
table_of_contents: True


# Audit Event Logs

There are many user initiated events in MAAS that an administrator or a user
may want to audit. These include someone updating the settings or changing a
user's permissions. This page details how to query these events and includes
examples of how to perform a query and the type of data logs can provide.

## List audit events for all users

To list events for all users, use the following syntax:

```bash
maas $PROFILE events query level=AUDIT
```

Note:
    Non-administrators will only see their own audit event logs listed.

The following is example output from the previous command, using *admin* as the
MAAS profile:

```no-highlight
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

The above output shows that there is currently only one audit event log for the user
`admin` and this was created when they logged into the web UI.


## List audit events for a specific user

To list the audit event logs for a specific user that you have permissions for,
supply the `owner=$USERNAME` parameter to the query command:

```bash
maas $PROFILE events query level=AUDIT owner=$USERNAME
```

As there is only one audit event log in the database (as seen above), generate
some more by performing these actions:

- create new non-administrator user `johnnybegood` with `admin` user
- logout of web UI as `admin` user and login with `johnnybegood` user
- change password of the `johnnybegood` user
- log back into the web UI (Django forces a re-login when currently logged in
  user changes their password).

Let's take a look and see what type of audit event logs we have now, filtering
with `owner=johnnybegood` as shown in the following command:

```bash
maas admin events query level=AUDIT owner=johnnybegood
```

```bash
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
generated. These events show the following:

- user for the event
- whether the event is associated with a particular node
- node's hostname
- event id
- level of the event
- when the event was created
- event type
- event description

## Types of audit event logs

Here is a list of the types of audit event logs that are currently supported by MAAS:

- Password changes
- Permission changes
- API (OAuth) tokens created/deleted
- Login and logouts
- SSH keys imported from GitHub or Launchpad
- SSL key changes
- User profile changes
- Commissioning script changes
- Test script changes

