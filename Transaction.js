/*
 * File: transaction.js                                                        *
 * Project: blockchain                                                         *
 * Created Date: Th May yyyy                                                   *
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



class Transaction{
    constructor(from, to, amout){
        this.from = from;
        this.to = to;
        this.amout = amout; //btc
    }
}

module.exports = Transaction;