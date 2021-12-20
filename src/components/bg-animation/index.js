import anime from "animejs/lib/anime.es.js";
import { useEffect, useRef } from "react";

const bubblePath1 =
  "M1120.5 492.587C1120.5 784.41 753.411 1106.32 461.343 1106.32C71.7985 1106.32 0.5 665.945 0.5 374.123C0.5 82.3003 272.209 0.0515747 564.277 0.0515747C856.346 0.0515747 1067.14 214.662 1120.5 492.587Z";

const bubblePath2 =
  "M1092.38 481.339C1092.38 786.396 968.871 1120 663.813 1120C358.756 1120 0 959.007 0 653.95C0 348.892 234.969 0 540.026 0C845.084 0 1092.38 176.281 1092.38 481.339Z";

const bubblePath3 =
  "M1111.53 730.751C1009.72 1008.1 548.528 1185.98 270.946 1084.08C-99.2783 948.18 -13.4043 504.771 88.4049 227.422C190.214 -49.926 477.141 -33.303 754.724 68.5921C1032.31 170.487 1157.78 447.995 1111.53 730.751Z";

const bubblePathSoft =
  "M1063.42 704.138C961.607 981.486 590.498 1192.53 312.916 1090.64C-57.308 954.736 -36.8935 541.486 64.9158 264.138C166.725 -13.2106 472.832 -49.2574 750.415 52.6377C1028 154.533 1109.67 421.382 1063.42 704.138Z";

const circlePath =
  "M1120 560C1120 869.279 869.279 1120 560 1120C250.721 1120 0 869.279 0 560C0 250.721 250.721 0 560 0C869.279 0 1120 250.721 1120 560Z";

export default function BgAnimation() {
  const animationRef = useRef(null);

  useEffect(() => {
    // Animations!
    const timeline = anime.timeline({
      easing: "linear",
      duration: 15000,
      loop: true,
    });

    timeline.add({
      targets: "#circle",
      d: [
        { value: bubblePathSoft },
        { value: bubblePath1 },
        { value: bubblePathSoft },
        { value: bubblePath2 },
        { value: bubblePathSoft },
        { value: bubblePath3 },
        { value: bubblePathSoft },
        { value: circlePath },
      ],
    });
  }, []);

  // Animations!
  const timeline = anime.timeline({
    easing: "linear",
    duration: 15000,
    loop: true,
  });

  timeline.add({
    targets: "#circle",
    d: [
      { value: bubblePathSoft },
      { value: bubblePath1 },
      { value: bubblePathSoft },
      { value: bubblePath2 },
      { value: bubblePathSoft },
      { value: bubblePath3 },
      { value: bubblePathSoft },
      { value: circlePath },
    ],
  });

  return (
    <svg
      id="movingBubble"
      width="1120"
      height="1120"
      viewBox="0 0 1120 1120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onLoad={() => animationRef.current.restart()}
    >
      <path
        id="circle"
        d="M1120 560C1120 869.279 869.279 1120 560 1120C250.721 1120 0 869.279 0 560C0 250.721 250.721 0 560 0C869.279 0 1120 250.721 1120 560Z"
        fill="url(#paint0_linear_204_3)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_204_3"
          x1="1120"
          y1="560"
          x2="1.67149e-05"
          y2="560"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#A8FFEF" />
          <stop offset="1" stop-color="#FF88A5" stop-opacity="0.54" />
        </linearGradient>
      </defs>
    </svg>
  );
}
