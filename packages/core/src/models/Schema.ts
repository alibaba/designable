import {
  JSONSchema7Type,
  JSONSchema7TypeName,
  JSONSchema7Version,
} from 'json-schema'

export type JSONSchema7Definition = JSONSchema7 | boolean
export interface JSONSchema7 {
  $id?: string
  $ref?: string
  $schema?: JSONSchema7Version
  $comment?: string

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
   */
  type?: JSONSchema7TypeName | JSONSchema7TypeName[]
  enum?: JSONSchema7Type[]
  const?: JSONSchema7Type

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
   */
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
   */
  maxLength?: number
  minLength?: number
  pattern?: string

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
   */
  items?: JSONSchema7Definition | JSONSchema7Definition[]
  additionalItems?: JSONSchema7Definition
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  contains?: JSONSchema7

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
   */
  maxProperties?: number
  minProperties?: number
  required?: string[]
  properties?: {
    [key: string]: JSONSchema7Definition
  }
  patternProperties?: {
    [key: string]: JSONSchema7Definition
  }
  additionalProperties?: JSONSchema7Definition
  dependencies?: {
    [key: string]: JSONSchema7Definition | string[]
  }
  propertyNames?: JSONSchema7Definition

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
   */
  if?: JSONSchema7Definition
  then?: JSONSchema7Definition
  else?: JSONSchema7Definition

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
   */
  allOf?: JSONSchema7Definition[]
  anyOf?: JSONSchema7Definition[]
  oneOf?: JSONSchema7Definition[]
  not?: JSONSchema7Definition

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
   */
  format?: string

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
   */
  contentMediaType?: string
  contentEncoding?: string

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
   */
  definitions?: {
    [key: string]: JSONSchema7Definition
  }

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
   */
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  default?: JSONSchema7Type
  readOnly?: boolean
  writeOnly?: boolean
  examples?: JSONSchema7Type
  [key: string]: any
}
