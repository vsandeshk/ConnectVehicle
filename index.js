const myCluster = require('cluster');
const os = require('os');
const expressServer = require('./express_server');

expressServer();

/*

// We will check if current process is master
if (myCluster.isMaster) {
  // Get total num of CPUs
  const cpuCount = os.cpus().length;

  // create a worker from every cpu.
  for (let j = 0; j < cpuCount; j++) {
    console.log("starting worker: ", j+1);
    myCluster.fork();
  }
} else {
  //  If not a master process then run express server
  expressServer();
}

// Restart a new process if a worker die.
myCluster.on('exit', function (worker) {
  console.log(`Worker ${worker.id} died'`);
  console.log(`Staring a new one...`);
  myCluster.fork();
});
*/
