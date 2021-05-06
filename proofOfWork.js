/*
 * File: proofOfWork.js                                                        *
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



const proofOfWork = (block, difficulty) => new Promise((resolve) => {
    setImmediate(async () => {
        block.hash = block.computeHash();
        const dontMine = process.env.BREAK
        if (block.hash.substring(0, difficulty) == Array(difficulty + 1).join("0") || dontMine === 'true') {
            resolve({block, dontMine})
        } else{
            block.nonce++;
            resolve(await proofOfWork(block, difficulty))
        }
    })
})
 
module.exports = proofOfWork