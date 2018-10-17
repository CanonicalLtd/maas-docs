Title: MAAS security
TODO:  
table_of_contents: True

# MAAS security

Computer security is a wide-ranging and important discipline impossible to cover
completely here. There are, however, some relatively simple steps you can take
to harden the security of your MAAS installation on your rack and region
controllers.

!!! Warning:
    There are too many use cases and operating systems to make any meaningful
    security suggestions in this context for your deployed machines.

## `maas` and `root` users

This should go without saying, but you should pick good passwords and store them
securely (e.g. in a KeePassX password database). User administration should be
performed via the web UI and the `maas` and `root` user passwords should only be
shared with administrators.

## SSL

## Conf file permissions

## Firewalls

## Shared secrets

When you add a new rack or region controller, for example, by installing the MAAS
snap and running `maas init --mode rack`, MAAS asks for a shared secret it will
use to communicate with the rest of MAAS. (This secret is also exposed in the web
UI when you click the 'Add rack controller' button on the Controllers page.)

This secret is stored in a plain text file. MAAS automatically generates this
secret when you install initially, i.e. when your first region controller is
initially run.

You should also verify that any 'secret' files on all region and rack
controllers are `600` or readable and writeable only by the 'maas' user.

```bash
sudo chmod 600 /var/lib/maas/secret
```

And after:

```no-highlight
root@bionic-maas-run:/var/lib/maas# ls -l /var/lib/maas/secret
-rw-r----- 1 maas maas 32 Sep 27 14:15 /var/lib/maas/secret
root@bionic-maas-run:/var/lib/maas#
```
