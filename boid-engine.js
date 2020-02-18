
// NOTES
// to "normalize" a vector: divide x and y by magnitude
// subtract two positions to calculate "displacement"
//   "magnitude" is the distance between the two = sqrt(x^2 + y^2)
//   "normalized" "displacement" is the direction to move to get closer to it

// start with 2d, then consider how to do 3d??


// BOIDBUG OBJECT
class BoidBug {

    // properties: position, velocity, orientation (velocity + orientation = Vector?)

    constructor(x = Math.random(1), y = Math.random(1), velocity = Math.random(1), orientation = Math.random(1)) {
        this.pos = [x, y];
        this.vector = [velocity, orientation];
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

function init() {
    createInitialBugs();
    addBugsToField();    
}

function createInitialBugs() {
    // set a random creator of all bugs
    boidBugs = [[0.02, 0.6], [0.3, 0.1], [0.8, 0.75]];
}

function addBugsToField() {
    const boidField = document.getElementById("boid-field");
    const fieldWidth = boidField.clientWidth;
    const fieldHeight = boidField.clientHeight;  
    boidBugs.forEach((boidBug) => {
        let boidElement = document.createElementNS("http://www.w3.org/2000/svg", "image");
        boidElement.setAttribute("href", "img/bug-solid.svg");
        boidElement.setAttribute("x", boidBug[0] * fieldWidth);
        boidElement.setAttribute("y", boidBug[1] * fieldHeight);
        boidElement.setAttribute("width", "8px");
        boidElement.setAttribute("height", "8px");
        boidField.append(boidElement);
    });
}