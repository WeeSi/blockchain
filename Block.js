/*
 * File: Block.js                                                              *
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

const sha256 = require('crypto-js/sha256');

class Block {
    constructor(transactions) {
        this.index = 0;
        this.tms = Date.now();
        this.transactions = transactions;
        this.precedinghash = "0";
        this.hash = this.computeHash();
        this.nonce = 0;
    }

    proofOfWork = (difficulty) => {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;

            this.hash = this.computeHash();
        }
    }

    computeHash = () => {
        return sha256(this.index + this.tms + JSON.stringify(this.transactions) + this.precedinghash + this.nonce).toString();
    }
}

module.exports = Block;