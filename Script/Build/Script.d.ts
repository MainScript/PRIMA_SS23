declare namespace Script {
    import fudge = FudgeCore;
    class Camera {
        cmp: fudge.ComponentCamera;
        constructor(x: number, y: number, z: number, viewport: fudge.Viewport);
    }
}
declare namespace Script {
    import fudge = FudgeCore;
    class Character {
        cmp: fudge.Node;
        velocity: fudge.Vector3;
        acceleration: fudge.Vector3;
        terminalVelocity: fudge.Vector3;
        constructor(name: string, x: number, y: number, z: number, viewport: fudge.Viewport, terminalVelocity: fudge.Vector3);
        applyGravity(g: number): void;
        private updateVelocity;
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
declare module "constants" {
    const _default: {
        bg: {
            width: number;
            height: number;
        };
        sonic: {
            width: number;
            height: number;
        };
    };
    export default _default;
}
