// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

console.log("Portfolio Loaded");

/* =========================================
   1. CUSTOM CURSOR
   ========================================= */
const cursor = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, .btn, .skill-node, .hero-name, .hover-invert-word, .social-link, .education-card'); // Added education-card

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
   2.5 NAVBAR DIRECTIONAL UNDERLINE
   ========================================= */
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('mouseenter', function (e) {
        const rect = this.getBoundingClientRect();
        const mouseX = e.clientX;
        const linkCenterX = rect.left + rect.width / 2;

        // Remove both classes first
        this.classList.remove('hover-from-left', 'hover-from-right');

        // Determine direction based on mouse position relative to link center
        if (mouseX < linkCenterX) {
            // Mouse entered from left side
            this.classList.add('hover-from-left');
        } else {
            // Mouse entered from right side
            this.classList.add('hover-from-right');
        }
    });

    link.addEventListener('mouseleave', function (e) {
        const rect = this.getBoundingClientRect();
        const mouseX = e.clientX;
        const linkCenterX = rect.left + rect.width / 2;

        // Remove both classes first
        this.classList.remove('hover-from-left', 'hover-from-right');

        // Determine exit direction
        if (mouseX < linkCenterX) {
            // Mouse exiting to the left
            this.classList.add('hover-from-right'); // Collapse to right
        } else {
            // Mouse exiting to the right
            this.classList.add('hover-from-left'); // Collapse to left
        }
    });
});

/* =========================================
   3. SKILLS NETWORK (LAYOUT & FLOATING)
   ========================================= */
/* =========================================
   3. SKILLS NETWORK (PHYSICS & INTERACTION)
   ========================================= */
const skillsSection = document.querySelector('.skills-section');
const header = document.querySelector('.skills-header');
const headerTitle = document.getElementById('animated'); // The text container
const nodes = Array.from(document.querySelectorAll('.skill-node'));

// Physics Constants
const DAMPING = 0.99; // Friction
const VELOCITY_LIMIT = 3;
const REPULSION_FORCE = 0.5;
const HEADER_BUFFER = 20;

// State
let bounds = { width: 0, height: 0, left: 0, top: 0 };
let headerRect = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
let physicsNodes = [];

// Initialize Physics Nodes
function initPhysics() {
    updateBounds();

    physicsNodes = nodes.map((element, index) => {
        // Random initial positions if not set, or parse current
        const rect = element.getBoundingClientRect();
        // Start roughly in the center area if first load, or use existing top/left
        let x = Math.random() * (bounds.width - 100);
        let y = Math.random() * (bounds.height - 100);

        // Random Velocity (Slower on mobile)
        const isMobile = window.innerWidth <= 768;
        const speedFactor = isMobile ? 1.5 : 3;

        let vx = (Math.random() - 0.5) * speedFactor;
        let vy = (Math.random() - 0.5) * speedFactor;

        return {
            element,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            radius: element.offsetWidth / 2, // 50px usually
            isDragging: false,
            mass: 1,
            originalRadius: element.offsetWidth / 2
        };
    });

    animatePhysics();
}

function updateBounds() {
    const rect = skillsSection.getBoundingClientRect();
    bounds.width = rect.width;
    bounds.height = rect.height;
    bounds.left = rect.left;
    bounds.top = rect.top;

    // Heading Rect relative to section
    const hRect = header.getBoundingClientRect();
    headerRect = {
        left: hRect.left - rect.left - HEADER_BUFFER,
        right: hRect.right - rect.left + HEADER_BUFFER,
        top: hRect.top - rect.top - HEADER_BUFFER,
        bottom: hRect.bottom - rect.top + HEADER_BUFFER,
        width: hRect.width + (HEADER_BUFFER * 2),
        height: hRect.height + (HEADER_BUFFER * 2)
    };
}

