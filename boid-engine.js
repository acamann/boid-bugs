
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

    multiplyBy(factor) {
        this.x *= factor;
        this.y *= factor;
    }

    static subtract(v1, v2) {
        return new Vector (v1.x - v2.x, v1.y - v2.y);
    }
    static divide(v1, divisor) {
        return new Vector (v1.x / divisor, v1.y / divisor);
    }
    static distance(v1, v2) {
        return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
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
let crumbPosition;

const AVOID_NEIGHBOR_DISTANCE = 25;
const AVOIDANCE_FACTOR = 0.001;

const ALIGN_NEIGHBOR_DISTANCE = 200;
const ALIGNMENT_FACTOR = 0.1;

const APPROACH_NEIGHBOR_DISTANCE = 200;
const COHESION_FACTOR = 0.0001;

const AVOID_WALL_FACTOR = 1.5;

const FIND_FOOD_DISTANCE = 100;
const FIND_FOOD_FACTOR = 0.001;

    
function infest() {
    boidField = document.getElementById("boid-field");
        
    createBoidBugObjects();
    addBugElementsToField();

    requestAnimationFrame(loop);
}

function resize() {    
    fieldWidth = boidField.clientWidth;
    fieldHeight = boidField.clientHeight;
}

function clickSVG(event) {
    placeCrumbs(event.clientX, event.clientY);
}

function placeCrumbs(x, y) {
    crumbPosition = new Vector(x, y);
    let crumbs = document.getElementById("crumbs");
    if (!crumbs) {
        crumbs = document.createElementNS("http://www.w3.org/2000/svg", "image");
        crumbs.setAttribute("id", `crumbs`);
        crumbs.setAttribute("href", "img/foodscraps.png");
        crumbs.setAttribute("width", "200px");
        crumbs.setAttribute("height", "200px");
        boidField.prepend(crumbs);
    }
    crumbs.setAttribute("x", x - 100 );
    crumbs.setAttribute("y", y - 100 );
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

    for (let i = 0; i < 100; i++) {
        boidBugs.push(new BoidBug(Math.random() * fieldWidth, 
                                  Math.random() * fieldHeight, 
                                  (2 * Math.random()) - 1, 
                                  (2 * Math.random()) -1 ));
    }
}

function addBugElementsToField() {
    boidBugs.forEach((boidBug, index) => {
        let boidElement = document.createElementNS("http://www.w3.org/2000/svg", "image");
        boidElement.setAttribute("id", `bug-${index}`);
        boidElement.setAttribute("href", "img/bug-solid.svg");
        boidElement.setAttribute("width", "16px");
        boidElement.setAttribute("height", "16px");
        boidField.append(boidElement);
    });
}

function moveBoidBugs() {
    boidBugs.forEach(boidBug => {
        let avoidVector = avoid(boidBug);
        let alignVector = align(boidBug);
        let approachVector = approach(boidBug);
        let avoidWallsVector = avoidWalls(boidBug);
        let findFoodVector = findFood(boidBug);
        
        
        boidBug.vector.add(avoidVector)
        boidBug.vector.add(alignVector)
        boidBug.vector.add(approachVector)
        boidBug.vector.add(avoidWallsVector);
        boidBug.vector.add(findFoodVector);
        
        boidBug.vector.normalize();     

        boidBug.position.add(boidBug.vector);

    })
}

function drawBoidBugs() {
    boidBugs.forEach((boidBug, index) => {
        let boidElement = document.getElementById(`bug-${index}`);
        boidElement.setAttribute("x", boidBug.position.x);
        boidElement.setAttribute("y", boidBug.position.y);
        boidElement.setAttribute("transform", 
                `rotate(${boidBug.vector.getOrientationInDegrees()} ${boidBug.position.x} ${boidBug.position.y})`);
    });
}

function avoid(bug) {
    let separationVector = new Vector();
    boidBugs.forEach((boidBug) => {
        if (boidBug != bug) {
            if ( Vector.distance(bug.position, boidBug.position) < AVOID_NEIGHBOR_DISTANCE ) {
                separationVector.subtract( Vector.subtract(boidBug.position, bug.position) );
            }
        }
    })
    separationVector.multiplyBy(AVOIDANCE_FACTOR);
    return separationVector;
}


function align(bug) {
    let alignmentVector = new Vector();
    let neighborCount = 0;
    boidBugs.forEach((boidBug) => {
        if (boidBug != bug) {
            if ( Vector.distance(bug.position, boidBug.position) < ALIGN_NEIGHBOR_DISTANCE ) {
                alignmentVector.subtract(boidBug.vector);
                neighborCount++;
            }
        }
    })
    if (neighborCount > 0) alignmentVector.divideBy(neighborCount);
    alignmentVector.multiplyBy(ALIGNMENT_FACTOR);
    return alignmentVector;
}

function approach(bug) {
    let cohesionVector = new Vector();   
    let neighborCount = 0;    
    boidBugs.forEach((boidBug) => {
        if (boidBug != bug) {
            if ( Vector.distance(bug.position, boidBug.position) < APPROACH_NEIGHBOR_DISTANCE) {
                cohesionVector.add(boidBug.position);
                neighborCount++;
            }
        }
    })
    if (neighborCount > 0) {        
        cohesionVector.divideBy(neighborCount);
        cohesionVector.subtract(bug.position);
        cohesionVector.multiplyBy(COHESION_FACTOR);
    }
    return cohesionVector;
}

function avoidWalls(bug) {
    let avoidWallsVector = new Vector();

    avoidWallsVector.add(new Vector(1 / (bug.position.x - fieldWidth + 1), 1 / (bug.position.y + 1)));
    avoidWallsVector.add(new Vector(1 / (bug.position.x + 1), 1 / (bug.position.y - fieldHeight + 1)));    
    avoidWallsVector.multiplyBy(AVOID_WALL_FACTOR);

    return avoidWallsVector;
}

function findFood(bug) {
    let findFoodVector = new Vector();
    if (crumbPosition) {
        if (Vector.distance(crumbPosition, bug.position) < FIND_FOOD_DISTANCE) {
            findFoodVector.add(Vector.subtract(crumbPosition, bug.position));
            findFoodVector.multiplyBy(FIND_FOOD_FACTOR); 
        }  
    }
    return findFoodVector;
}
