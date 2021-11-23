import React, { Component } from "react";
import styles from "./styles.module.css";
import { animated, useSpring } from "@react-spring/web";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
const useGesture = createUseGesture([dragAction, pinchAction]);

export default function File(props) {
  const [style, api] = useSpring(() => ({
    x: props.x,
    y: props.y,
    background: props.background,
    scale: 1,
    rotateZ: 0,
  }));
  const ref = React.useRef(null);
  const [msg, setMsg] = React.useState("File");

  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y], ...rest }) => {
        if (pinching) return cancel();
        api.start({ x, y });
        props.updateIcon({...props, x, y});
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
        if (s > 1.75) {
          setMsg("File open!");
        }
        if (s < 0.5) {
          setMsg("File close!");
        }
        api.start({ scale:s, x, y });
        return memo;
      },
      onPinchEnd: ({
        memo,
      }) => {
        api.start({ scale:1 });
        setMsg("File");
        return memo;
      }
    },
    {
      target: ref,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true },
    }
  );

  const onclick = (e, id) => {
    e.preventDefault();
    props.updateIcon({...props, x:0});
  };
  return (
    <animated.div
      className={styles.file}
      onClick={(e) => onclick(e, props.id)}
      ref={ref}
      style={{ ...style}}
      onDoubleClick={e => e.stopPropagation()}
    >
      {msg}
    </animated.div>
  );
}
