document.addEventListener('DOMContentLoaded', () => {
    // --- Slide Navigation State ---
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    const progressBar = document.getElementById('progressBar');
    const slideIndicator = document.getElementById('slideIndicator');
    const slideSelector = document.getElementById('slideSelector');
    
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnFullscreen = document.getElementById('btnFullscreen');
    const btnAutoplay = document.getElementById('btnAutoplay');
    const btnHelp = document.getElementById('btnHelp');
    
    const helpModal = document.getElementById('helpModal');
    const btnCloseHelp = document.getElementById('btnCloseHelp');
    
    let autoplayInterval = null;
    let isAutoplayActive = false;
    const autoplayDuration = 6000; // 6 seconds per slide

    // Touch Swipe Navigation
    let touchStartX = 0;
    let touchEndX = 0;

    // --- Initialize Presentation ---
    function init() {
        // Read hash if exists (e.g. #slide-3 -> slide 2 index)
        const hash = window.location.hash;
        if (hash && hash.startsWith('#slide-')) {
            const index = parseInt(hash.replace('#slide-', '')) - 1;
            if (index >= 0 && index < totalSlides) {
                currentSlide = index;
            }
        }
        updateSlides();
    }

    function updateSlides() {
        slides.forEach((slide, idx) => {
            slide.classList.remove('active', 'prev', 'next');
            if (idx === currentSlide) {
                slide.classList.add('active');
            } else if (idx < currentSlide) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });

        // Update progress bar
        const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Update indicators
        slideIndicator.textContent = `${currentSlide + 1} / ${totalSlides}`;
        slideSelector.value = currentSlide;

        // Set hash without scrolling
        history.replaceState(null, null, `#slide-${currentSlide + 1}`);

        // Trigger slide-specific animations/resets
        handleSlideActivation(currentSlide);
    }

    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlide = index;
            updateSlides();
        }
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlides();
        } else if (isAutoplayActive) {
            // Loop back to start if autoplaying
            currentSlide = 0;
            updateSlides();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlides();
        }
    }

    // --- Slide Activation Triggers ---
    function handleSlideActivation(index) {
        // Slide 8: Reset simulation if active
        if (index !== 7) {
            resetWorkflowSimulation();
        }
        // Slide 10: Reset timeline if active
        if (index !== 9) {
            resetExecutionTimeline();
        }
    }

    // --- Controls and Event Listeners ---
    btnPrev.addEventListener('click', prevSlide);
    btnNext.addEventListener('click', nextSlide);

    slideSelector.addEventListener('change', (e) => {
        goToSlide(parseInt(e.target.value));
    });

    // Fullscreen toggle
    btnFullscreen.addEventListener('click', toggleFullscreen);

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error entering fullscreen: ${err.message}`);
            });
            btnFullscreen.innerHTML = '<i class="fa-solid fa-compress"></i>';
        } else {
            document.exitFullscreen();
            btnFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
    }

    // Update icon when exiting fullscreen via Esc
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            btnFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
    });

    // Autoplay toggle
    btnAutoplay.addEventListener('click', toggleAutoplay);

    function toggleAutoplay() {
        if (!isAutoplayActive) {
            isAutoplayActive = true;
            btnAutoplay.innerHTML = '<i class="fa-solid fa-pause"></i>';
            btnAutoplay.style.color = 'var(--color-green)';
            autoplayInterval = setInterval(nextSlide, autoplayDuration);
        } else {
            isAutoplayActive = false;
            btnAutoplay.innerHTML = '<i class="fa-solid fa-play"></i>';
            btnAutoplay.style.color = 'var(--text-secondary)';
            clearInterval(autoplayInterval);
        }
    }

    // Help Modal
    btnHelp.addEventListener('click', () => {
        helpModal.classList.add('active');
    });

    btnCloseHelp.addEventListener('click', () => {
        helpModal.classList.remove('active');
    });

    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.remove('active');
        }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // If modal is open, Escape closes it
        if (e.key === 'Escape' && helpModal.classList.contains('active')) {
            helpModal.classList.remove('active');
            return;
        }

        switch (e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide();
                break;
            case 'f':
            case 'F':
                toggleFullscreen();
                break;
            case 'p':
            case 'P':
                toggleAutoplay();
                break;
            case 'h':
            case 'H':
                helpModal.classList.add('active');
                break;
        }
    });

    // Swipe Support
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const threshold = 50; // min distance for swipe
        if (touchEndX < touchStartX - threshold) {
            nextSlide(); // swipe left -> next
        }
        if (touchEndX > touchStartX + threshold) {
            prevSlide(); // swipe right -> prev
        }
    }


    // ==========================================
    // --- Slide 6: Interactive Architecture ---
    // ==========================================
    const clickableNodes = {
        'node-search': { line: 'line-search', title: 'Product Search Agent', role: 'Recherche sémantique & Comparatif', desc: 'Cet agent interroge directement les bases de données SQL/NoSQL du catalogue et utilise des embeddings pour faire correspondre le langage naturel de la requête avec les caractéristiques techniques des produits.' },
        'node-reco': { line: 'line-reco', title: 'Recommendation Agent', role: 'Personnalisation & Up-selling', desc: 'Il analyse les préférences du client, l\'historique d\'achats et le panier en cours pour suggérer des produits complémentaires ou des alternatives haut de gamme (cross-selling et up-selling).' },
        'node-inventory': { line: 'line-inventory', title: 'Inventory Agent', role: 'Vérification en direct des stocks', desc: 'Cet agent interroge l\'API d\'inventaire en temps réel. Il évite de recommander un produit en rupture et calcule l\'entrepôt le plus proche pour estimer le délai de livraison.' },
        'node-support': { line: 'line-support', title: 'Customer Support Agent', role: 'FAQ & Après-vente', desc: 'Spécialisé dans le dialogue de service, il accède à la base de connaissances (retours, garanties, frais de port) pour apporter des réponses rapides et précises aux interrogations du client.' },
        'node-review': { line: 'line-review', title: 'Review Analysis Agent', role: 'Analyse sémantique des avis', desc: 'Il effectue un résumé sémantique des avis clients. Il extrait les points forts (ex: excellente autonomie) et les points faibles pour guider l\'utilisateur.' }
    };

    const archExplanation = document.querySelector('.architecture-explanation');
    const originalArchHTML = archExplanation.innerHTML;

    Object.keys(clickableNodes).forEach(nodeId => {
        const element = document.getElementById(nodeId);
        if (element) {
            element.addEventListener('click', () => {
                // Remove highlight from all lines
                Object.values(clickableNodes).forEach(info => {
                    const line = document.getElementById(info.line);
                    if (line) line.style.stroke = '#8b5cf6';
                    if (line) line.style.strokeWidth = '2';
                });

                // Highlight current line
                const currentInfo = clickableNodes[nodeId];
                const activeLine = document.getElementById(currentInfo.line);
                if (activeLine) activeLine.style.stroke = 'var(--color-green)';
                if (activeLine) activeLine.style.strokeWidth = '4';

                // Update text content
                archExplanation.innerHTML = `
                    <div style="animation: fadeInUp 0.4s ease forwards">
                        <button class="btn btn-secondary btn-sm mb-2" id="btnBackArch" style="margin-bottom: 1rem;"><i class="fa-solid fa-arrow-left"></i> Retour à l'ensemble</button>
                        <h3 class="text-green"><i class="fa-solid fa-robot"></i> ${currentInfo.title}</h3>
                        <p><strong>Rôle :</strong> ${currentInfo.role}</p>
                        <p>${currentInfo.desc}</p>
                        <div class="tip-box" style="margin-top: 1rem;"><i class="fa-solid fa-circle-info"></i> Cliquez sur un autre agent pour l'analyser.</div>
                    </div>
                `;

                // Add back button listener
                document.getElementById('btnBackArch').addEventListener('click', () => {
                    archExplanation.innerHTML = originalArchHTML;
                    // Reset line colors
                    Object.values(clickableNodes).forEach(info => {
                        const line = document.getElementById(info.line);
                        if (line) line.style.stroke = '#8b5cf6';
                        if (line) line.style.strokeWidth = '2';
                    });
                });
            });
        }
    });


    // ==========================================
    // --- Slide 8: Interactive Workflow ---
    // ==========================================
    const btnStartWorkflow = document.getElementById('btnStartWorkflow');
    const btnNextStep = document.getElementById('btnNextStep');
    const steps = document.querySelectorAll('.workflow-step');
    const actorUser = document.getElementById('actor-user');
    const actorSupervisor = document.getElementById('actor-supervisor');
    const actorAgent = document.getElementById('actor-agent');
    const activeAgentLabel = document.getElementById('active-agent-label');
    
    const flowUserSupervisor = document.getElementById('flow-user-supervisor');
    const flowSupervisorAgent = document.getElementById('flow-supervisor-agent');

    let workflowStep = 0;
    const workflowStepsInfo = [
        { actor: 'user', line: null, label: 'Agent Spécialiste' },
        { actor: 'supervisor', line: flowUserSupervisor, label: 'Agent Spécialiste' },
        { actor: 'agent', line: flowSupervisorAgent, label: 'Product Search Agent' },
        { actor: 'agent', line: flowSupervisorAgent, label: 'Review Analysis Agent' },
        { actor: 'supervisor', line: flowSupervisorAgent, label: 'Réponse Agrégée' }
    ];

    btnStartWorkflow.addEventListener('click', () => {
        workflowStep = 0;
        btnStartWorkflow.disabled = true;
        btnNextStep.disabled = false;
        runWorkflowStep(0);
    });

    btnNextStep.addEventListener('click', () => {
        if (workflowStep < workflowStepsInfo.length - 1) {
            workflowStep++;
            runWorkflowStep(workflowStep);
        } else {
            // End of simulation
            resetWorkflowSimulation();
        }
    });

    function runWorkflowStep(stepIndex) {
        // Clear all active classes
        steps.forEach(s => s.classList.remove('active-step'));
        actorUser.classList.remove('active-actor');
        actorSupervisor.classList.remove('active-actor');
        actorAgent.classList.remove('active-actor');
        
        flowUserSupervisor.classList.remove('active-line');
        flowSupervisorAgent.classList.remove('active-line');

        // Highlight step in list
        steps[stepIndex].classList.add('active-step');

        const stepInfo = workflowStepsInfo[stepIndex];
        activeAgentLabel.textContent = stepInfo.label;

        // Highlight actors and connection lines
        if (stepInfo.actor === 'user') {
            actorUser.classList.add('active-actor');
        } else if (stepInfo.actor === 'supervisor') {
            actorSupervisor.classList.add('active-actor');
            if (stepInfo.line) stepInfo.line.classList.add('active-line');
        } else if (stepInfo.actor === 'agent') {
            actorAgent.classList.add('active-actor');
            if (stepInfo.line) stepInfo.line.classList.add('active-line');
        }

        if (stepIndex === workflowStepsInfo.length - 1) {
            btnNextStep.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Recommencer';
        } else {
            btnNextStep.innerHTML = '<i class="fa-solid fa-forward"></i> Étape suivante';
        }
    }

    function resetWorkflowSimulation() {
        workflowStep = 0;
        btnStartWorkflow.disabled = false;
        btnNextStep.disabled = true;
        btnNextStep.innerHTML = '<i class="fa-solid fa-forward"></i> Étape suivante';
        
        steps.forEach((s, idx) => {
            s.classList.remove('active-step');
            if (idx === 0) s.classList.add('active-step');
        });

        actorUser.classList.add('active-actor');
        actorSupervisor.classList.remove('active-actor');
        actorAgent.classList.remove('active-actor');
        activeAgentLabel.textContent = 'Agent Spécialiste';
        
        flowUserSupervisor.classList.remove('active-line');
        flowSupervisorAgent.classList.remove('active-line');
    }


    // ==========================================
    // --- Slide 10: Step-by-Step Scenario ---
    // ==========================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    const btnNextExecStep = document.getElementById('btnNextExecStep');
    const btnResetExecStep = document.getElementById('btnResetExecStep');
    let timelineStep = 0; // Starts with step 1 visible

    btnNextExecStep.addEventListener('click', () => {
        if (timelineStep < timelineItems.length - 1) {
            timelineStep++;
            timelineItems[timelineStep].classList.add('active-item');
            // Scroll element into view inside container if overflow
            timelineItems[timelineStep].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        if (timelineStep === timelineItems.length - 1) {
            btnNextExecStep.disabled = true;
        }
    });

    btnResetExecStep.addEventListener('click', resetExecutionTimeline);

    function resetExecutionTimeline() {
        timelineStep = 0;
        timelineItems.forEach((item, index) => {
            if (index === 0) {
                item.classList.add('active-item');
            } else {
                item.classList.remove('active-item');
            }
        });
        btnNextExecStep.disabled = false;
    }


    // --- Run Initialization ---
    init();
});
