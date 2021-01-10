const calculateElo = (p1mmr, p2mmr, winner, p1k, p2k) => {
    if(winner != 1 && winner != 2) return console.log("Please enter 1 or 2");
    let s1 = (winner == 1) ? 1 : 0;
    let s2 = (winner == 2) ? 1 : 0;
    let e1 = Math.pow(10, (p1mmr/1000));
    let e2 = Math.pow(10, (p2mmr/1000)); //1000 is base MMR hmmm
    let r1 = Math.floor((p1k*(s1-(e1/(e1+e2)))));
    let r2 = Math.floor((p2k*(s2-(e2/(e1+e2)))));
    console.log(`\nPlayer 1 MMR went from ${p1mmr} to ${r1+p1mmr} (${(r1>0) ? "+"+r1: r1})`);
    console.log(`Player 2 MMR went from ${p2mmr} to ${r2+p2mmr} (${(r2>0) ? "+"+r2: r2})`);
}

/* Formula for getting k
* k = 60 - (NUMBER_OF_GAMES * 2) 
*/

//TODO: Dynamically get MMRs and games played from DB and calculate values of K
calculateElo(1800, 1200, 1, 20, 20);