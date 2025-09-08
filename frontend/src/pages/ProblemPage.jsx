import Editor from "@monaco-editor/react";

function ProblemPage() {
    return (
        <Editor height="90vh" defaultLanguage="cpp" defaultValue="// some comment" />
    )
}

export default ProblemPage;