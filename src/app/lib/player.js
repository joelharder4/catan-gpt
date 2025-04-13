class Player {
    constructor(name, colour, vp) {
        this.name = name;
        this.colour = colour;
        this.vp = vp; // Victory Points
        this.developmentCards = {
            knight: 0,
            monopoly: 0,
            roadBuilding: 0,
            yearOfPlenty: 0,
            victoryPoint: 0
        };
        this.resources = {
            wood: 0,
            brick: 0,
            sheep: 0,
            wheat: 0,
            ore: 0
        };
    }
}

export { Player };