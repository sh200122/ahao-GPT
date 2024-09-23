import React from "react";
import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

const ChatPage = () => {
  // 获取当前页面的路径
  const path = useLocation().pathname;
  // 提取路径中的最后一个部分作为 chatId
  const chatId = path.split("/").pop();

  // 使用 useQuery 来获取聊天数据
  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? "加载中..."
            : error
            ? "遇到了一些错误"
            : data?.history?.map((message, i) => (
                <React.Fragment key={i}>
                  {message.img && message.img !== "" && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={message.img}
                      height="300"
                      width="400"
                      transformation={[{ height: 300, width: 400 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div
                    className={
                      message.role === "user" ? "message user" : "message"
                    }
                  >
                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </React.Fragment>
              ))}
          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
