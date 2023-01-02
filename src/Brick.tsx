type Props = {
  type: "apple" | "block" | "head" | "body";
};

export default function Brick(props: Props) {
  let color;
  switch (props.type) {
    case "apple":
      color = "red";
      break;
    case "block":
      color = "brown";
      break;
    case "head":
      color = "green";
      break;
    case "body":
      color = "limegreen";
      break;
    default:
      break;
  }

  return (
    <g>
      {props.type === "apple" && (
        <animate
          attributeType="XML"
          attributeName="opacity"
          values="1;0"
          dur="1s"
          repeatCount="indefinite"
        />
      )}
      <rect x="2.5" y="2.5" width="15" height="15" fill={color} />
      <rect
        x="0.25"
        y="0.25"
        width="19.5"
        height="19.5"
        fill="none"
        stroke={color}
        strokeWidth="0.5"
        rx="2.5"
        ry="2.5"
      />
    </g>
  );
}
