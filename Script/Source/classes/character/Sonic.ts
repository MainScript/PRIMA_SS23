namespace Script {
  export class Sonic {
    private _character: Character;
    constructor(viewport: FudgeCore.Viewport) {
      this._character = new Character(defSonic, viewport);
    }
    public update(): void {
      this._character.checkCollision();
      this._character.applyGravity();
      this._character.updateVelocity();
      this._character.updatePosition();
    }

    public jump(): void {
      if (this._character.collision) {
        this._character.applyImpulse(new FudgeCore.Vector2(0, defSonic.jumpImpulse));
      }
    }

    public move(_direction: Direction): void {
      this._character.applyForce(new FudgeCore.Vector2(_direction * defSonic.moveForce, 0));
    }

    public stop(): void {
      this._character.applyForce(new FudgeCore.Vector2(-this._character.velocity.x / defSonic.framesToStop, 0));
    }
  }
}