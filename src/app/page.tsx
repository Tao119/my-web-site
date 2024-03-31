import Link from "next/link";
import { Dispatch, SetStateAction, useContext } from "react";

const Page = () => {
  return (
    <div
      className="p-home"
      style={{ padding: "100px", display: "flex", flexDirection: "column" }}
    >
      <Link href="molkky" style={{ fontSize: "30px" }}>
        MOLKKY
      </Link>
      <Link href="ito" style={{ fontSize: "30px" }}>
        ITO
      </Link>
    </div>
  );
};
export default Page;
