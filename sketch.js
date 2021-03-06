// ------ elements ------ //
let canvas, canvasWrapper;
let resetBtn, runBtn, randomBtn;

// ------ vars ------ // 
let network;

// ------- setup ------- //
function setup() {
   canvas = createCanvas(0, 0);
   sizeCanvas(canvas);

   canvasWrapper = document.querySelector(".canvas-wrapper");
   canvas.parent(canvasWrapper);

   sizeElem();
   initBtns();

   background(0);
   network = new Network();
}

// ------- init buttons ------- // 
function initBtns() {
   randomBtn = document.querySelector("button:nth-of-type(1)");
   runBtn = document.querySelector("button:nth-of-type(2)");
   resetBtn = document.querySelector("button:nth-of-type(3)");

   randomBtn.addEventListener('click', e => network.randomPoints());
   runBtn.addEventListener('click', e => network.run());
   resetBtn.addEventListener('click', e => network = new Network());
}

// ------- resize ------- // 
function windowResized() {
   sizeCanvas();
   sizeElem();
}

// ------- hr style ------- // 
function sizeElem() {
   document.querySelector("hr").style.width = (windowWidth * 0.7) + "px";
   document.querySelector(".description").style.width = (windowWidth * 0.7) + "px";
}

// ------- canvas size ------- //
function sizeCanvas() {
   let w = windowWidth * 0.7;
   let h = windowHeight * 0.6;
   resizeCanvas(w, h);
   network = new Network();
}

// ------- draw ------- //
function draw() {
   background(0);
   if (network.running == false) {
      network.draw();
   }
   else {
      network.newDraw();
   }
}

// ------- mouse click ------- //
function mouseClicked() {
   if (mouseOnCanvas()) {
      network.createVertex(mouseX, mouseY);
   }
}

// ------- network ------- // 
class Network {
   constructor() {
      this.vertices = [];
      this.edges = [];
      this.minSpanningTree = [];

      this.maxVertices = 40;
      this.minDist = 15;

      this.maxIndex = 0;
      this.counter = 0;
      this.running = false;
   }

   randomPoints() {
      let max = this.maxVertices - this.vertices.length;
      let total = 0;
      let limit = 1000;
      while (total < max && limit > 0) {
         let x = (15 + Math.random() * (width - 30));
         let y = (15 + Math.random() * (height - 30));
         if (this.createVertex(x, y)) {
            total++;
         }
         limit--;
      }
   }

   log() {
      console.log(this.edges);
   }

   // draws the network 
   draw() {
      this.vertices.forEach(vertex => vertex.show());
   }

   newDraw() {
      if (this.counter == 0 && this.maxIndex < this.vertices.length) {
         this.counter = 5;
         this.maxIndex++;
      }
      else {
         this.counter--;
      }

      if (this.maxIndex == this.vertices.length) {
         this.minSpanningTree.forEach(edge => edge.show());
      }
      else if (this.maxIndex < this.vertices.length) {
         for (let i = 0; i < this.maxIndex; i++) {
            this.minSpanningTree[i].show();
         }
      }

      this.vertices.forEach(vertex => vertex.show());
   }

   run() {
      if(this.vertices.length === 0){
         return;
      }

      this.running = true;
      this.sort();
      let totalVertices = this.vertices.length;
      let chosenEdges = [];
      let chosenVertices = [];
      let considerdEdges = [];
      let origin = this.vertices[0];

      chosenVertices.push(origin);
      considerdEdges.push(...origin.edges);

      while (chosenVertices.length < totalVertices) {

         // get best edge of considered edges
         let chosenEdge;
         for (let i = 0; i < considerdEdges.length; i++) {
            let edge = considerdEdges[i];
            if (!chosenVertices.includes(edge.v1) || !chosenVertices.includes(edge.v2)) {
               chosenEdge = edge;
               considerdEdges.splice(i, 1);
               break;
            }
         }
         chosenEdges.push(chosenEdge);

         // get the vertex that isnt already chosen
         let chosenVertex;
         if (chosenVertices.includes(chosenEdge.v1)) {
            chosenVertex = chosenEdge.v2;
         } else {
            chosenVertex = chosenEdge.v1;
         }
         chosenVertices.push(chosenVertex);

         // add all edges that arent considered and arent chosen
         chosenVertex.edges.forEach(edge => {
            if (!considerdEdges.includes(edge) && !chosenEdges.includes(edge)) {
               if (!chosenVertices.includes(edge.v1) || !chosenVertices.includes(edge.v2)) {
                  considerdEdges.push(edge);
               }
            }
         });

         // sort considered
         considerdEdges.sort((a, b) => a.distance - b.distance);
      }
      this.minSpanningTree = chosenEdges.splice(0);
   }

   sort() {
      this.vertices.forEach(vertex => vertex.sortEdges());
      this.edges.sort((a, b) => a.distance - b.distance);
   }

   // creates a new vertex 
   createVertex(x, y) {
      if (!this.running && this.vertices.length < this.maxVertices) {
         if (this.checkCollisions(x, y)) {
            let vertex = new Vertex(x, y);
            vertex.id = this.vertices.length;
            this.createEdges(vertex);
            this.vertices.push(vertex);
            return true;
         }
      }
      return false;
   }

   // creates new edges for a vertex
   createEdges(newVertex) {
      this.vertices.forEach(vertex => {
         let edge = new Edge(newVertex, vertex);
         edge.id = this.edges.length;
         vertex.edges.push(edge);
         newVertex.edges.push(edge);
         this.edges.push(edge);
      });
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

   connectedEdges(vertex) {
      let connectedEdges = [];
      this.edges.forEach(edge => {
         if (edge.connectsTo(vertex)) {
            connectedEdges.push(edge);
         }
      });
      return connectedEdges;
   }
}

// ------- vertex ------- //
class Vertex {
   constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 5;
      this.color = color(24, 209, 17);
      this.edges = [];
      this.id;
   }

   show() {
      stroke(this.color);
      fill(this.color);
      circle(this.x, this.y, this.radius * 2);
   }

   sortEdges() {
      this.edges.sort((a, b) => a.distance - b.distance);
   }
}

// ------- edge ------- //
class Edge {
   constructor(v1, v2) {
      this.v1 = v1;
      this.v2 = v2;
      this.distance = dist(this.v1.x, this.v1.y, this.v2.x, this.v2.y);
      this.color = color(24, 209, 17);
      this.id;
   }

   show() {
      stroke(this.color);
      line(this.v1.x, this.v1.y, this.v2.x, this.v2.y);
   }

   connectsTo(vertex) {
      return (this.v1 == vertex || this.v2 == vertex);
   }
}

// ------- helper functions ------- //
// return true if the mouse is within the bounds of the canvas
function mouseOnCanvas() {
   return (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0);
}

function sleep(ms) {
   return new Promise(r => setTimeout(r, ms));
}