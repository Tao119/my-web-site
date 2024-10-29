"use client";
import Link from "next/link";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { FadeIn, FadeInWithStagger } from "src/components/fadeIn";

const Page = () => {
  const [step, setStep] = useState(0);

  return (
    <div>
      <div>隠されたお菓子を探せ！！</div>
    </div>
  );
};
export default Page;
