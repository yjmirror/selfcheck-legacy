const defaultHeaders = {
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
  Pragma: 'no-cache',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
} as const;

let internal: Record<string, string> = { ...defaultHeaders };

export function setUserAgent(userAgent: string) {
  internal['User-Agent'] = userAgent;
}
export function setDefaultConfig(headers: Record<string, string>) {
  Object.assign(internal, headers);
}

type HeaderTemplate = (
  headers?: Record<string, string> | null
) => Record<string, string>;

function createTemplate(base: Record<string, string>): HeaderTemplate {
  return headers => {
    return headers
      ? { ...base, ...internal, ...headers }
      : { ...base, ...internal };
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
