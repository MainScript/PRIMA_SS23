namespace Script {
  export interface CharacterSprite extends Sprite {
    cmp: FudgeCore.Node;
    definition: CharacterDefinition;
  }

  export interface CharacterDefinition extends SpriteDefinition {
    terminalVelocity: FudgeCore.Vector2;
  }

  export interface PlayableCharacterDefinition extends CharacterDefinition {
    jumpImpulse: number;
    moveForce: number;
    framesToStop: number;
  }
}