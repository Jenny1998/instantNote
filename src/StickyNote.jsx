import React from "react";
import styles from "./styles.module.css";
import { animated, useSpring } from "@react-spring/web";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";

const useGesture = createUseGesture([dragAction, pinchAction]);

export default function StickyNote(props) {
  const [style, api] = useSpring(() => ({
    origin: "true",
    x: props.x,
    y: props.y,
    background: props.background,
    scale: 1,
    rotateZ: 0,
  }));
  const ref = React.useRef(null);
  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y], ...rest }) => {
        if (pinching) return cancel();
        api.start({ x, y });
        if (Math.pow(y - window.innerHeight, 2) + Math.pow(x, 2) < 5000) {
          props.removeSticky(props.id);
        }
        props.setX(props.id, x);
        props.setY(props.id, y);
      },
      onPinch: ({
        origin: [ox, oy],
        first,
        movement: [ms],
        offset: [s, a],
        memo,
      }) => {
        if (first) {
          const { width, height, x, y } = ref.current.getBoundingClientRect();
          const tx = ox - (x + width / 2);
          const ty = oy - (y + height / 2);
          memo = [style.x.get(), style.y.get(), tx, ty];
        }
        const x = memo[0] - ms * memo[2];
        const y = memo[1] - ms * memo[3];
        api.start({ scale: s, rotateZ: a, x, y });
        return memo;
      },
    },
    {
      target: ref,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true },
    }
  );

  return (
    <animated.div
      className={styles.stickyNote}
      ref={ref}
      style={{ ...style }}
      onDoubleClick={(e) => e.stopPropagation()}
    />
  );
}
