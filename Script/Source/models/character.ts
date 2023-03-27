namespace Script {
  export interface Character {
    acceleration: FudgeCore.Vector2;
    cmp: FudgeCore.Node;
    definition: CharacterDefinition;
    position: FudgeCore.Vector3;
    velocity: FudgeCore.Vector2;
  }

  export interface CharacterDefinition {
    name: string;
    height: number;
    terminalVelocity: FudgeCore.Vector2;
    width: number;
  }

  export interface PlayableCharacter extends CharacterDefinition {
    jumpImpulse: number;
    moveForce: number;
    framesToStop: number;
  }
}