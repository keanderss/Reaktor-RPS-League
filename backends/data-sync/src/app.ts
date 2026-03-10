import { prisma } from './configs/db.ts'
import messageValidator from './validators/messageValidator.ts';

export const onMessage = async (data: object) => {
    console.log(data);
    const validationResult = messageValidator.safeParse(data);
    if (!validationResult.success) {
        console.log(validationResult.error);
    } else {
        const validationResultData = validationResult.data;
        const data = [
            { name: validationResultData.playerA.name },
            { name: validationResultData.playerB.name }
        ]
        prisma.$transaction(async (tx) => {
            // Create players
            await tx.player.createMany({
                data,
                skipDuplicates: true
            });

            // Get players with ids
            const players = await tx.player.findMany({
                where: {
                    name: { in: data.map(player => player.name) }
                }
            });

            const player1 = players.find(p => p.name === validationResultData.playerA.name);
            const player2 = players.find(p => p.name === validationResultData.playerB.name);
            const move1 = validationResultData.playerA.played;
            const move2 = validationResultData.playerB.played;
            const result = getMatchResult(move1, move2);

            if (player1 && player2) {
                // Create matches
                await tx.match.create({
                    data: {
                        id: validationResultData.gameId,
                        player1: {
                            connect: { id: player1.id }
                        },
                        player2: {
                            connect: { id: player2.id }
                        },
                        move1,
                        move2,
                        result,
                        date: new Date(validationResultData.time).toISOString(),
                    }
                })
            }
        })
    }
}

type RPS = "ROCK" | "PAPER" | "SCISSORS";

const getMatchResult = (move1: RPS, move2: RPS) => {
    if (move1 === move2) {
        return "DRAW"
    }
    if (move1 === 'ROCK' && move2 === 'SCISSORS' || 
        move1 === 'PAPER' && move2 === 'ROCK' || 
        move1 === 'SCISSORS' && move2 === 'PAPER' 
    ) {
        return "PLAYER1"
    }
    
    return "PLAYER2"
}