/**
 * @element subscribe-form
 * @description A customizable newsletter subscription form web component.
 * 
 * This web component renders a complete email subscription form with an input field,
 * submit button, and message. It uses Shadow DOM for style encapsulation and 
 * can be customized via attributes.
 * 
 * @attr {string} input-placeholder - Placeholder text for the email input field (default: "Enter your email address")
 * @attr {string} button-text - Text displayed on the submit button (default: "Subscribe now")
 * @attr {string} message - Text displayed below the form (default: "Your email is 100% confidential and won't send you any spam.")
 * @attr {string} success-message - Message displayed after successful submission (default: "Thank you for subscribing!")
 * @attr {string} error-message - Message displayed if submission fails (default: "Something went wrong. Please try again.")
 * 
 * @csspart form - The form element container
 * @csspart input - The email input field
 * @csspart button - The submit button
 * @csspart message - The message span below the button
 * 
 * @cssproperty --background-color - Background color of the form (default: white)
 * @cssproperty --box-shadow - Box shadow for the form (default: 0 1rem 1rem rgb(0, 0, 0, 0.1))
 * @cssproperty --border-radius - Border radius of the form (default: 1rem)
 * @cssproperty --input-border - Border style for the input field (default: 1px solid rgb(227, 232, 238))
 * @cssproperty --input-border-radius - Border radius for the input field (default: 0.25rem)
 * @cssproperty --input-background-color - Background color for the input field (default: rgb(243, 244, 246))
 * @cssproperty --input-color - Text color for the input field (default: #000)
 * @cssproperty --button-background-color - Background color for the button (default: blue)
 * @cssproperty --button-color - Text color for the button (default: white)
 * @cssproperty --button-border-radius - Border radius for the button (default: 0.5rem)
 * @cssproperty --button-border - Border style for the button (default: none)
 * @cssproperty --message-color - Text color for the message (default: rgb(107, 114, 128))
 * @cssproperty --success-color - Text color for success messages (default: green)
 * @cssproperty --error-color - Text color for error messages (default: red)
 * 
 * @example
 * ```html
 * <subscribe-form 
 *   input-placeholder="Your email here" 
 *   button-text="Join us" 
 *   message="We respect your privacy">
 * </subscribe-form>
 * ```
 */
class SuscribeForm extends HTMLElement {
  inputPlaceholder: string;
  buttonText: string;
  message: string;
  successMessage: string;
  errorMessage: string;
  apiUrl: string | null = null;
  form: HTMLFormElement | null = null;
  statusMessage: HTMLSpanElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.inputPlaceholder = "Enter your email address";
    this.buttonText = "Subscribe now";
    this.message = "Your email is 100% confidential and won&rsquo;t send you any spam.";
    this.successMessage = "Thank you for subscribing!";
    this.errorMessage = "Something went wrong. Please try again.";
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.form = this.shadowRoot!.querySelector('form');
    this.statusMessage = this.shadowRoot!.querySelector('.status-message');
    
    if (this.form) {
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
  }

  async submitToServer(email: string): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Subscription error:', error);
      return false;
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.form) return;
    
    const emailInput = this.form.querySelector('input[type="email"]') as HTMLInputElement;
    const email = emailInput.value;
    
    if (!email || !this.isValidEmail(email)) {
      this.showMessage(this.errorMessage, 'error');
      return;
    }
    
    this.setSubmitting(true);
    
    if (this.apiUrl) {
      // Use the API if URL is provided
      this.submitToServer(email).then(success => {
        if (success) {
          this.showMessage(this.successMessage, 'success');
          this.form?.reset();
        } else {
          this.showMessage(this.errorMessage, 'error');
        }
        this.setSubmitting(false);
      });
    } else {
      this.showMessage('No API url provided', 'error');
    }
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  showMessage(text: string, type: 'success' | 'error' | 'info') {
    if (this.statusMessage) {
      this.statusMessage.textContent = text;
      this.statusMessage.className = `status-message ${type}`;
      this.statusMessage.style.display = 'block';
    }
  }
  
  setSubmitting(isSubmitting: boolean) {
    const button = this.shadowRoot!.querySelector('button');
    if (button) {
      button.disabled = isSubmitting;
      button.textContent = isSubmitting ? 'Subscribing...' : this.buttonText;
    }
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
    }
  }

  static get observedAttributes() {
    return ["input-placeholder", "button-text", "message", "success-message", "error-message", "api-url"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    switch(name) {
      case "input-placeholder":
        this.inputPlaceholder = newValue;
        break;
      case "button-text":
        this.buttonText = newValue;
        break;
      case "message":
        this.message = newValue;
        break;
      case "success-message":
        this.successMessage = newValue;
        break;
      case "error-message":
        this.errorMessage = newValue;
        break;
      case "api-url":
        this.apiUrl = newValue;
        break;
    }
    this.render();
  }

  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
      <form>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="${this.inputPlaceholder}"
          autocomplete="on"
          required
        />
        <button type="submit">${this.buttonText}</button>
        <span class="info-message">
          ${this.message}
        </span>
        <span class="status-message" style="display: none;"></span>
      </form>
      ${this.getStyles()}
    `;
    return template;
  }

  getStyles() {
    return `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          max-width: 24rem;
          margin: 0 auto;
          --background-color: white;
          --box-shadow: 0 1rem 1rem rgb(0, 0, 0, 0.1);
          --border-radius: 1rem;
          --input-border: 1px solid rgb(227, 232, 238);
          --input-border-radius: 0.25rem;
          --input-background-color: rgb(243, 244, 246);
          --input-color: #000;
          --button-background-color: blue;
          --button-color: white;
          --button-border-radius: 0.5rem;
          --button-border: none;
          --message-color: rgb(107, 114, 128);
          --success-color: green;
          --error-color: red;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 24rem;
          background-color: var(--background-color);
          padding: 1.5rem;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }

        input {
          padding: 0.5rem;
          border: var(--input-border);
          background-color: var(--input-background-color);
          border-radius: var(--input-border-radius);
          font-size: 0.75rem;
          color: var(--input-color);
          text-align: center;
        }

        button {
          padding: 0.75rem 0;
          background-color: var(--button-background-color);
          color: var(--button-color);
          border: var(--button-border);
          border-radius: var(--button-border-radius);
          font-size: 0.6rem;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        button:hover:not([disabled]) {
          opacity: 0.8;
        }
        
        button[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .info-message {
          font-size: 0.75rem;
          color: var(--message-color);
          text-align: center;
        }
        
        .status-message {
          font-size: 0.75rem;
          text-align: center;
          font-weight: bold;
          margin-top: 0.5rem;
        }
        
        .status-message.success {
          color: var(--success-color);
        }
        
        .status-message.error {
          color: var(--error-color);
        }
      </style>
    `;
  }
}

customElements.define("subscribe-form", SuscribeForm);
