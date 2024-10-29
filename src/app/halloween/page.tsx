"use client";
import Link from "next/link";
import { Dispatch, SetStateAction, useContext } from "react";
import { FadeIn, FadeInWithStagger } from "src/components/fadeIn";
import backGroundImage from "src/assets/img/halloween.png";
import Image from "next/image";
import { halloweenFont } from "src/lib/font";
import { halloweenImages } from "./images";
import { Button } from "src/components/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className={`p-halloween ${halloweenFont.variable}`}>
      <Image src={backGroundImage} alt="" className="p-halloween__background" />
      <div className={`p-halloween__title`}>
        かようスクール　ハロウィーン　とくせつサイト
      </div>
      <div className="p-halloween__images">
        {halloweenImages.map((image, i) => (
          <FadeIn>
            <div className="p-halloween__box" key={i}>
              <Image
                className="p-halloween__box-image"
                src={image.image}
                alt=""
              />
              <div className="p-halloween__box-name">{image.name}</div>
              <div className="p-halloween__box-text">{image.detail}</div>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn>
        <Link
          className="p-halloween__link"
          href="https://docs.google.com/forms/d/e/1FAIpQLSecLHsNY-fsyLkL4LMsoAC3GJ-aBUL2TowfJPw9Ova7Gdomeg/viewform"
          target="_blank"
        >
          <Button
            addClass="p-halloween__link-button"
            label="とうひょうフォームはこちら"
          />
        </Link>
      </FadeIn>
    </div>
  );
};
export default Page;
