class Algorithm {

    // check if the next coordinate has a number that isn't what we want
    static checkNum(grid, num, nextPosX, nextPosY) {
        const nextBox = grid.getBox(nextPosX, nextPosY);
        const valid = true;
        // if the num == 0 (path) then replace with our current number and return true
        const nextBoxNum = parseInt(nextBox.number);
        
        // checks whether the nextBox is desired path / free path
        if (num + 1 != nextBoxNum && nextBoxNum != 0) {
            return false;
        }
        return valid;
    }

    // check if our position exceeds that of the dimensions
    static checkValidPos(gridDim, evalPos) {
        return (evalPos >= 0 && evalPos <= (gridDim - 1));
    }

    // check if our current box has limitations to go to a certain direction (used by type)
    static checkWall(box, type) {
        const valid = true;
        for (let i = 0; i < box.wall.length; i++) {
            if (type == box.wall[i]) {
                return false;
            }
        }
        return valid;
    }

    static boxEval(grid, box, solved, num, set) {
        const gridWidth = grid.columns;
        const gridHeight = grid.rows;

        const boxPosX = box.positionX;
        const boxPosY = box.positionY;
        const boxNum = parseInt(box.number);


        const key = `${boxPosX},${boxPosY}`;
        set.add(key);
        
        // check if our current Box has the same number as our 'num'
        console.log(key);
        if (boxNum != 0 && num + 1 == boxNum) {
            num++;
            if (parseInt(grid.highestNum) == num && set.size === grid.rows * grid.columns) {
                return set;
            }
            
        }


        // lets try to go up first (y - 1); type = "top"
        if (this.checkValidPos(gridHeight, boxPosY - 1)) {
            if (!set.has(`${boxPosX},${boxPosY - 1}`)) {
                if (this.checkWall(box, "top")) {
                    if (this.checkNum(grid, num, boxPosX, boxPosY - 1)) { // this function handles the num changing
                        const theNextBox = grid.getBox(boxPosX, boxPosY - 1);
                        const result = this.boxEval(grid, theNextBox, solved, num, set);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
        }

        // lets try going right next (x + 1); type = "right"
        if (this.checkValidPos(gridWidth, boxPosX + 1)) {
            if (!set.has(`${boxPosX + 1},${boxPosY}`)) {
                if (this.checkWall(box, "right")) {
                    if (this.checkNum(grid, num, boxPosX + 1, boxPosY)) {
                        const theNextBox = grid.getBox(boxPosX + 1, boxPosY);
                        const result = this.boxEval(grid, theNextBox, solved, num, set);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
        }

        // lets try going down next (y + 1); type = "bottom"
        if (this.checkValidPos(gridHeight, boxPosY + 1)) {
            if (!set.has(`${boxPosX},${boxPosY + 1}`)) {
                if (this.checkWall(box, "bottom")) {
                    if (this.checkNum(grid, num, boxPosX, boxPosY + 1)) {
                        const theNextBox = grid.getBox(boxPosX, boxPosY + 1);
                        const result = this.boxEval(grid, theNextBox, solved, num, set)
                        if (result) {
                            return result;
                        }
                    }
                }
            }
        }

        // lets try going left next (x - 1); type = "left"
        if (this.checkValidPos(gridWidth, boxPosX - 1)) {
            if (!set.has(`${boxPosX - 1},${boxPosY}`)) {
                if (this.checkWall(box, "left")) {
                    if (this.checkNum(grid, num, boxPosX - 1, boxPosY)) {
                        const theNextBox = grid.getBox(boxPosX - 1, boxPosY);
                        const result = this.boxEval(grid, theNextBox, solved, num, set);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
        }

        set.delete(key);
        return null;
    }

    static hunt(grid) {
        // find the firstBox
        const visitedSet = new Set();
        let startNum = 1;
        let solved = false;
        
        // this.nextBox(grid, grid.firstBox, visitedSet, startNum, solved);
        
        const pathSet = this.boxEval(grid, grid.firstBox, solved, startNum, visitedSet)
        return pathSet;
    }
}

module.exports = { Algorithm };