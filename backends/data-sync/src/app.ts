import { prisma } from "./configs/db.ts";
import { Result } from "./generated/enums.ts";
import matchValidator from "./validators/matchValidator.ts";
import type { match } from "./validators/matchValidator.ts";
import { sleep } from "./utils/sleep.ts";
import type { RPS } from "./validators/rpsValidator.ts";

const getMatchResult = async (match: match): Promise<{ move1: RPS, move2: RPS, result: Result }> => {
  const player1 = match.playerA;
  const player2 = match.playerB;
  const move1 = player1.played;
  const move2 = player2.played;

  if (move1 === move2) {
    return { move1, move2, result: "DRAW" };
  }

  const ruleset = {
    ROCK: ["SCISSORS"],
    PAPER: ["ROCK"],
    SCISSORS: ["PAPER"],
  }

  // Extended ruleset:
  // const ruleset = {
  //   ROCK: ["SCISSORS", "LIZARD", "DOG"],
  //   PAPER: ["ROCK", "SPOCK", "DOG"],
  //   SCISSORS: ["PAPER", "LIZARD", "DOG"],
  //   SPOCK: ["SCISSORS", "ROCK", "DOG"],
  //   LIZARD: ["ROCK", "SPOCK", "DOG"],
  //   BLADE: ["ROCK", "PAPER", "SCISSORS", "SPOCK", "LIZARD"],
  //   DOG: ["BLADE"],
  // }

  if (ruleset[player1.played].includes(player2.played)) {
    return { move1, move2, result: "PLAYER1" };
  }

  return { move1, move2, result: "PLAYER2" };
};

export const onMessage = async (message: object): Promise<boolean> => {
  const { success, data } = await validateMatch(message);
  if (success) {
    await insertSingleMatch(data);
  }
  return success;
};

const validateMatch = async (
  message: object,
): Promise<
  { success: true; data: match } | { success: false; data: undefined }
> => {
  const validationResult = matchValidator.safeParse(message);
  if (validationResult.success) {
    const data = validationResult.data;
    if (data.playerA.name !== data.playerB.name) {
      //console.log(`Validation success: ${JSON.stringify(data)}`);
      return { success: true, data };
    } else {
      console.log(`Error: Player tried to play against themselves.`);
      console.log(`Player 1: ${data.playerA.name}`);
      console.log(`Player 2: ${data.playerB.name}`);
    }
  } else {
    console.log(`Error: ${JSON.stringify(message)}`);
    console.log(`Error: ${validationResult.error.issues[0].message}`);
  }
  return { success: false, data: undefined };
};

const insertSingleMatch = async (match: match): Promise<void> => {
  prisma.$transaction(async (tx) => {
    const playerNameData = [
      { name: match.playerA.name },
      { name: match.playerB.name },
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

    const player1 = players.find((p) => p.name === match.playerA.name);
    const player2 = players.find((p) => p.name === match.playerB.name);
    const { move1, move2, result } = await getMatchResult(match);

    if (player1 && player2) {
      // Create matches
      await tx.match.createMany({
        data: [{
          id: match.gameId,
          player1Id: player1.id,
          player2Id: player2.id,
          move1,
          move2,
          result,
          datetime: match.time
        }],
        skipDuplicates: true,
      });
    }
  });
};

export const insertMatchBatch = async (messages: object[]): Promise<void> => {
  let inserts = messages.length;
  console.log(`New batch from history with ${messages.length} items.`);
  for (const message of messages) {
    const success = await onMessage(message);
    if (!success) {
      inserts -= 1;
    }
    await sleep(10);
  }
  console.log(
    `Inserted from history with ${inserts} items. ${
      messages.length - inserts
    } validation failures.`,
  );
};
