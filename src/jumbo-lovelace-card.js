class JumboOverviewCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      card.header = 'Example Jumbo card';
      this.content = document.createElement('div');
      this.content.style.padding = '0 16px 16px';
      card.appendChild(this.content);
      this.appendChild(card);
    }

    const entityId = this.config.entity_timeslots;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : 'unavailable';
    
    
    const timeslots = hass.states[entityId];
    
    console.log('KIJKEN OF DIT WERKT4');

    
    for (const key of state.attributes.time_slots) {
        //console.log(key.start_date_time)
        this.content.innerHTML = ` ${key.start_date_time} --`; 
    }

    //this.content.innerHTML = `
    //  The state of ${entityId} is ${stateStr}!
    //  <br><br>
    //`;
  }

  setConfig(config) {
    if (!config.entity_timeslots) {
      throw new Error('You need to define an entity_timeslots');
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define('jumbo-overview-card', JumboOverviewCard);