//declaration of variables

const p = 11
const Na = 7 //private key of user A
const Nb = 7 //private key of user B

/*
Let our elliptic curve be 

y^2 = x^3 + x + 6 over Z 11

and let the point satisfying this equation representing our message be 
(10,9)

*/

const a = 1
const b = 6

//tools for Elliptic curve cryptography

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
const Pm = { x: 1, y: 8 }; // Point on the curve representing message
const G = {x: 2, y: 7}; //point on the curve
const k = 3
let Cmx = G;
let Pa = G
let Pb = G

console.log("Plain Message - ", Pm);
//calcualting first point of cipher message i.e k*G

for(let i = 1; i<k; i++)
{
    Cmx = addPoints(Cmx,G);
}

console.log("Cmx - ",Cmx);

//calculating second point Cmy = Pm + k*Pb

//calculating Pb

for(let i = 1; i<Nb; i++)
{
    Pb = addPoints(Pb, G);
}

console.log(`Pb - `, Pb)

let Cmy = Pb;

for(let i = 1; i<k; i++)
{
    Cmy = addPoints(Cmy, Pb);
}

Cmy = addPoints(Cmy, Pm);
console.log(`Cipher message - ((${Cmx.x},${Cmx.y}), (${Cmy.x},${Cmy.y}))`);

//decryption process

//multiplying Cmx by Nb

let sub = Cmx;

for(let i = 1; i<Nb; i++)
{
    sub = addPoints(sub, Cmx);
}

//taking reflection upon x axis

sub.y = -1*sub.y;
sub.y += p;
sub.y %= p;

//now pm = cmy - nb*cmx

Cmy = addPoints(Cmy, sub);
console.log("Decrypted Message : ", Cmy);