import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Loader from "./loader";
import { auth } from "../firebase";
//Protected component icerisine alinan routelara sadece oturumu acik olan kullanicilar erisebilecek
const Protected = () => {
  // aktif kullanici statei
  const [user, setUser] = useState(undefined);

  //aktif kullanici verisini al
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });
  }, []);
  //kullanici verisi yukleniyorsa loader bas
  if (user === undefined) return <Loader />;

  //kullanici oturumu kapaliysa logine yonlendir
  if (user === null) return <Navigate to="/" replace />;
  // use navigate kullandigimizda react router domm nerden nereye gezctigimizi tam anlamiyor.bu tarz durumlarda <Navigate/> kullanmaliyiz.Nereye yonlendirecigini soylemelyz

  // kullanici oturumu aciksa ilgili sayfayi goster
  // kapsayici (parent) element altinda (child) routen elemanini ekrana bas
  return <Outlet context={user} />;
  // outlet componenti parent route icerisinde alt route'un elmentini ekrana basmak icin kullanilir.
  // outlet componentine istedigimiz isimde prop gonderemeyiz.
  // Sadece contrext={}propu icerisinde gonderilebilir.
  //Gonedrilen propa alt routlar useOutletContext() fonk. ile erisir.
};

export default Protected;
