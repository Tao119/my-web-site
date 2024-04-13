import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  className?: string;
  out?: boolean;
  name?: string;
  value?: number;
  date?: string;
}

const History = (props: Props) => {
  return (
    <div className={`c-history ${props.className}`}>
      <div className="c-history__label">{props.out ? "出" : "入"}</div>
      <div className="c-history__main">
        <div className="c-history__name">{props.name}</div>
        <div className="c-history__date">{props.date}</div>
      </div>
      <div className="c-history__value">{`¥${props.value}`}</div>
    </div>
  );
};

export default History;
