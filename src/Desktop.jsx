import TrashCan from "./TrashCan";
import StickyNote from "./StickyNote";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { disableBodyScroll } from "body-scroll-lock";

export default function Desktop() {
  // const notePadRef = React.useRef(null);
  const targetRef = useRef();
  useEffect(() => {
    disableBodyScroll(targetRef.current);
  });
  const [notes, setNotes] = useState([]);

  const createNewStickyNote = (e, color) => {
    let noteProps = {
      id: Math.random(),
      background: color
        ? color
        : "#" + Math.floor(Math.random() * 16777215).toString(16),
      x: color ? e.changedTouches[0].clientX : e.nativeEvent.offsetX,
      y: color ? e.changedTouches[0].clientY : e.nativeEvent.offsetY,
      setX: (id, x) =>
        setNotes((s) => [
          ...s.filter((y) => y.id != id),
          ...s.filter((note) => note.id == id).map((p) => ({ ...p, x })),
        ]),
      setY: (id, y) =>
        setNotes((s) =>
          s.map((note) => (note.id === id ? { ...note, y } : note))
        ),

      removeSticky: (id) => {
        setNotes((s) => [...s.filter((y) => y.id != id)]);
      },
    };
    setNotes((s) => [...s, noteProps]);
  };

  return (
    <div
      ref={targetRef}
      className={`${styles.container}`}
      onDoubleClick={createNewStickyNote}
    >
      <div
        className={styles.stickiesBar}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        {/* <div
          className={styles.stickyPad}
          style={{ background: "#fef9b9"}}
          onTouchEnd={(e) => {
            createNewStickyNote(e, "#fef9b9");
          }}
        />
        <div
          className={styles.stickyPad}
          style={{ background: "#7f91f8" }}
          onTouchEnd={(e) => {
            createNewStickyNote(e, "#7f91f8");
          }}
        />
        <div
          className={styles.stickyPad}
          style={{ background: "#e17481" }}
          onTouchEnd={(e) => {
            createNewStickyNote(e, "#e17481");
          }}
        />
        <div
          className={styles.stickyPad}
          style={{ background: "#a1d07f" }}
          onTouchEnd={(e) => {
            createNewStickyNote(e, "#a1d07f");
          }}
        /> */}

        {/* <StickyNote key={1} {...x} /> */}
      </div>
      {notes.map((x) => (
        <StickyNote key={x.id} {...x} />
      ))}
      <TrashCan />
    </div>
  );
}
