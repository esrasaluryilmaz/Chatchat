import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, useOutletContext } from "react-router-dom";

const RoomPage = () => {
  const user = useOutletContext();
  const navigate = useNavigate();

  // Odaya gir
  const handleSubmit = (e) => {
    e.preventDefault();

    //inputtaki girdiyi al
    const room = e.target[0].value.toLowerCase().replaceAll(" ", "-");

    //kullaniciyi sohbet odasina yonlendr
    navigate(`/chat/${room}`);
  };
  //Oturumu kapat
  const handleLogout = () => {
    signOut(auth);
    toast.info("oturum kapandi");
  };

  //  auth?.currentUser); icersinde firebase aktif olan kullanicin bilgisini tutuyor
  // signOut(auth)} ile ciikis butonu yapabiliyoruz firebasede
  return (
    <div className="wrapper">
      <form
        onSubmit={handleSubmit}
        className="box rounded-[10px] flex flex-col gap-10 text-center"
      >
        <h1 className="text-4xl">Chat Odasi</h1>
        <p className="text-zinc-500">
          Selam {user.displayName}, <br /> Hangi odaya gireceksiniz?
        </p>
        <input
          type="text"
          className="border border-gray-300 rounded-md shadow-lg p-2 px-4"
          placeholder="orn:haftaici"
        ></input>
        <button type="submit" className="btn bg-zinc-700 text-white">
          Odaya Gir
        </button>
        <button
          type="button"
          className="btn bg-red-500 text-white"
          onClick={handleLogout}
        >
          Cikis Yap
        </button>
      </form>
    </div>
  );
};

export default RoomPage;
