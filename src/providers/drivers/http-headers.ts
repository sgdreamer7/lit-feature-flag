import { BaseFeatureFlagProvider } from "./base";

declare global {
  interface Window { __feature_flags_http_headers__: any; }
}

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

interface JSONObject {
  [x: string]: JSONValue;
}

const updateWindowHttpHeaders = () => {
  if (!window.__feature_flags_http_headers__) {
    const req = new XMLHttpRequest();
    req.open('GET', document.location.href, false);
    req.send(null);
    const headers = req.getAllResponseHeaders();
    window.__feature_flags_http_headers__ = headers
      .split('\r\n')
      .map((item) => item.split(/: */, 2))
      .filter(item => item.length > 0)
      .reduce((acc, item) => { acc[item[0].toLowerCase()] = item[1]; return acc; }, {} as JSONObject);
  }
}

export class HttpHeaderFeatureFlagProvider extends BaseFeatureFlagProvider {
  private feature: string = '';

  constructor(feature: string) {
    super();
    this.feature = feature;
  }

  getFlag(): boolean {
    updateWindowHttpHeaders();
    const featuresString = window.__feature_flags_http_headers__ && window.__feature_flags_http_headers__['x-feature-flags'];
    const features = featuresString && featuresString.split('|') || [];
    return features.includes(this.feature);
  }
}