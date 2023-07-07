import { BaseFeatureFlagProvider } from "./base";

const COOKIE_NAME = 'feature-flags-features';

export class CookieFeatureFlagProvider extends BaseFeatureFlagProvider {
  private feature: string = '';

  constructor(feature: string) {
    super();
    this.feature = feature;
  }

  getFlag(): boolean {
    const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
    if (match) {
      const features = match[2].split('|');
      return features.includes(this.feature);
    }
    return false;
  }
}