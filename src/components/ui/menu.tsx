const Menu = ({ color = "currentColor", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.97 5.97H19.97" />
      <path d="M3.97 11.97H19.97" />
      <path d="M3.97 17.97H19.97" />
    </svg>
  );
};
export default Menu;
