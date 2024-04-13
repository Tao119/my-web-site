"use client";

import Image from "next/image";
import MenuIcon from "./menuIcon";
import { Button } from "src/components/button";
import History from "./history";
import FooterIcon from "./footerIcon";

import notifyImage from "../../../assets/img/notify.png";
import faqImage from "../../../assets/img/faq.png";
import icon1Image from "../../../assets/img/icon1.png";
import icon2Image from "../../../assets/img/icon2.png";
import icon3Image from "../../../assets/img/icon3.png";
import icon4Image from "../../../assets/img/icon4.png";
import icon5Image from "../../../assets/img/icon5.png";
import icon6Image from "../../../assets/img/icon6.png";
import icon7Image from "../../../assets/img/icon7.png";
import foot1Image from "../../../assets/img/home.png";
import foot2Image from "../../../assets/img/bank.png";
import foot3Image from "../../../assets/img/money-bag.png";
import foot4Image from "../../../assets/img/menu.png";

const Page = () => {
  return (
    <div className="p-hattari">
      <div className="p-hattari__header">
        <Image
          className="p-hattari__header-img"
          alt="notify"
          src={notifyImage}
        />
        <span>ホーム</span>
        <Image className="p-hattari__header-img" alt="faq" src={faqImage} />
      </div>
      <div className="p-hattari__main">
        <div className="p-hattari__main-box">
          <div className="p-hattari__money">
            <div className="p-hattari__money-header">
              <span className="p-hattari__money-title">口座残高</span>
              <span className="p-hattari__money-date">
                2024/04/12 17:30:00現在
              </span>
            </div>
            <span className="p-hattari__money-busho">ハッタリソン営業部</span>
            <span className="p-hattari__money-kouza">普通　20021109</span>
            <span className="p-hattari__money-value">¥ 300</span>
          </div>
          <div className="p-hattari__menu">
            <MenuIcon name="振込" src={icon6Image} />
            <MenuIcon name="振替" src={icon1Image} />
            <MenuIcon name="料金支払" src={icon2Image} />
            <MenuIcon name="定期預金" src={icon3Image} />
            <MenuIcon name="投資信託" src={icon4Image} />
            <MenuIcon name="ローン" src={icon5Image} />
            <MenuIcon name="クラファン" src={icon1Image} />
            <MenuIcon name="すべて" src={icon7Image} />
          </div>
          <div className="p-hattari__history">
            <div className="p-hattari__history-header">
              <span>直近の入出金履歴</span>
              <Button label="もっと見る" />
            </div>
            <History name="ゲーム" value={15000} date="2024/04/10" out={true} />
            <History name="水道" value={3000} date="2024/04/09" out={true} />
            <History name="振込" value={7700} date="2024/04/07" out={true} />
            <History name="給料" value={141510} date="2024/04/01" out={false} />
            <History name="ゲーム" value={5000} date="2024/04/01" out={true} />
            <History name="ゲーム" value={5000} date="2024/04/01" out={true} />
          </div>
        </div>
      </div>
      <div className="p-hattari__footer">
        <FooterIcon name="ホーム" src={foot1Image} />
        <FooterIcon name="口座一覧" src={foot2Image} />
        <FooterIcon name="各種取引" src={foot3Image} />
        <FooterIcon name="メニュー" src={foot4Image} />
      </div>
    </div>
  );
};

export default Page;
