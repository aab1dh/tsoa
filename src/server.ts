import { strict } from "assert";
// src/server.ts
import { app } from "./app";

const port = process.env.PORT || 3000;



const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
var clusterMap: any = {};
if (cluster?.isMaster) {
    console.log('Master process is running with pid:', process.pid);
    console.log('number of Cpus:', numCPUs);

    let count = 0; // Used to avoid infinite loop
    for (let i = 0; i < numCPUs; ++i) {
        const customId = i + 100;
        const worker = cluster.fork({ workerId: customId });
        clusterMap[worker.id] = { pid: worker.process.pid, custId: customId };
        // clusterMap[worker.id].processId = worker.process.pid

        // worker.send({ msg: 'Hello from Master', task: 'SAPI' });
        // worker.on('message', (msg: any) => {
        //     console.log('Message from worker:', clusterMap[worker.id], msg);
        //     if (clusterMap[worker.id] === 101 && !count++) {
        //         // Message from master for worker 101 to do specific task with taskArg
        //         const taskArg = { params: { name: 'xyz' }, task: 'email' }; // dummy arg
        //         worker.send(taskArg);
        //     } else {
        //         switch (msg.msgType) {
        //             case 'SAPI':
        //                 console.log('Received data from SAPI');
        //                 // Code to send email
        //                 break;
        //             default:
        //                 // default action
        //                 break;
        //         }
        //     }
        // });
    }


    cluster.on('exit', function (deadWorker: any, code: any, signal: any) {

        let delay = 0;
        for (const id in cluster.workers) {
            var func = deadWorker.kill(cluster.workers[id]);
            if (delay == 0)
                func();
            else
                setTimeout(func, delay);
            delay += 60000 * 5;// 5 minute delay, inserted to give time for each worker to re-spool itself
        }

        if (worker.suicide === true) {
            console.log(new Date() + ` ${deadWorker.id} Worker committed suicide`);
            // cluster.fork();
        }
        // Restart the worker
        var worker = cluster.fork({ workerId: deadWorker.id });

        // Note the process IDs
        var newPID = worker.process.pid;
        var oldPID = deadWorker.process.pid;

        // Log the event
        console.log('worker ' + oldPID + ' died.');
        console.log('worker ' + newPID + ' born.');
    });

    console.log('cluster map', clusterMap)
} else {
    console.log(
        'Worker started with pid:',
        process.pid,
        'and id:',
        process.env.workerId
    );
    // if (process.on) process?.on('message', msg => {
    //     console.log('Message from master:', msg);
    //     if (process?.send) process.send({
    //         msgType: 'SAPI',
    //         msg: 'Hello from sapi'
    //     });
    // });




}

if (!cluster.isMaster) {
    app.listen(port, () =>
        console.log(`Example app listening at localhost:${port}`)
    );
}