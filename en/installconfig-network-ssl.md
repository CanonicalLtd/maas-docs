Title: SSL
TODO:  Critical: review required
       modify Apache redirection wording if this redirection is ever removed


# SSL

MAAS doesn't support SSL natively and needs to be enabled in web server
software independently (e.g. Apache, Nginx) which users access directly.

Once the above is done, change the MAAS URL:

```bash
sudo maas-region local_config_set --maas-url https://localhost:5240/MAAS
sudo systemctl restart maas-regiond
```

Note that currently Apache is employed for redirecting TCP port 80 to 5240.
This may be removed in future versions of MAAS.
