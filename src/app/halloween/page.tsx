"use client";
import Link from "next/link";
import { useState } from "react";
import { FadeIn, FadeInWithStagger } from "src/components/fadeIn";
import backGroundImage from "src/assets/img/halloween.png";
import Image from "next/image";
import { halloweenFont } from "src/lib/font";
import { halloweenImages } from "./images";
import { Button } from "src/components/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  // 各ボックスの状態を管理するための配列
  const [flippedStates, setFlippedStates] = useState(
    halloweenImages.map(() => false) // 初期状態は全てfalse（表面）
  );

  // ボックスをクリックして状態を切り替える関数
  const handleBoxClick = (index: any) => {
    setFlippedStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );
  };

  return (
    <div className={`p-halloween ${halloweenFont.variable}`}>
      <Image src={backGroundImage} alt="" className="p-halloween__background" />
      <div className={`p-halloween__title`}>
        かようスクール　ハロウィーン　とくせつサイト
      </div>
      <div className="p-halloween__images">
        {halloweenImages.map((image, i) => (
          <FadeIn key={i}>
            <div
              className={`p-halloween__box ${
                flippedStates[i] ? "is-flipped" : ""
              }`}
              onClick={() => handleBoxClick(i)}
            >
              {/* 表面 */}
              {!flippedStates[i] && (
                <>
                  <Image
                    className="p-halloween__box-image"
                    src={image.image}
                    alt=""
                  />

                  <div className="p-halloween__box-name">{image.name}</div>
                  <div className="p-halloween__box-detail">{image.detail}</div>
                </>
              )}
              {/* 裏面 */}
              {flippedStates[i] && (
                <>
                  <div className="p-halloween__box-text">{image.text}</div>
                </>
              )}
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
