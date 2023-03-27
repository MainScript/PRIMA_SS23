namespace Script {
  export const defSonic: PlayableCharacterDefinition = {
      name: "Sonic",
      height: 1,
      terminalVelocity: new FudgeCore.Vector2(0.05, 0.15),
      width: 1,
      jumpImpulse: 0.25,
      moveForce: 0.0025,
      framesToStop: 20,
      origin: FudgeCore.ORIGIN2D.BOTTOMCENTER
  }
}