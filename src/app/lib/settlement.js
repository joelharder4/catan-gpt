class Settlement {
    constructor(x, y, adjacentHexes, player) {
        this.x = x;
        this.y = y;
        this.player = player;
        this.colour = player.colour;

        this.adjacentHexes = adjacentHexes;
    }

    collectResources(numRolled) {
        const resources = [];
        this.adjacentHexes.forEach(hex => {
            if (hex.number === numRolled) {
                resources.push(hex.resource);
            }
        });
        return resources;
    }
}


class City extends Settlement {
    constructor(x, y, adjacentHexes) {
        super(x, y, adjacentHexes);
    }

    collectResources(numRolled) {
        const resources = super.collectResources(numRolled);
        return resources.flatMap(i => [i, i]);
    }
}


export { Settlement, City };