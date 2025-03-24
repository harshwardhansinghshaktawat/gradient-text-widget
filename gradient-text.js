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
      'letter-spacing', 'animation-duration', 'text-alignment', 'gradient-preset'
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

  getGradientPreset(presetName) {
    const presets = {
      'vivid-flow': '#1A759F, #EE6C4D, #3D405B, #A663CC',
      'sunset-glow': '#FF6B6B, #FFD93D, #FF9F1C, #D00000',
      'ocean-wave': '#00C4CC, #34E4EA, #0077B6, #023E8A',
      'forest-dusk': '#2A9D8F, #E9C46A, #F4A261, #264653',
      'neon-pulse': '#FF006E, #8338EC, #3A86FF, #FFBE0B',
      'twilight-bliss': '#7209B7, #B5179E, #F72585, #560BAD',
      'desert-mirage': '#F48C06, #FAA307, #FFBA08, #9D0208',
      'aurora-borealis': '#006D77, #83C5BE, #EDF6F9, #FFDDD2',
      'candy-crush': '#FF70A6, #FF9770, #FFD670, #E9FF70',
      'retro-vibe': '#EF476F, #FFD166, #06D6A0, #118AB2',
      'cosmic-dream': '#590D22, #800F25, #A4133C, #FF4D6D',
      'mystic-haze': '#4A5759, #B5838D, #FFB4A2, #E5989B',
      'golden-hour': '#FFD60A, #FFC107, #FF9505, #FF6200',
      'lavender-mist': '#7209B7, #A06CD5, #CDB4DB, #FFAFCC',
      'emerald-tide': '#006466, #065A60, #0B525B, #1B3A4B',
      'ruby-flare': '#9B1D20, #D00000, #DC2F02, #F48C06',
      'sapphire-sky': '#03045E, #023E8A, #0077B6, #00B4D8',
      'tropical-breeze': '#0081A7, #00AFB9, #FED9B7, #FDFCDC',
      'berry-blast': '#720026, #A30038, #CE4257, #FF7092',
      'midnight-glow': '#03071E, #370617, #6A040F, #9D0208',
      'pastel-dream': '#FFCAD4, #F4ACB7, #D8A7B1, #B5838D',
      'electric-storm': '#FF006E, #3A0CA3, #4361EE, #4CC9F0',
      'sunrise-blush': '#FF9F1C, #FF70A6, #FF9770, #FFD670',
      'galactic-shift': '#10002B, #240046, #3C096C, #5A189A',
      'lime-fusion': '#99E2B4, #88D4AB, #56AB91, #358F80',
      'coral-reef': '#FF595E, #FFCA3A, #8AC926, #1982C4',
      'autumn-fade': '#606C38, #283618, #FEFAE0, #DDA15E',
      'polar-light': '#CAF0F8, #90E0EF, #48CAE4, #00B4D8',
      'vintage-wine': '#4A2C2A, #6B3E3D, #8D5524, #C98C5C',
      'cyber-punk': '#FF0A54, #FF477E, #FF5C8A, #FF7092',
      'spring-bloom': '#E2EA82, #B7E1A1, #8CD790, #62C370'
    };
    return presets[presetName] || presets['vivid-flow'];
  }

  render() {
    const text = this.getAttribute('text') || 'Vivid Flow Unleashed';
    const headingTag = this.getAttribute('heading-tag') || 'h2';
    const backgroundColor = this.getAttribute('background-color') || '#0A3D62';
    const backgroundOpacity = parseFloat(this.getAttribute('background-opacity')) || 100;
    const bgOpacityValue = backgroundOpacity / 100; // 0-1 scale
    const fontSize = parseFloat(this.getAttribute('font-size')) || 5;
    const fontFamily = this.getAttribute('font-family') || 'Montserrat';
    const fontWeight = parseInt(this.getAttribute('font-weight')) || 700;
    const lineHeight = parseInt(this.getAttribute('line-height')) || 120;
    const letterSpacing = parseInt(this.getAttribute('letter-spacing')) || 5;
    const animationDuration = parseFloat(this.getAttribute('animation-duration')) || 8;
    const textAlignment = this.getAttribute('text-alignment') || 'center';
    const gradientPreset = this.getAttribute('gradient-preset') || 'vivid-flow';

    this.isAnimating = false;

    // Convert font family name to Google Fonts URL format (spaces to +)
    const fontFamilyUrl = fontFamily.replace(/\s+/g, '+');

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=${fontFamilyUrl}:wght@100..900&display=swap');

        :host {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(${parseInt(backgroundColor.slice(1, 3), 16), parseInt(backgroundColor.slice(3, 5), 16), parseInt(backgroundColor.slice(5, 7), 16), ${bgOpacityValue}});
          overflow: hidden;
        }

        .gradient-heading {
          font-size: ${fontSize}vw;
          font-weight: ${fontWeight};
          line-height: ${lineHeight}px;
          letter-spacing: ${letterSpacing}px;
          text-align: ${textAlignment};
          background: linear-gradient(45deg, ${this.getGradientPreset(gradientPreset)});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 300% 300%;
          animation: gradient-text ${animationDuration}s ease infinite;
          animation-play-state: paused;
          margin: 0;
          font-family: '${fontFamily}', sans-serif; /* Ensure font applies */
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
