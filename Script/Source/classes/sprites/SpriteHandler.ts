namespace Script {
    export enum SlopeType {
        Linear,
        Quadratic,
    }

    export class SlopeMapper {
        static getSlopeMapping(
            slopeType: SlopeType,
            _start: FudgeCore.Vector2,
            _end: FudgeCore.Vector2
        ): (x: number) => number {
            switch (slopeType) {
                case SlopeType.Linear:
                    return () => 0.95;
                case SlopeType.Quadratic:
                    return (x) => (4 / 5) * x ** 2 - (4 / 5) * x + 0.6;
            }
        }

        static getLinearSlope(_start: FudgeCore.Vector2, _end: FudgeCore.Vector2): (x: number) => number {
            return (x) => {
                if (x < _start.x) {
                    return _start.y;
                }
                if (x > _end.x) {
                    return _end.y;
                }
                return _start.y + ((x - _start.x) / (_end.x - _start.x)) * (_end.y - _start.y);
            };
        }
    }
}
