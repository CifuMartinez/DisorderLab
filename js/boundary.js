class Boundary {
  constructor(p, x, y, w, h) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  display() {
    this.p.push();
    this.p.noStroke();
    this.p.fill(0, 0, 0, 0);
    this.p.rectMode(this.p.CENTER);
    this.p.rect(this.x, this.y, this.w, this.h);
    this.p.pop();
  }
}