// Main Physics Loop
function animatePhysics() {
    // 1. Update Positions
    physicsNodes.forEach(node => {
        if (node.isDragging) return; // Skip position update if dragging

        // Apply slight random wandering force
        node.vx += (Math.random() - 0.5) * 0.2;
        node.vy += (Math.random() - 0.5) * 0.2;

        // Apply friction
        node.vx *= DAMPING;
        node.vy *= DAMPING;

        // Limit Velocity
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > VELOCITY_LIMIT) {
            node.vx = (node.vx / speed) * VELOCITY_LIMIT;
            node.vy = (node.vy / speed) * VELOCITY_LIMIT;
        }

        node.x += node.vx;
        node.y += node.vy;
    });

    // Update Header Rect Dynamically (since it moves or changes size)
    // We treat the header as a static obstacle for this frame
    if (header) {
        const hRect = header.getBoundingClientRect();
        const pRect = skillsSection.getBoundingClientRect();

        // Update headerRect specifically for collision
        headerRect = {
            left: hRect.left - pRect.left,
            right: hRect.right - pRect.left,
            top: hRect.top - pRect.top,
            bottom: hRect.bottom - pRect.top,
            width: hRect.width,
            height: hRect.height
        };
    }

    // 2. Resolve Collisions
    // A. Wall Collisions
    physicsNodes.forEach(node => {
        // Right Wall
        if (node.x + node.radius * 2 > bounds.width) {
            node.x = bounds.width - node.radius * 2;
            node.vx *= -1;
        }
        // Left Wall
        if (node.x < 0) {
            node.x = 0;
            node.vx *= -1;
        }
        // Bottom Wall
        if (node.y + node.radius * 2 > bounds.height) {
            node.y = bounds.height - node.radius * 2;
            node.vy *= -1;
        }
        // Top Wall
        if (node.y < 0) {
            node.y = 0;
            node.vy *= -1;
        }
    });

    // B. Header Collision (Circle-Rectangle Collision)
    physicsNodes.forEach(node => {
        const cx = node.x + node.radius;
        const cy = node.y + node.radius;

        // Find closest point on the header rectangle to the circle center
        // Clamp center to the box
        let testX = cx;
        let testY = cy;

        if (cx < headerRect.left) testX = headerRect.left;
        else if (cx > headerRect.right) testX = headerRect.right;

        if (cy < headerRect.top) testY = headerRect.top;
        else if (cy > headerRect.bottom) testY = headerRect.bottom;

        // Distance from closest point to center
        const distX = cx - testX;
        const distY = cy - testY;
        const distance = Math.sqrt((distX * distX) + (distY * distY));

        // Check collision
        if (distance < node.radius) {
            // Collision detected

            // Calculate Normal Vector
            let nx = distX;
            let ny = distY;

            // Edge case: Center is inside the rectangle (distX and distY are 0 if we clamp strictly)
            // Wait, if Center is INSIDE, clamp checks will simply return the center coordinates? 
            // No, clamp returns the *edge* coordinates if inside? No, clamp returns the value itself if inside.
            // If inside, cx matches testX, cy matches testY => distance = 0.

            if (distance === 0) {
                // Deep overlap (center inside rect)
                // Find nearest edge to push out
                const dLeft = cx - headerRect.left;
                const dRight = headerRect.right - cx;
                const dTop = cy - headerRect.top;
                const dBottom = headerRect.bottom - cy;

                const min = Math.min(dLeft, dRight, dTop, dBottom);

                if (min === dLeft) { nx = -1; ny = 0; }
                else if (min === dRight) { nx = 1; ny = 0; }
                else if (min === dTop) { nx = 0; ny = -1; }
                else { nx = 0; ny = 1; }

                // Push out
                node.x += nx * (node.radius - distance + 5);
                node.y += ny * (node.radius - distance + 5);

            } else {
                // Normal bounce off corner or edge
                const len = distance;
                nx /= len; // Normalize
                ny /= len;

                // Push out to surface
                const overlap = node.radius - distance;
                node.x += nx * overlap;
                node.y += ny * overlap;
            }

            // Reflect Velocity: V_new = V_old - 2 * (V_old . N) * N
            const dot = node.vx * nx + node.vy * ny;

            // Only reflect if moving towards the object
            if (dot < 0) {
                node.vx = node.vx - 2 * dot * nx;
                node.vy = node.vy - 2 * dot * ny;

                // Add some energy loss/gain or randomization
                node.vx *= 1.1; // Slightly "bouncy"
                node.vy *= 1.1;
            }
        }
    });

    // C. Node-Node Collisions
    for (let i = 0; i < physicsNodes.length; i++) {
        for (let j = i + 1; j < physicsNodes.length; j++) {
            const p1 = physicsNodes[i];
            const p2 = physicsNodes[j];

            const dx = (p2.x + p2.radius) - (p1.x + p1.radius);
            const dy = (p2.y + p2.radius) - (p1.y + p1.radius);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = p1.radius + p2.radius;

            if (distance < minDistance) {
                // Collision Detected!

                // Trigger Wobble if significant impact
                const impact = Math.sqrt((p1.vx - p2.vx) ** 2 + (p1.vy - p2.vy) ** 2);
                if (impact > 0.5) {
                    triggerWobble(p1.element);
                    triggerWobble(p2.element);
                }

                // Resolve Overlap
                const overlap = minDistance - distance;
                const nx = dx / distance; // Normal X
                const ny = dy / distance; // Normal Y

                // Move apart proportional to overlap
                const moveX = nx * overlap * 0.5;
                const moveY = ny * overlap * 0.5;

                // If one is dragging, it doesn't move, the other takes full force
                if (p1.isDragging && !p2.isDragging) {
                    p2.x += moveX * 2;
                    p2.y += moveY * 2;
                    p2.vx += nx * 2; // Add "push" velocity
                    p2.vy += ny * 2;
                } else if (!p1.isDragging && p2.isDragging) {
                    p1.x -= moveX * 2;
                    p1.y -= moveY * 2;
                    p1.vx -= nx * 2;
                    p1.vy -= ny * 2;
                } else {
                    // Both free
                    p1.x -= moveX;
                    p1.y -= moveY;
                    p2.x += moveX;
                    p2.y += moveY;

                    // Swap Velocities (Simple Elastic)
                    // ...actually better to just simple bounce vector math?
                    // Simplified: Exchange normal velocity components + restitution

                    // Separation vector is (nx, ny)
                    // Relative velocity in normal direction
                    const dvx = p2.vx - p1.vx;
                    const dvy = p2.vy - p1.vy;
                    const velAlongNormal = dvx * nx + dvy * ny;

                    if (velAlongNormal < 0) {
                        // Closing in
                        const restitution = 0.9; // Bounciness
                        const jVal = -(1 + restitution) * velAlongNormal;
                        // Assuming equal mass for simplicity (1)
                        // impulse = j / (1/m1 + 1/m2) = j / 2
                        const impulse = jVal / 2;

                        p1.vx -= impulse * nx;
                        p1.vy -= impulse * ny;
                        p2.vx += impulse * nx;
                        p2.vy += impulse * ny;
                    }
                }
            }
        }
    }

    // 3. Render
    physicsNodes.forEach(node => {
        node.element.style.left = node.x + 'px';
        node.element.style.top = node.y + 'px';
    });

    requestAnimationFrame(animatePhysics);
}

