namespace Script {
    export const defFloorStraight4x1: TileDefinition = {
        name: 'FloorStraight',
        width: 1,
        height: 1,
        slopeMapping: () => 1,
        origin: FudgeCore.ORIGIN2D.CENTER,
    };

    export const defRampUpFull: TileDefinition = {
        name: 'RampUp',
        width: 2.5,
        height: 2,
        slopeMapping: (x) => 0.375 * x + 0.625,
        origin: FudgeCore.ORIGIN2D.CENTER,
    };

    export const collidables: TileDefinition[] = [defFloorStraight4x1, defRampUpFull];
}
