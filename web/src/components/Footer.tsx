export default function Footer() {
  return (
    <footer className="bg-neutral-900/40 backdrop-blur-sm border-t border-neutral-800 p-4 mt-auto">
      <div className="max-w-6xl mx-auto text-center text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} 42 Helper @
        <span className="ml-2 space-x-2">
          <a
            href="https://intra.42.fr/users/jkauker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-white underline"
          >
            jkauker
          </a>
          <span className="text-neutral-500">,</span>
          <a
            href="https://intra.42.fr/users/lseeger"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-white underline"
          >
            lseeger
          </a>
          <span className="text-neutral-500">,</span>
          <a
            href="https://intra.42.fr/users/lbohm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-white underline"
          >
            lbohm
          </a>
          <span className="text-neutral-500">,</span>
          <a
            href="https://intra.42.fr/users/lglauch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-white underline"
          >
            lglauch
          </a>
        </span>
      </div>
    </footer>
  );
}
