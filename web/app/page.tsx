import InkScriptEditor from "../components/InkScriptEditor/InkScriptEditor";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-20 text-on-surface-10 flex flex-col items-center">
      <main className="flex-1 w-full flex justify-center">
        <div className="w-full max-w-[1400px] min-w-[800px] px-10 py-10">
          <div className="w-full bg-surface-10 rounded-2xl outline outline-1 outline-offset-[-1px] outline-border-10/5 p-10 flex flex-col gap-10">
            <InkScriptEditor />
          </div>
        </div>
      </main>
    </div>
  );
}
