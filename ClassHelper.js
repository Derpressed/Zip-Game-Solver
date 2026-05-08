class Box {
    constructor(div) {
        this.positionX = 0;
        this.positionY = 0;
        this.div = div; 

        this.numOfChild = 0;
        this.number = 0;
        this.wall = [];
    }

    async wallCheck() {
        const children = await this.div.locator(':scope > div');
        const count = await children.count();
        for (let i = 0; i < count; i++) {
            const child = children.nth(i);

            const top = await child.evaluate(el => el.style.top);
            const bottom = await child.evaluate(el => el.style.bottom);
            const left = await child.evaluate(el => el.style.left);
            const right = await child.evaluate(el => el.style.right);

            // if top is missing then the wall must be at the bottom
            if (top == 0) {
                this.wall.push("bottom");
            }

            // if bottom is missing then the wall must be at the top
            if (bottom == 0) {
                this.wall.push("top");
            }

            // if left is missing then the wall must be at the right
            if (left == 0) {
                this.wall.push("right");
            }

            // if right is missing then the wall must be at the left
            if (right == 0) {
                this.wall.push("left");
            }
        }
    }
    
    async clickBox() {
        await this.div.click();
    }
    async numCheck() {
        const children = await this.div.locator(":scope > span");
        const count = await children.count();
        
        let isFirstCoord = false;
        let highestNum = 0;
        
        for (let i = 0; i < count; i++) {
            const spanChild = children.nth(i);
            this.number = await spanChild.textContent();

            if (1 == parseInt(this.number)) {
                isFirstCoord = true;
            }
        }

        return isFirstCoord;
    }

    async childCheck() {
        await this.wallCheck();
        return await this.numCheck();
    }


    setPosition(x, y) {
        this.positionX = x;
        this.positionY = y;
    }



    toString() {
        return `Box has a position of x = ${this.positionX} y = ${this.positionY}\tBox has number ${this.number}\tBox has walls at ${this.wall}`;
    }
}


class Grid {
    constructor(div) {
        this.rows = 0; // Global variables
        this.columns = 0;
        this.div = div;
    
        this.gridArr = null;
        this.firstBox = null;
        this.highestNum = 0;
    }

    static gridArrHelper(dimension) {
        const mainArr = [];
        for (let i = 0; i < dimension; i++) {
            mainArr[i] = [];

            for (let j = 0; j < dimension; j++) {
                mainArr[i][j] = null;
            }
        }
        return mainArr;
    }
    
    setGridArr(arr) {
        this.gridArr = arr;
    }

    getGridArr() {
        return this.gridArr;
    }

    static async getGridClass(page) {
        const parentDiv = page.locator('[role="grid"]');
        const rowByCol = await parentDiv.locator(':scope > div').count();

        const newClass = new Grid(parentDiv);
        const rowAndCol = Math.sqrt(rowByCol);
        
        // Error checking whether row x col is a perfect square root (assume row == col)
        if (!Number.isInteger(rowAndCol)) {
            return null;
        }

        // make the empty 2D array
        newClass.setGridArr(Grid.gridArrHelper(rowAndCol));
        const gridArr = newClass.getGridArr();

        let highestNum = 0;
        // iterate through the child divs and find the boxes for the grid
        // i = row, j = columns
        for (let i = 0; i < rowAndCol; i++) {
            for (let j = 0; j < rowAndCol; j++) {
                const childBox = await parentDiv.locator(`[data-row="${i}"][data-col="${j}"]`);
                
                const newChildBox = new Box(childBox);
                newChildBox.setPosition(j, i);
                const isFirstCoord = await newChildBox.childCheck();
                
                if (isFirstCoord) {
                    newClass.firstBox = newChildBox;
                }

                // console.log(newChildBox.toString());
                gridArr[i][j] = newChildBox;
                if (parseInt(newChildBox.number) > highestNum) {
                    highestNum = newChildBox.number;
                }
            }
        }
        newClass.highestNum = highestNum;
        newClass.setDimensions(rowAndCol, rowAndCol);
        return newClass;
    }

    setDimensions(row, col) {
        this.rows = row;
        this.columns = col;
    }

    getDimensions() {
        return [this.columns, this.rows];
    }

    // this function uses (x , y)
    getBox(col, row) {
        return this.gridArr[row][col];
    }

    toString() {
        console.log(`Number of rows: ${this.rows}\nNumber of columns: ${this.columns}`)
    }
}


module.exports = { Grid, Box }