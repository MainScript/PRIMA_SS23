namespace Script {
export class Character {
    private _acceleration: FudgeCore.Vector2 = FudgeCore.Vector2.ZERO();
    private _cmp: FudgeCore.Node;
    private _definition: CharacterDefinition;
    private _position: FudgeCore.Vector3;
    private _velocity: FudgeCore.Vector2 = FudgeCore.Vector2.ZERO();
    constructor(_definition: CharacterDefinition, viewport: FudgeCore.Viewport) {
        this._definition = _definition;
        this._cmp = viewport.getBranch().getChildrenByName(_definition.name)[0];
        this._position = this._cmp.mtxLocal.translation;
    }

    public set acceleration(_acceleration: FudgeCore.Vector2) {
        this._acceleration = _acceleration;
    }

    public applyGravity(): void {
        this._acceleration.y = GRAVITY;
    }

    public get velocity(): FudgeCore.Vector2 {
        return this._velocity;
    }

    public updateVelocity(): void {
        this._velocity.add(this._acceleration);
        this._acceleration = FudgeCore.Vector2.ZERO();

        if (this._velocity.x > this._definition.terminalVelocity.x) {
            this._velocity.x = this._definition.terminalVelocity.x;
        } else if (this._velocity.x < -this._definition.terminalVelocity.x) {
            this._velocity.x = -this._definition.terminalVelocity.x;
        }

        if (this._velocity.y > this._definition.terminalVelocity.y) {
            this._velocity.y = this._definition.terminalVelocity.y;
        } else if (this._velocity.y < -this._definition.terminalVelocity.y) {
            this._velocity.y = -this._definition.terminalVelocity.y;
        }
    }

    public updatePosition(): void {
        this._position.add(this._velocity.toVector3());
        this._cmp.mtxLocal.translation = this._position;
    }

    public applyForce(_force: FudgeCore.Vector2): void {
        this._acceleration.add(_force);
    }

    public applyImpulse(_impulse: FudgeCore.Vector2): void {
        this._velocity.add(_impulse);
    }
        
    }
}