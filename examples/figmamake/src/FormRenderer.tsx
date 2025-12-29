
import React, { useState } from "react"
import { Card, Input, Select, Upload, Button, Breadcrumb } from "antd"
import type { UISchema, UIField } from "./types"

type Props = {
  schema: UISchema
}

export const FormRenderer: React.FC<Props> = ({ schema }) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field: UIField, value: any) => {
    setFormData(prev => ({ ...prev, [field.id]: value }))
    setSubmitted(false)
  }

  const renderField = (field: UIField) => {
    const label = (
      <label>
        {field.label}
        {field.required && <span style={{ color: "red" }}> *</span>}
      </label>
    )

    switch (field.type) {
      case "input":
        return (
          <>
            {label}
            <Input
              placeholder={field.placeholder}
              value={formData[field.id] ?? ""}
              onChange={e => handleChange(field, e.target.value)}
            />
          </>
        )

      case "textarea":
        return (
          <>
            {label}
            <Input.TextArea
              rows={field.rows || 4}
              value={formData[field.id] ?? ""}
              onChange={e => handleChange(field, e.target.value)}
            />
          </>
        )

      case "select":
        return (
          <>
            {label}
            <Select
              showSearch={field.searchable}
              placeholder={field.placeholder}
              options={field.options?.map(o => ({
                label: o,
                value: o
              }))}
              value={formData[field.id] ?? undefined}
              onChange={value => handleChange(field, value)}
            />
          </>
        )

      case "upload":
        return (
          <>
            {label}
            <Upload.Dragger>
              <p>{field.hint}</p>
            </Upload.Dragger>
          </>
        )
      default:
        return null;
    }
  }

  return (
    <div style={{ maxWidth: schema.layout.maxWidth, margin: "40px auto" }}>
      <Breadcrumb items={schema.header.breadcrumb.map(b => ({ title: b }))} />

      <Card title={schema.header.title} style={{ marginTop: 16 }}>
        {schema.header.subtitle && (
          <p style={{ color: "#6B778C" }}>{schema.header.subtitle}</p>
        )}

        {schema.form.fields.map(field => (
          <div key={field.id} style={{ marginBottom: 16 }}>
            {renderField(field)}
            {field.help && (
              <div style={{ fontSize: 12, color: "#6B778C" }}>
                {field.help}
              </div>
            )}
          </div>
        ))}

        <div style={{ marginTop: 24 }}>
          {schema.form.actions.map(action => (
            <Button
              key={action.label}
              type={action.type === "primary" ? "primary" : "default"}
              style={{ marginRight: 8 }}
            >
              {action.label}
            </Button>
          ))}
          <Button
            type="primary"
            onClick={() => setSubmitted(true)}
            style={{ marginRight: 8 }}
          >
            Submit
          </Button>
        </div>
      </Card>

      {submitted && (
        <div style={{ marginTop: 32 }}>
          <h3>Form Data</h3>
          <pre style={{ background: "#f6f8fa", padding: 16, borderRadius: 8 }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}

      {schema.footer && (
        <div style={{ textAlign: "center", marginTop: 24, color: "#999" }}>
          {schema.footer.text}
        </div>
      )}
    </div>
  )
}
