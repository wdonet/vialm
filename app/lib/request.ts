const DEFAULT_HEADERS = {
  'content-type': 'application/json;charset=UTF-8',
}
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

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
    .then(getJson);
}

export const requestAs = (context: string, payload = {}, headers = DEFAULT_HEADERS, method = 'POST') => {
  const options: RequestInit = {
    method,
    headers,
  }
  if (Object.keys(payload).length) {
    options.body = JSON.stringify(payload);
  }
  return fetch(`${BASE_URL}${context}`, options)
    .then(getJson);
}

export const post = (context: string, payload = {}, headers = DEFAULT_HEADERS) =>
  requestAs(context, payload, headers);

export const put = (context: string, payload = {}, headers = DEFAULT_HEADERS) =>
  requestAs(context, payload, headers, 'PUT');

export const remove = (context: string, payload = {}, headers = DEFAULT_HEADERS) =>
  requestAs(context, payload, headers, 'DELETE');
