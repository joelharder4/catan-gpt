class Settlement {
    constructor(x, y, adjacentHexes, player = null) {
        this.x = x;
        this.y = y;
        this.player = player;
        this.colour = player ? player.colour : '#000000';

        this.adjacentHexes = adjacentHexes;
    }

    collectResources(numRolled) {
        const resources = [];
        this.adjacentHexes.forEach(hex => {
            if (hex.number === numRolled) {
                resources.push(hex.type);
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