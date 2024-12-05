import { langs } from "@uiw/codemirror-extensions-langs";
import CodeMirror, { Extension, ViewUpdate } from "@uiw/react-codemirror";
import LZString from "lz-string";
import { useCallback, useEffect, useState } from "react";

const PLAIN_TEXT = "plain text";

const languageOptions = [...Object.keys(langs), PLAIN_TEXT].sort();

type Language = keyof typeof langs | typeof PLAIN_TEXT;

function generateUrl(code: string) {
  const compressed = LZString.compressToEncodedURIComponent(code);
  const url = window.location.origin;
  return url + "/" + compressed;
}

function parseUrl() {
  // this on root gives "/" but I only need the contents after that
  const pathContents = window.location.pathname.slice(1);
  return LZString.decompressFromEncodedURIComponent(pathContents) ?? "";
}

function App() {
  const [value, setValue] = useState("");
  const [lang, setLang] = useState<Language>(PLAIN_TEXT);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onChange = useCallback((val: string, _: ViewUpdate) => {
    setValue(val);
  }, []);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetLang = e.target.value as Language;
    setLang(targetLang);
    if (targetLang !== PLAIN_TEXT) {
      setExtensions([langs[targetLang]()]);
    } else {
      setExtensions([]);
    }
  };

  useEffect(() => {
    setValue(parseUrl());
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
            value={lang}
            onChange={(e) => {
              handleLangChange(e);
            }}
          >
            {languageOptions.map((language) => (
              <option key={language}>{language}</option>
            ))}
          </select>
        </label>

        <button
          onClick={() => {
            const url = generateUrl(value);
            navigator.clipboard.writeText(url).catch((err) => {
              console.error(err);
            });
          }}
        >
          Copy link
        </button>
        <button
          onClick={() => {
            const url = generateUrl(value);
            navigator.clipboard.writeText(`[paste](${url})`).catch((err) => {
              console.error(err);
            });
          }}
        >
          Copy markdown link
        </button>
      </nav>

      <CodeMirror
        value={value}
        height="calc(100vh - 3em)"
        maxHeight="calc(100vh - 3em)"
        onChange={onChange}
        extensions={extensions}
        autoFocus
      />
    </>
  );
}

export default App;
