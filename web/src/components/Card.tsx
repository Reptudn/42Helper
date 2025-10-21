import Image from "next/image";
import React from "react";

interface CardComponentProps {
  title: string;
  description: string;
  category: string;
  project: string;
  userImageUrl?: string;
  intraName?: string;
}

export default function Card({
  title,
  description,
  category,
  project,
  userImageUrl,
  intraName,
}: CardComponentProps) {
  const [imageError, setImageError] = React.useState(false);

  // Map project types to a specific background gradient, border color and text color.
  const hexToRgba = (hex: string, alpha = 1) => {
    const h = hex.replace("#", "");
    const bigint = parseInt(
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h,
      16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getProjectColors = (projectType?: string) => {
    const key = (projectType || "").toLowerCase();
    const map: Record<string, { bg: string; border: string; text: string }> = {
      // Colors based on the picture you provided
      libft: {
        bg: "linear-gradient(180deg,#fff7c2 0%, #ffe98a 100%)",
        border: "#ffd54f",
        text: "#000",
      },
      ft_printf: {
        bg: "linear-gradient(180deg,#ffd6ee 0%, #ffb0da 100%)",
        border: "#ff78b6",
        text: "#000",
      },
      printf: {
        bg: "linear-gradient(180deg,#ffd6ee 0%, #ffb0da 100%)",
        border: "#ff78b6",
        text: "#000",
      },
      get_next_line: {
        bg: "linear-gradient(180deg,#e6ffef 0%, #bfffd6 100%)",
        border: "#7bf5a1",
        text: "#000",
      },
      push_swap: {
        bg: "linear-gradient(180deg,#e6f6ff 0%, #cfefff 100%)",
        border: "#6fcfff",
        text: "#000",
      },
      minishell: {
        bg: "linear-gradient(180deg,#ffdede 0%, #ffb0b0 100%)",
        border: "#ff6b6b",
        text: "#000",
      },
      philosophers: {
        bg: "linear-gradient(180deg,#f3f3f3 0%, #e6e6e6 100%)",
        border: "#cfcfcf",
        text: "#111",
      },
      philosopher: {
        bg: "linear-gradient(180deg,#f3f3f3 0%, #e6e6e6 100%)",
        border: "#cfcfcf",
        text: "#111",
      },
      born2beroot: {
        bg: "linear-gradient(180deg,#ffe6d9 0%, #ffccb3 100%)",
        border: "#ff9966",
        text: "#000",
      },
      so_long: {
        bg: "linear-gradient(180deg,#e6e6ff 0%, #ccccff 100%)",
        border: "#9999ff",
        text: "#000",
      },
      pipex: {
        bg: "linear-gradient(180deg,#fff0e6 0%, #ffe0cc 100%)",
        border: "#ffcc99",
        text: "#000",
      },
      cub3d: {
        bg: "linear-gradient(180deg,#f0f0f0 0%, #e0e0e0 100%)",
        border: "#cccccc",
        text: "#111",
      },
      cpp: {
        bg: "linear-gradient(180deg,#ffe6f2 0%, #ffcce6 100%)",
        border: "#ff99cc",
        text: "#000",
      },
      webserv: {
        bg: "linear-gradient(180deg,#e6fff2 0%, #ccffe6 100%)",
        border: "#99ff99",
        text: "#000",
      },
      inception: {
        bg: "linear-gradient(180deg,#f2e6ff 0%, #e6ccff 100%)",
        border: "#cc99ff",
        text: "#000",
      },
      fun: {
        bg: "linear-gradient(180deg,#ffebcd 0%, #ffd700 100%)",
        border: "#ffb347",
        text: "#000",
      },
      // fallback for all other projects
      other: {
        bg: "linear-gradient(180deg,#efe6ff 0%, #d6c1ff 100%)",
        border: "#a178ff",
        text: "#000",
      },
    };

    return map[key] ?? map.other;
  };

  const colors = getProjectColors(project);

  return (
    <article
      className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg relative mx-auto transition-all duration-300 hover:scale-[1.02] hover:-rotate-1 group cursor-pointer"
      style={{
        boxShadow: `0 4px 6px rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.2), 0 1px 3px ${hexToRgba(
          colors.border,
          0.3
        )}`,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
      }}
    >
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 rounded-lg opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="p-5 sm:p-7 rounded-lg relative"
        style={{
          background: colors.bg,
          border: `3px solid ${colors.border}`,
          borderTop: `4px solid ${colors.border}`,
        }}
      >
        {/* Tape effect at top */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 opacity-30"
          style={{
            background: "rgba(255,255,255,0.4)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            backdropFilter: "blur(2px)",
          }}
        />

        <header className="text-center mb-3">
          <h2
            className="text-2xl sm:text-3xl font-bold text-black tracking-tight"
            style={{ textShadow: "0 1px 2px rgba(255,255,255,0.5)" }}
          >
            {title}
          </h2>
        </header>

        <hr className="my-4 border-black/20 border-dashed" />

        <p
          className="text-sm sm:text-base text-black/85 min-h-[3.5rem] leading-relaxed font-medium"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          {description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2 justify-center">
          <span className="badge badge-primary text-xs sm:text-sm font-semibold shadow-sm px-3 py-2.5">
            {category}
          </span>
          <span className="badge badge-secondary text-xs sm:text-sm font-semibold shadow-sm px-3 py-2.5">
            {project}
          </span>
        </div>

        <hr className="my-4 border-black/20 border-dashed" />

        {/* Get if the user is online and then show the seat */}
        <footer className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-black/70 font-medium text-sm">from</span>
            {intraName ? (
              <a
                href={`https://profile.intra.42.fr/users/${encodeURIComponent(
                  intraName
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 no-underline hover:opacity-80 transition-opacity"
                aria-label={`Open ${intraName} profile in new tab`}
              >
                {userImageUrl && !imageError ? (
                  <Image
                    src={userImageUrl}
                    alt={`${intraName} avatar`}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-black/20 shadow-md object-cover w-10 h-10 flex-shrink-0"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-black/20 shadow-md bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <span className="text-black/90 font-bold text-sm sm:text-base underline decoration-2 underline-offset-2">
                  {intraName}
                </span>
              </a>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full border-2 border-black/20 shadow-md bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-black/50 text-sm italic font-medium">
                  Anonymous
                </span>
              </div>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}
