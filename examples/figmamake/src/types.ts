export type UISchema = {
  meta: {
    name: string
    style: "jira" | "default"
  }
  layout: {
    type: "page"
    maxWidth: number
    padding: number
  }
  header: {
    breadcrumb: string[]
    title: string
    subtitle?: string
  }
  form: {
    layout: "vertical" | "horizontal"
    fields: UIField[]
    actions: UIAction[]
  }
  footer?: {
    text: string
  }
}

export type UIField = {
  id: string
  type: "input" | "select" | "textarea" | "upload"
  label: string
  required?: boolean
  placeholder?: string
  help?: string
  searchable?: boolean
  options?: string[]
  default?: string
  rows?: number
  hint?: string
}

export type UIAction = {
  type: "primary" | "secondary"
  label: string
}
