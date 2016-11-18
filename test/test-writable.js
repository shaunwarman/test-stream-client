const net = require('net');
const payload = require('./fixtures/payload.json');
const test = require('tape');

const Logger = require('../lib');

const logger = new Logger(false, {});

test('test valid chunk', (t) => {
    logger.write('b', 'utf8', (err, response) => {
        if (err) {
            t.error(err, `Error - ${err}`);
        }
        else {
            t.ok(response, `Good - ${response}`);
        }
    });

    t.end();
});

test('test multiple writes', (t) => {
   for (var a = 0; a < 10; a++) {
       logger.write(payload, 'utf8', (err, response) => {
           if (err) {
               t.error(err, `Error - ${err}`);
           } else {
               t.ok(response, `Good - ${JSON.stringify(response)}`);
           }
       });
   }

   t.end();
});

test('test remote write', (t) => {
    const remoteLogger = new Logger({host: '127.0.0.1', port: 8008});

    const server = net.createServer((socket) => {
        socket.on('data', (data) => {
           console.log(`Incoming: ${data}`);
        });
    });

    server.listen({host: '127.0.0.1', port: 8008}, () => {
        console.log('opened server on', server.address());
    });

    server.on('listening', () => {
        remoteLogger.write('Test remote datas!', 'utf8', (err, response) => {
            if (err) {
                t.error(err, `Error - ${err}`);

                server.close();
                t.end();
            } else {
                t.ok(response, `Good - ${JSON.stringify(response)}`);

                server.close();
                t.end();
            }
        });
    });
});
