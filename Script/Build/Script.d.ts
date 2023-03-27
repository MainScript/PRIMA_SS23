declare namespace Script {
    import fudge = FudgeCore;
    class Camera {
        cmp: fudge.ComponentCamera;
        constructor(x: number, y: number, z: number, viewport: fudge.Viewport);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
}
declare namespace Script {
    class Character {
        private _acceleration;
        private _cmp;
        private _definition;
        private _position;
        private _velocity;
        constructor(_definition: CharacterDefinition, viewport: FudgeCore.Viewport);
        set acceleration(_acceleration: FudgeCore.Vector2);
        applyGravity(): void;
        get velocity(): FudgeCore.Vector2;
        updateVelocity(): void;
        updatePosition(): void;
        applyForce(_force: FudgeCore.Vector2): void;
        applyImpulse(_impulse: FudgeCore.Vector2): void;
    }
}
declare namespace Script {
    class Sonic {
        private _character;
        constructor(viewport: FudgeCore.Viewport);
        update(): void;
        jump(): void;
        move(_direction: Direction): void;
        stop(): void;
    }
}
declare namespace Script {
    const defSonic: PlayableCharacter;
}
declare namespace Script {
    enum Direction {
        LEFT = -1,
        RIGHT = 1
    }
}
declare namespace Script {
    const GRAVITY = 0;
}
declare namespace Script {
    interface Character {
        acceleration: FudgeCore.Vector2;
        cmp: FudgeCore.Node;
        definition: CharacterDefinition;
        position: FudgeCore.Vector3;
        velocity: FudgeCore.Vector2;
    }
    interface CharacterDefinition {
        name: string;
        height: number;
        terminalVelocity: FudgeCore.Vector2;
        width: number;
    }
    interface PlayableCharacter extends CharacterDefinition {
        jumpImpulse: number;
        moveForce: number;
        framesToStop: number;
    }
}
