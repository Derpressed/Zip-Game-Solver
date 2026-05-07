class Algorithm {

    static firstCoord(grid) {
        const coordArr = grid.firstBox;

        const width = coordArr[0];
        const height = coordArr[1];

        return [width, height];
    }

    static nextBox(grid, coordArr) {
        // check up, right, down, left - in order
        // must check for edge cases such as overflow   
        console.log(grid.getBox(0, 5));
    }

    static hunt(grid) {
        const firstCoordArr = Algorithm.firstCoord();
        this.nextBox(grid);

    }
}

module.exports = { Algorithm };