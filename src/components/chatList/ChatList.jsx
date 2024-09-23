import React from "react";
import "./chatList.css";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const ChatList = () => {
  // 使用 useQuery 发送请求获取用户聊天记录
  const { isPending, error, data } = useQuery({
    // 定义查询的key,标识为'userChat'
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });
  return (
    <div className="chatList">
      <span className="title">功能</span>
      <Link to="/dashboard">创建新聊天</Link>
      <Link to="/">探索 贾维斯</Link>
      <Link to="/">联系我们</Link>
      <hr />
      <span className="title">最近聊天</span>
      <div className="list">
        {isPending
          ? "加载中..."
          : error
          ? "遇到一些问题"
          : data?.map((chat) => (
              <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                {chat.title}
              </Link>
            ))}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>升级到 贾维斯pro</span>
          <span>无限制的使用全部功能</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
