const {Socket} = require('net');
const {Writable} = require('stream');

class Logger extends Writable {
    constructor(endpoint = false, options = {}) {
        super({ objectMode: true });

        this.endpoint = endpoint;
        this.options = options;

        // this._client = new Client(...);
    }

    write(chunk, encoding, callback) {
        if (this.endpoint) {
            const {host, port} = this.endpoint;

            sendRemote({host, port}, chunk, encoding, callback);
        } else {
            send(chunk, encoding, callback);
        }
    }
}

const format = (message) => {
    return `${Date.now()}: ${JSON.stringify(message)}`;
};

const send = (chunk, encoding, callback) => {
    console.log(format(chunk));
    callback(null, chunk);
};

const sendRemote = (options, chunk, encoding, callback) => {
    const socket = new Socket({writable: true});

    const {host, port} = options;

    socket.connect({
        host,
        port
    });

    socket.on('connect', () => {});
    socket.on('error', err => callback(err));
    socket.on('close', () => {
        callback(null, chunk);
        socket.destroy();
    });

    socket.write(format(chunk), encoding);
    socket.end('Socket closed');
};

module.exports = Logger;