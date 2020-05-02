## Warning
This component requires that the custom Jumbo components to be installed:
More information: https://github.com/peternijssen/home-assistant-jumbo

## Features

* Display of your current basket
* Display of the available time slots for pickup.
* Display of the available time slots for delivery.

## Configuration options
Option          		| Values        | Default   | Details
--              		| -             | -     	| -
time_slots_delivery 	| `sensor` 		| 			| The sensor that contains the Jumbo deliverie timeslots, it not defined its not visible.
time_slots_delivery_days| `int` 		| `99` 		| Define of how many days of timeslots should be displayed.
time_slots_pickup 		| `sensor` 		| 			| The sensor that contains the Jumbo pickup timeslots, it not defined its not visible.
time_slots_pickup_days 	| `int` 		| `99` 		| Define of how many days of timeslots should be displayed.
deliveries 				| `sensor` 		| 			| The sensor that contains the Jumbo deliveries, it not defined its not visible.
basket 					| `sensor` 		| 			| The sensor that contains the Jumbo basket, it not defined its not visible.



## Example config:

```title: Jumbo card
type: 'custom:jumbo-card'
timeslots_delivery: sensor.jumbo_time_slots
timeslots_delivery_days: 2
deliveries: sensor.jumbo_orders
basket: sensor.jumbo_basket
```

## Example image:
![Test Image 1](https://github.com/Voxxie/lovelace-jumbo-card/blob/master/images/Examplecard.png)



See <a href="https://github.com/voxxie/home-assistant-jumbo-card" target="_blank">the repository</a> for configuration options.
