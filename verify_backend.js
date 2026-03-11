
const http = require('http');

function request(method, path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/categories' + path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        // DELETE might return empty or message
                        resolve(body);
                    }
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function verify() {
    console.log('--- Verifying Admin Functionality (Native HTTP) ---');
    try {
        // 1. ADD
        const testDate = Date.now();
        const newCat = { name: 'Verify_' + testDate, image: 'http://img.com' };
        console.log(`1. Adding Category: ${newCat.name}`);
        const added = await request('POST', '', newCat);
        console.log('   ✅ Success. ID:', added._id);

        // 2. UPDATE
        console.log('2. Updating Name...');
        const updateData = { name: 'Verify_' + testDate + '_Edited' };
        const updated = await request('PUT', '/' + added._id, updateData);
        if (updated.name !== updateData.name) throw new Error('Name mismatch');
        console.log('   ✅ Success. New Name:', updated.name);

        // 3. DELETE
        console.log('3. Deleting...');
        await request('DELETE', '/' + added._id);
        console.log('   ✅ Success.');

        console.log('\nAll tests passed.');

    } catch (e) {
        console.error('\n❌ FAILED:', e.message);
        process.exit(1);
    }
}

verify();
