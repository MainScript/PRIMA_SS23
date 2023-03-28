namespace Script {
  export const defFloorStraight4x1: TileDefinition = {
    name: "FloorStraight4x1",
    width: 4,
    height: 1,
    slopeMapping: () => 1,
    origin: FudgeCore.ORIGIN2D.TOPLEFT
  };

  export const defRampUpFull: TileDefinition = {
    name: "RampUpFull",
    width: 2.5,
    height: 2,
    slopeMapping: (x) => 0.75 * x,
    origin: FudgeCore.ORIGIN2D.BOTTOMLEFT
  };

  export const collidables: TileDefinition[] = [
    defFloorStraight4x1,
    defRampUpFull
  ];
}