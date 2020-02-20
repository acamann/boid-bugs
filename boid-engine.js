
// NOTES
// to "normalize" a vector: divide x and y by magnitude
// subtract two positions to calculate "displacement"
//   "magnitude" is the distance between the two = sqrt(x^2 + y^2)
//   "normalized" "displacement" is the direction to move to get closer to it

// start with 2d, then consider how to do 3d??


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
        console.log(`(${this.x}, ${this.y}), Magnitude=${magnitude}`)
        this.x /= magnitude;
        this.y /= magnitude;
    }

    divideBy(divisor) {
        this.x /= divisor;
        this.y /= divisor;
    }

    static add(v1, v2) {
        return new Vector (v1.x + v2.x, v1.y + v2.y);
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
const speedFactor = 0.001
    
function infest() {
    boidField = document.getElementById("boid-field");
        
    createBoidBugObjects();
    addBugElementsToField();

    requestAnimationFrame(loop);
}

function loop() {
    drawBoidBugs();
    moveBoidBugs();
    console.log("loop");
    requestAnimationFrame(loop);
}

function createBoidBugObjects() {
    const fieldWidth = boidField.clientWidth;
    const fieldHeight = boidField.clientHeight;

    for (let i = 0; i < 30; i++) {
        boidBugs.push(new BoidBug(Math.random() * fieldWidth, Math.random() * fieldHeight));
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
                
        boidBug.vector = Vector.add(boidBug.vector, alignmentVector);
        boidBug.vector = Vector.add(boidBug.vector, cohesionVector);
        boidBug.vector = Vector.add(boidBug.vector, separationVector);

        //boidBug.vector.normalize();
        //console.log(`${boidBug.vector.x}, ${boidBug.vector.y}`);

        boidBug.position = Vector.add(boidBug.position, boidBug.vector);
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
            cohesionVector = Vector.add(cohesionVector, boidBug.position);
        }
    })
    cohesionVector = Vector.divide(cohesionVector, boidBugs.length - 1);
    cohesionVector = Vector.subtract(cohesionVector, bug.position);
    cohesionVector = Vector.divide(cohesionVector, 100);
    return cohesionVector;
}

function separation(bug) {
    let separationVector = new Vector();
    boidBugs.forEach((boidBug) => {
        if (boidBug != bug) {
            let distanceBetween = Vector.subtract(bug.position, boidBug.position).getMagnitude();
            if ( distanceBetween < 100) {
                separationVector = Vector.subtract(separationVector, Vector.subtract(boidBug.position, bug.position));
            }
        }
    })
    return separationVector;
}

function alignment(bug) {
    let alignmentVector = new Vector();    
    boidBugs.forEach((boidBug) => {
        if (boidBug != bug) {
            alignmentVector = Vector.subtract(alignmentVector, boidBug.vector);
        }
    })    
    alignmentVector = Vector.divide(alignmentVector, boidBugs.length - 1);
    alignmentVector = Vector.subtract(alignmentVector, bug.vector);
    alignmentVector = Vector.divide(alignmentVector, 8);
    return alignmentVector;
}
