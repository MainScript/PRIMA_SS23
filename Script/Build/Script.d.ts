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
    import fudge = FudgeCore;
    class Camera {
        cmp: fudge.ComponentCamera;
        constructor(x: number, y: number, z: number, viewport: fudge.Viewport);
        get position(): fudge.Vector3;
        set position(_position: fudge.Vector3);
        follow(target: Character): void;
    }
}
declare namespace Script {
    class Character {
        private _acceleration;
        private _cmp;
        private _definition;
        private _position;
        private _velocity;
        private _viewport;
        constructor(_definition: CharacterDefinition, viewport: FudgeCore.Viewport);
        get position(): FudgeCore.Vector3;
        set acceleration(_acceleration: FudgeCore.Vector2);
        get acceleration(): FudgeCore.Vector2;
        set velocity(_velocity: FudgeCore.Vector2);
        get velocity(): FudgeCore.Vector2;
        reset(): void;
        applyGravity(_intersection?: BoundingBox): void;
        updateVelocity(_timeDeltaSeconds: number, _intersection?: BoundingBox): void;
        updatePosition(_timeDeltaSeconds: number, _intersection?: BoundingBox): void;
        applyForce(_force: FudgeCore.Vector2): void;
        applyImpulse(_impulse: FudgeCore.Vector2): void;
        checkCollision(_char: Character, _timeDeltaSeconds: number): BoundingBox;
        private compareDistances;
        changeAnimation(_animation: string): void;
    }
}
declare namespace Script {
    class Sonic {
        private _character;
        private _collision;
        constructor(viewport: FudgeCore.Viewport);
        get character(): Character;
        update(_timeDeltaSeconds: number): void;
        jump(_timeDeltaSeconds: number): void;
        move(_direction: Direction, _timeDeltaSeconds: number): void;
        stop(): void;
    }
}
declare namespace Script {
    class BoundingBox {
        x: number;
        y: number;
        width: number;
        height: number;
        _origin: FudgeCore.ORIGIN2D;
        constructor(_translation: FudgeCore.Vector2, _size: FudgeCore.Vector2, _origin: FudgeCore.ORIGIN2D);
        isInside(_point: FudgeCore.Vector2): boolean;
        get top(): number;
        get bottom(): number;
        get left(): number;
        get right(): number;
        getIntersection(other: BoundingBox): BoundingBox;
        get position(): FudgeCore.Vector2;
    }
}
declare namespace Script {
    class CollisionChecker {
        checkCollision(object1: CharacterSprite, object2: CharacterSprite | Tile): BoundingBox;
        private getRectangle;
        private mapXToAbsoluteYUsingSlope;
        private getRelativeX;
        private objectIsTile;
    }
}
declare namespace Script {
    class KeyboardHandler {
        private controlsKeys;
        constructor();
        handleInputs(_sonic: Sonic, _timeDeltaSeconds: number): void;
    }
}
declare namespace Script {
    function getAllMeshesInNode(_node: FudgeCore.Node): FudgeCore.ComponentMesh[];
}
declare namespace Script {
    const defSonic: PlayableCharacterDefinition;
}
declare namespace Script {
    enum Direction {
        LEFT = -1,
        RIGHT = 1
    }
}
declare namespace Script {
    const GRAVITY = -10;
}
declare namespace Script {
    const defFloorStraight4x1: TileDefinition;
    const defRampUpFull: TileDefinition;
    const defBridge: TileDefinition;
    const collidables: TileDefinition[];
}
declare namespace Script {
    interface CharacterSprite extends Sprite {
        translation: FudgeCore.Vector3;
        definition: CharacterDefinition;
    }
    interface CharacterDefinition extends SpriteDefinition {
        terminalVelocity: FudgeCore.Vector2;
    }
    interface PlayableCharacterDefinition extends CharacterDefinition {
        jumpImpulse: number;
        moveAcceleration: number;
        secondsToStop: number;
    }
}
declare namespace Script {
    interface SpriteDefinition {
        name: string;
        width: number;
        height: number;
        origin: FudgeCore.ORIGIN2D;
    }
    interface TileDefinition extends SpriteDefinition {
        slopeMapping: (x: number) => number;
    }
    interface Sprite {
        translation: FudgeCore.Vector3;
        definition: SpriteDefinition;
    }
    interface Tile extends Sprite {
        definition: TileDefinition;
    }
}
