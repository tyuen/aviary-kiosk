// @ts-ignore
import styles from "./App.module.css";
import SwipeIntro from "components/SwipeIntro";
import Carousel from "components/Carousel";
import { useState, useRef, useEffect } from "react";

const sounds = {
  sweep: new Audio("./assets/317273__dpoggioli.wav"),
  flip: new Audio("./assets/75538__ra-gun.wav"),
};

function App() {
  const [data, setData] = useState({ list: [] });

  useEffect(() => {
    //https://www.wetlandpark.gov.hk/tc/biodiversity/wildlife-watching-calendar/birds
    fetch("data.json")
      .then(res => res.json())
      .then(res => setData(res));
  }, []);

  const mediaRef = useRef<HTMLAudioElement[]>([]);

  useEffect(() => {
    const list = mediaRef.current;
    const onPlay = e => {
      e.target.style.animation =
        "border-pulse 0.7s ease-in-out infinite alternate";
    };
    const onPause = e => {
      e.target.style.animation = "none";
    };
    for (let n of list) {
      n.addEventListener("play", onPlay, false);
      n.addEventListener("pause", onPause, false);
    }
    return () => {
      for (let n of list) {
        n.removeEventListener("play", onPlay, false);
        n.removeEventListener("pause", onPause, false);
      }
    };
  }, [mediaRef.current.length]);

  const carouselRef = useRef<any>();
  const bookRef = useRef<HTMLElement>();

  const changePage = i => {
    const pages = bookRef.current.children;
    const carousel = carouselRef.current;
    if (i === -1) {
      //show main menu
      pages[0].classList.add(styles.openpage);
      pages[1].classList.remove(styles.openpage);
      //stop all audio
      mediaRef.current.forEach(i => i.pause());
      //play menu sound
      sounds.sweep.play();
    } else {
      pages[0].classList.remove(styles.openpage);
      pages[1].classList.add(styles.openpage);
      if (carousel) carousel.show(i);
    }
  };

  useEffect(() => {
    if (bookRef.current) changePage(-1);
  }, [bookRef]);

  const onBlur = i => {
    if (i >= 0) {
      let m = mediaRef.current[i];
      m.muted = false;
      m.volume = 1;
      m.pause();
    }
  };

  const onFocus = i => {
    sounds.flip.currentTime = 0;
    sounds.flip.play();
  };

  return (
    <div className="flex flex-col items-stretch h-screen overflow-hidden text-white">
      <header
        className="flex justify-between pt-1 bg-stone-100"
        style={{ boxShadow: "0 1px 10px rgba(0 0 0/.4)" }}
      >
        <img src="assets/header.png" className="h-20" alt="" />
        <img src="assets/hksar25.png" className="h-20 mr-2" alt="" />
      </header>

      <article ref={bookRef} className="relative z-0 flex-1 overflow-hidden">
        <article className="absolute inset-0 flex flex-col items-center justify-center w-full h-full p-0 m-0 overflow-hidden transition-all duration-500 scale-150 opacity-0">
          <h1
            className="mb-8 text-4xl"
            style={{ textShadow: "1px 1px 5px rgba(0 0 0/1)" }}
          >
            香港公園觀鳥園
          </h1>

          <nav className="grid grid-cols-4 gap-[3vmin] mb-5">
            {data.list.map((m, i) => (
              <button
                key={i}
                className="z-0 relative flex justify-center items-center text-center border-4 border-stone-700 rounded-lg w-[17vmin] h-[17vmin] text-xl text-white transition-transform overflow-hidden active:scale-90"
                style={{
                  textShadow: "0 0 4px #000, 0 0 10px #000",
                  boxShadow: "1px 1px 20px rgba(0 0 0/.5)",
                }}
                onClick={e => changePage(i)}
              >
                <img
                  src={"./data/" + m.img}
                  className="absolute object-cover w-full min-h-full -z-10 opacity-70"
                  alt=""
                />
                {m.h1}
              </button>
            ))}
          </nav>
        </article>

        <article className="absolute inset-0 flex flex-col items-center w-full h-full p-0 m-0 overflow-hidden transition-all duration-500 translate-y-full opacity-0">
          <Carousel
            ref={carouselRef}
            className="self-stretch grow"
            onBlur={onBlur}
            onFocus={onFocus}
          >
            {data.list.map((info, i) => (
              <div
                key={i}
                className="overflow-auto text-sm p-5 flex flex-col border-8 border-stone-600 rounded-xl bg-stone-800 max-w-[70%]"
                style={{
                  boxShadow:
                    "0 0 100px rgba(0 0 0/.5), inset 1px 1px 8px rgba(0 0 0/.8)",
                  backgroundImage:
                    "linear-gradient(45deg,#444,#333,#222,#444,#222)",
                }}
              >
                <header className="text-3xl text-center">{info.h1}</header>
                <table cellSpacing={0} cellPadding={10} border={0}>
                  <tbody>
                    {info.dl.map(([h2, text], i) => (
                      <tr key={i}>
                        <td className="font-bold whitespace-nowrap">{h2}</td>
                        <td>{text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="relative grow min-h-[25vh]">
                  <img
                    src={"./data/" + info.img}
                    className="absolute object-scale-down w-full h-full min-h-0"
                    alt=""
                  />
                </div>
                {info.audio ? (
                  <audio
                    ref={n => (mediaRef.current[i] = n)}
                    src={"./data/" + info.audio}
                    controls
                    controlsList="nodownload nofullscreen"
                    className="self-center mt-6 border-4 border-transparent rounded-full shrink-0"
                  />
                ) : null}
              </div>
            ))}
          </Carousel>
          <SwipeIntro className="mb-3 -mt-10" />
          <button
            className="min-h-0 px-4 py-1 mb-10 text-lg text-white border rounded-full border-stone-400 bg-stone-600 shrink-0 active:scale-90"
            style={{
              boxShadow:
                "1px 1px 20px rgba(0 0 0/.5), inset 1px 1px 53x rgba(0 0 0/.5)",
              backgroundImage:
                "linear-gradient(45deg,#444,#333,#222,#444,#222)",
            }}
            onClick={() => changePage(-1)}
          >
            &larr; 返回主頁
          </button>
        </article>
      </article>
    </div>
  );
}

export default App;
