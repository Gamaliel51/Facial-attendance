// @ts-ignore
import "./Spinner.css";

interface SpinnerProps {
  size?: string; // e.g., '1rem', '2rem'
  color?: string; // e.g., 'rgba(209, 213, 219, 1)'
  duration?: string; // e.g., '1s'
}

const Spinner = ({
  size = "1.2rem",
  color = "rgba(209, 213, 219, 1)",
  duration = "1s",
}: SpinnerProps) => {
  return (
    <div className="spinner_bg">
      <div
        className="spinner"
        style={{
          borderTopColor: color,
          height: size,
          width: size,
          animationDuration: duration,
        }}
      ></div>
    </div>
  );
};

export default Spinner;
