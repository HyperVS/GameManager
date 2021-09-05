const handleMmr = async (message, team1, team2, matchID) => {
    team1.sort(async (a,b) => await db.getMmr(b) - await db.getMmr(a));
    team2.sort(async (a,b) => await db.getMmr(b) - await db.getMmr(a));
    let highestT1 = await db.getMmr(team1[0]);
    let highestT2 = await db.getMmr(team2[0]);
    let channel = message.guild.channels.cache.get(c => c.name == "game-results");
    let embed = new MessageEmbed().setColor(rlColor).setFooter(footer);
    team1.forEach(async userid => {
        let mmr = await db.getMmr(userid);
        let gamesPlayed = await db.getWins(userid) + await db.getLosses(userid);
        let k = 60 - (gamesPlayed*2);
        k = k<20 ? 20 : k;
        let newMmr = calculateElo(mmr, highestT2, client.result.get(userid), k);
        await db.updateMmr(userid, newMmr);
        newMMr > mmr ? await db.addWin(userid) : await db.addLoss(userid);
        //TODO: send embed to channel game-results
        channel.send();
    });

    team2.forEach(async userid => {
        let mmr = await db.getMmr(userid);
        let gamesPlayed = await db.getWins(userid) + await db.getLosses(userid);
        let k = 60 - (gamesPlayed*2);
        k = k<20 ? 20 : k;
        let newMmr = calculateElo(mmr, highestT1, client.result.get(userid), k);
        await db.updateMmr(userid, newMmr);
        newMMr > mmr ? await db.addWin(userid) : await db.addLoss(userid);
        channel.send();
    });

};