import './TextArea.css'

type TextAreaProps =
  React.ComponentPropsWithoutRef<"textarea">;

export default function TextArea({
  className = "",
  ...props
}: TextAreaProps) {
  return (
    <textarea
      className={`textarea ${className}`}
      {...props}
    />
  );
}