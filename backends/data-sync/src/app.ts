import { prisma } from "./configs/db.ts";
import messageValidator from "./validators/messageValidator.ts";
import type { message } from "./validators/messageValidator.ts";
import type { RPS } from "./validators/rpsValidator.ts";
import { sleep } from "./utils/sleep.ts";
import z from "zod";

const getMatchResult = (move1: RPS, move2: RPS) => {
  if (move1 === move2) {
    return "DRAW";
  }
  if (
    move1 === "ROCK" && move2 === "SCISSORS" ||
    move1 === "PAPER" && move2 === "ROCK" ||
    move1 === "SCISSORS" && move2 === "PAPER"
  ) {
    return "PLAYER1";
  }

  return "PLAYER2";
};

export const onMessage = async (data: object) => {
  console.log(data);
  const validationResult = messageValidator.safeParse(data);
  if (!validationResult.success) {
    console.log(validationResult.error);
  } else {
    await insertSingleMatch(validationResult.data);
  }
};

const insertSingleMatch = async (message: message) => {
  prisma.$transaction(async (tx) => {
    const playerNameData = [
      { name: message.playerA.name },
      { name: message.playerB.name },
    ];

    // Create players
    await tx.player.createMany({
      data: playerNameData,
      skipDuplicates: true,
    });

    // Get players with ids
    const players = await tx.player.findMany({
      where: {
        name: { in: playerNameData.map((player) => player.name) },
      },
    });

    const player1 = players.find((p) => p.name === message.playerA.name);
    const player2 = players.find((p) => p.name === message.playerB.name);
    const move1 = message.playerA.played;
    const move2 = message.playerB.played;
    const result = getMatchResult(move1, move2);

    if (player1 && player2) {
      // Create matches
      await tx.match.createMany({
        data: [{
          id: message.gameId,
          player1Id: player1.id,
          player2Id: player2.id,
          move1,
          move2,
          result,
          date: new Date(message.time).toISOString(),
        }],
        skipDuplicates: true,
      });
    }
  });
};

export const onBatchPayload = async (data: object) => {
  const validationResult = z.array(messageValidator).safeParse(data);
  if (!validationResult.success) {
    console.log(validationResult.error);
  } else {
    await insertMatchBatch(validationResult.data);
  }
};

const insertMatchBatch = async (messages: message[]) => {
  console.log(`New batch from history with ${messages.length} items.`);
  for (const message of messages) {
    await insertSingleMatch(message);
    await sleep(100);
  }
  console.log(`Inserted from history with ${messages.length} items.`);
};
