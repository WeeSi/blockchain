/*
 * File: Blockchain.js                                                         *
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

const Block = require("./Block");
const proofOfWork = require("./proofOfWork");
const Transaction = require("./transaction");

class Blockchain {

    constructor(io) {
        this.chain = [this.startGenesisBlock()];
        this.difficulty = 2;
        this.nodes = [];
        this.io = io;
        this.pendingTransactions = [];
        this.miningReward = 0;
        this.balance = 0;
    }

    startGenesisBlock = () => {
        let block = new Block('init');
        block.tms = 1620288994;
        return block;
    }

    getLatestBlock = () => {
        return this.chain[this.chain.length - 1];
    }

    checkChainValidity = () => {
        let valide = false;

        this.chain.map((item, index) => {
            if (item.hash === this.chain[index].computeHash()
                && item.precedingHash === this.chain[index - 1].hash) valide = true;
        })

        return valide;
    }

    //minage
    mineBlock = (block) => {
        this.chain.push(block);
        this.io.emit('blockmined', this.chain);
    }

    //on regarde si on peut acheter
    createTransaction = (transaction) => {
        if (this.balance >= transaction.amout) {
            this.pendingTransactions.push(transaction);
            this.balance -= transaction.amout;
            // if (trans.to === address) this.balance += trans.amout;
        }
        else console.log('not enough rewards');

        return this.balance;
    }

    // getBalanceOfAdress(address) {
    //     for (const block of this.chain) {
    //         for (const trans of block.transactions) {
    //             if (trans.from === address) this.balance -= trans.amout;
    //             if (trans.to === address) this.balance += trans.amout;
    //         }
    //     }

    //     return this.balance;
    // }

    addNewBlock = async (newBlock) => {
        newBlock.precedingHash = this.getLatestBlock().hash
        newBlock.index = this.getLatestBlock().index + 1
        process.env.BREAK = false;
        const { block, dontMine } = await proofOfWork(newBlock, this.difficulty)
        if (dontMine !== 'true') {
            this.mineBlock(block);

            //ajout d'un gain 
            this.pendingTransactions = [
                new Transaction(
                    null,
                    block.receiver,
                    12)
            ];
            this.balance += 12;

            console.log(this.balance);
        }
    }

    addNewNode = (node) => {
        this.nodes.push(node)
    }
}

module.exports = Blockchain;