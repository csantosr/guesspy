"use client";

import { useAtomValue } from "jotai";
import { type FC, useMemo, useState } from "react";
import { GameCard } from "@/game/_components/card";
import { gameSettingsAtom } from "../../_store/game-settings";
import { GameTimer } from "./timer";

export const Game: FC = () => {
  const gameSettings = useAtomValue(gameSettingsAtom);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Generate spy assignments
  const playerRoles = useMemo(() => {
    const players = gameSettings.players.map((p) => p.name);
    const spyCount = gameSettings.randomNumberOfSpies
      ? Math.floor(Math.random() * players.length) + 1
      : Number(gameSettings.numberOfSpies);

    // Create an array with spy indices
    const spyIndices = new Set<number>();
    while (spyIndices.size < spyCount && spyIndices.size < players.length) {
      spyIndices.add(Math.floor(Math.random() * players.length));
    }

    return players.map((name, index) => ({
      name,
      isSpy: spyIndices.has(index),
    }));
  }, [gameSettings]);

  const allPlayersChecked = currentPlayerIndex >= playerRoles.length;

  // Show timer once all players have checked their cards
  if (allPlayersChecked) {
    return <GameTimer />;
  }

  const currentPlayer = playerRoles[currentPlayerIndex];
  if (!currentPlayer) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>No players found. Please set up the game first.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="text-center">
        <h2 className="mb-2 font-bold text-2xl">
          Player {currentPlayerIndex + 1} of {playerRoles.length}
        </h2>
        <p className="text-muted-foreground">
          Click the card to reveal your role, click again to continue
        </p>
      </div>

      <GameCard
        player={currentPlayer}
        word="WORD"
        onFinishCheck={() => setCurrentPlayerIndex(currentPlayerIndex + 1)}
      />
    </div>
  );
};
