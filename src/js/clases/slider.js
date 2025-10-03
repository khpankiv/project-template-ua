export class TravelSlider {
	constructor({ rootId, slideCount, ext = '.png', imgPath = 'assets/images/slider-img/travel-suitcase', phrases }) {
		this.carousel = document.getElementById('carousel');
		// Create side arrow buttons
		this.prevBtn = document.createElement('button');
		this.prevBtn.className = 'slider-arrow slider-arrow-left';
		this.prevBtn.innerHTML = '&#8592;';
		this.nextBtn = document.createElement('button');
		this.nextBtn.className = 'slider-arrow slider-arrow-right';
		this.nextBtn.innerHTML = '&#8594;';
		// Insert arrows into carousel root
		const root = document.getElementById(rootId) || this.carousel.parentElement;
		if (root) {
			root.appendChild(this.prevBtn);
			root.appendChild(this.nextBtn);
		}
		this.slideCount = slideCount;
		this.ext = ext;
		this.imgPath = imgPath;
		this.images = this._generateImageList();
		this.phrases = phrases;
		this.index = 0;
		this.items = [];
		this._init();
	}

	_generateImageList() {
		console.log(`${this.imgPath}${1}${this.ext}`);
		return Array.from({ length: this.slideCount }, (_,i) => `${this.imgPath}${i+1}${this.ext}`);
	}

	_init() {
		this._renderSlides();
		this._attachEvents();
		this._update();
		// autoplay
		this.autoplay = true;
		this._interval = setInterval(() => {
			if(this.autoplay) this.next();
		}, 4000);
		// swipe events for mobile
		let startX = null;
		this.carousel.addEventListener('touchstart', e => {
			startX = e.touches[0].clientX;
		});
		this.carousel.addEventListener('touchend', e => {
			if(startX === null) return;
			const dx = e.changedTouches[0].clientX - startX;
			if(Math.abs(dx) > 40) {
				if(dx > 0) this.prev();
				else this.next();
			}
			startX = null;
		});
	}

	_renderSlides() {
		this.carousel.innerHTML = '';
		this.images.forEach((src, i) => {
			const it = document.createElement('div');
			it.className = 'item';
			it.dataset.index = i;
			// Caption with background
			const caption = document.createElement('div');
			caption.className = 'slider-caption';
			caption.dataset.bg = src;
			caption.style.backgroundImage = `url('${src}')`;
			caption.innerHTML = '<span class="slider-caption-text"></span>';
			it.appendChild(caption);
			const badge = document.createElement('div');
			badge.className = 'badge';
			badge.textContent = i+1;
			it.appendChild(badge);
			it.addEventListener('click', () => this.goTo(i));
			this.carousel.appendChild(it);
		});
		this.items = Array.from(this.carousel.children);
	}

	_attachEvents() {
		this.prevBtn.addEventListener('click', e => { e.stopPropagation(); this.prev(); });
		this.nextBtn.addEventListener('click', e => { e.stopPropagation(); this.next(); });
		this.carousel.addEventListener('mouseenter', () => this.autoplay = false);
		this.carousel.addEventListener('mouseleave', () => this.autoplay = true);
		document.addEventListener('keydown', (e) => {
			if(e.key === 'ArrowLeft') this.prev();
			if(e.key === 'ArrowRight') this.next();
		});
	}

	_update() {
		const itemWidth = this.items[0]?.offsetWidth || 0;
		const gap = 24; // px, або підставте ваш $space-md
		const visible = 5; // скільки картинок видно
		const center = Math.floor(visible / 2);
		this.items.forEach((el, i) => {
			// позиція відносно центрального
			let pos = (i - this.index);
			// для каруселі по колу
			if (pos < -Math.floor(this.items.length/2)) pos += this.items.length;
			if (pos > Math.floor(this.items.length/2)) pos -= this.items.length;
			el.style.position = 'absolute';
			el.style.left = '50%';
			el.style.top = '0';
			// Scale and shadow for central item
			if (pos === 0) {
				el.style.transform = `translateX(${(pos * (itemWidth + gap))}px) scale(1.18)`;
				el.style.boxShadow = '0 8px 32px 0 rgba(0,0,0,0.25)';
				el.style.zIndex = 10;
			} else {
				el.style.transform = `translateX(${(pos * (itemWidth + gap))}px) scale(1)`;
				el.style.boxShadow = 'none';
				el.style.zIndex = (center - Math.abs(pos));
			}
			el.style.opacity = Math.abs(pos) > center ? 0 : 1;
			el.style.pointerEvents = Math.abs(pos) > center ? 'none' : 'auto';
			// Always show captions, fixed text per slide
			const caption = el.querySelector('.slider-caption');
			const text = caption && caption.querySelector('.slider-caption-text');
			if (text) text.textContent = this.phrases[i % this.phrases.length];
		});
	}

	prev() {
		this.index = (this.index - 1 + this.items.length) % this.items.length;
		this._update();
	}

	next() {
		this.index = (this.index + 1) % this.items.length;
		this._update();
	}

	goTo(i) {
		this.index = i;
		this._update();
	}
}

