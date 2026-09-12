export const metadata = {
  title: "Privacy | Space Coast Explorer",
  description: "Privacy principles for Space Coast Explorer."
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-4xl font-bold text-slate-950">Privacy</h1>
      <p className="mt-6 text-lg leading-8 text-slate-700">
        Space Coast Explorer is designed to collect only what is needed to operate visitor
        experiences and improve the product.
      </p>
      <div className="mt-8 grid gap-4 text-slate-700">
        <p>Precise location history is not retained unless a future feature clearly requires it and explains why.</p>
        <p>Authentication tokens, passwords, and sensitive secrets must never be logged.</p>
        <p>Analytics are intended to measure experience completion and product health without invasive tracking.</p>
      </div>
    </main>
  );
}
