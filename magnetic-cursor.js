// Magnetic Cursor - Vanilla JS Implementation
// Converted from React component

const ANIMATION_CONSTANTS = {
  SPEED_MULTIPLIER: 0.04,
  MAX_SCALE_X: 1,
  MAX_SCALE_Y: 0.3,
  ATTACH_DURATION: 0.6,
  DETACH_DURATION: 0.5,
  CURSOR_DEFAULT_SIZE: 24,
};

class MagneticCursor {
    constructor(options = {}) {
        this.options = {
            lerpAmount: 0.1,
            magneticFactor: 0.2,
            hoverPadding: 8,
            hoverAttribute: 'data-magnetic',
            cursorSize: ANIMATION_CONSTANTS.CURSOR_DEFAULT_SIZE,
            cursorColor: 'var(--color-primary-green)',
            blendMode: 'normal',
            cursorClassName: '',
            shape: 'circle',
            disableOnTouch: true,
            ...options
        };

        this.cursorEl = null;
        this.state = null;
        this.isTouchDevice = false;
        this.rafId = null;
        this.cleanupFunctions = [];

        this.init();
    }

    init() {
        this.checkTouch();
        if (this.options.disableOnTouch && this.isTouchDevice) return;

        this.createCursorElement();
        this.initState();
        this.bindEvents();
        this.initMagneticElements();
        
        // Start animation loop
        gsap.ticker.add(this.update.bind(this));
    }

    checkTouch() {
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    createCursorElement() {
        this.cursorEl = document.createElement('div');
        this.cursorEl.className = `magnetic-cursor ${this.options.cursorClassName}`;
        Object.assign(this.cursorEl.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 9999,
            backgroundColor: this.options.cursorColor,
            mixBlendMode: this.options.blendMode,
            width: `${this.options.cursorSize}px`,
            height: `${this.options.cursorSize}px`,
            borderRadius: this.options.shape === 'circle' ? '50%' : this.options.shape === 'square' ? '0' : '8px',
            opacity: 0, // Start hidden
            willChange: 'transform, width, height, border-radius, background-color'
        });
        document.body.appendChild(this.cursorEl);
    }

