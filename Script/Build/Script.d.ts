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
    class BoundingBox {
        x: number;
        y: number;
        width: number;
        height: number;
        _origin: FudgeCore.ORIGIN2D;
        constructor(_x: number, _y: number, _width: number, _height: number, _origin: FudgeCore.ORIGIN2D);
        get top(): number;
        get bottom(): number;
        get left(): number;
        get right(): number;
    }
}
declare namespace Script {
    class CollisionChecker {
        checkCollision(a: Tile | CharacterSprite, b: Tile | CharacterSprite): BoundingBox;
        private getRectFromObject;
        private objectIsTile;
        private getIntersection;
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
        private _intersection;
        constructor(_definition: CharacterDefinition, viewport: FudgeCore.Viewport);
        set acceleration(_acceleration: FudgeCore.Vector2);
        get acceleration(): FudgeCore.Vector2;
        get collision(): boolean;
        applyGravity(): void;
        get velocity(): FudgeCore.Vector2;
        updateVelocity(): void;
        updatePosition(): void;
        applyForce(_force: FudgeCore.Vector2): void;
        applyImpulse(_impulse: FudgeCore.Vector2): void;
        checkCollision(): void;
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
    const defSonic: PlayableCharacterDefinition;
}
declare namespace Script {
    enum Direction {
        LEFT = -1,
        RIGHT = 1
    }
}
declare namespace Script {
    const GRAVITY = -0.005;
}
declare namespace Script {
    const defFloorStraight4x1: TileDefinition;
    const defRampUpFull: TileDefinition;
    const collidables: TileDefinition[];
}
declare namespace Script {
    interface CharacterSprite extends Sprite {
        cmp: FudgeCore.Node;
        definition: CharacterDefinition;
    }
    interface CharacterDefinition extends SpriteDefinition {
        terminalVelocity: FudgeCore.Vector2;
    }
    interface PlayableCharacterDefinition extends CharacterDefinition {
        jumpImpulse: number;
        moveForce: number;
        framesToStop: number;
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
        XYMapping: (x: number) => number;
    }
    interface Sprite {
        cmp: FudgeCore.Node;
        definition: SpriteDefinition;
    }
    interface Tile extends Sprite {
        definition: TileDefinition;
    }
}
