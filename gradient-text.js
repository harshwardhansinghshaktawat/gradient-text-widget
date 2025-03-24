class GradientText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isAnimating = false;
  }

  static get observedAttributes() {
    return [
      'text', 'heading-tag', 'background-color', 'background-opacity',
      'font-size', 'font-family', 'font-weight', 'line-height',
      'letter-spacing', 'animation-duration', 'text-alignment'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.handleResize = () => this.render();
    window.addEventListener('resize', this.handleResize);
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isAnimating) {
          this.isAnimating = true;
          this.startAnimation();
          observer.unobserve(this);
        }
      });
    }, { threshold: 0.1 });
    this.observer.observe(this);
  }

  startAnimation() {
    const heading = this.shadowRoot.querySelector('.gradient-heading');
    heading.style.animationPlayState = 'running';
  }

  render() {
    const text = this.getAttribute('text') || 'Vivid Flow Unleashed';
    const headingTag = this.getAttribute('heading-tag') || 'h2';
    const backgroundColor = this.getAttribute('background-color') || '#0A3D62'; // Dark teal
    const backgroundOpacity = parseFloat(this.getAttribute('background-opacity')) || 100; // 0-100
    const bgOpacityValue = backgroundOpacity / 100;
    const bgColorWithOpacity = `${backgroundColor}${Math.round(bgOpacityValue * 255).toString(16).padStart(2, '0')}`;
    const fontSize = parseFloat(this.getAttribute('font-size')) || 5; // In vw
    const fontFamily = this.getAttribute('font-family') || 'Montserrat';
    const fontWeight = parseInt(this.getAttribute('font-weight')) || 700;
    const lineHeight = parseInt(this.getAttribute('line-height')) || 120; // In px
    const letterSpacing = parseInt(this.getAttribute('letter-spacing')) || 5; // In px
    const animationDuration = parseFloat(this.getAttribute('animation-duration')) || 8; // In seconds
    const textAlignment = this.getAttribute('text-alignment') || 'center';

    this.isAnimating = false;

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap');

        :host {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${bgColorWithOpacity};
          overflow: hidden;
        }

        .gradient-heading {
          font-size: ${fontSize}vw;
          font-weight: ${fontWeight};
          line-height: ${lineHeight}px;
          letter-spacing: ${letterSpacing}px;
          text-align: ${textAlignment};
          background: linear-gradient(45deg, #1A759F, #EE6C4D, #3D405B, #A663CC);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 300% 300%;
          animation: gradient-text ${animationDuration}s ease infinite;
          animation-play-state: paused; /* Start paused */
          margin: 0;
        }

        @keyframes gradient-text {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      </style>
      <${headingTag} class="gradient-heading">${text}</${headingTag}>
    `;
  }
}

customElements.define('gradient-text', GradientText);
