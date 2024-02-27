//function modInverse returns null incase 
//the modInverse does not exist

function modInverse(a, m) {
    let [old_r, r] = [a, m];
    let [old_s, s] = [1n, 0n];

    while (r !== 0n) {
        let quotient = old_r / r;
        [old_r, r] = [r, old_r - quotient * r];
        [old_s, s] = [s, old_s - quotient * s];
    }

    return old_r !== 1n ? null : (old_s < 0n ? old_s + m : old_s);
}

// Example usage
let a = 3n;
let m = 5n;
let inv = modInverse(a, m);

console.log(`The modular inverse of ${a} modulo ${m} is ${inv}`);
