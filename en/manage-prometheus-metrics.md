Title: Prometheus metrics
TODO:
table_of_contents: True

# Prometheus metrics

MAAS services can provide [Prometheus][prometheus] endpoints for collecting
performance metrics.

These include:

- TFTP server file transfer latency
- HTTP requests latency
- Websocket requests latency
- RPC calls (beween MAAS services) latency
- Per request DB queries counts

All available metrics are prefixed with `maas_`, to make it easier to look them
up in Prometheus and Grafana UIs.

## Enabling Prometheus endpoints

Prometheus endpoints are exposed over HTTP by the `rackd` and `regiond`
processes under the default `/metrics` path, whenever the
`python3-prometheus-client` library is installed.

For a snap-based MAAS installation, the library is already included in the
snap, so metrics will be available out of the box.

For a Debian-based MAAS installation, install the library and restart MAAS
services as follows:

```
sudo apt install python3-prometheus-client
sudo systemctl restart maas-rackd
sudo systemctl restart maas-regiond
```

MAAS also provides optional stats about resources registered with the MAAS server itself.

These include:

- Number of nodes by type, arch, ...
- Number of networks, spaces, fabrics, vlans and subnets
- Total counts for machines CPU cores, memory and storage
- Counters for KVM pods resources

After installing the `python3-prometheus-client` library as describe above, run
the following to enable stats:

```
maas $PROFILE maas set-config name=prometheus_enabled value=true
```

## Configuring Prometheus


Once the `/metrics` endpoint is available in MAAS services, Prometheus can be
confiured to scrape metric values from these.  This can be done by adding a
stanza like the following to the prometheus configuration:


```yaml
    - job_name: maas
      static_configs:
        - targets:
          - <maas-host1-IP>:5239  # for regiond
          - <maas-host1-IP>:5249  # for rackd
          - <maas-host2-IP>:5239  # regiond-only
          - <maas-host3-IP>:5249  # rackd-only
```

If the MAAS installation includes multiple nodes, the `targets` entries must be
adjusted accordingly, to match services deployed on each node.

If MAAS stats have also been enabled, an additional Prometheus job must added to the config:

```yaml
    - job_name: maas
      metrics_path: /MAAS/metrics
      static_configs:
        - targets:
          - <maas-host1-IP>:5240
          - <maas-host2-IP>:5240
          - <maas-host3-IP>:5240
```


## Deploying Prometheus and Grafana


[Grafana][grafana] and Prometheus can be easily deployed using [Juju][juju].

The [MAAS performance repo][maasperformance] repository provides a sample
`deploy-stack` script that will deploy and configure the stack on LXD
containers.

First, juju must be installed via

```
sudo snap install --classic juju
```

Then, the script from the repo can be run as

```
grafana/deploy-stack <MAAS-IP>
```

To follow the progress of the deployment, run

```
watch -c juju status --color
```

Once everything is deployed, the the Grafana UI will be accessible on port
`3000` with the credentials `admin`/`grafana`.  The Prometheus UI will be
accessible on port `9090`.

The repository also provides some sample dashboard covering the most common use
cases for graphs. These are available under `grafana/dashboards` and can be
imported from the Grafana UI or API.


<!-- LINKS -->

[grafana]: https://grafana.com/
[juju]: https://jujucharms.com/
[prometheus]: https://prometheus.io/
[maasperformance]: https://git.launchpad.net/~maas-committers/maas/+git/maas-performance
