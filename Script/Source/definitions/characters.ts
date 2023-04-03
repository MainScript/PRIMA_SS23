namespace Script {
    export const defSonic: PlayableCharacterDefinition = {
        name: 'Sonic',
        height: 1,
        terminalVelocity: new FudgeCore.Vector2(6, 10),
        width: 1,
        jumpImpulse: 5,
        moveAcceleration: 12,
        secondsToStop: 0.1,
        origin: FudgeCore.ORIGIN2D.BOTTOMCENTER,
    };
}
