import { useState, useRef, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import EmojiPicker from "emoji-picker-react";

const Form = ({ user, room }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const emojiPickerRef = useRef(null);
  const buttonRef = useRef(null);

  //emoji picker alaninin disarisina cikinca modali kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  //form gonderilince
  const handleSubmit = async (e) => {
    e.preventDefault();

    //formu temizle
    setText("");
    setIsOpen(false);

    //mesaji kaydedecegi koleksiyonun referansini al
    const collectionRef = collection(db, "messages");

    //mesaji veritabanindaki messages koleksiyonuna ekle
    await addDoc(collectionRef, {
      text,
      room,
      author: {
        id: user.uid,
        name: user.displayName,
        photo: user.photoURL,
      },
      createdAt: serverTimestamp(),
    });
  };

  //inputtaki secili alana emoji ekle
  const handleEmojiClick = (e) => {
    const input = document.querySelector("input[type='text']");

    if (input) {
      //inputtaki secili karakterin baslangic sirasi
      const start = input.selectionStart;
      //inputtaki secili karakterin bitis sirasi
      const end = input.selectionEnd;
      //secili alana emoji ekle
      const newText = text.substring(0, start) + e.emoji + text.substring(end);
      //stati guncelle
      setText(newText);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 border border-gray-200 shadow-lg flex justify-center gap-3"
    >
      <input
        type="text"
        placeholder="mesajinizi yaziniz..."
        className="border border-gray-200 shadow-sm p-2 px-4 rounded-md w-1/2 "
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="relative">
        {isOpen && (
          <div
            className="absolute top-[-470px] right-[-140px]"
            ref={emojiPickerRef}
          >
            <EmojiPicker open={isOpen} onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <button
          ref={buttonRef}
          type="button"
          className="btn text-base"
          onClick={() => setIsOpen(!isOpen)}
        >
          🙂
        </button>
      </div>
      <button
        disabled={text.length < 1}
        type="submit"
        className="btn bg-black text-white disabled:brightness-75"
      >
        Gonder
      </button>
    </form>
  );
};

export default Form;
