import { BaseFeatureFlagProvider } from "./base";

export const LOCAL_STORAGE_KEY_PREFIX = "feature-flags";

export class LocalStorageFeatureFlagProvider extends BaseFeatureFlagProvider {
  private feature: string = '';

  constructor(feature: string) {
    super();
    this.feature = feature;
  }

  private getLocalStorageKeyName(): string {
    return `${LOCAL_STORAGE_KEY_PREFIX}/${this.feature}`;
  }

  getFlag(): boolean {
    const item = localStorage.getItem(this.getLocalStorageKeyName());
    return 'true' === item?.toLocaleLowerCase();
  }

  setFeatureFlag(enabled: boolean): void {
    const item = localStorage.setItem(this.getLocalStorageKeyName(), enabled.toString());
    return;
  }
}