function triggerWobble(element) {
    // restart animation
    element.classList.remove('wobble-anim');
    void element.offsetWidth; // trigger reflow
    element.classList.add('wobble-anim');
}

// 4. Interaction (Drag - Mouse and Touch)
let draggedNode = null;
let dragOffset = { x: 0, y: 0 };

// Mouse Events
document.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', endDrag);

// Touch Events for Mobile
document.addEventListener('touchstart', handleTouchStart, { passive: false });
document.addEventListener('touchmove', handleTouchMove, { passive: false });
document.addEventListener('touchend', handleTouchEnd);

function startDrag(e) {
    if (e.target.closest('.skill-node')) {
        const element = e.target.closest('.skill-node');
        const node = physicsNodes.find(n => n.element === element);
        if (node) {
            draggedNode = node;
            node.isDragging = true;
            // Calculate offset within the bubble
            const rect = element.getBoundingClientRect();
            const parentRect = skillsSection.getBoundingClientRect();

            // Mouse relative to section
            const mouseX = e.clientX - parentRect.left;
            const mouseY = e.clientY - parentRect.top;

            dragOffset.x = mouseX - node.x;
            dragOffset.y = mouseY - node.y;

            // Kill velocity while dragging
            node.vx = 0;
            node.vy = 0;

            element.style.cursor = 'grabbing';
        }
    }
}

