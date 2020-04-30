## Warning
This component requires that the custom Jumbo components to be installed:
More information: https://github.com/peternijssen/home-assistant-jumbo

## Features

* Display of your current basket
* display of the avaiable time slots.

## Configuration options
Option          | Values        | Default   | Details
--              | -             | -         | -
show_basket | `true/false` | `true` | Define if the card should display the available timeslots.
show_timeslots | `true/false` | `true` | Define if the card should display the available timeslots.
timeslot_days | `int` | `99` | Define of how many days of timeslots should be displayed.


## Example config:

```title: Jumbo card
type: 'custom:jumbo-card'
show_timeslots: true
timeslot_days: 2
show_basket: true
show_orders: true
```

## Example image:
![Test Image 1](https://github.com/Voxxie/lovelace-jumbo-card/blob/master/images/Examplecard.png)



See <a href="https://github.com/voxxie/home-assistant-jumbo-card" target="_blank">the repository</a> for configuration options.
