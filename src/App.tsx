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

const paraIcons = ["🔬", "🗺️", "🕹️", "🧭"];
const paraColor = [
  "bg-red-500/40",
  "bg-yellow-500/40",
  "bg-sky-500/40",
  "bg-green-500/40",
];

function App() {
  const [data, setData] = useState({
    title: {},
    intro: {},
    back: {},
    hear: {},
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
        className="flex items-center justify-center gap-6 pt-1 bg-white rounded-b-[50%_30%] pb-[10px]"
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

      <aside className="fixed left-0 w-full top-[8vh]">
        <img
          src="assets/clouds.svg"
          className="absolute top-0 left-0 h-[15vh] anim-cloud"
          style={{ animationDuration: "40s" }}
          alt=""
        />
        <img
          src="assets/clouds.svg"
          className="absolute top-0 left-0 h-[10vh] anim-cloud"
          style={{ animationDuration: "50s", animationDelay: "10s" }}
          alt=""
        />
        <img
          src="assets/clouds.svg"
          className="absolute top-0 left-0 h-[5vh] anim-cloud"
          style={{ animationDuration: "60s", animationDelay: "5s" }}
          alt=""
        />
      </aside>

      <footer className="fixed bottom-0 left-0 w-full h-[15vh]">
        <div
          className="absolute inset-0 bg-bottom bg-repeat-x bg-contain opacity-20 -top-16 bottom-10"
          style={{ backgroundImage: "url('assets/grass.svg')" }}
        ></div>
        <div
          className="absolute inset-0 bg-bottom bg-repeat-x bg-contain opacity-50"
          style={{ backgroundImage: "url('assets/grass.svg')" }}
        ></div>

        <div className="absolute left-0 flex items-end justify-between w-full px-[5vw] bottom-[5vh]">
          <img src="assets/dog.webp" className="h-[350px]" alt="dog" />
          <img src="assets/cat.webp" className="h-[300px]" alt="cat" />
        </div>

        <div
          className="absolute inset-0 bg-bottom bg-repeat-x bg-contain top-16"
          style={{ backgroundImage: "url('assets/grass.svg')" }}
        ></div>
      </footer>

      <article ref={bookRef} className="relative z-0 flex-1 overflow-hidden">
        <article className="absolute inset-0 flex flex-col items-center justify-center w-full h-full p-0 m-0 overflow-hidden transition-all duration-500 scale-150 opacity-0">
          <h1
            className="p-3 px-8 mb-4 text-3xl text-center rounded-md border-[3px] border-[#640]"
            style={{
              textShadow: "1px 1px 3px rgba(0 0 0/.7)",
              background: "#a60 url(assets/wood.svg) center/75% repeat",
            }}
          >
            <div>{data.title[lang]}</div>
          </h1>

          <div
            className="mb-6 justify-evenly mx-[13vw] text-justify"
            style={{ textShadow: "1px 1px 3px rgba(0 0 0/.7)" }}
          >
            {data.intro[lang]}
          </div>

          <nav className="grid grid-cols-4 gap-[3vmin]">
            {data.list.map((m, i) => (
              <button
                key={i}
                className="z-0 relative flex justify-center items-end text-center nest-frame w-[16vmin] h-[16vmin] text-white transition-transform overflow-hidden active:scale-90 leading-none p-2"
                style={{
                  hyphens: "auto",
                  textShadow: "0 0 4px #000, 0 0 10px #000",
                  borderImageWidth: "22px",
                  borderImageOutset: "4px",
                  borderWidth: "14px",
                }}
                onClick={e => changePage(i)}
              >
                <img
                  src={"./data/" + m.img[0]}
                  className="absolute inset-0 object-cover w-full min-h-full rounded-lg -z-10"
                  style={{ imageRendering: "crisp-edges" }}
                  alt=""
                />
                {m.h1[lang]}
              </button>
            ))}
          </nav>
          {data.list.length > 0 ? (
            <div className="flex justify-center gap-2 mt-6 text-sm">
              <Button className="bg-black/60" onClick={() => setLang("z")}>
                中文
              </Button>
              <Button className="bg-black/60" onClick={() => setLang("e")}>
                Eng
              </Button>
            </div>
          ) : null}
        </article>

        <article className="absolute inset-0 flex flex-col items-center w-full h-full p-0 m-0 overflow-hidden transition-all duration-500 translate-y-full opacity-0">
          <Carousel
            ref={carouselRef}
            className="self-stretch grow"
            onBlur={onBlur}
            onFocus={onFocus}
            prevClassName="active:scale-90 rounded-xl bg-gradient-to-br from-black/70 border-2"
            nextClassName="active:scale-90 bg-gradient-to-br from-black/70 rounded-xl border-2"
          >
            {data.list.map((info, i) => (
              <div
                key={i}
                className="relative nest-frame overflow-hidden text-sm leading-tight rounded-xl max-w-[70%] bg-black/50"
                style={{
                  boxShadow:
                    "0 0 100px rgba(0 0 0/.5), inset 1px 1px 15px black",
                  borderImageWidth: "30px",
                  borderImageOutset: "4px",
                  borderWidth: "22px",
                }}
              >
                <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 rounded-xl">
                  <img
                    src={"./data/" + info.img[0]}
                    className="object-cover w-full h-full -z-10 blur-2xl saturate-200 brightness-125"
                    alt="bg"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "repeating-linear-gradient(-60deg, rgba(0 0 0/.15), transparent 2px, transparent 5px)",
                    }}
                  ></div>
                </div>

                <div className="flex flex-col h-full p-5 overflow-auto">
                  <header className="flex items-start justify-between mb-4 text-3xl leading-none text-center">
                    <div className="w-[6ch]"></div>
                    <div style={{ textShadow: "1px 1px 4px rgba(0 0 0/.7)" }}>
                      {info.h1[lang]}
                    </div>
                    <div className="w-[6ch] justify-end flex items-center">
                      <Button
                        className="text-sm"
                        onClick={() => setLang(lang === "z" ? "e" : "z")}
                      >
                        {lang === "z" ? "Eng" : "中"}
                      </Button>
                    </div>
                  </header>

                  {info.dl.map(([h2, text], i) => (
                    <section
                      key={i}
                      className={
                        "relative flex gap-2 p-2 mb-3 ml-5 border rounded rounded-tl-2xl rounded-br-2xl border-black/50 " +
                        paraColor[i]
                      }
                      style={{
                        boxShadow: "1px 1px 3px rgba(0 0 0/.5)",
                      }}
                    >
                      <div className="absolute text-4xl -left-4 -top-2">
                        {paraIcons[i]}
                      </div>
                      <div className="font-bold w-[14ch] opacity-60 ml-7">
                        {h2[lang]}
                      </div>
                      <div className="flex-1">{text[lang]}</div>
                    </section>
                  ))}

                  {info.img.map(src => (
                    <div
                      key={src}
                      className={
                        "grow mt-4 max-h-[40vh] " +
                        (info.img.length === 1
                          ? "min-h-[25vh]"
                          : "min-h-[17vh]")
                      }
                    >
                      <img
                        src={"./data/" + src}
                        className="object-scale-down h-full min-h-0 mx-auto rounded"
                        alt=""
                      />
                    </div>
                  ))}
                  {info.audio ? (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className="p-2 rounded-full bg-white/10">
                        🎧 {data.hear[lang] || ""} &rarr;
                      </div>
                      <audio
                        ref={n => (mediaRef.current[i] = n)}
                        src={"./data/" + info.audio}
                        controls
                        preload="metadata"
                        onPlay={onPlay}
                        onPause={onPause}
                        controlsList="nodownload nofullscreen"
                        className="border-4 border-transparent rounded-full shrink-0"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </Carousel>
          <SwipeIntro className="mb-3 -mt-10" />
          <Button className="mb-20 bg-black/60" onClick={() => changePage(-1)}>
            &larr; {data.back[lang] || ""}
          </Button>
        </article>
      </article>
    </div>
  );
}

export default App;
