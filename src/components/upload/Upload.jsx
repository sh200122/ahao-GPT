import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import { useRef } from "react";

// 从环境变量中获取 ImageKit 的url端点和公共密匙
const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

// 定义 authenticator 函数，用于获取上传图像时所需的签名、过期时间和 token
const authenticator = async () => {
  try {
    // 发送请求到后端、获取上传图像所需的认证信息
    const response = await fetch("http://localhost:3000/api/upload");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    // 解析返回的数据，获取签名、过期时间和 token
    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

// upload 组件，用于上传图像并将结果传递给父组件
const Upload = ({ setImg }) => {
  // 使用 useRef 访问 IKUpload 组件的引用
  const ikUploadRef = useRef(null);
  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    // 更新图像的状态
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  // 上传开始时的处理函数，读取用户选择的文件更新状态
  const onUploadStart = (evt) => {
    // 获取用户第一个文件
    const file = evt.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      // 当文件读取完成时更新 img 的状态，设置图像的 base64 和 MIME 类型
      setImg((prev) => ({
        ...prev,
        isLoading: true,
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUploadRef}
      />
      {
        <label onClick={() => ikUploadRef.current.click()}>
          <img src="/attachment.png" alt="" />
        </label>
      }
    </IKContext>
  );
};

export default Upload;
