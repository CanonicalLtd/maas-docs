Title: SSL | MAAS
TODO:  needs better info IMO. My (pmatulis) attempts to get this from maas team failed
       modify Apache redirection wording if this redirection is ever removed


# SSL

MAAS doesn't support SSL natively and needs to be enabled in web server
software independently (e.g. Apache, Nginx) which users access directly.

Note that currently Apache is employed for redirecting TCP port 80 to port
5240 but this may be removed in future versions of MAAS.
