import schema from "./ui-schema.json"
import { FormRenderer } from "./FormRenderer"

function App() {
  return <FormRenderer schema={schema} />
}

export default App
