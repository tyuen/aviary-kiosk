// @ts-ignore
import styles from "./Carousel.module.css";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  Children,
} from "react";

function calcMiddle(rect: DOMRect) {
  return (rect.left + rect.right) / 2;
}

const CB = (i: number) => {};

function Carousel(
  {
    children,
    className = "",
    onBlur = CB,
    onFocus = CB,
    onHide = CB,
    prevClassName = "",
    nextClassName = "",
  },
  ref,
) {
  //scrollable container
  const rootRef = useRef<HTMLDivElement>();
  //array of absolutely positioned cards
  const cardsRef = useRef<HTMLLIElement[]>([]);
  //array of horizontal boxes with IntersectionObserver registered
  const stubsRef = useRef<HTMLDivElement[]>([]);
  //currently visible box
  const activeStubRef = useRef<HTMLDivElement>();

  useImperativeHandle(
    ref,
    () => ({
      //callback functions
      show: (i: number) => {
        let node = stubsRef.current[i];
        if (node) {
          let parent = node.parentElement;
          parent.classList.add(styles.nosmooth);
          parent.scrollLeft = node.offsetLeft;
          setTimeout(() => {
            parent.classList.remove(styles.nosmooth);
          }, 100);
        }
      },
    }),
    [],
  );

  useEffect(() => {
    const root = rootRef.current;
    const cards = [...cardsRef.current];
    const stubs = [...stubsRef.current];

    if (!root || cards.length <= 0 || stubs.length <= 0) return;

    const stubMap = new Map();

    let obs = new IntersectionObserver(
      changes => {
        let outer = root.getBoundingClientRect();
        let middle = calcMiddle(outer);

        for (let c of changes) {
          let stub = c.target as HTMLDivElement;
          let style = stubMap.get(stub).style;

          if (c.isIntersecting) {
            style.display = "flex";

            //is left side or right side
            let negate = calcMiddle(c.boundingClientRect) < middle ? 1 : -1;
            let r = c.intersectionRatio;
            let deg = (75 - r * 75) * negate;

            style.transform = `translateX(${
              (1 - r) * -50 * negate
            }%) rotateY(${deg}deg) scale(${0.1 + 0.9 * r},${0.5 + 0.5 * r})`;
            style.zIndex = r >= 0.5 ? 2 : 1;

            if (r >= 1) {
              const last = activeStubRef.current;
              if (last !== stub) {
                onBlur(stubs.indexOf(last));
                onFocus(stubs.indexOf(stub));
                activeStubRef.current = stub;
              }
            }
          } else {
            const index = stubs.indexOf(activeStubRef.current);
            onBlur(index);
            onHide(index);
            style.display = "none";
          }
        }
      },
      {
        root,
        threshold: new Array(500)
          .fill(0)
          .map((_, i, arr) => i / (arr.length - 1)),
      },
    );

    stubs.forEach((s, i) => {
      obs.observe(s);
      stubMap.set(s, cards[i]);
    });

    return () => {
      stubs.forEach(s => obs.unobserve(s));
      stubMap.clear();
    };
  }, [rootRef.current, cardsRef.current, stubsRef.current]);

  const onClickPrev = () => {
    let n = activeStubRef.current?.previousElementSibling;
    if (n && n.classList.contains("stub")) {
      n.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  const onClickNext = () => {
    let n = activeStubRef.current?.nextElementSibling;
    if (n && n.classList.contains("stub")) {
      n.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      className={
        "relative snap-mandatory z-0 snap-x scroll-smooth flex flex-row items-stretch flex-nowrap overflow-x-auto overflow-y-hidden outline-hidden " +
        styles.noscrollbar +
        " " +
        className
      }
    >
      <ol
        className="sticky top-0 left-0 z-10 min-w-full min-h-full overflow-hidden -mr-full"
        style={{ perspective: "10cm" }}
      >
        {Children.map(children, (c, i) => (
          <li
            key={i}
            ref={n => (cardsRef.current[i] = n)}
            className="absolute inset-0 flex flex-col items-center overflow-hidden"
          >
            <div className="flex-1"></div>
            {c}
            <div className="flex-1"></div>
          </li>
        ))}
      </ol>

      <button
        className={
          "left-2 z-30 sticky min-w-[10vmin] h-[10vmin] top-1/2 -translate-y-1/2 cursor-default active:scale-75 " +
          prevClassName
        }
        onClick={onClickPrev}
      >
        <div className="absolute rotate-45 translate-y-px border-b-2 border-l-2 translate-x-1/4 border-stone-600 inset-5"></div>
        <div className="absolute rotate-45 border-b-2 border-l-2 border-white translate-x-1/4 inset-5"></div>
      </button>

      <div className="min-w-[50%] text-center opacity-0">&rarr;</div>
      {Children.map(children, (_, i) => (
        <div
          key={i}
          ref={n => (stubsRef.current[i] = n)}
          className="stub snap-center min-w-[80%] opacity-0 text-center"
        ></div>
      ))}
      <div className="min-w-[50%] text-center opacity-0">&rarr;</div>

      <button
        className={
          "right-2 z-30 sticky min-w-[10vmin] h-[10vmin] top-1/2 -translate-y-1/2 cursor-default active:scale-75 " +
          nextClassName
        }
        onClick={onClickNext}
      >
        <div className="absolute rotate-45 translate-y-px border-t-2 border-r-2 -translate-x-1/4 border-stone-600 inset-5"></div>
        <div className="absolute rotate-45 border-t-2 border-r-2 border-white -translate-x-1/4 inset-5"></div>
      </button>
    </div>
  );
}

export default forwardRef(Carousel);
