exports.calculateElo = (playerMmr, highestMmr, result, k) => {
    let s1 = (result === 1) ? 1 : 0;
    let e1 = Math.pow(10, (playerMmr/1000));
    let e2 = Math.pow(10, (highestMmr/1000)); //1000 is base MMR hmmm
    let r1 = Math.floor((k*(s1-(e1/(e1+e2)))));
    return r1+playerMmr;
}

/* Formula for getting k
* k = 60 - (NUMBER_OF_GAMES * 2) 
* k = (k<20) ? 20 : k
*/