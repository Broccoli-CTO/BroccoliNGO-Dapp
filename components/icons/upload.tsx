interface Props {
  className?: string;
}

const Icon = ({ className }: Props) => {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M1.334 19.333c0-3.105 1.632-5.828 4.086-7.358 0.667-5.25 5.15-9.308 10.581-9.308s9.914 4.059 10.581 9.308c2.453 1.53 4.086 4.254 4.086 7.358 0 4.562-3.525 8.301-8 8.641l-13.333 0.025c-4.475-0.366-8-4.105-8-8.667zM22.465 25.316c3.111-0.237 5.536-2.841 5.536-5.982 0-2.097-1.082-4.005-2.831-5.096l-1.074-0.67-0.16-1.256c-0.504-3.967-3.897-6.978-7.936-6.978s-7.431 3.011-7.936 6.978l-0.16 1.256-1.074 0.67c-1.748 1.091-2.83 2.998-2.83 5.096 0 3.141 2.424 5.746 5.536 5.982l0.231 0.018h12.467l0.231-0.018zM17.334 17.333v5.333h-2.667v-5.333h-4l5.333-6.667 5.333 6.667h-4z"
      ></path>
    </svg>
  );
};

export default Icon;
