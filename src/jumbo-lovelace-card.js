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


    var output = `<style>  .jumbo-grid-container {
        display: grid;
        grid-template-columns: auto auto auto;
        
        padding: 5px;
      }
      .jumbo-grid-item {
        box-shadow: var( --ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2) );
        padding: 5px;
        margin: 5px;
        font-size: 14px;
        text-align: center;
      }</style>`;

    const entityId = this.config.entity_timeslots;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : 'unavailable';

    
    const timeslots = hass.states[entityId];
    
    
    output += `<h2>Beschikbare bezorgmomenten</h2>`;


    //START Loop timeslots
    var cudate = `0000`;
    
    for (const key of state.attributes.time_slots) {
        
        
        
        var start = new Date(key.start_date_time);
        var startdate = (start.getDate() + '-' + (start.getMonth() +1) + '-' +  start.getFullYear());
        
        if (cudate != startdate ){
            
            if (cudate != `0000`){
                output += `</div>`;
            }
            
            cudate = startdate;
            output += `<h3> ` + startdate + `</h3><div class="jumbo-grid-container">`;
            
        }
        
        output += `<div class="jumbo-grid-item"><b>`+ (start.getHours()<10?'0':'') + start.getHours() + `:` +  (start.getMinutes()<10?'0':'') + start.getMinutes() + `</b><br>`+ key.price.format +`</div> `;
        
       
       
    }
    
    output += `</div>`;
    
    //END Loop timeslots



    //Output pushen to card
    this.content.innerHTML = output; 

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
