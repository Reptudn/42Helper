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
      className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl overflow-hidden relative mx-auto"
      style={{
        boxShadow: `0 12px 30px rgba(0,0,0,0.5), 0 8px 24px ${hexToRgba(
          colors.border,
          0.12
        )}`,
      }}
    >
      <div
        className="p-4 sm:p-6 rounded-2xl"
        style={{
          background: colors.bg,
          border: `4px solid ${colors.border}`,
        }}
      >
        <header className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black">
            {title}
          </h2>
        </header>

        <hr className="my-3 border-black/10" />

        <p className="text-sm sm:text-base italic text-black/80 min-h-[3.5rem]">
          {description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <span className="badge badge-primary text-xs sm:text-sm">
            {category}
          </span>
          <span className="badge badge-secondary text-xs sm:text-sm">
            {project}
          </span>
        </div>

        <hr className="my-3 border-black/10" />

        {(userImageUrl && intraName) ? (
          <footer className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-black/90 font-semibold">from</span>
              <a
                href={`https://profile.intra.42.fr/users/${encodeURIComponent(
                  intraName
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 no-underline"
                aria-label={`Open ${intraName} profile in new tab`}
              >
                <Image
                  src={userImageUrl}
                  alt={`${intraName} avatar`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-black/90 font-semibold text-sm sm:text-base">
                  {intraName}
                </span>
              </a>
            </div>
          </footer>
        ) : (
          <footer className="mt-4 text-center">
            <span className="text-black/60 text-sm">Anonymous Post</span>
          </footer>
        )}
      </div>
    </article>
  );
}
