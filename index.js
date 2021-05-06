/*
 * File: index.js                                                              *
 * Project: blockchain                                                         *
 * Created Date: Mo May yyyy                                                   *
 * Author: Franck Ehui                                                         *
 * -----                                                                       *
 * Last Modified: Thu May 06 2021                                              *
 * Modified By: Franck Ehui                                                    *
 * -----                                                                       *
 * Copyright (c) 2021 BeAll                                                    *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date      	By	Comments                                                   *
 * ----------	---	---------------------------------------------------------  *
 */

const express = require("express");
const socketio = require('socket.io');
const client = require('socket.io-client');
const http = require('http');
const Blockchain = require("./Blockchain");
const socketListner = require("./socket");
const Block = require("./Block");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.set('socketio', io);

let blockchain = new Blockchain(io);

app.get('/blocks', (req, res) => {
    res.json(blockchain.chain)
});

app.post('/mine', (req, res) => {
    const { sender, receiver, qty } = req.body;
    io.emit('mine', { sender, receiver, qty, pendingTransactions: blockchain.pendingTransactions });
    res.redirect('/blocks');
});

app.post('/transaction', (req, res) => {
    const { transaction } = req.body; //amount
    blockchain.createTransaction(transaction);
})

app.post('/nodes', (req, res) => {
    const { host, port } = req.body;
    const newNode = `http://${host}:${port}`;
    const { callback } = req.query;
    const socketNode = socketListner(client(newNode), blockchain);
    blockchain.addNewNode(socketNode);

    if (callback === 'true') {
        console.info(`Node ${newNode} added via callback`);
        res.json({ status: 'Added node', newNode: newNode, callback: true });
    } else {
        fetch(`${newNode}/nodes?callback=true`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ host: req.hostname, port: PORT })
        })
        console.info(`Node ${newNode} added via callback`);
        res.json({ status: `added node`, newNode: newNode, callback: false })
    }
})

app.get('/nodes', (req, res) => {
    res.json({ count: blockchain.nodes.length });
    console.log(blockchain.nodes);
})

io.on('connection', (socket) => {
    console.info(socket.id)
    socket.on('disconnect', () => {
        console.info("disconnected");
    })
})

blockchain.addNewNode(socketListner(client(`http://localhost:${PORT}`), blockchain));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
