import Image, { StaticImageData } from "next/image";

interface Props {
  className?: string;
  name?: string;
  src?: StaticImageData;
}

const FooterIcon = (props: Props) => {
  return (
    <div className={`c-footer-icon ${props.className}`}>
      <Image className="c-footer-icon__img" src={props.src!} alt="icon" />
      <span className="c-footer-icon__name">{props.name}</span>
    </div>
  );
};

export default FooterIcon;
