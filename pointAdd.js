// Define the parameters of the elliptic curve
const a = 1;
const b = 6;
const p = 11; // Field size
const G = { x: 5, y: 1 }; // Base point

// Function to calculate the slope of the tangent line at a point on the curve
function slopeTangent(x, y) {
    // console.log(x,y);
    return ((3 * x * x + a)%p * inverseMod(2 * y, p)) % p;
}

// Function to calculate the inverse modulo p
function inverseMod(a, m) {
    let m0 = m;
    let x0 = 0;
    let x1 = 1;

    if (m === 1) {
        return 0;
    }

    while (a > 1) {
        let q = Math.floor(a / m);
        let t = m;

        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }

    if (x1 < 0) {
        x1 += m0;
    }

    return x1;
}

// Function to add two points on the curve
function addPoints(P, Q) {
    // Handle the special case where one of the points is the point at infinity
    if (!P) return Q;
    if (!Q) return P;

    // Handle the case where the points are the same
    if (P.x === Q.x && P.y === Q.y) {
        return doublePoint(P);
    }

    // Calculate the slope of the line passing through P and Q
    const m = (Q.y - P.y) * inverseMod(Q.x - P.x + p, p) % p;

    // Calculate the sum of P and Q
    let x = (m * m - P.x - Q.x + p) % p;
    let y = (m * (P.x - x) - P.y + p) % p;
    
    x += p;
    x %= p;
    y += p;
    y %= p;
    return { x, y };
}

// Function to double a point on the curve
function doublePoint(P) {
    // Handle the special case where P is the point at infinity
    if (!P) return null;

    // Calculate the slope of the tangent line at P
    const m = slopeTangent(P.x, P.y);
    // Calculate the new point
    let x = (m * m - 2 * P.x + p) % p;
    let y = (m * (P.x - x) - P.y + p) % p;
    x += p;
    x %= p;
    y += p;
    y %= p;
    return { x, y };
}

// Example usage
const P = { x: 2, y: 7 }; // Point on the curve
const Q = { x: 2, y: 7 }; // Another point on the curve
let R = addPoints(P, Q); // Add the points
R = addPoints(R,P);
let Cmx = R;
R = addPoints(R,P)
let Cmy = R;

let sub = Cmx;
console.log(sub);
for(let i = 1; i<=7; i++)
{
    sub = addPoints(sub,R);
    console.log(sub);
}

// sub.y = sub.y*-1;

sub = addPoints(sub,Cmy);


console.log("Result of point addition:", sub);
