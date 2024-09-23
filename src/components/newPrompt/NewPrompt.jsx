import React, { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  // 定义三个状态来管理用户的提问、ai的回答和图像
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {}, // 数据库中的图像处理
    aiData: {}, // ai处理的图像数据
  });

  // 初始化聊天历史
  const chat = model.startChat({
    history: data?.history.map(({ role, parts }) => ({
      role,
      parts: [{ text: parts[0].text }],
    })),

    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  // 当数据、问题、答案、或图片改变时，滚动到页面底部
  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  // 获取查询客户端，用于管理缓存
  const queryClient = useQueryClient();

  // 定义 mutation 用于更新聊天记录
  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      // 更新成功后，重新获取聊天记录
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          // 清空表单和状态
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // 添加新的问题或初始消息到聊天
  const add = async (text, isInitial) => {
    // 如果不是初始消息，则设置问题
    if (!isInitial) setQuestion(text);
    try {
      // 使用聊天模型发消息
      let accumulatedText = "";
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        // 更新答案
        setAnswer(accumulatedText);
      }
      // 在AI回答完成后调用 mutation
      setTimeout(() => {
        mutation.mutate();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text, false);
  };

  // 控制初始运行，确保只执行一次
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {img.isLoading && <div>加载中...</div>}
      {img.dbData?.filePath && img.dbData?.filePath !== "" && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input type="file" id="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="给'贾维斯'发消息" />
        <button>
          <img
            src="/arrow.png"
            alt=""
            style={{ width: "30px", height: "30px" }}
          />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
