import store from './configStore';

type HeaderTemplate = (
  headers?: Record<string, string> | null
) => Record<string, string>;

function createTemplate(base: Record<string, string>): HeaderTemplate {
  return headers => {
    return headers
      ? { ...base, ...store.headers, ...headers }
      : { ...base, ...store.headers };
  };
}

export const apiHeaders = createTemplate({
  Accept: 'application/json, text/plain, */*',
  Origin: 'https://hcs.eduro.go.kr',
  Referer: 'https://hcs.eduro.go.kr/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
});
