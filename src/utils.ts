type TransformMap = {
  [tag: string]: (content: string) => string
}

export const defaultTransformMap: TransformMap = {
  incr: (content: string) => increment(parseIntSafe(content, 0)).toString(),
  decr: (content: string) => decrement(parseIntSafe(content, 0)).toString()
}

export function parseAndTransformHtmlByTag(
  htmlString: string,
  transformMap: TransformMap = defaultTransformMap
): string {
  const regex = /<(\w+)[^>]*>(.*?)<\/\1>/gs

  const transformContent = (input: string): string => {
    return input.replace(regex, (_match, tagName, content) => {
      const transformFn = transformMap[tagName]
      let transformedContent = transformFn ? transformFn(content) : content
      return transformedContent
    })
  }

  const transformedHtml = transformContent(htmlString)
  return transformedHtml.replace(/<[^>]*>/g, '')
}

export function parseIntSafe(
  value: string | undefined,
  defaultValue: number
): number {
  const parsed = parseInt(value || '', 10)
  return isNaN(parsed) ? defaultValue : parsed
}

export function parseYamlBoolean(value: string): boolean | null {
  const trueValues = [
    'true',
    'True',
    'TRUE',
    'yes',
    'Yes',
    'YES',
    'on',
    'On',
    'ON'
  ]
  const falseValues = [
    'false',
    'False',
    'FALSE',
    'no',
    'No',
    'NO',
    'off',
    'Off',
    'OFF'
  ]

  if (trueValues.includes(value)) {
    return true
  } else if (falseValues.includes(value)) {
    return false
  }

  return null
}

function increment(value: number) {
  return value + 1
}

function decrement(value: number) {
  return value - 1
}
