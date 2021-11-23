import styles from "./styles.module.css";

export default function TrashCan() {

    return (
        <div className={styles.trashCan} onDoubleClick={e => e.stopPropagation()}>
            <span className={styles.trashCanCross}>x</span>
        </div>
    );
}
