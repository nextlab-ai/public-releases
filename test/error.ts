let foo; // eslint-disable-line @typescript-eslint/no-unused-vars

async function bar() {
  await console; // eslint-disable-line @typescript-eslint/await-thenable
  await bar();
}

bar(); // eslint-disable-line @typescript-eslint/no-floating-promises
