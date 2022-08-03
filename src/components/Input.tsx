import cx from "clsx";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  /** Input label */
  label: string;
}

export default function Input(props: InputProps) {
  const { id, onChange, value, className, ...rest } = props;
  return (
    <span>
      <label className="block" htmlFor={id}>
        {props.label}
      </label>
      <input
        className={cx(
          "border-slate-400 border-solid border rounded",
          className
        )}
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </span>
  );
}
