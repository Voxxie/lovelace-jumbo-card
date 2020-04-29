import {
  LitElement, html, css, unsafeCSS
} from 'lit-element';
import moment from 'moment/src/moment';
import Swiper from 'swiper';
import swiperStyle from "swiper/dist/css/swiper.min.css";

import 'moment/src/locale/nl';

const DEFAULT_HIDE = {
  delivered: false,
  first_order: false,
  header: false,
};

const LANG = {
  en: {
    unknown: 'Unknown',
  },
  nl: {
    unknown: 'Onbekend',
  }
};

function renderNotFoundStyles() {
  return html`
    <style is="custom-style">
      ha-card {
        font-weight: var(--paper-font-body1_-_font-weight);
        line-height: var(--paper-font-body1_-_line-height);
      }
      .not-found {
        flex: 1;
        background-color: red;
        padding: calc(16px);
      }
    </style>
  `;
}

function renderStyles() {
  return [
    html`
      <style is="custom-style">
            ${unsafeCSS(swiperStyle)}
      </style>
        `,
    html`
      <style is="custom-style">
          ha-card {
            -webkit-font-smoothing: var(
              --paper-font-body1_-_-webkit-font-smoothing
            );
            font-size: var(--paper-font-body1_-_font-size);
            font-weight: var(--paper-font-body1_-_font-weight);
            line-height: var(--paper-font-body1_-_line-height);
            padding-bottom: 16px;
          }
          ha-card.no-header {
            padding: 16px 0;
          }
          .info-body,
          .detail-body {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
          }
          .info {
            text-align: center;
          }

          .info__icon {
            color: var(--paper-item-icon-color, #44739e);
          }
          .detail-body table {
            padding: 0px 16px;
            width: 100%;
          }
          .detail-body td {
            padding: 2px;
          }
          .detail-body thead th {
            text-align: left;
          }
          .detail-body tbody tr:nth-child(odd) {
            background-color: var(--paper-card-background-color);
          }
          .detail-body tbody tr:nth-child(even) {
            background-color: var(--secondary-background-color);
          }
          .detail-body tbody td.name a {
            color: var(--primary-text-color);
            text-decoration-line: none;
            font-weight: normal;
          }
          .img-body {
            margin-bottom: 10px;
            text-align: center;
          }
          .img-body img {
            padding: 5px;
            background: repeating-linear-gradient(
              45deg,
              #B45859,
              #B45859 10px,
              #FFFFFF 10px,
              #FFFFFF 20px,
              #122F94 20px,
              #122F94 30px,
              #FFFFFF 30px,
              #FFFFFF 40px
            );
          }

          header {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-family: var(--paper-font-headline_-_font-family);
            -webkit-font-smoothing: var(
              --paper-font-headline_-_-webkit-font-smoothing
            );
            font-size: var(--paper-font-headline_-_font-size);
            font-weight: var(--paper-font-headline_-_font-weight);
            order-spacing: var(--paper-font-headline_-_order-spacing);
            line-height: var(--paper-font-headline_-_line-height);
            text-rendering: var(
              --paper-font-common-expensive-kerning_-_text-rendering
            );
            opacity: var(--dark-primary-opacity);
            padding: 24px
              16px
              16px;
          }
          .header__icon {
            margin-right: 8px;
            color: var(--paper-item-icon-color, #44739e);
          }
          .header__title {
            font-size: var(--thermostat-font-size-title);
            line-height: var(--thermostat-font-size-title);
            font-weight: normal;
            margin: 0;
            align-self: left;
          }

          footer {
            padding: 16px;
            color: red;
          }
      </style>`
  ];
}

class Jumbo extends LitElement {
  static get properties() {
    return {
      _hass: Object,
      swiper: Object,
      config: Object,
      deliveryObject: Object,
      distributionObject: Object,
      orderObject: Object,
      icon: String,
      name: String,
      date_format: String,
      time_format: String,
      past_days: String,
      _language: String,
      _hide: Object,
    };
  }

  constructor() {
    super();

    this._hass = null;
    this.deliveryObject = null;
    this.distributionObject = null;
    this.orderObject = null;
    this.delivery_enroute = [];
    this.delivery_delivered = [];
    this.distribution_enroute = [];
    this.distribution_delivered = [];
    this.orders = [];
    this.icon = null;
    this.name = null;
    this.date_format = null;
    this.time_format = null;
    this.past_days = null;
    this._language = null;
    this._hide = DEFAULT_HIDE;
    this._lang = LANG;
  }

