document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Mobile Menu Navigation Drawer
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when a navigation item is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ==========================================================================
    // Intersection Observer for Scroll Reveals (Smooth Motion)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Animate once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ==========================================================================
    // Anti-Gravity 3D Hero Parallax Mouse Interaction
    // ==========================================================================
    const heroZone = document.getElementById('hero-interactive-zone');
    const scene = document.querySelector('.hero-3d-scene');
    const layers = document.querySelectorAll('.scene-layer');

    let isMobile = window.matchMedia('(max-width: 768px)').matches;
    window.addEventListener('resize', () => {
        isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile && scene) {
            // Reset transforms if user resized down to mobile
            scene.style.transform = '';
            layers.forEach(layer => {
                layer.style.transform = '';
            });
        }
    });

    if (heroZone && scene && !isMobile) {
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        // Strength of parallax effect
        const tiltStrength = 15; // Max degrees of tilt
        const shiftStrength = 40; // Max pixels of displacement

        heroZone.addEventListener('mousemove', (e) => {
            if (isMobile) return;
            
            const rect = heroZone.getBoundingClientRect();
            
            // Calculate coordinates relative to center of the interactive zone (-1 to 1)
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
            
            targetX = x;
            targetY = y;
        });

        heroZone.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
        });

        // Smooth interpolation function (LERP) for high-performance shifting
        function updateParallax() {
            if (isMobile) {
                requestAnimationFrame(updateParallax);
                return;
            }

            mouseX += (targetX - mouseX) * 0.1;
            mouseY += (targetY - mouseY) * 0.1;

            // Tilt the outer container slightly
            const rotateY = mouseX * tiltStrength;
            const rotateX = -mouseY * tiltStrength;
            scene.style.transform = `rotateX(${rotateX + 8}deg) rotateY(${rotateY - 8}deg)`;

            // Shift layers relative to depth attributes
            layers.forEach(layer => {
                const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
                
                // Outer translation offsets based on coordinates and layer depth
                const transX = mouseX * shiftStrength * depth;
                const transY = mouseY * shiftStrength * depth;

                // Grab original styles/rotations preset in style.css for each element wrapper
                if (layer.classList.contains('layer-showcase')) {
                    const el = layer.querySelector('.showcase-card-wrapper');
                    el.style.transform = `translateZ(${40 + depth * 30}px) rotateX(-5deg) rotateY(10deg) translate(${transX}px, ${transY}px)`;
                } else if (layer.classList.contains('layer-grid')) {
                    const el = layer.querySelector('.tech-grid');
                    el.style.transform = `translateZ(-100px) translate(${transX * 0.5}px, ${transY * 0.5}px)`;
                } else if (layer.classList.contains('layer-glow-showcase')) {
                    const el = layer.querySelector('.showcase-glow');
                    el.style.transform = `translateZ(-30px) translate(${-20 + transX}px, ${-20 + transY}px)`;
                }
            });

            requestAnimationFrame(updateParallax);
        }

        // Initialize animation frame loop
        requestAnimationFrame(updateParallax);
    }

    // ==========================================================================
    // Partner Cards Glass Glow Tracker
    // ==========================================================================
    const cards = document.querySelectorAll('.partner-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ==========================================================================
    // Multi-Step Interactive Funnel
    // ==========================================================================
    const form = document.getElementById('lead-form');
    const steps = document.querySelectorAll('.funnel-step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const progressBar = document.getElementById('progress-bar');
    
    // Step inputs & triggers
    const propertyBtns = document.querySelectorAll('.property-btn');
    const propertyTypeInput = document.getElementById('property-type-input');
    const billSlider = document.getElementById('bill-slider');
    const billValText = document.getElementById('bill-val');
    
    // Savings calculation display nodes
    const savingsMonthlyText = document.getElementById('savings-monthly');
    const savingsYearlyText = document.getElementById('savings-yearly');
    
    // Navigation buttons
    const nextStepBtns = document.querySelectorAll('.next-step-btn');
    const prevStepBtns = document.querySelectorAll('.prev-step-btn');
    
    // Error spans
    const propertyError = document.getElementById('property-error');

    let currentStep = 1;
    let selectedPropertyType = '';

    // Step 1 - Property Selection Toggle
    propertyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            propertyBtns.forEach(b => b.classList.remove('active'));
            
            // Set active class
            btn.classList.add('active');
            selectedPropertyType = btn.getAttribute('data-value');
            propertyTypeInput.value = selectedPropertyType;
            
            // Hide error and enable Next button
            propertyError.style.display = 'none';
            const step1NextBtn = document.querySelector('#step-1 .next-step-btn');
            if (step1NextBtn) {
                step1NextBtn.removeAttribute('disabled');
            }
        });
    });

    // Step 2 - Savings Calculations (Real-time update)
    function calculateSavings(billValue) {
        // Solar panels typically offset about 85-90% of a homeowner's electricity bill
        const monthlyOffset = 0.85;
        const monthlySavings = Math.round(billValue * monthlyOffset);
        
        // Compound annual utility price inflation rate in California is historically ~4-6%
        // Let's calculate total savings over a 25-year panel lifecycle using compounding rate of 4.5%
        const inflationRate = 0.045;
        const years = 25;
        
        let cumulativeSavings = 0;
        let yearlyBaseSavings = monthlySavings * 12;
        
        for (let i = 0; i < years; i++) {
            cumulativeSavings += yearlyBaseSavings * Math.pow(1 + inflationRate, i);
        }
        
        const lifetimeSavings = Math.round(cumulativeSavings);

        // Update displays with clean numeric strings
        savingsMonthlyText.textContent = `$${monthlySavings.toLocaleString()}`;
        
        // Return lifetime savings in a clean abbreviated format or fully detailed
        savingsYearlyText.textContent = `$${lifetimeSavings.toLocaleString()}`;
        
        return {
            monthly: monthlySavings,
            lifetime: lifetimeSavings
        };
    }

    // Initialize calculations on load
    if (billSlider) {
        calculateSavings(parseInt(billSlider.value));
        
        billSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            billValText.textContent = val;
            calculateSavings(val);
        });
    }

    // Step Navigation Handlers
    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep === 1 && !selectedPropertyType) {
                propertyError.style.display = 'block';
                return;
            }
            goToStep(currentStep + 1);
        });
    });

    prevStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            goToStep(currentStep - 1);
        });
    });

    function goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > 3) return;
        
        const currentStepEl = document.getElementById(`step-${currentStep}`);
        const nextStepEl = document.getElementById(`step-${stepNumber}`);
        
        // Setup transition styles
        if (stepNumber > currentStep) {
            // Sliding forward
            currentStepEl.classList.add('exit-left');
            setTimeout(() => {
                currentStepEl.classList.remove('active', 'exit-left');
                nextStepEl.classList.add('active');
            }, 250);
        } else {
            // Sliding backward
            currentStepEl.classList.remove('active');
            nextStepEl.classList.add('active');
        }

        currentStep = stepNumber;
        updateProgress();
    }

    function updateProgress() {
        const percentages = { 1: '33.3%', 2: '66.6%', 3: '100%' };
        progressBar.style.width = percentages[currentStep];

        // Highlight step labels
        stepIndicators.forEach(ind => {
            const step = parseInt(ind.getAttribute('data-step'));
            if (step <= currentStep) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });
    }

    // ==========================================================================
    // Lead Form Validation & Submit
    // ==========================================================================
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validating inputs
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const phoneInput = document.getElementById('form-phone');
            const addressInput = document.getElementById('form-address');
            const agreementCheckbox = document.getElementById('form-agreement');
            
            let isValid = true;
            
            // Validation helper
            function validateField(inputEl, condition) {
                const group = inputEl.closest('.form-group') || inputEl.closest('.form-checkbox');
                if (!condition) {
                    group.classList.add('invalid');
                    isValid = false;
                } else {
                    group.classList.remove('invalid');
                }
            }

            validateField(nameInput, nameInput.value.trim().length > 0);
            validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()));
            validateField(phoneInput, /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/.test(phoneInput.value.replace(/\s+/g, '')));
            validateField(addressInput, addressInput.value.trim().length > 0);
            validateField(agreementCheckbox, agreementCheckbox.checked);

            if (!isValid) return;

            // Trigger submit animations
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.classList.add('loading');
            submitBtn.setAttribute('disabled', 'true');

            // Simulate server request
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                
                // Hide current active step 3
                const step3El = document.getElementById('step-3');
                step3El.classList.remove('active');
                
                // Update success information
                const successName = document.getElementById('success-username');
                const successAddress = document.getElementById('success-address');
                const successPropType = document.getElementById('success-prop-type');
                const successBillVal = document.getElementById('success-bill');
                const successSavings = document.getElementById('success-savings');
                const successPhone = document.getElementById('success-phone');

                const nameVal = nameInput.value.trim().split(' ')[0]; // First name
                const billValue = parseInt(billSlider.value);
                const computed = calculateSavings(billValue);

                successName.textContent = nameVal;
                successAddress.textContent = addressInput.value.trim();
                successPropType.textContent = selectedPropertyType;
                successBillVal.textContent = `$${billValue}`;
                successSavings.textContent = `$${computed.lifetime.toLocaleString()}+`;
                successPhone.textContent = phoneInput.value.trim();

                // Show success screen
                const successStep = document.getElementById('step-success');
                successStep.classList.add('active');
                
                // Reset step count indicator
                currentStep = 3;
            }, 1500);
        });

        // Real-time error removal when typing
        const fields = ['form-name', 'form-email', 'form-phone', 'form-address'];
        fields.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    const group = input.closest('.form-group');
                    group.classList.remove('invalid');
                });
            }
        });

        const agreement = document.getElementById('form-agreement');
        if (agreement) {
            agreement.addEventListener('change', () => {
                const group = agreement.closest('.form-checkbox');
                group.classList.remove('invalid');
            });
        }

        // Funnel Reset Button
        const resetBtn = document.getElementById('reset-funnel-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Clear inputs
                form.reset();
                selectedPropertyType = '';
                propertyTypeInput.value = '';
                
                // Remove active classes
                propertyBtns.forEach(b => b.classList.remove('active'));
                
                // Disable next button for step 1
                const step1NextBtn = document.querySelector('#step-1 .next-step-btn');
                if (step1NextBtn) {
                    step1NextBtn.setAttribute('disabled', 'true');
                }

                // Reset slider
                billSlider.value = 350;
                billValText.textContent = 350;
                calculateSavings(350);

                // Hide success screen
                const successStep = document.getElementById('step-success');
                successStep.classList.remove('active');
                
                // Go back to step 1
                currentStep = 1;
                const step1El = document.getElementById('step-1');
                step1El.classList.add('active');
                
                updateProgress();

                // Re-enable submit button
                const submitBtn = document.getElementById('submit-btn');
                submitBtn.removeAttribute('disabled');
            });
        }
    }

    // ==========================================================================
    // Dynamic Active Page Navigation Class
    // ==========================================================================
    const currentPath = window.location.pathname;
    const pageFilename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    const navLinks = document.querySelectorAll('.nav-menu .nav-item, .dropdown-item');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === pageFilename || (pageFilename === '' && href === 'index.html')) {
            link.classList.add('active');
            
            // If it's a dropdown item, also highlight the parent toggle
            const parentDropdown = link.closest('.nav-item-dropdown');
            if (parentDropdown) {
                const parentToggle = parentDropdown.querySelector('.dropdown-toggle');
                if (parentToggle) parentToggle.classList.add('active');
            }
        }
    });

    // ==========================================================================
    // Mobile Dropdown Click Toggle
    // ==========================================================================
    const dropdowns = document.querySelectorAll('.nav-item-dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        }
    });

    // ==========================================================================
    // Blog Categories Filter
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-button-styled');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (filterButtons.length > 0 && blogCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active class in buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.getAttribute('data-filter');
                
                // Show/hide cards with animation
                blogCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ==========================================================================
    // Subpage Contact Form Handler
    // ==========================================================================
    const contactForm = document.getElementById('contact-form-styled');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const phoneInput = document.getElementById('contact-phone');
            const addressInput = document.getElementById('contact-address');
            const msgInput = document.getElementById('contact-message');
            
            let isValid = true;
            
            function validateField(inputEl, condition) {
                const group = inputEl.closest('.form-group-spaced');
                if (!condition) {
                    group.classList.add('invalid');
                    isValid = false;
                } else {
                    group.classList.remove('invalid');
                }
            }
            
            if (nameInput) validateField(nameInput, nameInput.value.trim().length > 0);
            if (emailInput) validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()));
            if (phoneInput) validateField(phoneInput, /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/.test(phoneInput.value.replace(/\s+/g, '')));
            if (addressInput) validateField(addressInput, addressInput.value.trim().length > 0);
            if (msgInput) validateField(msgInput, msgInput.value.trim().length > 0);
            
            if (!isValid) return;
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.setAttribute('disabled', 'true');
            submitBtn.innerHTML = 'Sending Message...';
            
            setTimeout(() => {
                submitBtn.innerHTML = 'Message Sent Successfully!';
                submitBtn.style.backgroundColor = '#10b981'; // Green color for success
                submitBtn.style.color = '#ffffff';
                submitBtn.style.borderColor = '#10b981';
                
                // Reset form fields after 2.5 seconds
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.removeAttribute('disabled');
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.style.borderColor = '';
                }, 2500);
            }, 1500);
        });

        // Real-time error removal when typing
        const fields = ['contact-name', 'contact-email', 'contact-phone', 'contact-address', 'contact-message'];
        fields.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    const group = input.closest('.form-group-spaced');
                    if (group) group.classList.remove('invalid');
                });
            }
        });
    }
});

