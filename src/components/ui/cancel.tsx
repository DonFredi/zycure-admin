const Cancel = ({ color = "currentColor", size = 24 }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 19L12 12M12 12L19 5M12 12L5 5M12 12L19 19"
        width={size}
        height={size}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default Cancel;
