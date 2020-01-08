// ----- vars ----- //
let canvas;
let vertices = [];
let edges = [];

// ----- setup ----- //
function setup() {
   canvas = createCanvas(600, 400);
   canvas.style('border: 1px solid black;');
}

// ----- draw ----- //
function draw() {
  
}

function mousePressed(){
   if(mouseOnCanvas()){
    
   }
}

function mouseOnCanvas(){
   return (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0);
}

class Vertex {
   constructor(x, y){
      this.x = x;
      this.y = y;
      this.edges = [];
   }
}

class Edge{
   constructor(vertices){
      this.vertices = [];
   }
}