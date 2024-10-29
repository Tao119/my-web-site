/** @jsxImportSource @emotion/react */
import { FC } from "react";
import { css } from "@emotion/react";
import "@google/model-viewer";
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": MyElementAttributes;
    }
    interface MyElementAttributes {
      src: string;
      poster: string;
      alt: string;
      ar: boolean;
      scale: string;
    }
  }
}

type Props = {
  poster: string;
  glb: string;
  usdz: string;
  alt: string;
  scale?: number;
  height?: string;
};
export const ModelViewer: FC<Props> = (props) => {
  const { poster, glb, usdz, alt, scale = 1, height = "80vh" } = props;

  const container = css`
    width: 100%;
    model-viewer {
      width: 100%;
      height: ${height};
    }
  `;

  return (
    <div css={container}>
      <model-viewer
        src={glb}
        ios-src={usdz}
        poster={poster}
        alt={alt}
        shadow-intensity="1"
        camera-controls
        ar
        scale={`${scale} ${scale} ${scale}`}
      ></model-viewer>
    </div>
  );
};
