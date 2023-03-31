namespace Script {
    export const defSonic: PlayableCharacterDefinition = {
        name: 'Sonic',
        height: 1,
        terminalVelocity: new FudgeCore.Vector2(4, 10),
        width: 1,
        jumpImpulse: 15,
        moveAcceleration: 0.5,
        framesToStop: 20,
        origin: FudgeCore.ORIGIN2D.BOTTOMCENTER,
    };
}
