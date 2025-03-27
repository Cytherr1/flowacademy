"use client";

import { Icon } from "@tabler/icons-react";

export const IconLetterDFilled: Icon = (props) => {
  const { size, stroke, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 26}
      height={size || 26}
      viewBox="0 0 24 24"
      fill="currentColor"
      strokeWidth={stroke || 1.5}
      {...rest}
    >
      <path d="M7 4h6a5 5 0 0 1 5 5v6a5 5 0 0 1 -5 5h-6v-16z" />
    </svg>
  );
};
