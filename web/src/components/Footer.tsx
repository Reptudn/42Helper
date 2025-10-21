export default function Footer() {
  return (
    <footer className="bg-black border-t border-neutral-800 px-8 py-4 shrink-0">
      <div className="w-full text-center text-sm text-neutral-400">
        {new Date().getFullYear()} - 42 Helper @
        <span className="ml-2 space-x-2">
          <a
            href="https://intra.42.fr/users/jkauker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
          >
            jkauker
          </a>
          <span className="text-neutral-600">,</span>
          <a
            href="https://intra.42.fr/users/lseeger"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            lseeger
          </a>
          <span className="text-neutral-600">,</span>
          <a
            href="https://intra.42.fr/users/lbohm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
          >
            lbohm
          </a>
          <span className="text-neutral-600">,</span>
          <a
            href="https://intra.42.fr/users/lglauch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-300 hover:underline transition-colors"
          >
            lglauch
          </a>
        </span>
      </div>
    </footer>
  );
}
