import InkScriptEditor from "../../components/InkScriptEditor/InkScriptEditor";

export const metadata = {
  title: "Ink Script Editor | Cursor Talk to Figma",
  description: "Notion-style script editor with single-slot resource system",
};

export default function InkScriptEditorPage() {
  return (
    <main className="min-h-screen bg-background-20">
      <InkScriptEditor />
    </main>
  );
}
