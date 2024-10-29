"use client";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function UnityComponent() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "Build/build.loader.js",
    dataUrl: "Build/build.data",
    frameworkUrl: "build/build.framework.js",
    codeUrl: "Build/build.wasm",
  });

  return (
    <Unity unityProvider={unityProvider} style={{ width: 800, height: 600 }} />
  );
}
