"use client";

import { useRouter } from "next/navigation";
import { Button } from "src/components/button";

const Page = () => {
  const router = useRouter();
  return (
    <div className="p-pay">
      <span>タンス決済</span>
      <Button label="タンス決済する" onClick={() => router.push("tansu/pay")} />
    </div>
  );
};

export default Page;
