import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { useCallback, useState } from "react";

function App() {
  const [value, setValue] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onChange = useCallback((val: string, _: ViewUpdate) => {
    setValue(val);
  }, []);
  return (
    <>
      <CodeMirror value={value} height="200px" onChange={onChange} />
    </>
  );
}

export default App;
