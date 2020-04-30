

class JumboOverviewCard extends HTMLElement {
  set hass(hass) {
      
 
      
    if (!this.content) {
      const card = document.createElement('ha-card');
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
      }</style><br><br>`;

    //Define show parameters, and set them to a value if nog defined.
    const show_timeslots = this.config.show_timeslots ? this.config.show_timeslots : 'true';
    const show_basket = this.config.show_basket ? this.config.show_basket : 'true';
    const show_orders = this.config.show_timeslots ? this.config.show_orders : 'true';
    const timeslot_days = this.config.timeslot_days ? this.config.timeslot_days : '99';

    //START show basket
    if (show_basket === true) {
        
        const basket = hass.states['sensor.jumbo_basket'];
        
        console.log(basket);
          output += `<h2>Huidig winkelmandje</h2>
                            <table width="100%">
                                <tr>
                                    <td width="50%"><center><h3>` + basket.state+ `</h3>items</center></td>
                                    <td width="50%"><center><h3>` + (basket.attributes.price.amount / 100) + `</h3>euro</center></td>
                                </tr>
                            </table>`;
        
    }
    //END show basket



    //START Loop orders
    if (show_orders === true) {
        
    }
    //END Loop orders



    //START Loop timeslots
    if (show_timeslots === true) {
        
      output += `<h2>Beschikbare bezorgmomenten</h2>`;
        
      const state = hass.states['sensor.jumbo_time_slots'];    
      var cudate = `0000`;
      var showtimeslot = 'yes';
      var numdays = 0;
     
    
      for (const key of state.attributes.time_slots) {
          
          var start = new Date(key.start_date_time);
          var startdate = (start.getDate() + '-' + (start.getMonth() +1) + '-' +  start.getFullYear());
        
          if (cudate != startdate ){
            
            if (numdays < timeslot_days){
            
              if (cudate != `0000`){
                output += `</div>`;
              }
            
              cudate = startdate;
              output += `<h3> ` + startdate + `</h3><div class="jumbo-grid-container" id="` + startdate + `">`;
              
              numdays++;
              
            } else {
                
                showtimeslot = 'no';
                
            }
            
          }
        
          if (showtimeslot === 'yes'){
             output += `<div class="jumbo-grid-item"><b>`+ (start.getHours()<10?'0':'') + start.getHours() + `:` +  (start.getMinutes()<10?'0':'') + start.getMinutes() + `</b><br>&euro; `+ (key.price.amount /100) +`</div> `;
          }
       
       
      }
    
      output += `</div>`;
    }
    //END Loop timeslots









    //Output pushen to card
    this.content.innerHTML = output; 





    //this.content.innerHTML = `
    //  The state of ${entityId} is ${stateStr}!
    //  <br><br>
    //`;
  }
  
  

  
  

  setConfig(config) {
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
  
  
  
  
}

customElements.define('jumbo-card', JumboOverviewCard);



