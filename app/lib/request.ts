const DEFAULT_HEADERS = {
  'content-type': 'application/json;charset=UTF-8',
}

const BASE_URL = process.env.API_URL || 'http://localhost:4000'

const getJson = (response: Response) => response.json();

export const get = (context: string, queryParams = {}, headers = DEFAULT_HEADERS) => {
  const options = {
    method: 'GET',
    headers
  }
  const qryString = Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return fetch(`${BASE_URL}${context}?${qryString}`, options)
    .then(getJson)
}
