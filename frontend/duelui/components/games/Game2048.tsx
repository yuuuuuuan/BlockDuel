import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../src/components/ui/button';

interface Game2048Props {
  onScoreUpdate: (score: number) => void;
}

const GRID_SIZE = 4;
const CELL_GAP = 16;
const CELL_SIZE = 80;
const CELL_BORDER_RADIUS = 8;

type Cell = {
  x: number;
  y: number;
  value: number;
  id: number;
  mergedFrom?: { x: number; y: number; value: number; id: number }[];
  previousPosition?: { x: number; y: number };
};

const Game2048: React.FC<Game2048Props> = ({ onScoreUpdate }) => {
  const [cells, setCells] = useState<Cell[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [idCounter, setIdCounter] = useState(0);
  
  // Get empty cells function
  const getEmptyCells = useCallback((cellsArray: Cell[] = cells) => {
    const emptyCells = [];
    
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!cellsArray.some(cell => cell.x === x && cell.y === y)) {
          emptyCells.push({ x, y });
        }
      }
    }
    
    return emptyCells;
  }, [cells]);
  
  // Add random tile
  const addRandomTile = useCallback((cellsArray: Cell[] = cells) => {
    const emptyCells = getEmptyCells(cellsArray);
    
    if (emptyCells.length > 0) {
      const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2, 10% chance for 4
      const newId = idCounter + 1;
      
      const newCells = [...cellsArray, { x, y, value, id: newId }];
      setCells(newCells);
      setIdCounter(newId);
      
      return newCells;
    }
    
    return cellsArray;
  }, [cells, idCounter, getEmptyCells]);
  
  // Find cell at specific coordinates
  const findCellAt = useCallback((x: number, y: number, cellsArray: Cell[] = cells) => {
    return cellsArray.find(cell => cell.x === x && cell.y === y);
  }, [cells]);
  
  // Check if position is within bounds
  const isPositionWithinBounds = useCallback((position: { x: number; y: number }) => {
    return position.x >= 0 && position.x < GRID_SIZE &&
           position.y >= 0 && position.y < GRID_SIZE;
  }, []);
  
  // Find farthest position
  const findFarthestPosition = useCallback((
    cellsArray: Cell[],
    cell: Cell,
    vector: { x: number; y: number }
  ) => {
    let previous;
    let position = { x: cell.x, y: cell.y };
    
    do {
      previous = position;
      position = {
        x: previous.x + vector.x,
        y: previous.y + vector.y
      };
    } while (
      isPositionWithinBounds(position) &&
      !findCellAt(position.x, position.y, cellsArray)
    );
    
    return {
      farthest: previous,
      next: isPositionWithinBounds(position) ? position : null
    };
  }, [isPositionWithinBounds, findCellAt]);
  
  // Check if moves are available
  const movesAvailable = useCallback((cellsArray: Cell[]) => {
    // Check for empty cells
    if (getEmptyCells(cellsArray).length > 0) return true;
    
    // Check for possible merges
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const cell = findCellAt(x, y, cellsArray);
        
        if (cell) {
          // Check for available merges with adjacent cells
          for (const direction of ["up", "right", "down", "left"]) {
            const vector = getVector(direction);
            const adjX = x + vector.x;
            const adjY = y + vector.y;
            
            if (isPositionWithinBounds({ x: adjX, y: adjY })) {
              const adjacent = findCellAt(adjX, adjY, cellsArray);
              
              if (adjacent && adjacent.value === cell.value) {
                return true;
              }
            }
          }
        }
      }
    }
    
    return false;
  }, [findCellAt, getEmptyCells, isPositionWithinBounds]);
  
  // Initialize game board
  const setupGame = useCallback(() => {
    const newCells: Cell[] = [];
    setGameOver(false);
    setWon(false);
    setCurrentScore(0);
    onScoreUpdate(0);
    setIdCounter(0);
    setCells(newCells);
    
    // Add two initial tiles
    addRandomTile(newCells);
    addRandomTile(newCells);
  }, [onScoreUpdate, addRandomTile]);
  
  // Get vector based on direction
  const getVector = (direction: string) => {
    switch (direction) {
      case "up": return { x: 0, y: -1 };
      case "right": return { x: 1, y: 0 };
      case "down": return { x: 0, y: 1 };
      case "left": return { x: -1, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };
  
  // Build traversals based on vector
  const buildTraversals = (vector: { x: number; y: number }) => {
    const traversals = {
      x: [] as number[],
      y: [] as number[]
    };
    
    for (let i = 0; i < GRID_SIZE; i++) {
      traversals.x.push(i);
      traversals.y.push(i);
    }
    
    // Always traverse from the farthest cell in the chosen direction
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();
    
    return traversals;
  };
  
  // Check if positions are equal
  const positionsEqual = (first: { x: number; y: number }, second: { x: number; y: number }) => {
    return first.x === second.x && first.y === second.y;
  };
  
  // Move tiles in a direction
  const moveTiles = useCallback((direction: string) => {
    if (gameOver) return;
    
    const vector = getVector(direction);
    const traversals = buildTraversals(vector);
    let moved = false;
    
    // Create a copy of the cells array for the move
    let newCells = cells.map(cell => ({
      ...cell,
      mergedFrom: undefined,
      previousPosition: { x: cell.x, y: cell.y }
    }));
    
    // Move tiles
    traversals.y.forEach(y => {
      traversals.x.forEach(x => {
        const cell = findCellAt(x, y, newCells);
        
        if (cell) {
          const { farthest, next } = findFarthestPosition(newCells, cell, vector);
          
          // Only update the cell position if it can be moved
          if (!positionsEqual(cell, farthest)) {
            cell.x = farthest.x;
            cell.y = farthest.y;
            moved = true;
          }
          
          // Check for merge
          if (next && findCellAt(next.x, next.y, newCells)?.value === cell.value) {
            const nextCell = findCellAt(next.x, next.y, newCells) as Cell;
            
            // Create a new tile with merged value
            const merged = {
              x: nextCell.x,
              y: nextCell.y,
              value: cell.value * 2,
              id: idCounter + 1,
              mergedFrom: [cell, nextCell]
            };
            
            // Remove the merged tiles
            newCells = newCells.filter(c => c.id !== cell.id && c.id !== nextCell.id);
            newCells.push(merged);
            
            // Update score
            const newScore = currentScore + merged.value;
            setCurrentScore(newScore);
            onScoreUpdate(newScore);
            
            setIdCounter(idCounter + 1);
            
            // Check for win (reaching 2048)
            if (merged.value === 2048 && !won) {
              setWon(true);
            }
            
            moved = true;
          }
        }
      });
    });
    
    // If the move was valid, add a new tile
    if (moved) {
      newCells = addRandomTile(newCells);
      
      // Check if the game is over
      if (!movesAvailable(newCells)) {
        setGameOver(true);
      }
      
      setCells(newCells);
    }
  }, [
    gameOver, cells, idCounter, currentScore, won, 
    addRandomTile, findCellAt, findFarthestPosition, 
    movesAvailable, onScoreUpdate
  ]);
  
  // Set up the game and keyboard controls
  useEffect(() => {
    setupGame();
    
    // Set up keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          moveTiles("up");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          moveTiles("down");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          moveTiles("left");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          moveTiles("right");
          break;
        default:
          return;
      }
      
      e.preventDefault();
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setupGame, gameOver, moveTiles]);
  
  // Cell style based on tile value
  const getCellStyle = (cell: Cell) => {
    const style = {
      transform: `translate(${cell.x * (CELL_SIZE + CELL_GAP)}px, ${cell.y * (CELL_SIZE + CELL_GAP)}px)`,
      width: `${CELL_SIZE}px`,
      height: `${CELL_SIZE}px`,
      borderRadius: `${CELL_BORDER_RADIUS}px`,
      transition: "all 0.15s ease",
      position: "absolute" as "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: cell.value < 1024 ? "24px" : cell.value < 10000 ? "20px" : "16px",
      fontWeight: "bold",
    };
    
    // Different background colors based on tile value
    const colorMap: Record<number, string> = {
      2: "bg-amber-100 text-gray-800",
      4: "bg-amber-200 text-gray-800",
      8: "bg-amber-300 text-gray-800",
      16: "bg-amber-400 text-white",
      32: "bg-amber-500 text-white",
      64: "bg-amber-600 text-white",
      128: "bg-yellow-400 text-white",
      256: "bg-yellow-500 text-white",
      512: "bg-yellow-600 text-white",
      1024: "bg-orange-500 text-white",
      2048: "bg-orange-600 text-white",
    };
    
    // For values higher than 2048
    const defaultClass = "bg-red-600 text-white";
    
    return {
      ...style,
      className: colorMap[cell.value] || defaultClass
    };
  };
  
  // Render cells
  const renderCells = () => {
    return cells.map(cell => {
      const { className, ...style } = getCellStyle(cell);
      
      return (
        <div
          key={cell.id}
          className={`${className} tile`}
          style={style}
        >
          {cell.value}
        </div>
      );
    });
  };
  
  // Render empty grid
  const renderEmptyGrid = () => {
    const emptyCells = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        emptyCells.push(
          <div
            key={`empty-${x}-${y}`}
            className="bg-gray-200 dark:bg-gray-700 opacity-30 rounded-lg"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              margin: CELL_GAP / 2,
            }}
          ></div>
        );
      }
    }
    
    return emptyCells;
  };
  
  // Handle touch/click swipe
  const handleSwipe = (direction: string) => {
    moveTiles(direction);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex items-center justify-between w-full max-w-md">
        <div>
          <h2 className="text-xl font-bold">Score: {currentScore}</h2>
        </div>
        <Button onClick={setupGame} variant="outline">
          New Game
        </Button>
      </div>
      
      <div
        className="relative bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6"
        style={{
          width: GRID_SIZE * (CELL_SIZE + CELL_GAP) + CELL_GAP,
          height: GRID_SIZE * (CELL_SIZE + CELL_GAP) + CELL_GAP,
        }}
      >
        <div className="grid grid-cols-4 grid-rows-4">
          {renderEmptyGrid()}
        </div>
        {renderCells()}
      </div>
      
      <div className="touch-controls grid grid-cols-3 gap-2 w-full max-w-xs">
        <div></div>
        <Button
          variant="outline"
          onClick={() => handleSwipe("up")}
          className="text-2xl py-3"
        >
          ↑
        </Button>
        <div></div>
        <Button
          variant="outline"
          onClick={() => handleSwipe("left")}
          className="text-2xl py-3"
        >
          ←
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSwipe("down")}
          className="text-2xl py-3"
        >
          ↓
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSwipe("right")}
          className="text-2xl py-3"
        >
          →
        </Button>
      </div>
      
      {(gameOver || won) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
              {won ? "You Win!" : "Game Over!"}
            </h2>
            <p className="mb-6">Your score: {currentScore}</p>
            <Button onClick={setupGame}>Play Again</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2048;