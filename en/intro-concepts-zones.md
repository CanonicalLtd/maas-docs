Title: Zone Examples | MAAS


# Zone Examples

This page provides examples of how MAAS zones can be used.

See [Concepts and Terms](intro-concepts.md#zones) for what zones are and
[Using Zones](installconfig-using-zones.md) for how to work with them.


## Fault tolerance

Fault tolerance is "the property that enables a system to continue operating
properly in the event of the failure of (or one or more faults within) some of
its components". To assist with this, multiple MAAS zones can be employed.

For this, a zone can be defined in different ways. It can be based on power
supply for instance, or it can represent a portion of your network or an entire
data centre location. 

Machines that work in tandem in order to provide an instance of a service
should be allocated in the same zone. The entire service should be replicated 
in another zone.


## Service performance

Service performance is the ability of your service to operate in the most
efficient manner possible where the typical criteria used is speed. Multiple
MAAS zones can be used to help. 

Nodes should be allocated in the zone closest to the performance-critical
resources they need.

For example, for applications that are highly sensitive to network latency, it
may make sense to design a network topology consisting of several smaller
networks, and have each of those represented as a zone. The zones can then be
used to allocate nodes that have the best performance depending on the service
offered.


## Power management

Power management is concerned with power usage density and cooling. This topic
can be addressed with the use of several MAAS zones.

Nodes can be distributed in such a way that power-hungry and/or "hot" systems
are located in different zones. This can help mitigate power consumption and
heat problems.
