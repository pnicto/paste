import { langs } from "@uiw/codemirror-extensions-langs";
import CodeMirror, { Extension, ViewUpdate } from "@uiw/react-codemirror";
import { useCallback, useState } from "react";

const PLAIN_TEXT = "plain text";

const languageOptions = [...Object.keys(langs), PLAIN_TEXT].sort();

type Language = keyof typeof langs | typeof PLAIN_TEXT;

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

  return (
    <>
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
      <CodeMirror
        value={value}
        height="200px"
        onChange={onChange}
        extensions={extensions}
      />
    </>
  );
}

export default App;
