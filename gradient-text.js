class GradientText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isAnimating = false;
  }

  static get observedAttributes() {
    return [
      'text', 'heading-tag', 'background-color', 'font-size', 
      'font-family', 'animation-duration', 'text-alignment', 'gradient-preset'
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

  getGradientColors(preset) {
    const presets = {
      'Ocean Breeze': ['#1A759F', '#34A0A4', '#76C893', '#B7E4C7'],
      'Sunset Glow': ['#FF6B6B', '#FF9F1C', '#FFD60A', '#FFEE88'],
      'Neon Pulse': ['#FF00FF', '#00FFFF', '#FF00FF', '#00FFFF'],
      'Forest Mist': ['#2D6A4F', '#40916C', '#74C69D', '#B7E4C7'],
      'Cosmic Dust': ['#3D405B', '#5A5F7D', '#81A4CD', '#C2E7FF'],
      'Lava Flow': ['#D00000', '#FF4500', '#FF8C00', '#FFC107'],
      'Twilight Haze': ['#7209B7', '#9B5DE5', '#F15BB5', '#FEE440'],
      'Aurora Veil': ['#006D77', '#83C5BE', '#EDF6F9', '#FFDDD2'],
      'Candy Rush': ['#FF70A6', '#FF9770', '#FFD670', '#E9FF70'],
      'Midnight Sky': ['#03045E', '#023E8A', '#0077B6', '#90E0EF'],
      'Golden Hour': ['#FFD700', '#FFA500', '#FF4500', '#8B0000'],
      'Emerald Dream': ['#004B23', '#006400', '#008000', '#90EE90'],
      'Purple Reign': ['#4B0082', '#800080', '#DA70D6', '#FFB6C1'],
      'Tropical Wave': ['#00CED1', '#20B2AA', '#48D1CC', '#AFEEEE'],
      'Blush Bloom': ['#FF9999', '#FFCC99', '#FFFF99', '#CCFF99'],
      'Electric Storm': ['#483D8B', '#6A5ACD', '#9370DB', '#E6E6FA'],
      'Fire Opal': ['#E25822', '#F28C38', '#FBBF24', '#FFF8DC'],
      'Icy Peak': ['#4682B4', '#87CEEB', '#ADD8E6', '#F0F8FF'],
      'Berry Blast': ['#800000', '#C71585', '#FF1493', '#FFB6C1'],
      'Citrus Twist': ['#FFA07A', '#FFD700', '#ADFF2F', '#7FFF00'],
      'Mystic Tide': ['#2F004F', '#4B0082', '#9400D3', '#E0B0FF'],
      'Autumn Blaze': ['#8B4513', '#D2691E', '#F4A460', '#FFDAB9'],
      'Velvet Dawn': ['#4A2C5A', '#6B3E7A', '#9B59B6', '#D7BDE2'],
      'Sapphire Shine': ['#000080', '#4169E1', '#87CEFA', '#E0FFFF'],
      'Coral Reef': ['#FF4040', '#FF7F50', '#FFDAB9', '#FFE4E1'],
      'Lunar Glow': ['#2F2F2F', '#696969', '#A9A9A9', '#F5F5F5'],
      'Pink Sunset': ['#FF69B4', '#FFB6C1', '#FFD1DC', '#FFF0F5'],
      'Teal Horizon': ['#008080', '#20B2AA', '#48D1CC', '#B0E0E6'],
      'Amber Waves': ['#8B5A2B', '#CD853F', '#F4A460', '#FFE4B5'],
      'Violet Mist': ['#6A0DAD', '#9932CC', '#BA55D3', '#E6E6FA']
    };
    return presets[preset] || presets['Ocean Breeze']; // Default to Ocean Breeze
  }

  render() {
    const text = this.getAttribute('text') || 'Vivid Flow Unleashed';
    const headingTag = this.getAttribute('heading-tag') || 'h2';
    const backgroundColor = this.getAttribute('background-color') || '#0A3D62'; // Dark teal
    const fontSize = parseFloat(this.getAttribute('font-size')) || 5; // In vw
    const fontFamily = this.getAttribute('font-family') || 'Montserrat';
    const animationDuration = parseFloat(this.getAttribute('animation-duration')) || 8; // In seconds
    const textAlignment = this.getAttribute('text-alignment') || 'center';
    const gradientPreset = this.getAttribute('gradient-preset') || 'Ocean Breeze';
    const gradientColors = this.getGradientColors(gradientPreset).join(', ');

    this.isAnimating = false;

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

        :host {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${backgroundColor};
          overflow: hidden;
        }

        .gradient-heading {
          font-size: ${fontSize}vw;
          text-align: ${textAlignment};
          background: linear-gradient(45deg, ${gradientColors});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 300% 300%;
          animation: gradient-text ${animationDuration}s ease infinite;
          animation-play-state: paused;
          margin: 0;
          font-family: ${fontFamily}, sans-serif;
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
