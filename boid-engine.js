
// NOTES
// to "normalize" a vector: divide x and y by magnitude
// subtract two positions to calculate "displacement"
//   "magnitude" is the distance between the two = sqrt(x^2 + y^2)
//   "normalized" "displacement" is the direction to move to get closer to it

// start with 2d, then consider how to do 3d??
// start in javascript to understand logic, then move to C#


// VECTOR OBJECT

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    getOrientationInDegrees() {
        return 90 + (Math.atan2(this.y, this.x) * 180 / Math.PI);
    }

    getMagnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    normalize() {
        let magnitude = this.getMagnitude();
        this.x /= magnitude;
        this.y /= magnitude;
    }
    
    add(v2) {
        this.x += v2.x;
        this.y += v2.y;
    }

    subtract(v2) {
        this.x -= v2.x;
        this.y -= v2.y;
    }

    divideBy(divisor) {
        this.x /= divisor;
        this.y /= divisor;
    }

    static subtract(v1, v2) {
        return new Vector (v1.x - v2.x, v1.y - v2.y);
    }
    static divide(v1, divisor) {
        return new Vector (v1.x / divisor, v1.y / divisor);
    }
}


// BOIDBUG OBJECT
class BoidBug {

    constructor( x , y , v1 = 0, v2 = 0 ) {
        this.position = new Vector(x, y);
        this.vector = new Vector(v1, v2);
    }

}


// BOID-ENGINE

let boidBugs = [];
let boidField;
let fieldWidth;
let fieldHeight;

const speedFactor = 0.001;
const COHESION_FACTOR = 200;
const SEPARATION_FACTOR = 8;
const ALIGNMENT_FACTOR = 8;
    
function infest() {
    boidField = document.getElementById("boid-field");
        
    createBoidBugObjects();
    addBugElementsToField();

    requestAnimationFrame(loop);
}

function resize() {
    boidField.innerHTML="";
    boidBugs = [];
    infest();
}

function loop() {
    drawBoidBugs();
    moveBoidBugs();
    console.log("loop");
    requestAnimationFrame(loop);
}

function createBoidBugObjects() {
    fieldWidth = boidField.clientWidth;
    fieldHeight = boidField.clientHeight;

    for (let i = 0; i < 50; i++) {
        boidBugs.push(new BoidBug(Math.random() * fieldWidth, Math.random() * fieldHeight, (2 * Math.random()) - 1, (2 * Math.random()) -1 ));
    }
}

function addBugElementsToField() {
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
    boidBugs.forEach(boidBug => {
        alignmentVector = alignment(boidBug);
        separationVector = separation(boidBug);
        cohesionVector = cohesion(boidBug);
                
        boidBug.vector.add(alignmentVector); 
        boidBug.vector.add(cohesionVector); 
        boidBug.vector.add(separationVector);

        boidBug.position.add(boidBug.vector);
    })
}

function drawBoidBugs() {
    boidBugs.forEach((boidBug, index) => {
        let boidElement = document.getElementById(`bug-${index}`);
        boidElement.setAttribute("x", boidBug.position.x);
        boidElement.setAttribute("y", boidBug.position.y);
        boidElement.setAttribute("transform", `rotate(${boidBug.vector.getOrientationInDegrees()} ${boidBug.position.x} ${boidBug.position.y})`);
    });
}

function cohesion(bug) {
    let cohesionVector = new Vector();   
    boidBugs.forEach((boidBug) => {
        if (boidBug != bug) {
            cohesionVector.add(boidBug.position);
        }
    })
    cohesionVector.divideBy(boidBugs.length - 1);
    cohesionVector.subtract(bug.position);
    cohesionVector.divideBy(COHESION_FACTOR);
    return cohesionVector;
}

function separation(bug) {
    let separationVector = new Vector();
    boidBugs.forEach((boidBug) => {
        if (boidBug != bug) {
            if ( Vector.subtract(bug.position, boidBug.position).getMagnitude() < 20) {
                separationVector.subtract( Vector.subtract(boidBug.position, bug.position) );
            }
        }
    })
    separationVector.divideBy(SEPARATION_FACTOR);
    return separationVector;
}

function alignment(bug) {
    let alignmentVector = new Vector();    
    boidBugs.forEach((boidBug) => {
        if (boidBug != bug) {
            alignmentVector.subtract(boidBug.vector);
        }
    })    
    alignmentVector.divideBy(boidBugs.length - 1);
    alignmentVector.subtract(bug.vector);
    alignmentVector.divideBy(ALIGNMENT_FACTOR);
    return alignmentVector;
}