function drag(e) {
    if (draggedNode) {
        e.preventDefault();
        const parentRect = skillsSection.getBoundingClientRect();
        const mouseX = e.clientX - parentRect.left;
        const mouseY = e.clientY - parentRect.top;

        // Previous pos to calculate throwing velocity
        const prevX = draggedNode.x;
        const prevY = draggedNode.y;

        draggedNode.x = mouseX - dragOffset.x;
        draggedNode.y = mouseY - dragOffset.y;

        // Calculate velocity for "throw" effect on release
        draggedNode.vx = (draggedNode.x - prevX) * 0.5; // Scale down a bit
        draggedNode.vy = (draggedNode.y - prevY) * 0.5;
    }
}

function endDrag() {
    if (draggedNode) {
        draggedNode.isDragging = false;
        draggedNode.element.style.cursor = 'pointer';
        draggedNode = null;
    }
}

// Touch Event Handlers
function handleTouchStart(e) {
    if (e.target.closest('.skill-node')) {
        e.preventDefault();
        const touch = e.touches[0];
        const element = e.target.closest('.skill-node');
        const node = physicsNodes.find(n => n.element === element);

        if (node) {
            draggedNode = node;
            node.isDragging = true;

            const parentRect = skillsSection.getBoundingClientRect();
            const touchX = touch.clientX - parentRect.left;
            const touchY = touch.clientY - parentRect.top;

            dragOffset.x = touchX - node.x;
            dragOffset.y = touchY - node.y;

            node.vx = 0;
            node.vy = 0;
        }
    }
}

function handleTouchMove(e) {
    if (draggedNode) {
        e.preventDefault();
        const touch = e.touches[0];
        const parentRect = skillsSection.getBoundingClientRect();
        const touchX = touch.clientX - parentRect.left;
        const touchY = touch.clientY - parentRect.top;

        const prevX = draggedNode.x;
        const prevY = draggedNode.y;

        draggedNode.x = touchX - dragOffset.x;
        draggedNode.y = touchY - dragOffset.y;

        draggedNode.vx = (draggedNode.x - prevX) * 0.5;
        draggedNode.vy = (draggedNode.y - prevY) * 0.5;
    }
}

function handleTouchEnd(e) {
    if (draggedNode) {
        draggedNode.isDragging = false;
        draggedNode = null;
    }
}

// Handle Window Resize
window.addEventListener('resize', updateBounds);

// Start
window.addEventListener('load', () => {
    // Animate Header
    gsap.to(".skills-header", {
        y: 15,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });

    // Init physics
    setTimeout(initPhysics, 100);

    // Wave Animation for Text
    updateText("Technical Skills");
});

function updateText(text) {
    let delay = 200;
    let h1 = document.getElementById("animated");

    if (!h1) return;

    h1.innerHTML = text
        .split("")
        .map(letter => {
            console.log(letter);
            return `<span>` + (letter === " " ? "&nbsp;" : letter) + `</span>`;
        })
        .join("");

    Array.from(h1.children).forEach((span, index) => {
        setTimeout(() => {
            span.classList.add("wavy");
        }, index * 250 + delay);
    });
}

// Mobile: Toggle tooltip on tap
if ('ontouchstart' in window) {
    nodes.forEach(node => {
        node.addEventListener('touchstart', function (e) {
            // Don't interfere with dragging
            if (!this.classList.contains('show-tooltip')) {
                e.preventDefault();
                // Remove tooltip from all other nodes
                nodes.forEach(n => n.classList.remove('show-tooltip'));
                // Add to this one
                this.classList.add('show-tooltip');

                // Auto-hide after 2 seconds
                setTimeout(() => {
                    this.classList.remove('show-tooltip');
                }, 2000);
            }
        });
    });
}

