
## Home Assisant LoveLace card for Jumbo.com
This card requires the home Assistant sensor component for Jumbo.com from peternijssen to be installed:
https://github.com/peternijssen/home-assistant-jumbo/

## Installation

Use [HACS](https://hacs.xyz) or follow this [guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)

```yaml
resources:
  url: /local/jumbo-card.js
  type: module
```



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

## Contributors
* [Hans Vos](https://github.com/Voxxie)
