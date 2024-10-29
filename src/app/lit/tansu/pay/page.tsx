"use client";

import Image from "next/image";
import touchImage from "../../../../assets/img/touch.png";

const Page = () => {
  return (
    <div className="p-pay">
      <Image src={touchImage} alt="タンス" />
    </div>
  );
};

export default Page;