/* =========================================
   4. EDUCATION SCROLL CARDS WITH TYPEWRITER
   ========================================= */

// Education data
const educationData = [
    {
        title: "Secondary School (10th)",
        date: "Mar 2017 – May 2018",
        desc: "Samrat International School, Surat. Subjects: Science, Mathematics, Social Studies, English, Computer Science"
    },
    {
        title: "Higher Secondary (12th)",
        date: "Mar 2019 – Jun 2020",
        desc: "Podar International School, Surat. Stream: PCM (Physics, Chemistry, Mathematics) – Science Stream"
    },
    {
        title: "Bachelor's in CSE",
        date: "Oct 2022 – Present",
        desc: "ITM (SLS) Vadodara University. Pursuing Bachelor's in Computer Science Engineering with focus on Web Development & ML"
    }
];

// Card animation logic
let currentCardIndex = -1;
let animationId = 0; // Track current animation session
const cards = document.querySelectorAll('.education-card');
const checkpoints = document.querySelectorAll('.checkpoint-circle');

// Simple non-blocking typewriter
function startTypewriter(element, text, speed = 50, sessionId) {
    element.textContent = '';
    element.classList.add('typing');

    let charIndex = 0;

    function type() {
        // Stop if a new animation session has started
        if (sessionId !== animationId) {
            element.classList.remove('typing');
            return;
        }

        if (charIndex < text.length) {
            element.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing');
        }
    }

    type();
}

function showCard(index) {
    if (index === currentCardIndex || index < 0 || index >= cards.length) return;

    // Increment animation ID to cancel any running typewriters
    animationId++;
    const currentSession = animationId;

    // Hide previous card
    if (currentCardIndex >= 0 && currentCardIndex < cards.length) {
        const prevCard = cards[currentCardIndex];
        prevCard.classList.remove('active');
        prevCard.classList.add('fade-out');

        // Clear previous card text
        prevCard.querySelector('.card-title').textContent = '';
        prevCard.querySelector('.card-date').textContent = '';
        prevCard.querySelector('.card-desc').textContent = '';
        prevCard.querySelector('.card-title').classList.remove('typing');
        prevCard.querySelector('.card-date').classList.remove('typing');
        prevCard.querySelector('.card-desc').classList.remove('typing');

        // Deactivate previous checkpoint
        if (checkpoints[currentCardIndex]) {
            checkpoints[currentCardIndex].classList.remove('active');
        }
    }

    currentCardIndex = index;
    const card = cards[index];
    const data = educationData[index];

    // Remove fade-out from target card
    card.classList.remove('fade-out');

    // Activate checkpoint circle
    if (checkpoints[index]) {
        checkpoints[index].classList.add('active');
    }

    // Show card
    card.classList.add('active');

    // Get elements
    const titleEl = card.querySelector('.card-title');
    const dateEl = card.querySelector('.card-date');
    const descEl = card.querySelector('.card-desc');

    // Clear existing text first
    titleEl.textContent = '';
    dateEl.textContent = '';
    descEl.textContent = '';

    // Start typewriter animations with delays
    setTimeout(() => {
        if (currentSession === animationId) {
            startTypewriter(titleEl, data.title, 35, currentSession);
        }
    }, 100);

    setTimeout(() => {
        if (currentSession === animationId) {
            startTypewriter(dateEl, data.date, 25, currentSession);
        }
    }, 600);

    setTimeout(() => {
        if (currentSession === animationId) {
            startTypewriter(descEl, data.desc, 12, currentSession);
        }
    }, 1000);
}

// Scroll-based card trigger
const educationSection = document.querySelector('.education-section');
const scrollLine = document.querySelector('.scroll-line');
const scrollBall = document.querySelector('.scroll-ball');
const scrollLineFill = document.querySelector('.scroll-line-fill');

