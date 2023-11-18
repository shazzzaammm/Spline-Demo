class Spline {
    constructor() {
        this.curves = [testBezier];
    }
    draw(){
        for (const curve of this.curves) {
            curve.draw();
        }
    }

    addCurve(x, y) {
        let startPoint = this.curves[this.curves.length - 1].point2;
        let endPoint = new Point(x, y);
        let controlPoint1 = new Point((startPoint.x + endPoint.x) / 2, (startPoint.y + endPoint.y) / 2);
        let controlPoint2 = new Point((startPoint.x + endPoint.x) / 2, (startPoint.y + endPoint.y) / 2);
        this.curves.push(
            new BezierCurve(
                startPoint,
                controlPoint1,
                endPoint,
                controlPoint2
            )
        );
    }

    findClickedPoint(x, y){
        for (const curve of this.curves) {
            let foundPoint = curve.findClickedPoint(x,y);
            if(foundPoint!==null){
                return foundPoint;
            }
        }
        return null;
    }
}

class Point {
    constructor(x, y) {
        this.w = 30;
        this.x = x;
        this.y = y;
    }
    draw() {
        // ellipse(this.x, this.y, this.w);
        // ellipseMode(CENTER);
        textSize(this.w);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text("X", this.x, this.y);
    }
    isClicked(x, y) {
        return (
            x <= this.x + this.w &&
            x >= this.x - this.w &&
            y <= this.y + this.w &&
            y >= this.y - this.w);
    }
}

class BezierCurve {
    constructor(point1, control1, point2, control2) {
        this.point1 = point1;
        this.point2 = point2;
        this.control1 = control1;
        this.control2 = control2;
        this.controlPoints = [point1, control1, control2, point2];
    }

    draw() {
        this.drawPoints();
        this.drawCurve();
        this.drawHandles();
    }

    binomialCoefficient(n, k) {
        if (k === 0 || k === n) {
            return 1;
        } else {
            return this.binomialCoefficient(n - 1, k - 1) + this.binomialCoefficient(n - 1, k);
        }
    }

    bezierCurve(t, controlPoints) {
        const n = controlPoints.length - 1;
        let result = { x: 0, y: 0 };

        for (let i = 0; i <= n; i++) {
            const coefficient = this.binomialCoefficient(n, i) * Math.pow((1 - t), n - i) * Math.pow(t, i);
            result.x += coefficient * controlPoints[i].x;
            result.y += coefficient * controlPoints[i].y;
        }
        return result;
    }

    drawPoints() {
        noStroke();
        for (let i = 0; i < this.controlPoints.length; i++) {
            const pt = this.controlPoints[i];
            if (pt == this.control1 || pt == this.control2) {
                fill(255);
            }
            else {
                fill(255, 105, 180);
            }
            pt.draw();
        }
    }

    drawCurve() {
        noFill();
        strokeWeight(5);
        setLineDash([1]);
        beginShape();
        for (let t = 0; t <= 1; t += 0.01) {
            const point = this.bezierCurve(t, this.controlPoints);
            stroke(100, 0, 255);
            // circle(point.x, point.y, 6);
            vertex(point.x, point.y);
        }
        endShape();
    }


    drawHandles() {
        setLineDash([10, 10]);
        stroke(255, 0, 100);
        strokeWeight(2);
        line(this.control1.x, this.control1.y, this.point1.x, this.point1.y)
        line(this.control2.x, this.control2.y, this.point2.x, this.point2.y)
    }

    findClickedPoint(x, y) {
        for (const pt of this.controlPoints) {
            if (pt.isClicked(x, y) === true) {
                return pt;
            }
        }
        return null;
    }
}

let testBezier = new BezierCurve(
    new Point(10, 20),
    new Point(30, 100),
    new Point(340, 100),
    new Point(300, 200));
let selectedPoint = null;
let testSpline = new Spline();
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
    background(0);
    // testBezier.draw();
    testSpline.draw();
}

function mousePressed() {
    selectedPoint = testSpline.findClickedPoint(mouseX, mouseY);
    if(selectedPoint==null){
        testSpline.addCurve(mouseX,mouseY);
    }
}

function mouseDragged() {
    if (selectedPoint == null) return;
    selectedPoint.x = mouseX;
    selectedPoint.y = mouseY;
}

function mouseReleased() {
    selectedPoint = null;
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}