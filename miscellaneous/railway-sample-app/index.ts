const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async () => {
  for (let i = 0; ; i++) {
    console.log(`On iteration: ${i + 1}`);
    await sleep(3000);
  }
};

console.log('Starting the application..');
main();
