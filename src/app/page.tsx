"use client";
import Link from "next/link";
import { Dispatch, SetStateAction, useContext } from "react";
import { FadeIn, FadeInWithStagger } from "src/components/fadeIn";

const Page = () => {
  return (
    <div
      className="p-home"
      style={{
        padding: "100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "flex-start",
        overflowY: "auto",
        height: "100vh",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        fontSize: "30px",
      }}
    >
      <FadeIn style={{ height: "1000px", flexShrink: 0 }}>tao </FadeIn>
      <FadeIn style={{ height: "1000px", flexShrink: 0 }}>matsumura </FadeIn>
      <FadeIn style={{ height: "1000px", flexShrink: 0 }}>website </FadeIn>
    </div>
  );
};
export default Page;
