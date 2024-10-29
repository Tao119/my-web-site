declare module 'three/examples/jsm/loaders/FontLoader.js' {
    import { Loader } from 'three';

    export class FontLoader extends Loader {
        load(
            url: string,
            onLoad: (font: Font) => void,
            onProgress?: (event: ProgressEvent) => void,
            onError?: (event: ErrorEvent) => void
        ): void;
        parse(json: any): Font;
    }

    export interface FontData {
        boundingBox: { top: number; bottom: number; left: number; right: number };
        familyName: string;
        resolution: number;
        underlineThickness: number;
        underlinePosition: number;
    }

    export class Font {
        constructor(data: FontData);
        generateShapes(text: string, size: number): THREE.Shape[];
    }
}

declare module 'three/examples/jsm/geometries/TextGeometry.js' {
    import { ExtrudeGeometry } from 'three';
    import { Font } from 'three/examples/jsm/loaders/FontLoader.js';

    interface TextGeometryParameters {
        font: Font;
        size?: number;
        depth?: number;
        curveSegments?: number;
        bevelEnabled?: boolean;
        bevelThickness?: number;
        bevelSize?: number;
        bevelOffset?: number;
        bevelSegments?: number;
    }

    export class TextGeometry extends ExtrudeGeometry {
        constructor(text: string, parameters: TextGeometryParameters);
    }
}
