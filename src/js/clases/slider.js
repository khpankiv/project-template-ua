export class TravelSlider {
  constructor({rootId, slideCount, ext = '.png', imgPath = 'assets/images/slider-img/travel-suitcase', phrases}) {
    this.carousel = document.getElementById('carousel');
    this.rootId = rootId;
    this.slideCount = slideCount;
    this.ext = ext;
    this.imgPath = imgPath;
    this.images = this._generateImageList();
    this.phrases = phrases;
    this.index = 0;
    this.items = [];
    this.isTransitioning = false;
    
    // Create navigation arrows
    this._createArrows();
    this._init();
  }
  
  _createArrows() {
    const root = document.getElementById(this.rootId) || this.carousel.parentElement;
    if (!root) return;
    
    // Remove existing arrows if any
    const existingArrows = root.querySelectorAll('.travel-slider-arrow');
    existingArrows.forEach(arrow => arrow.remove());
    
    // Create new arrows
    this.prevBtn = document.createElement('button');
    this.prevBtn.className = 'travel-slider-arrow travel-slider-arrow-left';
    this.prevBtn.innerHTML = '&#8249;'; // Better arrow character
    this.prevBtn.setAttribute('aria-label', 'Previous slide');
    
    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'travel-slider-arrow travel-slider-arrow-right';
    this.nextBtn.innerHTML = '&#8250;'; // Better arrow character  
    this.nextBtn.setAttribute('aria-label', 'Next slide');
    
    root.appendChild(this.prevBtn);
    root.appendChild(this.nextBtn);
  }

  _generateImageList() {
		console.log(`${this.imgPath}${1}${this.ext}`);
    return Array.from({length: this.slideCount}, (_,i)=> `${this.imgPath}${i+1}${this.ext}`);
  }

  _init() {
    this._renderSlides();
    this._attachEvents();
    this._update();
    
    // Smooth autoplay
    this.autoplay = true;
    this._interval = setInterval(() => {
      if(this.autoplay && !this.isTransitioning) {
        this.next();
      }
    }, 4500); // Slightly longer interval for better UX
    
    // Enhanced touch/swipe support
    this._addTouchSupport();
    
    // Keyboard navigation
    this._addKeyboardSupport();
  }
  
  _addTouchSupport() {
    let startX = null;
    let startY = null;
    
    this.carousel.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      this.autoplay = false; // Pause autoplay during touch
    });
    
    this.carousel.addEventListener('touchmove', e => {
      if (!startX || !startY) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;
      
      // Only handle horizontal swipes (avoid interfering with vertical scroll)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        e.preventDefault(); // Prevent scrolling
      }
    });
    
    this.carousel.addEventListener('touchend', e => {
      if(startX === null || startY === null) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
      
      startX = null;
      startY = null;
      
      // Resume autoplay after touch ends
      setTimeout(() => {
        this.autoplay = true;
      }, 1000);
    });
  }
  
  _addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
      if (this.carousel && this._isInViewport(this.carousel)) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        }
      }
    });
  }
  
  _isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (rect.top < window.innerHeight && rect.bottom > 0);
  }

  _renderSlides() {
    this.carousel.innerHTML = '';
    
    this.images.forEach((src, i) => {
      const slideElement = document.createElement('div');
      slideElement.className = 'travel-slide';
      slideElement.dataset.index = i;
      slideElement.style.backgroundImage = `url('${src}')`;
      
      // Add slide text
      const textElement = document.createElement('div');
      textElement.className = 'travel-slide-text';
      textElement.textContent = this.phrases[i % this.phrases.length];
      
      slideElement.appendChild(textElement);
      
      // Add click handler for slide navigation
      slideElement.addEventListener('click', (e) => {
        if (e.target === slideElement || e.target === textElement) {
          this.goTo(i);
        }
      });
      
      // Add loading state
      const img = new Image();
      img.onload = () => {
        slideElement.classList.add('loaded');
      };
      img.src = src;
      
      this.carousel.appendChild(slideElement);
    });
    
    this.items = Array.from(this.carousel.children);
  }

  _attachEvents() {
    // Arrow click events with smooth transitions
    this.prevBtn.addEventListener('click', (e) => { 
      e.stopPropagation(); 
      if (!this.isTransitioning) this.prev(); 
    });
    
    this.nextBtn.addEventListener('click', (e) => { 
      e.stopPropagation(); 
      if (!this.isTransitioning) this.next(); 
    });
    
    // Pause/resume autoplay on hover
    const container = document.getElementById(this.rootId) || this.carousel.parentElement;
    if (container) {
      container.addEventListener('mouseenter', () => {
        this.autoplay = false;
      });
      
      container.addEventListener('mouseleave', () => {
        this.autoplay = true;
      });
    }
    
    // Visibility API to pause when tab is not active
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.autoplay = false;
      } else {
        setTimeout(() => {
          this.autoplay = true;
        }, 1000);
      }
    });
  }

  _update() {
    if (this.isTransitioning) return;
    
    this.items.forEach((slide, i) => {
      slide.classList.remove('active', 'travel-slide-transition');
      
      if (i === this.index) {
        slide.classList.add('active');
        slide.style.opacity = '1';
        slide.style.transform = 'scale(1)';
        slide.style.zIndex = '10';
      } else {
        slide.classList.add('travel-slide-transition');
        slide.style.opacity = '0.7';
        slide.style.transform = 'scale(0.95)';
        slide.style.zIndex = '1';
      }
    });
    
    // Update arrow states
    this._updateArrows();
  }
  
  _updateArrows() {
    if (this.prevBtn) {
      this.prevBtn.disabled = false;
      this.prevBtn.style.opacity = '1';
    }
    
    if (this.nextBtn) {
      this.nextBtn.disabled = false;
      this.nextBtn.style.opacity = '1';
    }
  }

  prev() {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.index = (this.index - 1 + this.items.length) % this.items.length;
    this._update();
    
    // Reset transition flag
    setTimeout(() => {
      this.isTransitioning = false;
    }, 400); // Match CSS transition duration
  }

  next() {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.index = (this.index + 1) % this.items.length;
    this._update();
    
    // Reset transition flag
    setTimeout(() => {
      this.isTransitioning = false;
    }, 400); // Match CSS transition duration
  }

  goTo(i) {
    if (this.isTransitioning || i === this.index) return;
    
    this.isTransitioning = true;
    this.index = i;
    this._update();
    
    // Reset transition flag
    setTimeout(() => {
      this.isTransitioning = false;
    }, 400); // Match CSS transition duration
  }
  
  // Clean up method for when slider is destroyed
  destroy() {
    if (this._interval) {
      clearInterval(this._interval);
    }
    
    // Remove event listeners
    if (this.prevBtn) this.prevBtn.remove();
    if (this.nextBtn) this.nextBtn.remove();
  }
}

