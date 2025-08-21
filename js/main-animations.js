// Animación Lottie controlada por hover, simple: display:none al salir
let lottieInstance = null;
const lottieContainer = document.getElementById('lottie-container');

// Variables para controlar la velocidad de la animación
let isMouseDown = false;
let mouseDownStartTime = 0;
let speedInterval = null;
let currentSpeed = 1;

// Elemento de instrucciones del header
const headerInstrucciones = document.getElementById('header-instrucciones');

function showLottie() {
    lottieContainer.style.display = 'block';
    if (lottieInstance) {
        lottieInstance.play();
    }
    // Ocultar instrucciones cuando se activa la animación
    if (headerInstrucciones) {
        headerInstrucciones.classList.add('oculto');
    }
}

function hideLottie() {
    lottieContainer.style.display = 'none';
    if (lottieInstance) {
        lottieInstance.stop();
    }
    // Resetear velocidad cuando se oculta
    resetSpeed();
    // Mostrar instrucciones cuando se desactiva la animación
    if (headerInstrucciones) {
        headerInstrucciones.classList.remove('oculto');
    }
}

function resetSpeed() {
    isMouseDown = false;
    currentSpeed = 1;
    if (lottieInstance) {
        lottieInstance.setSpeed(currentSpeed);
    }
    if (speedInterval) {
        clearInterval(speedInterval);
        speedInterval = null;
    }
}

function startSpeedAcceleration() {
    isMouseDown = true;
    mouseDownStartTime = Date.now();
    currentSpeed = 1;
    
    // Incrementar velocidad cada 500ms mientras se mantiene presionado
    speedInterval = setInterval(() => {
        if (isMouseDown && lottieInstance) {
            currentSpeed += 0.5; // Incremento de velocidad
            lottieInstance.setSpeed(currentSpeed);
        }
    }, 500);
}

function stopSpeedAcceleration() {
    isMouseDown = false;
    if (speedInterval) {
        clearInterval(speedInterval);
        speedInterval = null;
    }
    // Mantener la velocidad actual hasta que se salga del hover
}

// Mapea cada sección con su isotype correspondiente
const sectionToIsotype = {
  'header': document.querySelector('.isotype-frame.header'),
  'aboutme': document.querySelector('.isotype-frame.aboutme'),
  'final': document.querySelector('.isotype-frame.next-steps')
};

const sectionElements = {
  'header': document.querySelector('header'),
  'aboutme': document.querySelector('.about-me'),
  'final': document.querySelector('.final')
};

const observerOptions = {
  threshold: 0.1 // Puedes ajustar el umbral según el efecto deseado
};

Object.entries(sectionElements).forEach(([key, section]) => {
  const isotype = sectionToIsotype[key];
  if (!isotype) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Oculta todos los isotypes
        Object.values(sectionToIsotype).forEach(i => i.classList.remove('visible'));
        // Muestra solo el correspondiente
        isotype.classList.add('visible');
      }
    });
  }, observerOptions);
  observer.observe(section);
}); 

// === ANIMACIÓN GSAP PARA H1 PALABRA POR PALABRA ===
// Registrar plugin solo una vez
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

function splitTextToSpans(element) {
    const words = element.textContent.trim().split(/\s+/);
    element.innerHTML = words.map(word => `<span class=\"h1-word\">${word}</span>`).join(' ');
}

function animateH1s() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(animateH1s, 100);
        return;
    }
    // No registrar plugin aquí
    gsap.utils.toArray('h1, .experimento-title, .destacado').forEach(el => {
        splitTextToSpans(el);
        const words = el.querySelectorAll('span');
        gsap.set(words, { y: 40, opacity: 0 });
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none none',
            }
        });
        tl.to(words, {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.08
        });
    });
}

  function animateGalleryAndVideos() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
          setTimeout(animateGalleryAndVideos, 100);
          return;
      }
  
      // Animación para los items de la galería, excluyendo botones
      gsap.utils.toArray('.experimento-gallery > .item:not(button)').forEach((item, i) => {
          gsap.fromTo(item,
              { scale: 0.9, opacity: 0, y: 40 },
              {
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  duration: 1.1,
                  ease: 'expo.out',
                  scrollTrigger: {
                      trigger: item,
                      start: 'top 80%',
                      toggleActions: 'play none none none',
                  },
                  delay: i * 0.08 // stagger manual
              }
          );
      });

      // Animación para los botones de la galería (solo opacidad)
      gsap.utils.toArray('button').forEach((btn, i) => {
        gsap.fromTo(btn,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 2,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: btn,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },
                delay: i * 0.08
            }
        );
      });

    // Animación para los main-video
    gsap.utils.toArray('.main-video').forEach(video => {
        gsap.fromTo(video,
            { scale: 0.9, opacity: 0,},
            {
                scale: 1,
                opacity: 1,
                duration: 1.1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: video,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });
}

//Animación de los números en los experimentos
function animateScrambleNumbers() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof ScrambleTextPlugin === 'undefined') {
        setTimeout(animateScrambleNumbers, 100);
        return;
    }
    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
    gsap.utils.toArray('.scramble-text').forEach(numEl => {
        const finalText = numEl.textContent;
        // Animación al aparecer con scroll
        gsap.fromTo(numEl,
            { scrambleText: { text: '', chars: '0123456789', revealDelay: 0.2 }, opacity: 0 },
            {
                scrambleText: {
                    text: finalText,
                    chars: '0123456789',
                    speed: 0.5,
                    revealDelay: 0.2
                },
                opacity: 1,
                duration: 1.5,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: numEl,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                }
            }
        );
        // Animación al pasar el mouse
        numEl.addEventListener('mouseenter', () => {
            gsap.to(numEl, {
                scrambleText: {
                    text: finalText,
                    chars: '0123456789',
                    speed: 0.5,
                    revealDelay: 0.2
                },
                duration: 1.2,
                ease: 'expo.out'
            });
        });
    });
}

