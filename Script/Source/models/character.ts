namespace Script {
    export interface CharacterSprite extends Sprite {
        translation: FudgeCore.Vector3;
        definition: CharacterDefinition;
    }

    export interface CharacterDefinition extends SpriteDefinition {
        terminalVelocity: FudgeCore.Vector2;
    }

    export interface PlayableCharacterDefinition extends CharacterDefinition {
        jumpImpulse: number;
        moveAcceleration: number;
        secondsToStop: number;
    }
}
