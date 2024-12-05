import { langs } from "@uiw/codemirror-extensions-langs";
import CodeMirror, {
  EditorView,
  Extension,
  ViewUpdate,
} from "@uiw/react-codemirror";
import LZString from "lz-string";
import { useCallback, useEffect, useState } from "react";

const PLAIN_TEXT = "plain text";

const languageOptions = [...Object.keys(langs), PLAIN_TEXT].sort();

type Language = keyof typeof langs | typeof PLAIN_TEXT;

function generateUrl(language: Language, code: string) {
  const compressed = LZString.compressToEncodedURIComponent(
    language + "@" + code
  );
  const url = window.location.origin;
  return url + "/" + compressed;
}

function parseUrl() {
  // this on root gives "/" but I only need the contents after that
  const pathContents = window.location.pathname.slice(1);
  const decompressed =
    LZString.decompressFromEncodedURIComponent(pathContents) ?? "";

  const [language, ...codeParts] = decompressed.split("@");
  const code = codeParts.join("@");

  if (!languageOptions.includes(language))
    return { language: PLAIN_TEXT as Language, code };
  return { language: language as Language, code };
}

function App() {
  const [editorText, setEditorText] = useState("");
  const [editorLanguage, setEditorLanguage] = useState<Language>(PLAIN_TEXT);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onChange = useCallback((val: string, _: ViewUpdate) => {
    setEditorText(val);
  }, []);

  const handleLangChange = (targetLang: Language) => {
    setEditorLanguage(targetLang);
    if (targetLang !== PLAIN_TEXT) {
      setExtensions([langs[targetLang]()]);
    } else {
      setExtensions([]);
    }
  };

  useEffect(() => {
    const { language, code } = parseUrl();
    handleLangChange(language);
    setEditorText(code);
  }, []);

  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "end",
          gap: "1rem",
        }}
      >
        <label>
          Language:
          <select
            value={editorLanguage}
            onChange={(e) => {
              handleLangChange(e.target.value as Language);
            }}
          >
            {languageOptions.map((language) => (
              <option key={language}>{language}</option>
            ))}
          </select>
        </label>

        <button
          onClick={() => {
            navigator.clipboard.writeText(editorText).catch((err) => {
              console.error(err);
            });
          }}
        >
          Copy Text
        </button>
        <button
          onClick={() => {
            const url = generateUrl(editorLanguage, editorText);
            navigator.clipboard.writeText(url).catch((err) => {
              console.error(err);
            });
          }}
        >
          Copy link
        </button>
        <button
          onClick={() => {
            const url = generateUrl(editorLanguage, editorText);
            navigator.clipboard.writeText(`[paste](${url})`).catch((err) => {
              console.error(err);
            });
          }}
        >
          Copy markdown link
        </button>
      </nav>

      <CodeMirror
        value={editorText}
        height="calc(100vh - 3em)"
        maxHeight="calc(100vh - 3em)"
        onChange={onChange}
        extensions={[...extensions, EditorView.lineWrapping]}
        autoFocus
      />
    </>
  );
}

export default App;
