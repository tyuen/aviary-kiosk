import { useState, useRef, useEffect } from "react";
// @ts-ignore
import styles from "./App.module.css";
import SwipeIntro from "components/SwipeIntro";
import Carousel from "components/Carousel";
import Button from "components/Button";

const sounds = {
  menu: new Audio("./assets/317273__dpoggioli.wav"),
  flip: new Audio("./assets/75538__ra-gun.wav"),
};
sounds.menu.volume = 0.5;

function App() {
  const [data, setData] = useState({
    title: {},
    intro: {},
    back: {},
    list: [],
  });
  const [lang, setLang] = useState("z");

  useEffect(() => {
    //https://www.wetlandpark.gov.hk/tc/biodiversity/wildlife-watching-calendar/birds
    fetch("data.json")
      .then(res => res.json())
      .then(res => setData(res));
  }, []);

  const mediaRef = useRef<HTMLAudioElement[]>([]);

  const onPlay = e => {
    e.target.classList.add("border-pulse");
  };
  const onPause = e => {
    e.target.classList.remove("border-pulse");
  };

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
      mediaRef.current.forEach(elm => elm?.pause());
      //play menu sound
      sounds.menu.play()?.catch(e => {});
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
      //can be null if a card has no audio
      if (m) {
        m.muted = false;
        m.volume = 1;
        m.pause();
      }
    }
  };

  const onFocus = i => {
    sounds.flip.currentTime = 0;
    sounds.flip.play()?.catch(e => {});
  };

  return (
    <div className="flex flex-col items-stretch h-full overflow-hidden text-white">
      <header
        className="flex items-center justify-between pt-1 bg-white"
        style={{ boxShadow: "0 1px 10px rgba(0 0 0/.4)" }}
      >
        <img
          src="assets/header.png"
          className="h-20"
          alt=""
          onClick={() => changePage(-1)}
        />
        <img src="assets/hksar25.png" className="my-3 mr-2 h-14" alt="" />
      </header>

      <article ref={bookRef} className="relative z-0 flex-1 overflow-hidden">
        <article className="absolute inset-0 flex flex-col items-center justify-center w-full h-full p-0 m-0 overflow-hidden transition-all duration-500 scale-150 opacity-0">
          <h1 className="mb-4 text-3xl text-center">
            <div>{data.title[lang]}</div>
          </h1>

          <div className="mb-6 justify-evenly mx-[13vw]">
            {data.intro[lang]}
          </div>

          <nav className="grid grid-cols-4 gap-[3vmin]">
            {data.list.map((m, i) => (
              <button
                key={i}
                className="z-0 relative flex justify-center items-end text-center border-4 border-stone-700 rounded-lg w-[16vmin] h-[16vmin] text-lg text-white transition-transform overflow-hidden active:scale-90 bg-black leading-none p-2"
                style={{
                  hyphens: "auto",
                  textShadow: "0 0 4px #000, 0 0 10px #000",
                }}
                onClick={e => changePage(i)}
              >
                <img
                  src={"./data/" + m.img[0]}
                  className="absolute inset-0 object-cover w-full min-h-full -z-10 opacity-70"
                  style={{ imageRendering: "crisp-edges" }}
                  alt=""
                />
                {m.h1[lang]}
              </button>
            ))}
          </nav>
          <div className="flex justify-center gap-2 mt-6 text-lg">
            <Button onClick={() => setLang("z")}>中文</Button>
            <Button onClick={() => setLang("e")}>Eng</Button>
          </div>
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
                <header className="flex items-start justify-between text-3xl text-center">
                  <div className="w-[6ch]"></div>
                  <div>{info.h1[lang]}</div>
                  <div className="w-[6ch] justify-end flex items-center">
                    <Button
                      className="text-sm"
                      onClick={() => setLang(lang === "z" ? "e" : "z")}
                    >
                      {lang === "z" ? "Eng" : "中文"}
                    </Button>
                  </div>
                </header>
                <table cellSpacing={0} cellPadding={10} border={0}>
                  <tbody>
                    {info.dl.map(([h2, text], i) => (
                      <tr key={i}>
                        <td className="font-bold align-top whitespace-nowrap">
                          {h2[lang]}
                        </td>
                        <td className="align-top">{text[lang]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {info.img.map(src => (
                  <div key={src} className="relative grow min-h-[25vh] mt-4">
                    <img
                      src={"./data/" + src}
                      className="absolute object-scale-down w-full h-full min-h-0"
                      alt=""
                    />
                  </div>
                ))}
                {info.audio ? (
                  <audio
                    ref={n => (mediaRef.current[i] = n)}
                    src={"./data/" + info.audio}
                    controls
                    preload="metadata"
                    onPlay={onPlay}
                    onPause={onPause}
                    controlsList="nodownload nofullscreen"
                    className="self-center mt-6 border-4 border-transparent rounded-full shrink-0"
                  />
                ) : null}
              </div>
            ))}
          </Carousel>
          <SwipeIntro className="mb-3 -mt-10" />
          <Button className="mb-10" onClick={() => changePage(-1)}>
            &larr; {data.back[lang] || ""}
          </Button>
        </article>
      </article>
    </div>
  );
}

export default App;
