// Plumbsmart Plumbers — Script
// Clean interactions: scroll reveal, mobile nav, sticky header, form

document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // Mobile Navigation Toggle
    // ===========================
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const closeNavBtn = document.getElementById('close-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });
    }

    if (closeNavBtn) {
        closeNavBtn.addEventListener('click', closeMobileNav);
    }

    // Close on backdrop click
    if (mobileNav) {
        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) closeMobileNav();
        });
    }

    // ===========================
    // Sticky Header Scroll Effect
    // ===========================
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
        } else {
            header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.09)';
        }
    }, { passive: true });

    // ===========================
    // Smooth Scroll for Anchor Links
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
                const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===========================
    // Scroll Reveal Animation
    // ===========================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ===========================
    // Counter Animation (Stats Bar)
    // ===========================
    const statNumbers = document.querySelectorAll('.stat-number');

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => countObserver.observe(el));

    function animateCounter(el) {
        const text = el.textContent.trim();
        // Extract leading number
        const match = text.match(/^[\d,.]+/);
        if (!match) return;
        const rawNum = parseFloat(match[0].replace(/,/g, ''));
        if (isNaN(rawNum)) return;
        const suffix = text.slice(match[0].length);
        const duration = 1400;
        const steps = 50;
        const stepTime = duration / steps;
        let current = 0;
        const increment = rawNum / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= rawNum) {
                current = rawNum;
                clearInterval(timer);
            }
            let display;
            if (rawNum >= 1000) {
                display = Math.round(current).toLocaleString();
            } else if (rawNum % 1 !== 0) {
                display = current.toFixed(1);
            } else {
                display = Math.round(current).toString();
            }
            el.textContent = display + suffix;
        }, stepTime);
    }

});

// Called from inline onclick in mobile nav links
function closeMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Form submission handler
function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const form = document.getElementById('contact-form');
    
    // Basic validation
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    
    if (!phone || !service) {
        showNotification('Please fill in your phone number and select a service.', 'error');
        return;
    }

    // Simulate sending
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
        form.reset();
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:17px;height:17px"><polyline points="20 6 9 17 4 12"/></svg>
            Request Sent!
        `;
        btn.style.background = '#16a34a';
        btn.style.borderColor = '#16a34a';
        showNotification('Thank you! We\'ll be in touch within minutes.', 'success');

        setTimeout(() => {
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:17px;height:17px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Send Request
            `;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.disabled = false;
        }, 4000);
    }, 1200);
}

function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: ${type === 'success' ? '#16a34a' : '#C0392B'};
        color: #fff;
        padding: 14px 28px;
        border-radius: 6px;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.88rem;
        font-weight: 600;
        box-shadow: 0 8px 28px rgba(0,0,0,0.2);
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 90vw;
        text-align: center;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);

    requestAnimationFrame(() => {
        notif.style.opacity = '1';
        notif.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => notif.remove(), 300);
    }, 4000);
}
