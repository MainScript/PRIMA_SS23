namespace Script {
  export class BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    _origin: FudgeCore.ORIGIN2D;
    constructor(_x: number, _y: number, _width: number, _height: number, _origin: FudgeCore.ORIGIN2D) {
      this.x = _x;
      this.y = _y;
      this.width = _width;
      this.height = _height;
      this._origin = _origin;
    }

    get top(): number {
      switch (this._origin & 0x30) {
        case 0x00: return this.y;
        case 0x10: return this.y + this.height / 2;
        case 0x20: return this.y + this.height;
      }
    }

    get bottom(): number {
      switch (this._origin & 0x30) {
        case 0x00: return this.y - this.height;
        case 0x10: return this.y - this.height / 2;
        case 0x20: return this.y;
      }
    }

    get left(): number {
      switch (this._origin & 0x03) {
        case 0x00: return this.x;
        case 0x01: return this.x - this.width / 2;
        case 0x02: return this.x - this.width;
      }
    }

    get right(): number {
      switch (this._origin & 0x03) {
        case 0x00: return this.x + this.width;
        case 0x01: return this.x + this.width / 2;
        case 0x02: return this.x;
      }
    }
  }
}