// Track last scroll direction and progress
let lastProgress = 0;

ScrollTrigger.create({
    trigger: ".education-section",
    start: "top center",
    end: "bottom center",
    scrub: 1,
    onUpdate: (self) => {
        const progress = self.progress * 100;
        const scrollDirection = progress > lastProgress ? 'down' : 'up';
        lastProgress = progress;

        // Remove hidden class when in section
        educationSection.classList.remove('section-hidden');

        // Move the scroll ball - position it along the scroll line
        if (scrollBall) {
            scrollBall.style.top = progress + '%';
        }

        // Animate the fill effect
        if (scrollLineFill) {
            scrollLineFill.style.height = progress + '%';
        }

        // Update checkpoint states based on ball position
        checkpoints.forEach((checkpoint, index) => {
            const checkpointPosition = parseFloat(checkpoint.dataset.position);

            // Calculate distance from ball to checkpoint
            const distance = Math.abs(progress - checkpointPosition);

            if (distance < 10) {
                // Ball is near this checkpoint - activate it
                checkpoint.classList.add('active');
                checkpoint.classList.remove('passed');
            } else if (progress > checkpointPosition + 10) {
                // Ball has passed this checkpoint
                checkpoint.classList.add('passed');
                checkpoint.classList.remove('active');
            } else {
                // Ball hasn't reached this checkpoint yet
                checkpoint.classList.remove('active');
                checkpoint.classList.remove('passed');
            }
        });

        // Show cards with adjusted ranges for equal reading time
        // Card 1: 20-50% (30% range)
        if (progress >= 20 && progress < 50) {
            showCard(0);
        }
        // Card 2: 50-75% (25% range)
        else if (progress >= 50 && progress < 75) {
            showCard(1);
        }
        // Card 3: 75-100% (25% range - same as other cards)
        else if (progress >= 75) {
            showCard(2);
        }
        // Before first checkpoint - hide all cards
        else if (progress < 20) {
            hideAllCards();
        }
    },
    onEnter: () => {
        // Reset state when entering section from above
        educationSection.classList.remove('section-hidden');

        // Reset ball and fill to start
        if (scrollBall) {
            scrollBall.style.top = '0%';
        }
        if (scrollLineFill) {
            scrollLineFill.style.height = '0%';
        }
    },
    onLeave: () => {
        // When scrolling past the section completely
        educationSection.classList.add('section-hidden');
        checkpoints.forEach(checkpoint => {
            checkpoint.classList.remove('active');
            checkpoint.classList.remove('passed');
        });
        hideAllCards();
    },
    onEnterBack: () => {
        // When scrolling back into section from bottom
        educationSection.classList.remove('section-hidden');

        // Set ball and fill to end (100%)
        if (scrollBall) {
            scrollBall.style.top = '100%';
        }
        if (scrollLineFill) {
            scrollLineFill.style.height = '100%';
        }
    },
    onLeaveBack: () => {
        // When scrolling back up past the section
        educationSection.classList.add('section-hidden');
        checkpoints.forEach(checkpoint => {
            checkpoint.classList.remove('active');
            checkpoint.classList.remove('passed');
        });
        hideAllCards();

        // Reset ball and fill
        if (scrollBall) {
            scrollBall.style.top = '0%';
        }
        if (scrollLineFill) {
            scrollLineFill.style.height = '0%';
        }
    }
});

// Function to hide all cards
function hideAllCards() {
    // Increment animation ID to cancel any running typewriters
    animationId++;

    cards.forEach(card => {
        card.classList.remove('active');
        card.classList.add('fade-out');
        // Clear text content and typing class
        card.querySelector('.card-title').textContent = '';
        card.querySelector('.card-date').textContent = '';
        card.querySelector('.card-desc').textContent = '';
        card.querySelector('.card-title').classList.remove('typing');
        card.querySelector('.card-date').classList.remove('typing');
        card.querySelector('.card-desc').classList.remove('typing');
    });
    currentCardIndex = -1;
}

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
