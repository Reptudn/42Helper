import React from "react";

interface Props {
  href?: string; // if provided, renders as an anchor
  onClick?: () => void;
  className?: string;
}

export default function LoginWithIntra({
  href,
  onClick,
  className = "",
}: Props) {
  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Inline SVG logo (uses currentColor so it matches the button text/accent) */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 text-current"
      >
        <path
          d="M128 48c-44.18 0-80 35.82-80 80s35.82 80 80 80 80-35.82 80-80-35.82-80-80-80zm0 24c30.928 0 56 25.072 56 56s-25.072 56-56 56-56-25.072-56-56 25.072-56 56-56z"
          fill="currentColor"
        />
      </svg>
      <span className="font-medium">Login with Intra</span>
    </span>
  );

  const baseClass = `inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-md transition-shadow duration-150 bg-neutral-800 text-white border border-neutral-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 ${className}`;

  if (href) {
    return (
      <a href={href} className={`${baseClass} inline-flex items-center`}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClass}>
      {content}
    </button>
  );
}
