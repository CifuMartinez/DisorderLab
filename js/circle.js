class Circle {
  constructor(p, x, y, r, engine, colorPalette) {
    this.p = p;
    this.r = r;
    this.c = p.color(p.random(colorPalette));
    this.done = false;
    this.body = Matter.Bodies.circle(x, y, this.r);
    let magnitude = 5;
    let velocity = Matter.Vector.create(p.random(-magnitude, magnitude), p.random(-magnitude, magnitude));
    Matter.Body.setVelocity(this.body, velocity);
    Matter.Composite.add(engine.world, this.body);
  }
  
  checkEdges(width, height) {
    let x = this.body.position.x;
    let y = this.body.position.y;
    if (x + this.r < 0 || x - this.r > width ||
      y + this.r < 0 || y - this.r > height) {
      this.done = true;
    } else {
      this.done = false;
    }
  }
  
  removeCircle(engine) {
    Matter.Composite.remove(engine.world, this.body);
  }
  
  display() {
    this.p.fill(this.c);
    this.p.ellipse(this.body.position.x, this.body.position.y, this.r * 2, this.r * 2);
  }
}