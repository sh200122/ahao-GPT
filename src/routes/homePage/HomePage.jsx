import { Link } from "react-router-dom";
import "./homepage.css";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const HomePage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className="homepage">
      <img src="/orbital.png" alt="" className="orbital" />
      <div className="left">
        <h1>贾维斯</h1>
        <h2>增强你的创造力和生产力</h2>
        <h3>
          贾维斯（J.A.R.V.I.S.）全称为“Just A Rather Very Intelligent
          System”，是由托尼·斯塔克创造的高度智能化人工助手，最初设计用于管理斯塔克工业的所有科技系统和家中的智能设备。贾维斯具备极高的计算能力和自我学习能力，不仅能够实时分析各种数据、监控安全系统，还能通过语音与用户进行互动。作为一个人工智能，它协助托尼·斯塔克设计并操控钢铁侠战甲，甚至在危急时刻具备作战指挥能力。随着时间的发展，贾维斯也不断进化，成为了托尼·斯塔克不可或缺的伙伴之一。
        </h3>
        <Link to="/dashboard">开始</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot" />
          <div className="chat">
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                  ? "/human2.jpg"
                  : "bot.png"
              }
              alt=""
            />
            <TypeAnimation
              sequence={[
                ":克服拖延症",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                ":克服拖延症可以从几个方面入手，结合心理学和实践策略来逐步改善习惯...",
                2000,
                () => {
                  setTypingStatus("human2");
                },
                ":克服焦虑",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                ":克服焦虑的关键在于调整心态、理解焦虑的来源，并运用具体的应对策略...",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">服务条款</Link>
          <span>|</span>
          <Link to="/">隐私政策</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
