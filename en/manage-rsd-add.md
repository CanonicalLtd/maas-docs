Title: Add RSD pod
TODO:  
table_of_contents: True

# Add an RSD pod

Add an RSD Pod by using the 'Add pod' button. Choose 'Rack Scale Design' from
the Pod type drop-down menu.

![add RSD pod][img__pod-add-rsd]

You will need to get values for 'Pod address' (IP address or URL followed by a
port), 'Pod user', and 'Pod password' from your RSD administrator.

!!! Note:
    MAAS will automatically discover and store the resources your RSD Pod
    contains.

## CLI

```bash
maas $PROFILE pods create type=rsd power_address=10.3.0.1:8443 \
    power_user=admin power_pass=admin
```

<!-- LINKS -->

[img__pod-add-rsd]: ../media/nodes-comp-hw__2.4_pod-add-rsd.png