// ===========================================================
// Product Slider Class for adaptive product sections
// ===========================================================
export class ProductSlider {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) return;
    
    this.options = {
      itemsPerView: {
        desktop: 4,
        tablet: 2,
        mobile: 1
      },
      gap: 32,
      autoPlay: false,
      loop: true,
      transition: 400,
      ...options
    };
    
    this.currentIndex = 0;
    this.itemsCount = 0;
    this.itemsPerView = this.options.itemsPerView.desktop;
    this.isTransitioning = false;
    
    this._init();
  }
  
  _init() {
    this._setupHTML();
    this._updateItemsPerView();
    this._bindEvents();
    this._update();
    
    // Auto-play if enabled
    if (this.options.autoPlay) {
      this._startAutoPlay();
    }
  }
  
  _setupHTML() {
    // Wrap existing items in slider structure
    const items = Array.from(this.container.children);
    this.itemsCount = items.length;
    
    // Don't create slider if not enough items
    if (this.itemsCount <= this.itemsPerView) {
      this.container.classList.add('product-slider-no-scroll');
      return;
    }
    
    this.container.innerHTML = '';
    this.container.classList.add('product-slider-wrapper');
    
    // Create track
    this.track = document.createElement('div');
    this.track.className = 'product-slider-track';
    
    // Add items to track
    items.forEach(item => {
      item.classList.add('product-slider-item');
      this.track.appendChild(item);
    });
    
    this.container.appendChild(this.track);
    
    // Create navigation arrows
    this._createArrows();
  }
  
  _createArrows() {
    this.prevBtn = document.createElement('button');
    this.prevBtn.className = 'product-slider-arrow product-slider-arrow-left';
    this.prevBtn.innerHTML = '&#8249;';
    this.prevBtn.setAttribute('aria-label', 'Previous products');
    
    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'product-slider-arrow product-slider-arrow-right';
    this.nextBtn.innerHTML = '&#8250;';
    this.nextBtn.setAttribute('aria-label', 'Next products');
    
    this.container.appendChild(this.prevBtn);
    this.container.appendChild(this.nextBtn);
    
    // Add event listeners
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());
  }
  
  _updateItemsPerView() {
    const width = window.innerWidth;
    
    if (width <= 768) {
      this.itemsPerView = this.options.itemsPerView.mobile;
    } else if (width <= 1024) {
      this.itemsPerView = this.options.itemsPerView.tablet;
    } else {
      this.itemsPerView = this.options.itemsPerView.desktop;
    }
  }
  
  _bindEvents() {
    // Responsive updates
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this._updateItemsPerView();
        this._update();
      }, 100);
    });
    
    // Touch support
    this._addTouchSupport();
  }
  
  _addTouchSupport() {
    let startX = 0;
    let isDragging = false;
    
    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });
    
    this.track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });
    
    this.track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
      
      isDragging = false;
    });
  }
  
  _update() {
    if (!this.track || this.isTransitioning) return;
    
    const itemWidth = 100 / this.itemsPerView;
    const translateX = -this.currentIndex * itemWidth;
    
    this.track.style.transform = `translateX(${translateX}%)`;
    
    // Update arrow states
    this._updateArrows();
  }
  
  _updateArrows() {
    if (!this.prevBtn || !this.nextBtn) return;
    
    const maxIndex = Math.max(0, this.itemsCount - this.itemsPerView);
    
    this.prevBtn.classList.toggle('disabled', this.currentIndex === 0 && !this.options.loop);
    this.nextBtn.classList.toggle('disabled', this.currentIndex >= maxIndex && !this.options.loop);
  }
  
  next() {
    if (this.isTransitioning) return;
    
    const maxIndex = Math.max(0, this.itemsCount - this.itemsPerView);
    
    if (this.currentIndex >= maxIndex) {
      if (this.options.loop) {
        this.currentIndex = 0;
      } else {
        return;
      }
    } else {
      this.currentIndex++;
    }
    
    this._animateTransition();
  }
  
  prev() {
    if (this.isTransitioning) return;
    
    if (this.currentIndex <= 0) {
      if (this.options.loop) {
        this.currentIndex = Math.max(0, this.itemsCount - this.itemsPerView);
      } else {
        return;
      }
    } else {
      this.currentIndex--;
    }
    
    this._animateTransition();
  }
  
  _animateTransition() {
    this.isTransitioning = true;
    this._update();
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, this.options.transition);
  }
  
  _startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, 3000);
    
    // Pause on hover
    this.container.addEventListener('mouseenter', () => {
      clearInterval(this.autoPlayInterval);
    });
    
    this.container.addEventListener('mouseleave', () => {
      this._startAutoPlay();
    });
  }
  
  destroy() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }
}

