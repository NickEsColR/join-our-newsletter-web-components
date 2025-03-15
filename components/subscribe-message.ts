/**
 * @element subscribe-message
 * @description A customizable newsletter container web component.
 * 
 * This web component renders a newsletter container with logo, title, 
 * and customizable message slots. It uses Shadow DOM for style encapsulation.
 * 
 * @attr {string} logo-src - Source URL for the logo image (default: "resources/logo.svg")
 * @attr {string} logo-alt - Alt text for the logo image (default: "Logo")
 * @attr {string} title - Title text (default: "Join our newsletter")
 * 
 * @slot message - Slot for displaying promotional messages
 * @slot - Default slot for additional content (e.g., a subscription form)
 * 
 * @cssproperty --text-color - Text color for the messages (default: rgb(107, 114, 128))
 * @cssproperty --title-color - Color for the title (default: black)
 * @cssproperty --line-height - Line height for the text (default: 1.5rem)
 * @cssproperty --max-width - Maximum width of the container (default: 32rem)
 * @cssproperty --font-family - Font family for the text (default: Arial, sans-serif)
 * @cssproperty --logo-width - Width of the logo (default: 4rem)
 * @cssproperty --logo-height - Height of the logo (default: 4rem)
 * 
 * @example
 * ```html
 * <subscribe-message>
 *   <div slot="message">
 *     <p>Keep up with our latest collections, exclusive deals, and special offers!</p>
 *     <p>We introduce a new collection every week, so stay tuned.</p>
 *   </div>
 *   <subscribe-form></subscribe-form>
 * </subscribe-message>
 * ```
 */
class SubscribeMessage extends HTMLElement {
  logoSrc: string;
  logoAlt: string;
  titleText: string;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.logoSrc = "resources/logo.svg";
    this.logoAlt = "Logo";
    this.titleText = "Join our newsletter";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = '';
    this.shadowRoot!.appendChild(this.getTemplate().content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["logo-src", "logo-alt", "title", "primary-message", "secondary-message"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    
    if (name === "logo-src") {
      this.logoSrc = newValue;
    }
    if (name === "logo-alt") {
      this.logoAlt = newValue;
    }
    if (name === "title") {
      this.titleText = newValue;
    }
    
    if (this.isConnected) {
      this.render();
    }
  }

  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
      <img src="${this.logoSrc}" alt="${this.logoAlt}" />
      <h1>${this.titleText}</h1>
      <slot name="message">
        <p>Contact with us</p>
      </slot>
      <slot/>
      ${this.getStyles()}
    `;
    return template;
  }

  getStyles() {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          height: 100dvh;
          padding: 1.5rem;
          font-family: var(--font-family, Arial, sans-serif);
          --text-color: rgb(107, 114, 128);
          --title-color: black;
          --line-height: 1.5rem;
          --max-width: 32rem;
          --logo-width: 4rem;
          --logo-height: 4rem;
        }

        img {
          width: var(--logo-width);
          height: var(--logo-height);
        }

        h1 {
          text-align: center;
          color: var(--title-color);
          margin: 0;
        }

        div {
          max-width: var(--max-width);
        }

        ::slotted([slot="message"]), p {
          text-align: center;
          color: var(--text-color);
          line-height: var(--line-height);
          margin:0;
        }

      </style>
    `;
  }
}

customElements.define("subscribe-message", SubscribeMessage);