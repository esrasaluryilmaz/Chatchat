import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import Message from "./message";
import Arrow from "./arrow";

const List = ({ room }) => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastMessageRef = useRef(null);
  const containerRef = useRef(null);
  const prevMessagesLength = useRef(0);
  const audioRef = useRef(new Audio("/notify.mp3"));

  //veritabanindan mesajlari al
  useEffect(() => {
    //koleksiyon referanisini al
    const collectionRef = collection(db, "messages");

    // sorgu ayarlarini yap
    const q = query(
      collectionRef,
      where("room", "==", room),
      orderBy("createdAt", "asc")
    );

    //mesajlar koleksiyonuna abone ol (degisiklikleri tzakip et)
    //koleksiyondaki her degisiklikte fonk. bize dokumanlari getirecek
    const unsub = onSnapshot(q, (snapshot) => {
      //dokumanlarin gecici olarak tutuldugu dizi
      const temp = [];

      //dokumanlari donup icerisindeki datalara erisip dizilere aktar
      snapshot.docs.forEach((doc) => {
        temp.push(doc.data());
      });
      setMessages(temp);
    });
    //componentWillUnmount: component ekrandan ayrilinca calisir
    // unsub ile veritabanina yapilan aboneligi iptal eder
    return () => unsub();
  }, []);

  //Her yeni mesaj geldiginde ekrani asagiya kaydir
  useEffect(() => {
    if (messages.length > 1) {
      const lastMsg = messages[messages.length - 1];

      //kullanici yukaridan yeni mesaj gelirse unread sayisini arttir
      if (messages.length > prevMessagesLength.current && !isAtBottom) {
        // eger son mesaji gonderen kendisi degilse
        if (lastMsg.author.id !== auth.currentUser.uid) {
          setUnreadCount((prev) => prev + 1);
          //yukaridayken yeni mesaj gelince bildirim sesi
          playSound();
        }
      }
      prevMessagesLength.current = messages.length;

      if (lastMsg.author.id === auth.currentUser.uid) {
        // eger son mesaji aktif kullanici attiysa her kosulda kaydir
        scrollToBottom();
      } else if (isAtBottom) {
        //eger son mesaji farkli kullanici attiysa kullanici asagidaysa kaydir
        scrollToBottom();

        // eger  asagidayken baskasindan mesaj gelirse bildirim
        if (messages.length > prevMessagesLength.current) {
          playSound();
        }
      }
    }
  }, [messages]);

  // kullanicin asagida olup olmadigini tespit eden fonk.
  const handleScroll = () => {
    // scrollTop kullanici yukardan asagiya ne kadar kaydirdi
    //clientHeight: kullanicinin ekranda gordugu kismin yuksekligi
    //scrollheight: tum icerigin yuksekligi
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;

    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 100);
  };

  // en asagiya kaydirir
  const scrollToBottom = () => {
    //son mesaja kaydir
    lastMessageRef.current.scrollIntoView();

    // okunmayan mesaj sayisini sifirla
    setUnreadCount(0);
  };

  //bildirim sesini oynat
  const playSound = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  return (
    <main
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 p-3 flex flex-col gap-3 w-full overflow-y-auto relative"
    >
      {messages.length < 1 ? (
        <div className="h-full grid place-items-center text-zinc-400">
          <p>Sohbete ilk mesaji gonderin </p>
        </div>
      ) : (
        messages.map((i, key) => <Message item={i} key={key} />)
      )}
      <div ref={lastMessageRef} />

      <Arrow
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        unreadCount={unreadCount}
      />
    </main>
  );
};

export default List;
