export const isJson = (item) => {
  item = typeof item !== 'string' ? JSON.stringify(item) : item

  try {
    item = JSON.parse(item)
  } catch (e) {
    return false
  }

  if (typeof item === 'object' && item !== null) {
    return true
  }

  return false
}

export const highlightJson = (json) => {
  const result = Object.entries(json).map(([key, value]) => {
    let valueType = typeof value

    const isSimpleValue = ['string', 'number', 'boolean'].includes(valueType) || !value

    if (isSimpleValue && valueType === 'object') {
      valueType = 'null'
    }

    return `
      <div class="line">
        <span class="key">${key}:</span>
        ${
          isSimpleValue
            ? `<span class="${valueType}">${value}</span>`
            : highlightJson(value)
        }
      </div>
    `
  })

  return result.join('')
}

const result = highlightJson({ "a": 1, "b": { "c": 3 } })
console.log(result)
