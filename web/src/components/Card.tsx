import Image from "next/image";
import React from "react";

interface CardComponentProps {
  projectTitle: string;
  description: string;
  tags: string[];
  userImageUrl: string;
  intraName: string;
}

export default function Card({
  projectTitle,
  description,
  tags,
  userImageUrl,
  intraName,
}: CardComponentProps) {
  const badgeVariants = [
    "badge-primary",
    "badge-secondary",
    "badge-accent",
    "badge-info",
    "badge-success",
    "badge-warning",
  ];

  // Map project types (projectTitle) to a specific background gradient, border color and text color.
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
      // fallback for all other projects
      other: {
        bg: "linear-gradient(180deg,#efe6ff 0%, #d6c1ff 100%)",
        border: "#a178ff",
        text: "#000",
      },
    };

    return map[key] ?? map.other;
  };

  const colors = getProjectColors(projectTitle);

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
            {projectTitle}
          </h2>
        </header>

        <hr className="my-3 border-black/10" />

        <p className="text-sm sm:text-base italic text-black/80 min-h-[3.5rem]">
          {description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags && tags.length > 0 ? (
            tags.map((t, i) => (
              <span
                key={t + i}
                className={`badge badge-soft ${
                  badgeVariants[i % badgeVariants.length]
                } text-xs sm:text-sm`}
              >
                {t}
              </span>
            ))
          ) : (
            <span className="badge badge-ghost">no tags</span>
          )}
        </div>

        <hr className="my-3 border-black/10" />

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

          <div className="text-right text-xs text-black/60 hidden sm:block">
            {/* place for small metadata */}
          </div>
        </footer>
      </div>
    </article>
  );
}
