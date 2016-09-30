Title: Power Driver Capabilities

# Power Driver Capabilities

MAAS has internal support for power controlling different types of hardware.
Not all the power drivers in MAAS have the same capabilities and the table
below details the main differences amongst the power drivers.


| Power Driver (*X=supported*) | PXE Next Boot | Power Querying | Chassis Configuration | Enhanced UI Error Reporting | BMC Enlistment |
|:--------------------------------------|-------------|-----------|---------------|-----------------|------------|
| American Power Conversion (APC) - PDU |             |           |               |                 |            |
| Cisco UCS Manager                     |      X      |     X     |       X       |                 |            |
| Digital Loggers, Inc. - PDU           |             |           |               |                 |            |
| HP Moonshot - iLO Chassis Manager     |      X      |     X     |       X       |                 |            |
| HP Moonshot - iLO4 (IPMI)             |      X      |     X     |               |                 |     X      |
| IBM Hardware Management Console (HMC) |      X      |     X     |               |                 |            |
| IPMI                                  |      X      |     X     |               |       X         |     X      |
| Intel AMT                             |      X      |     X     |               |       X         |            |
| Manual                                |             |           |               |                 |            |
| Microsoft OCS - Chassis Manager       |      X      |     X     |       X       |                 |            |
| OpenStack Nova                        |             |     X     |               |                 |            |
| SeaMicro 15000                        |      X      |     X     |       X       |                 |            |
| Sentry Switch CDU - PDU               |             |           |               |                 |            |
| VMWare                                |      X      |     X     |       X       |                 |            |
| Virsh (virtual systems)               |      X      |     X     |       X       |                 |            |
