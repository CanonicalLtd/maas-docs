Title: What is MAAS?
table_of_contents: True

# Requirements

The minimum requirements for the machines that run MAAS vary widely depending
on local implementation and usage.

Below, resource estimates are provided based on MAAS components and operating
system (Ubuntu Server). A test (or proof of concept) and a production
environment are considered.


## Test environment

   This is a proof of concept scenario where all MAAS components are installed
   on a single host. *Two* complete sets of images (latest two Ubuntu
   LTS releases) for a *single* architecture (amd64) have been assumed.
   
   |                                                     | Memory (MB) | CPU (GHz) | Disk (GB) |
   | --------------------------------------------------- | ----------- | --------- | --------- |
   | [Region controller][concepts-controllers] (minus PostgreSQL) |  512        | 0.5       |  5        |
   | PostgreSQL                                          |  512        | 0.5       |  5        |
   | [Rack controller][concepts-controllers]                      |  512        | 0.5       |  5        |
   | Ubuntu Server (including logs)                      |  512        | 0.5       |  5        |

   Therefore, the approximate requirements for this scenario are: 2 GB memory,
   2 GHz CPU, and 20 GB of disk space.


## Production environment

   This is a production scenario that is designed to handle a high number of
   sustained client connections. Both high availability (region and rack) and load
   balancing (region) have been implemented.

   Even though extra space has been reserved for images (database and rack
   controller) some images such as those for Microsoft Windows may require a lot
   more (plan accordingly).
 
   |                                                     | Memory (MB) | CPU (GHz) | Disk (GB) |
   | --------------------------------------------------- | ----------- | --------- | --------- |
   | [Region controller][concepts-controllers] (minus PostgreSQL) | 2048        | 2.0       |  5        |
   | PostgreSQL                                          | 2048        | 2.0       | 20        |
   | [Rack controller][concepts-controllers]                      | 2048        | 2.0       | 20        |
   | Ubuntu Server (including logs)                      |  512        | 0.5       | 20        |

   Therefore, the approximate requirements for this scenario are:

   - A region controller (including PostgreSQL) is installed on one host: 4.5 GB
     memory, 4.5 GHz CPU, and 45 GB of disk space.
   - A region controller (including PostgreSQL) is duplicated on a second
     host: 4.5 GB memory, 4.5 GHz CPU, and 45 GB of disk space.
   - A rack controller is installed on a third host: 2.5 GB memory, 2.5 GHz CPU,
     and 40 GB of disk space.
   - A rack controller is duplicated on a fourth host: 2.5 GB memory, 2.5 GHz CPU,
     and 40 GB of disk space.  
 
!!! Note: 
    Figures in the above two tables are for the MAAS infrastructure only.
    That is, they do not cover resources needed on the nodes that will subsequently
    be added to MAAS. That said, node machines should have IPMI-based BMC
    controllers for power cycling, see [BMC power types][power-types].

Examples of factors that influence hardware specifications include:

 - the number of connecting clients (client activity)
 - the manner in which services are distributed
 - whether [high availability][manage-ha] is used
 - whether [load balancing][load-balancing] is used
 - the number of images that are stored (disk space affecting PostgreSQL and
   the rack controller)

Equally not taken into account is a possible [local image mirror][mirror] which
would be a large consumer of disk space.

One rack controller should not be used to service more than 1000 nodes (whether
on the same or multiple subnets). There is no load balancing at the rack level
so further independent rack controllers will be needed with each one servicing
its own subnet(s).

[concepts-controllers]: intro-concepts.md#controllers
[manage-ha]: manage-ha.md
[load-balancing]: manage-ha.md#load-balancing-(optional)
