'use client';
import { useState, useRef } from 'react';
import RenderBoard from "./ui/RenderBoard";
import { newBoard, newSettlementFromClick } from "./lib/hex-board";
import { Player } from "./lib/player";

const Home = () => {
  const [grid, setGrid] = useState(newBoard());
  const [buildings, setBuildings] = useState([]);
  const svgDrawRef = useRef(null);
  const svgContainerRef = useRef(null);

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
    
    const settle = newSettlementFromClick(grid, scaledX, scaledY, new Player("Bot 1", "#db2525"));
    if (!settle) return;
    const minDistance = grid.getHex([0, 0]).dimensions.xRadius + 10;

    for (const building of buildings) {
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

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <RenderBoard 
        grid={grid}
        buildings={buildings}
        onClick={handleClick}
        svgDrawRef={svgDrawRef}
        svgContainerRef={svgContainerRef}
      />
      <button type='button' onClick={() => {setGrid(newBoard())}}>New Board</button>
    </div>
  );
}

export default Home;