import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">About</h1>
      <p className="mb-4">This is the about page</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go home
      </Link>
    </main>
  );
}