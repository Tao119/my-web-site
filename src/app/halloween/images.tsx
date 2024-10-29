import { StaticImageData } from "next/image";
import image1 from "src/assets/img/kks.jpg";
import image2 from "src/assets/img/kd.jpg";
import image3 from "src/assets/img/s.jpg";
import image4 from "src/assets/img/t.jpg";
import image5 from "src/assets/img/k.jpg";
import image6 from "src/assets/img/kt.jpg";
import image7 from "src/assets/img/r.jpg";

export interface HalloweenImage {
  image: StaticImageData;
  name: string;
  detail: string;
}

export const halloweenImages: HalloweenImage[] = [
  { image: image1, name: "かむり・かわち・しまとー", detail: "かぼちゃ" },
  { image: image2, name: "きよ・どーん", detail: "バナナ" },
  { image: image3, name: "しーぷ", detail: "Dハロ" },
  { image: image4, name: "たお", detail: "パーリー" },
  { image: image5, name: "こなん", detail: "はんにん" },
  { image: image6, name: "キティ", detail: "キティ" },
  { image: image7, name: "りょうさん", detail: "おばけ" },
];
