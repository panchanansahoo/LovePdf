const fs = require('fs');

async function test() {
  fs.writeFileSync('test1.pdf', 'dummy content 1');
  fs.writeFileSync('test2.pdf', 'dummy content 2');

  const form = new FormData();
  form.append('files', new Blob([fs.readFileSync('test1.pdf')]), 'test1.pdf');
  form.append('files', new Blob([fs.readFileSync('test2.pdf')]), 'test2.pdf');

  try {
    const res = await fetch('http://localhost:3000/api/tools/merge', {
      method: 'POST',
      body: form,
    });
    console.log('Status:', res.status);
    console.log('Headers:', res.headers);
    if (!res.ok) {
      console.log('Error:', await res.text());
    } else {
      console.log('Success, downloading file...');
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

test();
