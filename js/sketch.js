const aboutMeSketch = (p) => {
  let balls = [];
  let colorPalette = ["#abcd5e", "#14976b", "#2b67af", "#62b6de", "#f589a3", "#ef562f", "#fc8405", "#f9d531"];

  // Elemento de instrucciones de aboutme
  const aboutmeInstrucciones = document.getElementById('aboutme-instrucciones');

  class Circle {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.c = p.color(p.random(colorPalette));
      this.vx = p.random(-2, 2);
      this.vy = p.random(-2, 2);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Rebote en los bordes
      if (this.x - this.r < 0) {
        this.x = this.r;
        this.vx *= -1;
      }
      if (this.x + this.r > p.width) {
        this.x = p.width - this.r;
        this.vx *= -1;
      }
      if (this.y - this.r < 0) {
        this.y = this.r;
        this.vy *= -1;
      }
      if (this.y + this.r > p.height) {
        this.y = p.height - this.r;
        this.vy *= -1;
      }
    }
    display() {
      p.fill(this.c);
      p.noStroke();
      p.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }
  }

  p.setup = function() {
    let canvas = p.createCanvas(420, 420);
    canvas.parent('aboutme-canvas');
  };

  p.draw = function() {
    p.background(221, 213, 118);
    for (let ball of balls) {
      ball.update();
      ball.display();
    }
  };

  p.mouseDragged = function() {
    // Solo crear burbujas si el isotype-frame está visible
    const isotype = document.querySelector('.isotype-frame.aboutme');
    if (isotype && isotype.classList.contains('visible')) {
      balls.push(new Circle(p.mouseX, p.mouseY, p.random(10, 30)));
      // Ocultar instrucciones cuando se crea la primera burbuja
      if (balls.length === 1 && aboutmeInstrucciones) {
        aboutmeInstrucciones.classList.add('oculto');
      }
    }
  };
};

new p5(aboutMeSketch);


