"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm">
        <p>© {currentYear} AutoSpa Opus. All rights reserved.</p>
      </div>
    </footer>
  );
}
