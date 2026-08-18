import styles from "./TimerRing.module.css";

export default function TimerRing() {
  return (
    <div className={styles.stage}>
      <div className={styles.orbit}>
        <div className={styles.dot} />
      </div>
      <div className={`${styles.orbit} ${styles.small}`}>
        <div className={styles.dot} />
      </div>
      <div className={styles.core}>
        <span className={styles.time}>02:14:36</span>
      </div>
    </div>
  );
}