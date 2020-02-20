
// NOTES
// to "normalize" a vector: divide x and y by magnitude
// subtract two positions to calculate "displacement"
//   "magnitude" is the distance between the two = sqrt(x^2 + y^2)
//   "normalized" "displacement" is the direction to move to get closer to it

// start with 2d, then consider how to do 3d??

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static add(v1, v2) {
        return new Vector (v1.x + v2.x, v1.y + v2.y);
    }
}


// BOIDBUG OBJECT
class BoidBug {

    // properties: position, velocity, orientation (velocity + orientation = Vector?)

    constructor( x = Math.random(1), y = Math.random(1), v1 = (2 * Math.random()) - 1, v2 = (2 * Math.random() - 1) ) {
        const speedFactor = 0.001
        this.position = new Vector(x, y);
        this.vector = new Vector(v1 * speedFactor, v2 * speedFactor);
        this.orientation = (360 * Math.random(1)); // test rotation of items for now
    }

// input: neighboring bugs and their vectors

// process following forces:
//  alignment - move in similar direction of neighbors (take average of normalized vectors of neighbors)
//  cohesion - move toward center of mass of neighbors (aim to average of current x, y values of neighbors)
//  separation - 

// maintain current vector with no neighbors
//  other factors (variable speed, noise, obstacles(handled with separation))

// ouput: new vector (x & y relative distances)

}




// BOID-ENGINE

// array of boid-bugs
// rendered & binded using D3?

let boidBugs = [];
let isActive = true;
let boidField;
const speedFactor = 0.001
    
function infest() {
    createBoidBugObjects();
    addBugElementsToField();

    requestAnimationFrame(loop);
    //do {

    //} while (isActive);

}

function loop() {
    drawBoidBugs();
    moveBoidBugs();
    console.log("loop");
    requestAnimationFrame(loop);
}

function createBoidBugObjects() {
    // set a random creator of all bugs
    for (let i = 0; i < 100; i++) {
        boidBugs.push(new BoidBug());
    }
}

function addBugElementsToField() {
    boidField = document.getElementById("boid-field");
    boidBugs.forEach((boidBug, index) => {
        let boidElement = document.createElementNS("http://www.w3.org/2000/svg", "image");
        boidElement.setAttribute("id", `bug-${index}`);
        boidElement.setAttribute("href", "img/bug-solid.svg");
        boidElement.setAttribute("width", "8px");
        boidElement.setAttribute("height", "8px");
        boidField.append(boidElement);
    });
}

function moveBoidBugs() {
    // Vector v1, v2, v3
    // Boid b

    boidBugs.forEach(boidBug => {
        //alignmentVector = alignment(boidBug);
        //cohesionVector = cohesion(boidBug);
        //separationVector = separation(boidBug);

        //boidBug.vector = Vector.add(boidBug.boidbug.velocity + alignmentVector + cohesionVector + separationVector;
        boidBug.position = Vector.add(boidBug.position, boidBug.vector)
    })
}

function drawBoidBugs() {
    const fieldWidth = boidField.clientWidth;
    const fieldHeight = boidField.clientHeight;
    boidBugs.forEach((boidBug, index) => {
        let boidElement = document.getElementById(`bug-${index}`);
        boidElement.setAttribute("x", boidBug.position.x * fieldWidth);
        boidElement.setAttribute("y", boidBug.position.y * fieldHeight);
        boidElement.setAttribute("transform", `rotate(${boidBug.orientation} ${boidBug.position.x * fieldWidth} ${boidBug.position.y * fieldHeight})`);
    });
}

