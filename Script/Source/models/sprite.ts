namespace Script {
    export interface SpriteDefinition {
        name: string;
        width: number;
        height: number;
        origin: FudgeCore.ORIGIN2D;
    }

    export interface TileDefinition extends SpriteDefinition {
        slopeMapping: (x: number) => number;
    }

    export interface Sprite {
        translation: FudgeCore.Vector3;
        definition: SpriteDefinition;
    }

    export interface Tile extends Sprite {
        definition: TileDefinition;
    }
}
