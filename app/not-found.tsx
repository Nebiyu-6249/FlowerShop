import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-7xl text-wine">404</p>
      <h1 className="font-display text-2xl">This page has wilted</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to something in bloom.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-wine px-5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-wine-deep"
      >
        Back to home
      </Link>
    </main>
  );
}
