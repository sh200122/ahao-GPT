import React from "react";
import "./dashboardPage.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  // 创建查询客户端实例，用于管理查询缓存
  const queryClient = useQueryClient();
  // 创建导航实例，用于页面跳转
  const navigate = useNavigate();

  // 定义 mutation，负责处理创建新聊天的请求
  const mutation = useMutation({
    mutationFn: (text) => {
      // 发送 post 请求到后端 api ，创建新聊天
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      // 当请求成功时执行此回调
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      // 跳转到新的聊天页面，使用新创建的聊天id
      navigate(`/dashboard/chats/${id}`);
    },
  });

  // 表单提交处理函数
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };
  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>贾维斯</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>任何问题</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>关于图片</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>关于代码</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="给'贾维斯'发消息" />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
