// Dungeon Generation Algorithm
// Uses a simple room-based approach with corridors

export const TILES = {
  WALL: 'wall',
  FLOOR: 'floor',
  DOOR: 'door',
  STAIRS: 'stairs',
  CHEST: 'chest'
};

class Room {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.centerX = Math.floor(x + width / 2);
    this.centerY = Math.floor(y + height / 2);
  }

  intersects(other) {
    return !(this.x + this.width <= other.x || 
             other.x + other.width <= this.x ||
             this.y + this.height <= other.y ||
             other.y + other.height <= this.y);
  }
}

export class DungeonGenerator {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.rooms = [];
    this.dungeon = Array(height).fill().map(() => Array(width).fill(TILES.WALL));
  }

  // Generate a random integer between min and max (inclusive)
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Create a room in the dungeon
  createRoom(room) {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          this.dungeon[y][x] = TILES.FLOOR;
        }
      }
    }
  }

  // Create a horizontal corridor
  createHorizontalCorridor(x1, x2, y) {
    const startX = Math.min(x1, x2);
    const endX = Math.max(x1, x2);
    for (let x = startX; x <= endX; x++) {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.dungeon[y][x] = TILES.FLOOR;
      }
    }
  }

  // Create a vertical corridor
  createVerticalCorridor(y1, y2, x) {
    const startY = Math.min(y1, y2);
    const endY = Math.max(y1, y2);
    for (let y = startY; y <= endY; y++) {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.dungeon[y][x] = TILES.FLOOR;
      }
    }
  }

  // Connect two rooms with corridors
  connectRooms(room1, room2) {
    // Create L-shaped corridor
    if (Math.random() < 0.5) {
      // Horizontal first, then vertical
      this.createHorizontalCorridor(room1.centerX, room2.centerX, room1.centerY);
      this.createVerticalCorridor(room1.centerY, room2.centerY, room2.centerX);
    } else {
      // Vertical first, then horizontal
      this.createVerticalCorridor(room1.centerY, room2.centerY, room1.centerX);
      this.createHorizontalCorridor(room1.centerX, room2.centerX, room2.centerY);
    }
  }

  // Check if two rooms are connected by checking for a path between their centers
  areRoomsConnected(room1, room2) {
    // Simple check: if there's a direct path between room centers
    
    // Check horizontal path
    let horizontalClear = true;
    const startX = Math.min(room1.centerX, room2.centerX);
    const endX = Math.max(room1.centerX, room2.centerX);
    for (let x = startX; x <= endX; x++) {
      if (this.dungeon[room1.centerY][x] === TILES.WALL) {
        horizontalClear = false;
        break;
      }
    }
    
    // Check vertical path
    let verticalClear = true;
    const startY = Math.min(room1.centerY, room2.centerY);
    const endY = Math.max(room1.centerY, room2.centerY);
    for (let y = startY; y <= endY; y++) {
      if (this.dungeon[y][room2.centerX] === TILES.WALL) {
        verticalClear = false;
        break;
      }
    }
    
    return horizontalClear && verticalClear;
  }

  // Place special items in the dungeon
  placeSpecialItems() {
    const floorTiles = [];
    
    // Find all floor tiles
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.dungeon[y][x] === TILES.FLOOR) {
          floorTiles.push({ x, y });
        }
      }
    }

    if (floorTiles.length === 0) return;

    // Place 1-3 chests randomly
    const numChests = this.randomInt(1, 3);
    for (let i = 0; i < numChests && floorTiles.length > 0; i++) {
      const randomIndex = this.randomInt(0, floorTiles.length - 1);
      const tile = floorTiles.splice(randomIndex, 1)[0];
      this.dungeon[tile.y][tile.x] = TILES.CHEST;
    }

    // Place stairs down
    if (floorTiles.length > 0) {
      const randomIndex = this.randomInt(0, floorTiles.length - 1);
      const tile = floorTiles[randomIndex];
      this.dungeon[tile.y][tile.x] = TILES.STAIRS;
    }
  }

  // Generate enemy spawn points
  generateEnemySpawns() {
    const spawns = [];
    const floorTiles = [];
    
    // Find all floor tiles
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.dungeon[y][x] === TILES.FLOOR) {
          floorTiles.push({ x, y });
        }
      }
    }

    // Place 3-8 enemies randomly
    const numEnemies = this.randomInt(3, 8);
    for (let i = 0; i < numEnemies && floorTiles.length > 0; i++) {
      const randomIndex = this.randomInt(0, floorTiles.length - 1);
      const tile = floorTiles.splice(randomIndex, 1)[0];
      
      // Don't spawn enemies too close to starting position (1,1)
      if (Math.abs(tile.x - 1) + Math.abs(tile.y - 1) > 3) {
        spawns.push(tile);
      }
    }

    return spawns;
  }

  // Main generation method
  generate() {
    // Reset dungeon
    this.dungeon = Array(this.height).fill().map(() => Array(this.width).fill(TILES.WALL));
    this.rooms = [];

    // Try to place rooms
    const maxRooms = this.randomInt(4, 8);
    const minRoomSize = 3;
    const maxRoomSize = 8;

    for (let i = 0; i < maxRooms; i++) {
      const width = this.randomInt(minRoomSize, maxRoomSize);
      const height = this.randomInt(minRoomSize, maxRoomSize);
      const x = this.randomInt(1, this.width - width - 1);
      const y = this.randomInt(1, this.height - height - 1);

      const newRoom = new Room(x, y, width, height);

      // Check if room intersects with existing rooms
      let intersects = false;
      for (const room of this.rooms) {
        if (newRoom.intersects(room)) {
          intersects = true;
          break;
        }
      }

      if (!intersects) {
        this.createRoom(newRoom);
        
        // Connect to previous room
        if (this.rooms.length > 0) {
          const prevRoom = this.rooms[this.rooms.length - 1];
          this.connectRooms(prevRoom, newRoom);
        }
        
        this.rooms.push(newRoom);
      }
    }

    // Ensure all rooms are connected by creating additional connections
    if (this.rooms.length > 2) {
      // Connect each room to at least one other room
      for (let i = 1; i < this.rooms.length; i++) {
        const currentRoom = this.rooms[i];
        let connected = false;
        
        // Check if current room is already connected to any previous room
        for (let j = 0; j < i; j++) {
          const otherRoom = this.rooms[j];
          if (this.areRoomsConnected(currentRoom, otherRoom)) {
            connected = true;
            break;
          }
        }
        
        // If not connected, connect to a random previous room
        if (!connected && i > 0) {
          const randomPrevRoom = this.rooms[this.randomInt(0, i - 1)];
          this.connectRooms(randomPrevRoom, currentRoom);
        }
      }
    }

    // If no rooms were created, create a simple fallback room
    if (this.rooms.length === 0) {
      const fallbackRoom = new Room(1, 1, this.width - 2, this.height - 2);
      this.createRoom(fallbackRoom);
      this.rooms.push(fallbackRoom);
    }

    // Ensure there's always a safe starting area
    this.ensureSafeStartingArea();

    // Check connectivity and fix isolated areas
    this.connectIsolatedAreas();

    // Place special items
    this.placeSpecialItems();

    return {
      dungeon: this.dungeon,
      enemySpawns: this.generateEnemySpawns(),
      playerStart: this.findSafePlayerStart()
    };
  }

  // Ensure there's always a safe starting area
  ensureSafeStartingArea() {
    // Create a 3x3 safe area around (1,1)
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (x < this.width && y < this.height) {
          this.dungeon[y][x] = TILES.FLOOR;
        }
      }
    }
  }

  // Find a safe player starting position
  findSafePlayerStart() {
    // First try the guaranteed safe area
    if (this.dungeon[1] && this.dungeon[1][1] === TILES.FLOOR) {
      return { x: 1, y: 1 };
    }
    
    // If that fails, find the first available floor tile
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.dungeon[y][x] === TILES.FLOOR) {
          return { x, y };
        }
      }
    }
    
    // Fallback to (1,1) and make it a floor tile
    this.dungeon[1][1] = TILES.FLOOR;
    return { x: 1, y: 1 };
  }

  // Check if all floor tiles are connected using flood fill
  checkConnectivity() {
    const floorTiles = [];
    
    // Find all floor tiles
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.dungeon[y][x] === TILES.FLOOR) {
          floorTiles.push({ x, y });
        }
      }
    }

    if (floorTiles.length === 0) return false;

    // Start flood fill from the first floor tile
    const startTile = floorTiles[0];
    const visited = new Set();
    const queue = [startTile];
    visited.add(`${startTile.x},${startTile.y}`);

    // Flood fill to find all connected floor tiles
    while (queue.length > 0) {
      const current = queue.shift();
      const directions = [
        { x: 0, y: -1 }, // up
        { x: 1, y: 0 },  // right
        { x: 0, y: 1 },  // down
        { x: -1, y: 0 }  // left
      ];

      for (const dir of directions) {
        const newX = current.x + dir.x;
        const newY = current.y + dir.y;
        const key = `${newX},${newY}`;

        if (newX >= 0 && newX < this.width && 
            newY >= 0 && newY < this.height &&
            !visited.has(key) &&
            this.dungeon[newY][newX] === TILES.FLOOR) {
          visited.add(key);
          queue.push({ x: newX, y: newY });
        }
      }
    }

    // Check if all floor tiles were visited
    return visited.size === floorTiles.length;
  }

  // Connect isolated areas by creating additional corridors - OPTIMIZED
  connectIsolatedAreas() {
    const floorTiles = [];
    
    // Find all floor tiles
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.dungeon[y][x] === TILES.FLOOR) {
          floorTiles.push({ x, y });
        }
      }
    }

    if (floorTiles.length === 0) return;

    // Try to connect isolated areas by creating corridors - REDUCED ATTEMPTS
    const maxAttempts = 5; // Reduced from 20 to 5
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;
      
      // Skip connectivity check if too many floor tiles (performance optimization)
      if (floorTiles.length > 50) {
        console.log('Skipping connectivity check for large dungeon');
        break;
      }
      
      try {
        if (this.checkConnectivity()) break;
      } catch (error) {
        console.warn('Connectivity check failed:', error);
        break;
      }
      
      // Pick two random floor tiles
      const tile1 = floorTiles[this.randomInt(0, floorTiles.length - 1)];
      const tile2 = floorTiles[this.randomInt(0, floorTiles.length - 1)];
      
      if (tile1.x === tile2.x && tile1.y === tile2.y) continue;

      try {
        // Create a corridor between them
        this.createHorizontalCorridor(tile1.x, tile2.x, tile1.y);
        this.createVerticalCorridor(tile1.y, tile2.y, tile2.x);
      } catch (error) {
        console.warn('Corridor creation failed:', error);
        break;
      }
    }
  }
}

// Utility function to generate a new dungeon
export const generateDungeon = (width, height) => {
  const generator = new DungeonGenerator(width, height);
  return generator.generate();
};

