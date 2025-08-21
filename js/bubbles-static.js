// Sistema de burbujas estáticas con circle packing real y espacio de 5px
const bubblesSketch = (p) => {
  let bubbles = [];
  let hostGroteskFont;
  
  // Elemento de instrucciones de next-steps
  const nextStepsInstrucciones = document.getElementById('next-steps-instrucciones');
  
  // Palabras ordenadas de mayor a menor longitud/importancia
  const palabras_grandes = [
    "Exhibition", "Travel", "Brands", "Nature", "Art", "Technology"
  ];
  const palabras_medianas = [
    "Literature", "Philosophy", "Brands", "Journalism", "Cultures", "Dreams", "Codes",
    "Architecture", "Data", "Literature", "Science", "Biology"
  ];
  // Tamaños fijos de burbujas (radio)
  const SIZE_GRANDE = 80;
  const SIZE_MEDIANA = 60;
  const SIZE_PEQUENA = 25;
  const SPACING = 5; // Espacio entre burbujas

  // --- Movimiento del canvas con el mouse ---
  let canvasOffsetX = 0;
  let canvasOffsetY = 0;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragging = false;
  const viewSize = 360;
  const canvasSize = 600;
  const maxOffset = canvasSize - viewSize;

  // Para animación suave
  let targetOffsetX = 0;
  let targetOffsetY = 0;
  const smoothFactor = 0.12;

  p.preload = function() {
    hostGroteskFont = p.loadFont('fonts/HostGrotesk-Light.ttf');
  }

  p.setup = function() {
    let canvas = p.createCanvas(canvasSize, canvasSize);
    canvas.parent('next-steps');
    let centerX = canvasSize / 2;
    let centerY = canvasSize / 2;
    let burbujas = [];
    for (let i = 0; i < 6; i++) {
      burbujas.push({size: SIZE_GRANDE, palabra: palabras_grandes[i]});
    }
    for (let i = 0; i < 12; i++) {
      burbujas.push({size: SIZE_MEDIANA, palabra: palabras_medianas[i]});
    }
    for (let i = 0; i < 50; i++) {
      burbujas.push({size: SIZE_PEQUENA, palabra: ""});
    }
    shuffleArray(burbujas);
    let first = burbujas.shift();
    bubbles.push(new StaticBubble(centerX, centerY, first.size, first.palabra));
    for (let b of burbujas) {
      let pos = findValidPosition(b.size);
      if (pos) {
        bubbles.push(new StaticBubble(pos.x, pos.y, b.size, b.palabra));
      }
    }
    // Movimiento canvas: listeners
    const frame = document.querySelector('.isotype-frame.next-steps');
    frame.addEventListener('mousedown', function(e) {
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      canvasOffsetX = targetOffsetX;
      canvasOffsetY = targetOffsetY;
      // Ocultar instrucciones cuando se inicia el arrastre
      if (nextStepsInstrucciones) {
        nextStepsInstrucciones.classList.add('oculto');
      }
    });
    window.addEventListener('mousemove', function(e) {
      if (dragging) {
        let dx = e.clientX - dragStartX;
        let dy = e.clientY - dragStartY;
        setCanvasPosition(canvasOffsetX + dx, canvasOffsetY + dy);
      }
    });
    window.addEventListener('mouseup', function() {
      dragging = false;
    });

    // Soporte táctil para móviles
    frame.addEventListener('touchstart', function(e) {
      if (e.touches.length === 1) {
        dragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        canvasOffsetX = targetOffsetX;
        canvasOffsetY = targetOffsetY;
        if (nextStepsInstrucciones) {
          nextStepsInstrucciones.classList.add('oculto');
        }
      }
    }, { passive: false });

    window.addEventListener('touchmove', function(e) {
      if (dragging && e.touches.length === 1) {
        let dx = e.touches[0].clientX - dragStartX;
        let dy = e.touches[0].clientY - dragStartY;
        setCanvasPosition(canvasOffsetX + dx, canvasOffsetY + dy);
      }
    }, { passive: false });

    window.addEventListener('touchend', function() {
      dragging = false;
    });
    animateCanvasMove();
  }

  // Busca una posición válida tangente a dos burbujas existentes
  function findValidPosition(radio) {
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        let b1 = bubbles[i];
        let b2 = bubbles[j];
        let candidates = getTangents(b1, b2, radio);
        for (let c of candidates) {
          if (isValidPosition(c.x, c.y, radio)) {
            return c;
          }
        }
      }
    }
    let b0 = bubbles[0];
    for (let a = 0; a < 360; a += 10) {
      let angle = p.radians(a);
      let x = b0.x + p.cos(angle) * (b0.size + radio + SPACING);
      let y = b0.y + p.sin(angle) * (b0.size + radio + SPACING);
      if (isValidPosition(x, y, radio)) {
        return {x, y};
      }
    }
    return null;
  }

  // Calcula los dos posibles puntos tangentes a dos burbujas
  function getTangents(b1, b2, r) {
    let d = p.dist(b1.x, b1.y, b2.x, b2.y);
    let R1 = b1.size + r + SPACING;
    let R2 = b2.size + r + SPACING;
    if (d > R1 + R2 || d < Math.abs(R1 - R2)) return [];
    let a = (R1*R1 - R2*R2 + d*d) / (2*d);
    let h = Math.sqrt(Math.max(0, R1*R1 - a*a));
    let xm = b1.x + a * (b2.x - b1.x) / d;
    let ym = b1.y + a * (b2.y - b1.y) / d;
    let rx = -(b2.y - b1.y) * (h / d);
    let ry =  (b2.x - b1.x) * (h / d);
    return [
      {x: xm + rx, y: ym + ry},
      {x: xm - rx, y: ym - ry}
    ];
  }

  // Comprueba que la nueva burbuja no se pisa con ninguna existente
  function isValidPosition(x, y, r) {
    for (let b of bubbles) {
      let minDist = b.size + r + SPACING;
      if (p.dist(x, y, b.x, b.y) < minDist - 0.5) return false;
    }
    // Además, que esté dentro del canvas
    if (x - r < 0 || x + r > canvasSize || y - r < 0 || y + r > canvasSize) return false;
    return true;
  }

  // Fisher-Yates shuffle
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  p.draw = function() {
    p.background(0, 0, 0, 0); // Fondo transparente
    for (let bubble of bubbles) {
      bubble.display();
    }
  }

  class StaticBubble {
    constructor(x, y, size, palabra) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.palabra = palabra;
    }

    display() {
      p.push();
      p.stroke(0, 0, 0, 255);
      p.strokeWeight(1);
      p.fill(p.color('#DDD576'));
      p.ellipse(this.x, this.y, this.size * 2);
      if (this.palabra !== "") {
        p.fill(0, 0, 0, 255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(this.size * 0.32);
        p.text(this.palabra, this.x, this.y);
      }
      p.pop();
    }
  }

  function setCanvasPosition(x, y) {
    // Limita el desplazamiento para no mostrar fuera del canvas
    targetOffsetX = Math.max(-maxOffset, Math.min(0, x));
    targetOffsetY = Math.max(-maxOffset, Math.min(0, y));
  }

  // Animación suave en cada frame
  function animateCanvasMove() {
    // Interpolación lineal hacia el objetivo
    canvasOffsetX += (targetOffsetX - canvasOffsetX) * smoothFactor;
    canvasOffsetY += (targetOffsetY - canvasOffsetY) * smoothFactor;
    let c = document.querySelector('#next-steps canvas');
    if (c) {
      c.style.left = Math.round(canvasOffsetX) + 'px';
      c.style.top = Math.round(canvasOffsetY) + 'px';
    }
    requestAnimationFrame(animateCanvasMove);
  }
  animateCanvasMove();
}

new p5(bubblesSketch);