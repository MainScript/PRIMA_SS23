namespace Script {
    export class Sonic {
        private _character: Character;
        private _collision: BoundingBox;
        constructor(viewport: FudgeCore.Viewport) {
            this._character = new Character(defSonic, viewport);
        }

        public get character(): Character {
            return this._character;
        }

        public update(): void {
            const _clone = Object.assign(Object.create(Object.getPrototypeOf(this.character)), this.character);
            this._collision = this._character.checkCollision(_clone);
            this._character.applyGravity(this._collision);
            this._character.updateVelocity(this._collision);
            this._character.updatePosition(this._collision);
        }

        public jump(): void {
            if (this._collision) {
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
