// ------ vars ------ //
let canvas, network;

// ------- setup ------- //
function setup() {
   canvas = createCanvas(1000, 700);
   background(0);
   network = new Network();
}

// ------- draw ------- //
function draw() {
   network.draw();
}

// ------- mouse click ------- //
function mouseClicked() {
   if (mouseOnCanvas()) {
      network.createVertex(mouseX, mouseY);
   }
   if (!mouseOnCanvas()) {

   }
}

// ------- network ------- // 
class Network {
   constructor() {
      this.vertices = [];
      this.edges = [];
      this.running = false;
      this.maxVertices = 20;
      this.minDist = 15;
   }

   // draws the network 
   draw(){
      this.vertices.forEach(vertex => vertex.show());
      // this.edges.forEach(edge => edge.show());
   } 

   // creates a new vertex 
   createVertex(x, y) {
      if (!this.running && this.vertices.length < this.maxVertices) {
         if (this.checkCollisions(x, y)) {
            let vertex = new Vertex(x, y);
            this.createEdges(vertex);
            this.vertices.push(vertex);
         }
      }
   }

   // creates new edges for a vertex
   createEdges(newVertex) {
      this.vertices.forEach(vertex => {
         this.addEdge(new Edge(newVertex, vertex));
      });
   }

   // adds the edge to the proper place in the array
   addEdge(edge) {
      let l = this.edges.length;

      if (l < 1) {
         this.edges.push(edge);
         return;
      }
      else if (edge.distance > this.edges[l - 1].distance){
         this.edges.push(edge);
         return;
      }
      else {
         for (let i = 0; i < l; i++) {
            if (edge.distance < this.edges[i].distance) {
               this.edges.splice(i, 0, edge);
               return;
            }
         }
      }
      console.error("the end of this function should never be reached");
   }

   // returns false if a given coordiante is too close to any vertices
   checkCollisions(x, y) {
      for (let vertex of this.vertices) {
         if (dist(x, y, vertex.x, vertex.y) < this.minDist) {
            return false;
         }
      }
      return true;
   }
}

// ------- vertex ------- //
class Vertex {
   constructor(x, y) {
      this.x = x;
      this.y = y;
      this.edges = [];
      this.radius = 5;
      this.color = color(24, 209, 17);
   }

   show() {
      fill(this.color);
      circle(this.x, this.y, this.radius * 2);
   }
}

// ------- edge ------- //
class Edge {
   constructor(v1, v2) {
      this.v1 = v1;
      this.v2 = v2;
      this.distance = dist(this.v1.x, this.v1.y, this.v2.x, this.v2.y);
      this.color = color(24, 209, 17);
   }

   show(){
      stroke(this.color);
      line(this.v1.x, this.v1.y, this.v2.x, this.v2.y);
   }
}


// ------- helper functions ------- //
// return true if the mouse is within the bounds of the canvas
function mouseOnCanvas() {
   return (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0);
}

function sortedAdd(num, array) {
   let newArray = array.splice(0);
   let l = newArray.length;

   if (l < 1) {
      newArray.push(num);
      return newArray;
   }
   else {
      for (let i = 0; i < l; i++) {
         if (num < newArray[i]) {
            newArray.splice(i, 0, num);
            return newArray;
         }
      }
      newArray.push(num);
      return newArray;
   }
}