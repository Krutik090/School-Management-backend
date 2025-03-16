const argon2 = require('argon2');

async function generateNewHash() {
    const password = 'krutik1209'; // Replace with your new password
    try {
        const hash = await argon2.hash(password, { type: argon2.argon2id });
        console.log('Generated Hash:', hash);
    } catch (err) {
        console.error('Error hashing password:', err);
    }
}

generateNewHash();