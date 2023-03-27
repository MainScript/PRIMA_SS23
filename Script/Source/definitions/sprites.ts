namespace Script {
  export const defFloorStraight4x1: TileDefinition = {
    name: "FloorStraight4x1a",
    width: 4,
    height: 1,
    XYMapping: (x) => x,
    origin: FudgeCore.ORIGIN2D.TOPLEFT
  };

  export const defRampUpFull: TileDefinition = {
    name: "RampUpFull",
    width: 2.5,
    height: 2,
    XYMapping: (x) => 2/2.5 * x,
    origin: FudgeCore.ORIGIN2D.BOTTOMRIGHT
  };

  export const collidables: TileDefinition[] = [
    defFloorStraight4x1,
    // defRampUpFull
  ];
}