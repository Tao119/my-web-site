import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  className?: string;
  name?: string;
  src?: StaticImageData;
}

const MenuIcon = (props: Props) => {
  return (
    <div className={`c-menu-icon ${props.className}`}>
      <Image className="c-menu-icon__img" src={props.src!} alt="icon" />
      <span className="c-menu-icon__name">{props.name}</span>
    </div>
  );
};

export default MenuIcon;
