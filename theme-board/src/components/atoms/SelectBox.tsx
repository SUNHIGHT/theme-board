import './SelectBox.css'

type SelectBoxProps =
  React.ComponentPropsWithoutRef<"select">;

export default function SelectBox({
  className = "",
  children,
  ...props
}: SelectBoxProps) {
  return (
    <select
      className={`select ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}