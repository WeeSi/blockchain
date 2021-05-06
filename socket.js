/*
 * File: socket.js                                                                *
 * Project: blockchain                                                         *
 * Created Date: Tu May yyyy                                                   *
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

const Block = require("./Block");

const socketListner = (socket, blockchain) => {

    socket.on('mine', (sender, receiver, qty, pendingTransactions) => {
        let block = new Block({ sender, receiver, qty, pendingTransactions })
        blockchain.addNewBlock(block);
    });

    socket.on('blockmined', (newChain) => {
        process.env.BREAK = true;
        blockchain.chain = newChain
        console.info(`Blockchain synchronized`)
    })

    return socket;
}

module.exports = socketListner;