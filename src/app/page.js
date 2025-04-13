'use client';
import { useState, useRef, useEffect } from 'react';
import RenderBoard from "./ui/RenderBoard";
import { newBoard, newSettlementFromClick } from "./lib/hex-board";
import { Player } from "./lib/player";
import { Settlement } from "./lib/settlement";
import { Button } from '@mui/material';

const Home = () => {
  const [grid, setGrid] = useState(newBoard());
  const [buildings, setBuildings] = useState([]);
  const [players, setPlayers] = useState([]);
  const [dice, setDice] = useState([]);
  const [rolled, setRolled] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(0);
  const svgDrawRef = useRef(null);
  const svgContainerRef = useRef(null);


  useEffect(() => {
    setPlayers([
      new Player("Black", "#222222"),
      new Player("Blue (Based)", "#1b63cf"),
      new Player("White (Bot)", "#f7f7f7"),
      new Player("Orange (Grr)", "#db8121"),
      new Player("Red", "#bf2121"),
    ]);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (!svgDrawRef.current) return;
    
    const rect = svgContainerRef.current.getBoundingClientRect();
    const viewbox = svgDrawRef.current.viewbox();
    
    const clickX = e.clientX - rect.left; // value from 0 to rect.width
    const clickY = e.clientY - rect.top;  // value from 0 to rect.height

    // Scale linearly to viewBox
    const scaledX = viewbox.x + (clickX / rect.width) * (viewbox.x2 - viewbox.x);
    const scaledY = viewbox.y + (clickY / rect.height) * (viewbox.y2 - viewbox.y);
    
    const settle = newSettlementFromClick(grid, scaledX, scaledY, players[playerTurn]);
    if (!settle) return;
    const minDistance = grid.getHex([0, 0]).dimensions.xRadius + 10;

    for (const building of buildings) {
      if (!building instanceof Settlement) continue;
      const dx = Math.abs(settle.x - building.x);
      const dy = Math.abs(settle.y - building.y);
      const distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < minDistance) {
        console.log("Too close to another building");
        return;
      }
    }

    setBuildings([...buildings, settle]);
  }

  const newRoll = () => {
    setRolled(true);
    const r1 = Math.floor(Math.random() * 6) + 1;
    const r2 = Math.floor(Math.random() * 6) + 1;
    setDice([r1, r2]);
    const numRolled = r1 + r2;

    buildings.map((settlement) => {
      const settlementResources = settlement.collectResources(numRolled);
      if (!settlementResources.length) return;
      
      settlementResources.forEach((resource) => {
        const player = settlement.player;
        if (!player.resources[resource]) {
          player.resources[resource] = 0;
        }
        player.resources[resource]++;
      });
    });
  }

  const handleEndTurn = () => {
    setRolled(false);
    setPlayerTurn((prev) => (prev + 1) % players.length);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">
        {players.length > 0 ? `Current Player: ${players[playerTurn].name}` : "Loading..."}
      </h1>

      <RenderBoard 
        grid={grid}
        buildings={buildings}
        onClick={handleClick}
        svgDrawRef={svgDrawRef}
        svgContainerRef={svgContainerRef}
      />

      <div className='flex flex-row items-center justify-center gap-4'>
        <Button
          variant='contained'
          onClick={() => {setGrid(newBoard())}}
        >
          New Board
        </Button>

        <Button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            variant='contained'
            disabled={rolled}
            onClick={newRoll}
        >
            Roll the Dice
        </Button>

        <Button
          variant='contained'
          disabled={!rolled}
          onClick={handleEndTurn}
        >
          End Turn
        </Button>
      </div>

      {(dice[0] && dice[1]) ? <div className='justify-center p-4'>
        <h2>{rolled ? null : "(prev) "}Rolled {dice[0] + dice[1]} ({dice[0]} + {dice[1]})</h2>
      </div> : null}
    </div>
  );
}

export default Home;