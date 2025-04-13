import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    colour: { type: String, required: false },
    vp: { type: Number, default: 0 },
    developmentCards: {
        knight: { type: Number, default: 0 },
        monopoly: { type: Number, default: 0 },
        roadBuilding: { type: Number, default: 0 },
        yearOfPlenty: { type: Number, default: 0 },
        victoryPoint: { type: Number, default: 0 }
    },
    resources: {
        wood: { type: Number, default: 0 },
        brick: { type: Number, default: 0 },
        sheep: { type: Number, default: 0 },
        wheat: { type: Number, default: 0 },
        ore: { type: Number, default: 0 }
    }
});

export default mongoose.models.Player || mongoose.model('Player', PlayerSchema);