//Animación de las líneas horizontales
function animateLineSeparators() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(animateLineSeparators, 100);
        return;
    }
    // Animar todas las líneas horizontales
    gsap.utils.toArray('.line-separator, .line-separator-footer').forEach(line => {
        gsap.set(line, { scaleX: 0, transformOrigin: 'center' });
        gsap.to(line, {
            scaleX: 1,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: line,
                start: 'bottom 100%',
                toggleActions: 'play none none none',
            }
        });
    });
}

function initSmoothScroll() {
    if (typeof ScrollSmoother === 'undefined' || typeof gsap === 'undefined') {
        setTimeout(initSmoothScroll, 100);
        return;
    }
    ScrollSmoother.create({
        smooth: 1.2, // velocidad de suavizado
        effects: true
    });
}

document.addEventListener('DOMContentLoaded', function() {
    lottieInstance = lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/noise_disorder.json'
    });

    // Inicialmente oculto
    lottieContainer.style.display = 'none';

    // Hover sobre el marco
    const hoverZone = lottieContainer.parentElement;
    hoverZone.addEventListener('mouseenter', showLottie);
    hoverZone.addEventListener('mouseleave', hideLottie);
    
    // Eventos de mouse para controlar la velocidad
    hoverZone.addEventListener('mousedown', startSpeedAcceleration);
    hoverZone.addEventListener('mouseup', stopSpeedAcceleration);
    hoverZone.addEventListener('mouseleave', stopSpeedAcceleration);

    // Soporte táctil para acelerar la animación Lottie en móviles
    hoverZone.addEventListener('touchstart', function(e) {
      if (window.innerWidth < 768) {
        startSpeedAcceleration();
      }
    }, { passive: false });

    hoverZone.addEventListener('touchend', function(e) {
      if (window.innerWidth < 768) {
        stopSpeedAcceleration();
      }
    }, { passive: false });

    // Bloquear scroll al interactuar con isotype-frame aboutme en móviles
    const isotypeAboutme = document.querySelector('.isotype-frame.aboutme');
    if (isotypeAboutme) {
      isotypeAboutme.addEventListener('touchstart', function(e) {
        if (window.innerWidth < 768) {
          document.body.style.overflow = 'hidden';
        }
      }, { passive: false });
      isotypeAboutme.addEventListener('touchend', function(e) {
        if (window.innerWidth < 768) {
          document.body.style.overflow = '';
        }
      }, { passive: false });
    }

    // CONTACTO FLOTANTE (mover aquí para asegurar que los elementos existen)
    const contactFloat = document.getElementById('contact-float');
    const contactFloatClose = document.querySelector('.contact-float-close');
    const contactMenuLink = document.querySelector('a[href="#contacto"]');

    if (contactMenuLink && contactFloat && contactFloatClose) {
      contactMenuLink.addEventListener('click', function(e) {
        e.preventDefault();
        contactFloat.classList.remove('hidden');
        setTimeout(() => {
          contactFloat.classList.add('show');
        }, 10);
      });
      contactFloatClose.addEventListener('click', function() {
        contactFloat.classList.remove('show');
        setTimeout(() => {
          contactFloat.classList.add('hidden');
        }, 400);
      });
    }
    // Mostrar el contacto flotante al pulsar el botón .contact-button
    const contactButton = document.querySelector('.contact-button');
    if (contactButton && contactFloat && contactFloatClose) {
      contactButton.addEventListener('click', function(e) {
        e.preventDefault();
        contactFloat.classList.remove('hidden');
        setTimeout(() => {
          contactFloat.classList.add('show');
        }, 10);
      });
    }
    
    // Navegar a proyectos al pulsar el botón .about-me-button
    const aboutMeButton = document.querySelector('.about-me-button');
    if (aboutMeButton) {
      aboutMeButton.addEventListener('click', function() {
        window.location.href = 'proyectos.html';
      });
    }
    
    // FIN CONTACTO FLOTANTE

    animateH1s(); // Llamar a la función de animación de h1
    animateGalleryAndVideos(); // Llamar a la animación de galería y videos
    animateScrambleNumbers(); // Llamar a la animación de scramble text en los números
    animateLineSeparators(); // Llamar a la animación de las líneas

}); 
