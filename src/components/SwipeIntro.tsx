// @ts-ignore
import styles from "./SwipeIntro.module.css";
export default function SwipeIntro({ className = "" }) {
  return <div className={styles.finger + " " + className}>👆&#127999;</div>;
}
