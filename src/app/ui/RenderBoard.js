'use client';

import { SVG } from '@svgdotjs/svg.js';
import { useEffect } from 'react';

const RenderBoard = ({ grid, onClick, svgDrawRef, svgContainerRef }) => {

  useEffect(() => {
    if (!svgContainerRef.current) return;

    if (!svgDrawRef.current) {
      svgDrawRef.current = SVG().addTo(svgContainerRef.current).size('100%', '100%');
    }
    
    const draw = svgDrawRef.current;

    // Calculate the bounding box of the grid
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    grid.forEach(hex => {
      hex.corners.forEach(({ x, y }) => {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      });
    });

    // Optional: Apply extra margin so the hexes aren’t flush to the edge.
    const margin = 5;
    minX -= margin;
    minY -= margin;
    maxX += margin;
    maxY += margin;

    const viewBoxWidth = maxX - minX;
    const viewBoxHeight = maxY - minY;
    
    
    // Set the viewBox to include the whole grid
    draw.viewbox(minX, minY, viewBoxWidth, viewBoxHeight);

    // Render each hex without hard-coded offsets
    function renderSVG(hex) {
  // Create a group for both polygon and text
  const group = draw.group();
  
  // Add the polygon to the group
  const polygon = group
    .polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
    .fill(hex.colour)
    .stroke({ width: 2, color: '#999' });
  
  // Calculate center of the hexagon
  let centerX = 0;
  let centerY = 0;
  hex.corners.forEach(corner => {
    centerX += corner.x;
    centerY += corner.y;
  });
  centerX /= hex.corners.length;
  centerY /= hex.corners.length;
  
  // Add number text to the center
  if (hex.number !== null) {
    const text = group
      .text(hex.number.toString())
      .font({
        family: 'Arial',
        size: 10,
        weight: 'bold',
        anchor: 'middle',
        leading: '1.5em'
      })
      .fill('#000')
      .center(centerX, centerY);
  }
  
  // Add resource type text below the number
  group
    .text(hex.type || '')
    .font({
      family: 'Arial',
      size: 5,
      anchor: 'middle'
    })
    .fill('#333')
    .center(centerX, centerY + 15);
  
  return group;
}

    grid.forEach(renderSVG);
  }, [grid, svgContainerRef, svgDrawRef]);

  return <div ref={svgContainerRef} onClick={onClick} className='w-[70vw] max-w-[70vh]'/>;
}

export default RenderBoard;