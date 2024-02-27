function modInverse(a, m) {
    if (a === 0n) {
        throw new Error('Division by zero');
    }
    // Extended Euclidean Algorithm
    let [m0, x0, x1] = [m, 0n, 1n];
    let [lastx, lasty] = [1n, 0n];
    while (m !== 0n) {
        let quotient = a / m;
        [a, m] = [m, a % m];
        [x0, lastx] = [lastx - quotient * x0, x0];
        [x1, lasty] = [lasty - quotient * x1, x1];
    }
    if (a !== 1n) {
        throw new Error('No inverse exists');
    }
    return lastx < 0n ? lastx + m0 : lastx;
}


function pointAddition(x1, y1, x2, y2, a, p) {
    let s;
    if (x1 === x2 && y1 === y2) {
        s = ((BigInt(3) * x1 * x1 + a) * modInverse(BigInt(2) * y1, p)) % p;
    } else {
        s = ((y2 - y1) * modInverse(x2 - x1, p)) % p;
    }
    let x3 = (s * s - x1 - x2) % p;
    let y3 = (s * (x1 - x3) - y1) % p;
    return [x3, y3];
}

function pointScalarMultiply(k, x, y, a, p) {
    let result = [BigInt(0), BigInt(0)];
    let current = [x, y];
    for (let i = 0; i < k; i++) {
        try {
            result = pointAddition(result[0], result[1], current[0], current[1], a, p);
        } catch (error) {
            // Handle the case where no inverse exists
            console.error('No modular inverse exists for this scalar. Choosing a different scalar might help.');
            return [BigInt(-1), BigInt(-1)]; // Return an invalid point
        }
        current = result;
    }
    return result;
}


// Parameters for the secp256k1 curve
const p = 2n ** 256n - 2n ** 32n - 977n;
const a = 0n;
const b = 7n;
const Gx = 3;
const Gy = 10;
const n = 17;

// Alice's private key
const da = 123n;
// Alice's public key
const Qa = pointScalarMultiply(Gx, Gy, da, p, a);

// Bob's private key
const db = 456n;
// Bob's public key
const Qb = pointScalarMultiply(Gx, Gy, db, p, a);

// Encrypt message
const k = 789n;
const P = pointScalarMultiply(Gx, Gy, k, p, a);
const C1 = P[0];
const C2 = BigInt('0x' + Buffer.from('hello').toString('hex')) ^ P[1];

// Decrypt message
const P2 = pointScalarMultiply(C1, C2, db, p, a);
const message = Buffer.from((P2[1] ^ C2).toString(16), 'hex').toString();

console.log('Alice public key:', Qa);
console.log('Bob public key:', Qb);
console.log('Encrypted:', [C1, C2]);
console.log('Decrypted:', message);
