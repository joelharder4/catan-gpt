'use client';
import { useState, useRef } from 'react';
import RenderBoard from "./ui/RenderBoard";
import { newBoard } from "./lib/hex-board";

const Home = () => {
  const [grid, setGrid] = useState(newBoard());
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
    
    const svgPoint = { x: scaledX, y: scaledY };
    
    const hex = grid.pointToHex(svgPoint, { allowOutside: false });
    console.log(hex);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <RenderBoard 
        grid={grid}
        onClick={handleClick}
        svgDrawRef={svgDrawRef}
        svgContainerRef={svgContainerRef}
      />
      <button type='button' onClick={() => {setGrid(newBoard())}}>New Board</button>
    </div>
  );
}

export default Home;