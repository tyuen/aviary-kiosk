// @ts-ignore
import styles from "./App.module.css";
import SwipeIntro from "components/SwipeIntro";
import Carousel from "components/Carousel";
import { useState, useRef, useEffect } from "react";

function App() {
  const [data, setData] = useState({ list: [] });

  useEffect(() => {
    //https://www.wetlandpark.gov.hk/tc/biodiversity/wildlife-watching-calendar/birds
    fetch("data.json")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  const carouselRef = useRef<any>();

  const bookRef = useRef<HTMLElement>();
  const pageRef = useRef(0);

  const changePage = (i) => {
    const pages = bookRef.current.children;
    const carousel = carouselRef.current;
    if (i === -1) {
      pages[0].classList.add(styles.openpage);
      pages[1].classList.remove(styles.openpage);
    } else {
      pages[0].classList.remove(styles.openpage);
      pages[1].classList.add(styles.openpage);
      if (carousel) carousel.show(i);
    }
  };

  useEffect(() => {
    if (bookRef.current) changePage(-1);
  }, [bookRef]);

  return (
    <div className="flex flex-col items-stretch h-screen overflow-hidden text-white">
      <header className="flex justify-between pt-1 bg-white">
        <img src="assets/header.png" className="h-20" alt="" />
        <img src="assets/hksar25.png" className="h-20 mr-2" alt="" />
      </header>

      <article ref={bookRef} className="relative z-0 flex-1 overflow-hidden">
        <article className="absolute inset-0 flex flex-col items-center justify-center p-0 m-0 overflow-hidden transition-all duration-500 translate-y-full opacity-0">
          <h1 className="mb-4 text-4xl">香港公園觀鳥園</h1>

          <nav className="grid grid-cols-4 gap-[3vmin] mb-5">
            {data.list.map((m, i) => (
              <button
                key={i}
                className="z-0 relative flex justify-center items-center text-center border-4 border-stone-700 rounded-lg w-[17vmin] h-[17vmin] text-xl text-white transition-transform"
                style={{ textShadow: "0 0 20px #000" }}
                onClick={(e) => changePage(i)}
              >
                <img
                  src={"./data/" + m.img}
                  className="absolute object-cover w-full min-h-full -z-10 active:scale-75"
                  alt=""
                />
                {m.h1}
              </button>
            ))}
          </nav>
        </article>

        <article className="absolute inset-0 flex flex-col p-0 m-0 overflow-hidden transition-all duration-500 translate-y-full opacity-0">
          <Carousel ref={carouselRef} className="flex-1">
            {data.list.map((info, i) => (
              <div
                key={i}
                className="overflow-auto text-sm p-5 flex flex-col border-8 border-stone-600 rounded-xl bg-stone-800 max-w-[70%] h-[70%]"
                style={{ boxShadow: "0 0 100px black" }}
              >
                <header className="text-lg">{info.h1}</header>
                <table cellSpacing={0} cellPadding={10} border={0}>
                  {info.dl.map(([h2, text]) => (
                    <tr>
                      <td className="font-bold whitespace-nowrap">{h2}</td>
                      <td>{text}</td>
                    </tr>
                  ))}
                </table>
                <img
                  src={"./data/" + info.img}
                  className="object-contain w-full min-h-0 grow"
                  alt=""
                />
                {info.audio ? (
                  <audio
                    src={"./data/" + info.audio}
                    controls
                    className="self-center my-6"
                  />
                ) : null}
              </div>
            ))}
          </Carousel>

          <footer className="flex flex-col items-center mb-5">
            <SwipeIntro />
            <button
              className="px-4 py-1 text-lg text-white rounded bg-stone-600"
              onClick={() => changePage(-1)}
            >
              返回主頁
            </button>
          </footer>
        </article>
      </article>
    </div>
  );
}

export default App;
