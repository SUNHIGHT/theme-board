import "./Button.css";

type ButtonProps = {
  variant?: "primary" | "secondary";
} & React.ComponentPropsWithoutRef<"button">;

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}