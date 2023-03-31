namespace Script {
    export class BoundingBox {
        x: number;
        y: number;
        width: number;
        height: number;
        _origin: FudgeCore.ORIGIN2D;
        constructor(_translation: FudgeCore.Vector2, _size: FudgeCore.Vector2, _origin: FudgeCore.ORIGIN2D) {
            // round every number to 3 decimal places
            this.x = Math.round(_translation.x * 1000) / 1000;
            this.y = Math.round(_translation.y * 1000) / 1000;
            this.width = Math.round(_size.x * 1000) / 1000;
            this.height = Math.round(_size.y * 1000) / 1000;
            this._origin = _origin;
        }

        public isInside(_point: FudgeCore.Vector2): boolean {
            return this.left <= _point.x && this.right >= _point.x && this.top >= _point.y && this.bottom <= _point.y;
        }

        get top(): number {
            switch (this._origin & 0x30) {
                case 0x00:
                    return this.y;
                case 0x10:
                    return this.y + this.height / 2;
                case 0x20:
                    return this.y + this.height;
                default:
                    return this.y;
            }
        }

        get bottom(): number {
            switch (this._origin & 0x30) {
                case 0x00:
                    return this.y - this.height;
                case 0x10:
                    return this.y - this.height / 2;
                case 0x20:
                    return this.y;
                default:
                    return this.y;
            }
        }

        get left(): number {
            switch (this._origin & 0x03) {
                case 0x00:
                    return this.x;
                case 0x01:
                    return this.x - this.width / 2;
                case 0x02:
                    return this.x - this.width;
                default:
                    return this.x;
            }
        }

        get right(): number {
            switch (this._origin & 0x03) {
                case 0x00:
                    return this.x + this.width;
                case 0x01:
                    return this.x + this.width / 2;
                case 0x02:
                    return this.x;
                default:
                    return this.x;
            }
        }

        public getIntersection(other: BoundingBox): BoundingBox {
            if (
                this.right < other.left ||
                this.left > other.right ||
                this.top < other.bottom ||
                this.bottom > other.top
            ) {
                return null;
            }
            const x: number = Math.max(this.left, other.left);
            const right = Math.min(this.right, other.right);
            const width: number = Math.abs(right - x);
            const y: number = Math.max(this.bottom, other.bottom);
            const top = Math.min(this.top, other.top);
            const height: number = Math.abs(top - y);
            if (width > 0 && height > 0) {
                return new BoundingBox(
                    new FudgeCore.Vector2(x, y),
                    new FudgeCore.Vector2(width, height),
                    FudgeCore.ORIGIN2D.CENTER
                );
            }
            return null;
        }

        public get position(): FudgeCore.Vector2 {
            return new FudgeCore.Vector2(this.x, this.y);
        }
    }
}
