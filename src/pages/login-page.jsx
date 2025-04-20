import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        toast.success("Giris yapildi");
        navigate("/room");
      })
      .catch((err) => toast.error("Hata olustu.!", err.message));
  };
  return (
    <div className="wrapper">
      <div className="box h-[450px] flex flex-col justify-center items-center gap-[50px]">
        <h1 className="text-4xl">Chat Room</h1>

        <p className="text-gray-400">Devam etmek icin giris yapin </p>

        <button onClick={handleLogin} className="btn flex gap-5 items-center">
          <img src="/google.png" alt="google" className="w-[30px]" />
          <span>Google ile gir </span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