    initState() {
        this.state = {
            pos: {
                current: { x: -100, y: -100 },
                target: { x: -100, y: -100 },
                previous: { x: -100, y: -100 },
            },
            hover: { isHovered: false },
        };
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    update() {
        if (!this.state || this.state.hover.isHovered) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const effectiveLerpAmount = prefersReducedMotion ? 1 : this.options.lerpAmount;

        this.state.pos.current.x = this.lerp(this.state.pos.current.x, this.state.pos.target.x, effectiveLerpAmount);
        this.state.pos.current.y = this.lerp(this.state.pos.current.y, this.state.pos.target.y, effectiveLerpAmount);

        const delta = {
            x: this.state.pos.current.x - this.state.pos.previous.x,
            y: this.state.pos.current.y - this.state.pos.previous.y
        };

        this.state.pos.previous.x = this.state.pos.current.x;
        this.state.pos.previous.y = this.state.pos.current.y;

        const speed = Math.sqrt(delta.x * delta.x + delta.y * delta.y) * ANIMATION_CONSTANTS.SPEED_MULTIPLIER;

        gsap.set(this.cursorEl, {
            x: this.state.pos.current.x,
            y: this.state.pos.current.y,
            rotate: Math.atan2(delta.y, delta.x) * (180 / Math.PI),
            scaleX: 1 + Math.min(speed, ANIMATION_CONSTANTS.MAX_SCALE_X),
            scaleY: 1 - Math.min(speed, ANIMATION_CONSTANTS.MAX_SCALE_Y),
        });
    }

    onMouseMove(event) {
        if (!this.state) return;

        const isInViewport =
            event.clientX >= 0 &&
            event.clientX <= window.innerWidth &&
            event.clientY >= 0 &&
            event.clientY <= window.innerHeight;

        if (isInViewport) {
            this.state.pos.target.x = event.clientX - this.options.cursorSize / 2;
            this.state.pos.target.y = event.clientY - this.options.cursorSize / 2;
            gsap.to(this.cursorEl, { opacity: 1, duration: 0.2 });
        } else {
            gsap.to(this.cursorEl, { opacity: 0, duration: 0.2 });
        }

        // Text selection feedback
        const target = event.target;
        const computedCursor = window.getComputedStyle(target).cursor;
        const isTextContent =
            ['P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(target.tagName) ||
            computedCursor === 'text';

        if (isTextContent && !this.state.hover.isHovered) {
            gsap.to(this.cursorEl, {
                scaleX: 0.5,
                scaleY: 1.5,
                duration: 0.3,
            });
        }
    }

    bindEvents() {
        const onMouseMove = this.onMouseMove.bind(this);
        const handleMouseLeave = () => gsap.to(this.cursorEl, { opacity: 0, duration: 0.3 });
        const handleMouseEnter = () => gsap.to(this.cursorEl, { opacity: 1, duration: 0.3 });
        const handleClick = (e) => this.createParticles(e.clientX, e.clientY);

        window.addEventListener('pointermove', onMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('click', handleClick);

        // Initialize position on first move
        const initPos = (e) => {
            const x = e.clientX - this.options.cursorSize / 2;
            const y = e.clientY - this.options.cursorSize / 2;
            this.state.pos.current.x = x;
            this.state.pos.current.y = y;
            this.state.pos.target.x = x;
            this.state.pos.target.y = y;
            this.state.pos.previous.x = x;
            this.state.pos.previous.y = y;
            gsap.set(this.cursorEl, { x, y, opacity: 1 });
        };
        window.addEventListener('pointermove', initPos, { once: true });
    }

    createParticles(x, y) {
        const particleCount = 8;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'cursor-particle';
            Object.assign(particle.style, {
                position: 'fixed',
                width: '4px',
                height: '4px',
                background: this.options.cursorColor,
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9998,
            });
            document.body.appendChild(particle);

            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 50 + Math.random() * 50;

            gsap.fromTo(particle, 
                { x, y, opacity: 1 },
                {
                    x: x + Math.cos(angle) * velocity,
                    y: y + Math.sin(angle) * velocity,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    onComplete: () => particle.remove()
                }
            );
        }
    }

    initMagneticElements() {
        const magneticElements = document.querySelectorAll(`[${this.options.hoverAttribute}]`);
        
        magneticElements.forEach(el => {
            const xTo = gsap.quickTo(el, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
            const yTo = gsap.quickTo(el, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });

            const handlePointerEnter = () => {
                this.state.hover.isHovered = true;
                const bounds = el.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(el);
                
                // Optional: Custom color per element
                const magneticColor = el.getAttribute('data-magnetic-color') || this.options.cursorColor;

                gsap.killTweensOf(this.cursorEl);
                gsap.to(this.cursorEl, {
                    x: bounds.left - this.options.hoverPadding,
                    y: bounds.top - this.options.hoverPadding,
                    width: bounds.width + this.options.hoverPadding * 2,
                    height: bounds.height + this.options.hoverPadding * 2,
                    borderRadius: computedStyle.borderRadius,
                    backgroundColor: 'transparent', // Make it an outline
                    border: `2px solid ${magneticColor}`, // Outline style
                    scaleX: 1,
                    scaleY: 1,
                    rotate: 0,
                    duration: 0.4,
                    ease: 'power3.out',
                });
            };

            const handlePointerLeave = () => {
                this.state.hover.isHovered = false;
                const shapeBorderRadius = this.options.shape === 'circle' ? '50%' : this.options.shape === 'square' ? '0' : '8px';

                gsap.killTweensOf(this.cursorEl);
                gsap.to(this.cursorEl, {
                    x: this.state.pos.target.x,
                    y: this.state.pos.target.y,
                    width: this.options.cursorSize,
                    height: this.options.cursorSize,
                    borderRadius: shapeBorderRadius,
                    backgroundColor: this.options.cursorColor,
                    border: 'none', // Remove outline
                    duration: 0.4,
                    ease: 'power3.out',
                });
                
                // Reset element position
                xTo(0);
                yTo(0);
            };

            const handlePointerMove = (e) => {
                const { clientX, clientY } = e;
                const { height, width, left, top } = el.getBoundingClientRect();
                xTo((clientX - (left + width / 2)) * this.options.magneticFactor);
                yTo((clientY - (top + height / 2)) * this.options.magneticFactor);
            };

            el.addEventListener('pointerenter', handlePointerEnter);
            el.addEventListener('pointerleave', handlePointerLeave);
            el.addEventListener('pointermove', handlePointerMove);
        });
    }
}

// Export for usage
window.MagneticCursor = MagneticCursor;

