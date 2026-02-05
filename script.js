// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

console.log("Portfolio Loaded");

/* =========================================
   1. CUSTOM CURSOR
   ========================================= */
const cursor = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, .btn, .skill-node, .hero-name, .hover-invert-word, .social-link'); // Added social-link

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
    });
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-active');
    });
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-active');
    });
});

/* =========================================
   2. HERO TYPEWRITER
   ========================================= */
const typeWriterElement = document.querySelector('.typewriter-text');
const textToType = "Hii, I'm Dhruv.\nI am an Intern Developer at TestDino.\nComputer Science Student & Playwright Tester.\nExploring the world of Web Development.";

let charIndex = 0;

function typeWriter() {
    if (charIndex < textToType.length) {
        typeWriterElement.textContent += textToType.charAt(charIndex);
        charIndex++;
        // Random timeout for realistic typing effect
        setTimeout(typeWriter, Math.random() * 50 + 50);
    }
}

// Start typing on load
window.addEventListener('load', () => {
    typeWriterElement.textContent = "";
    charIndex = 0;
    setTimeout(typeWriter, 1000); // Delay start slightly
});

/* =========================================
   3. SKILLS NETWORK (LAYOUT & FLOATING)
   ========================================= */
/* =========================================
   3. SKILLS NETWORK (LAYOUT & FLOATING)
   ========================================= */
const nodes = document.querySelectorAll('.skill-node');

// Initial Random Positioning
// We want them scattered but not too close to edges if possible
const positions = [
    { top: '15%', left: '15%' },
    { top: '25%', left: '60%' },
    { top: '50%', left: '45%' },
    { top: '65%', left: '25%' },
    { top: '75%', left: '75%' },
    { top: '20%', left: '40%' },
    { top: '80%', left: '40%' },
    { top: '40%', left: '10%' },
    { top: '45%', left: '85%' },
    { top: '85%', left: '10%' },
];

nodes.forEach((node, index) => {
    // Set Initial Position
    const pos = positions[index] || { top: Math.random() * 80 + 10 + '%', left: Math.random() * 80 + 10 + '%' };
    node.style.top = pos.top;
    node.style.left = pos.left;

    // Start Wandering Animation
    animateNode(node);
});

function animateNode(node) {
    // Calculate a new random position relative to current, or absolute?
    // Let's do absolute constrained random movements to keep them somewhat in view
    // We can use xPercent/yPercent for movement relative to their start point

    // Move to a random point within +/- 150px of origin (or viewport based)
    // To make them "float slowly", duration should be high (4-8s)

    const xMove = Math.random() * 200 - 100; // -100 to 100
    const yMove = Math.random() * 200 - 100;

    gsap.to(node, {
        x: xMove,
        y: yMove,
        duration: Math.random() * 5 + 5, // 5 to 10 seconds
        ease: "sine.inOut",
        force3D: false, // CRITICAL: Keeps element in 2D context for mix-blend-mode to work
        onComplete: () => animateNode(node) // Recursively call for continuous non-repeating path
    });
}

/* =========================================
   4. EDUCATION SCROLL LINE
   ========================================= */
// Animate the Line Height? Or Ball Position?
// User said: "ball thing made of blackl will go down as we scroll"
// And "bar will be initally white empty and black line with a ball... will go down"

// We have .timeline-line (bg rgba(0,0,0,0.1))
// We'll create a "fill" like effect if needed, but moving ball is key.

ScrollTrigger.create({
    trigger: ".education-section",
    start: "top center",
    end: "bottom center",
    scrub: 1, // Smooth scrubbing
    onUpdate: (self) => {
        // self.progress (0 to 1)
        // Move the ball
        gsap.to(".timeline-ball", {
            top: (self.progress * 100) + "%",
            duration: 0.1,
            ease: "none",
            overwrite: "auto"
        });

        // Optional: Fill the line behind it?
        // We can use a linear gradient on the line container to simulate fill
        const line = document.querySelector('.timeline-line');
        // Black fill on top, faint on bottom
        line.style.background = `linear-gradient(to bottom, #000 ${self.progress * 100}%, rgba(0,0,0,0.1) ${self.progress * 100}%)`;
    }
});

// Animate Items fading in
const items = document.querySelectorAll('.timeline-item');
items.forEach(item => {
    gsap.from(item, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
});

/* =========================================
   5. PROJECTS SLIDE UP
   ========================================= */
const projects = document.querySelectorAll('.project-card');
projects.forEach(card => {
    gsap.from(card, {
        opacity: 0,
        y: 100,
        duration: 1,
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
        }
    });
});

/* =========================================
   6. SNOW EFFECT
   ========================================= */
const initSnow = () => {
    const canvas = document.getElementById('snow-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    let width = canvas.width = parent.offsetWidth;
    let height = canvas.height = parent.offsetHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = parent.offsetWidth;
        height = canvas.height = parent.offsetHeight;
    });

    class Snowflake {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Random slant (wind): -0.5 to 1.5 pixels per frame
            // Mostly falling down, sometimes slight wind
            this.radius = Math.random() * 2 + 1; // 1 to 3px
            this.speed = Math.random() * 1.5 + 0.5; // Fall speed
            this.wind = (Math.random() - 0.5) * 1.5; // Random wind direction
        }

        update() {
            this.y += this.speed;
            this.x += this.wind;

            // Reset if out of view
            if (this.y > height) {
                this.y = 0;
                this.x = Math.random() * width;
            }
            // Wrap X
            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; // Dull white
            ctx.fill();
            ctx.closePath();
        }
    }

    const flakes = [];
    const maxFlakes = 100; // Count
    for (let i = 0; i < maxFlakes; i++) {
        flakes.push(new Snowflake());
    }

    const animateSnow = () => {
        ctx.clearRect(0, 0, width, height);
        flakes.forEach(flake => {
            flake.update();
            flake.draw();
        });
        requestAnimationFrame(animateSnow);
    };

    animateSnow();
};

initSnow();
