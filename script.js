// script.js

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize Lenis for Ultra-Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smooth: true,
        smoothTouch: false, 
    });

    // Disable scrolling during loader
    lenis.stop();

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Register GSAP Plugin
    gsap.registerPlugin(ScrollTrigger);

    // 2. Cinematic Loader Animation
    const loaderTl = gsap.timeline({
        onComplete: () => {
            document.querySelector('.loader').style.display = 'none';
            lenis.start(); // Enable scroll after loader
        }
    });

    loaderTl.from(".loader-text", {
        opacity: 0,
        y: 10,
        letterSpacing: "0.5em",
        duration: 1.5,
        ease: "expo.out"
    })
    .to(".loader-text", {
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: "power2.inOut"
    })
    .to(".loader", {
        opacity: 0,
        duration: 1.2,
        ease: "power3.inOut"
    }, "-=0.4");


    // 3. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    hamburger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if(isMenuOpen) {
            mobileMenu.classList.add('active');
            gsap.to('.hamburger .line-1', { rotation: 45, y: 3.5, duration: 0.3 });
            gsap.to('.hamburger .line-2', { rotation: -45, y: -3.5, duration: 0.3 });
            lenis.stop(); 
        } else {
            closeMenu();
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    function closeMenu() {
        if(!isMenuOpen) return;
        isMenuOpen = false;
        mobileMenu.classList.remove('active');
        gsap.to('.hamburger .line-1', { rotation: 0, y: 0, duration: 0.3 });
        gsap.to('.hamburger .line-2', { rotation: 0, y: 0, duration: 0.3 });
        lenis.start();
    }

    // 4. Setup GSAP matchMedia for responsive animations
    let mm = gsap.matchMedia();

    mm.add({
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)"
    }, (context) => {
        let { isDesktop, isMobile } = context.conditions;

        // Hero Load Animation (Wait for Loader: 1.5 + 0.8 + 1.2 = ~3.1s delay)
        const heroTl = gsap.timeline({ delay: 3.1 });

        heroTl.from(".nav-item", {
            y: -20, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out"
        }, "start");

        heroTl.from(".hero-word", {
            y: "115%", duration: 1.8, ease: "expo.out", stagger: 0.1
        }, "start+=0.2");

        heroTl.from([".hero-subtext", ".scroll-indicator"], {
            opacity: 0, y: 20, duration: 1.5, ease: "power3.out", stagger: 0.2
        }, "start+=0.8");
        
        heroTl.from(".hero-cta", {
            opacity: 0, y: 20, duration: 1.5, ease: "power3.out"
        }, "start+=1.0");

        heroTl.from(".hero-image-container", {
            clipPath: isMobile ? "inset(5% 5% 5% 5%)" : "inset(15% 15% 15% 15%)",
            opacity: 0, duration: 2, ease: "expo.inOut"
        }, "start+=0.4");

        heroTl.from(".hero-image", {
            scale: 1.3, duration: 2, ease: "expo.inOut"
        }, "start+=0.4");

        heroTl.from(".now-playing-card", {
            opacity: 0, y: isMobile ? 20 : 0, x: isMobile ? 0 : -40, duration: 1.5, ease: "power4.out"
        }, "start+=1.4");

        heroTl.from(".floating-wa", {
            scale: 0, opacity: 0, duration: 1.5, ease: "back.out(1.5)"
        }, "start+=1.6");

        // Parallax Effect for Hero Image
        gsap.to(".hero-image", {
            yPercent: isMobile ? 10 : 15,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero", start: "top top", end: "bottom top", scrub: true
            }
        });

        // Scroll Reveal Animations 
        const revealElements = document.querySelectorAll(".gs-reveal");
        revealElements.forEach((element) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element, start: "top 88%", toggleActions: "play none none reverse"
                },
                y: isMobile ? 40 : 80,
                opacity: 0,
                duration: 1.5,
                ease: "expo.out"
            });
        });

        // About Image Parallax
        gsap.to(".about-img", {
            yPercent: isMobile ? 10 : 20,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-image-wrapper", start: "top bottom", end: "bottom top", scrub: true
            }
        });

        // Staggered Grids
        gsap.from(".portfolio-item", {
            scrollTrigger: { trigger: ".portfolio-grid", start: "top 85%" },
            y: isMobile ? 40 : 80,
            opacity: 0, duration: 1.5, stagger: isMobile ? 0.1 : 0.2, ease: "expo.out"
        });

        gsap.from(".service-card", {
            scrollTrigger: { trigger: ".services-grid", start: "top 85%" },
            y: isMobile ? 30 : 60,
            opacity: 0, duration: 1.2, stagger: isMobile ? 0.1 : 0.15, ease: "expo.out"
        });
    });
});