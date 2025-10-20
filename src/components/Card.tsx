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

  return (
    <article
      className="w-80 rounded-2xl overflow-hidden relative"
      style={{
        boxShadow:
          "0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(255, 184, 0, 0.06) inset",
      }}
    >
      <div
        className="p-4 rounded-2xl"
        style={{
          background: "linear-gradient(180deg,#ff9a3d 0%, #ff7a18 100%)",
          border: "6px solid #ffdf6b",
        }}
      >
        <header className="text-center">
          <h2 className="text-3xl font-extrabold text-black">{projectTitle}</h2>
        </header>

        <hr className="my-3 border-black/10" />

        <p className="text-sm italic text-black/80 min-h-[3.5rem]">
          {description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags && tags.length > 0 ? (
            tags.map((t, i) => (
              <span
                key={t + i}
                className={`badge badge-soft ${
                  badgeVariants[i % badgeVariants.length]
                } text-sm`}
              >
                {t}
              </span>
            ))
          ) : (
            <span className="badge badge-ghost">no tags</span>
          )}
        </div>

        <hr className="my-3 border-black/10" />

        <footer className="flex items-center gap-3">
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
              width={44}
              height={44}
              className="rounded-full"
            />
            <span className="text-black/90 font-semibold">{intraName}</span>
          </a>
        </footer>
      </div>
    </article>
  );
}