  set hass(hass) {
    this._hass = hass;

    if (this.config.delivery) {
      this.deliveryObject = hass.states[this.config.delivery];
    }

    if (this.config.distribution) {
      this.distributionObject = hass.states[this.config.distribution];
    }

    if (this.config.orders) {
      this.orderObject = hass.states[this.config.orders];
    }

    if (this.config.hide) {
      this._hide = { ...this._hide, ...this.config.hide };
    }

    if (typeof this.config.name === 'string') {
      this.name = this.config.name;
    } else {
      this.name = "Jumbo";
    }

    if (this.config.icon) {
      this.icon = this.config.icon;
    } else {
      this.icon = "mdi:mailbox";
    }

    if (this.config.date_format) {
      this.date_format = this.config.date_format;
    } else {
      this.date_format = "DD MMM YYYY";
    }

    if (this.config.time_format) {
      this.time_format = this.config.time_format;
    } else {
      this.time_format = "HH:mm";
    }

    if (typeof this.config.past_days !== 'undefined') {
      this.past_days = parseInt(this.config.past_days, 10);
    } else {
      this.past_days = 1;
    }

    this._language = hass.language;
    // Lazy fallback
    if (this._language !== 'nl') {
      this._language = 'en';
    }


    this.orders = [];

    // Format orders
    if (this.orderObject) {
      Object.entries(this.orderObject.attributes.orders).sort((a, b) => new Date(b[1].delivery_date) - new Date(a[1].delivery_date)).map(([key, order]) => {
        if (moment(order.delivery_date).isBefore(moment().subtract(this.past_days, 'days').startOf('day'))) {
          return;
        }

        this.orders.push(order);
      });
    }

  }

  render({
    _hass, _hide, _values, config, delivery, distribution, orders
  } = this) {
    if (!delivery && !distribution && !orders) {
      return html`
        ${renderNotFoundStyles()}
        <ha-card class="not-found">
          ${this.translate('unavailable_entities')}
        </ha-card>
      `;
    }

    return html`
      ${renderStyles()}
      <ha-card class="Jumbo-card">
        ${this.renderHeader()}
        <section class="info-body">
          ${this.renderOrdersInfo()}
        </section>

      ${this.renderOrders()}
      ${this.renderOrderWarning()}

      </ha-card>
    `;
  }

  renderHeader() {
    if (this._hide.header) return '';

    return html`
      <header>
        <ha-icon class="header__icon" .icon=${this.icon}></ha-icon>
        <h2 class="header__title">${this.name}</h2>
      </header>
    `;
  }

  renderOrderWarning() {
    if (!this.orderObject) return '';

    // Remove undefined check after the first of june
    if (typeof this.orderObject.attributes.enabled === 'undefined' || this.orderObject.attributes.enabled) return '';

    return html`
      <footer>
        ${this.translate('unavailable_orders')}
      </footer>
    `;
  }

  renderOrdersInfo() {
    if (!this.orderObject) return '';

    return html`
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:email"></ha-icon><br />
        <span>${this.orders.length} ${(this.orders.length > 1) ? this.translate('orders') : this.translate('order')}</span>
      </div>
    `;
  }

  renderOrders() {
    if (!this.orderObject || (this.orders && this.orders.length === 0)) return '';

    return html`
      <header>
        <ha-icon class="header__icon" icon="mdi:email"></ha-icon>
        <h2 class="header__title">${this.translate('orders')}</h2>
      </header>
      ${this.renderOrderImage()}
      <section class="detail-body">
        <table>
          <thead>
            <tr>
              <th>${this.translate('title')}</th>
              <th>${this.translate('status')}</th>
              <th>${this.translate('delivery_date')}</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(this.orders).map(([key, order]) => this.renderOrder(order))}
          </tbody>
        </table>
      </section>
    `;
  }

  
  renderOrder(order) {
    if (order.image == null) {
      return html`
        <tr>
          <td class="name">${order.id}</td>
          <td>${(order.status_message != null) ? order.status_message : this.translate('unknown')}</td>
          <td>${this.dateConversion(order.delivery_date)}</td>
        </tr>
      `;
    } else {
      return html`
        <tr>
          <td class="name"><a href="${order.image}" target="_blank">${order.id}</a></td>
          <td>${(order.status_message != null) ? order.status_message : this.translate('unknown')}</td>
          <td>${this.dateConversion(order.delivery_date)}</td>
        </tr>
      `;
    }
  }

  dateConversion(date) {
    const momentDate = moment(date);
    momentDate.locale(this._language);

    return momentDate.calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      sameElse: this.date_format
    });
  }

  timeConversion(date) {
    const momentDate = moment(date);
    momentDate.locale(this._language);

    return momentDate.format(this.time_format);
  }

  translate(key) {
    return this._lang[this._language][key];
  }

  setConfig(config) {
    if (!config.delivery && !config.distribution && !config.orders) {
      throw new Error('Please define entities');
    }

    this.config = {
      ...config,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.swiper) {
      this.swiper.update();
    } else {
      this._initialLoad();
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (this._config && this._hass && this.isConnected) {
      this._initialLoad();
    } else if (this.swiper) {
      this.swiper.update();
    }
  }

  async _initialLoad() {
    await this.updateComplete;

    this.swiper = new Swiper(this.shadowRoot.querySelector(".swiper-container"));
  }

  getCardSize() {
    return 3;
  }
}

window.customElements.define('Jumbo-card', Jumbo);

export default Jumbo;
