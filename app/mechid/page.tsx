export default function MechIDPage() {
  return (
    <main className="py-16">
      <h1 className="text-3xl font-bold text-gray-900">MechID</h1>
      <p className="mt-4 text-gray-700">
        An interactive susceptibility interpretation tool.
      </p>

      <div className="mt-8 rounded-lg border p-6">
        <p className="text-gray-700">
          Open the app here:
        </p>
        <a
          className="mt-3 inline-block rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          href="https://mechid.streamlit.app/"
          target="_blank"
          rel="noreferrer"
        >
          Launch MechID
        </a>

      </div>
    </main>
  );
}
