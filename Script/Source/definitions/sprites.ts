namespace Script {
    export const defFloorStraight4x1: TileDefinition = {
        name: 'FloorStraight',
        width: 1,
        height: 1,
        slopeMapping: () => 0.95,
        origin: FudgeCore.ORIGIN2D.CENTER,
    };

    export const defRampUpFull: TileDefinition = {
        name: 'RampUp',
        width: 2.5,
        height: 2,
        slopeMapping: (x) => {
            if (x > 0.1375) {
                return 0.43 * x + 0.54;
            }
            return 0.6;
        },
        origin: FudgeCore.ORIGIN2D.CENTER,
    };

    export const defBridge: TileDefinition = {
        name: 'Bridge',
        width: 4,
        height: 0.5,
        slopeMapping: (x) => (4 / 5) * x ** 2 - (4 / 5) * x + 0.6,
        origin: FudgeCore.ORIGIN2D.CENTER,
    };

    export const collidables: TileDefinition[] = [defFloorStraight4x1, defRampUpFull, defBridge];
}
