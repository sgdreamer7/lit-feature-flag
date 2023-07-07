import { BaseFeatureFlagProvider, LocalStorageFeatureFlagProvider, CookieFeatureFlagProvider, HttpHeaderFeatureFlagProvider, createOpenFeatureProviderInstance } from "./drivers";

export const createProviderInstance = (feature: string, provider: string, options?: string): BaseFeatureFlagProvider => {
  if ('local storage' === provider.toLocaleLowerCase()) {
    return new LocalStorageFeatureFlagProvider(feature);
  } else if ('cookie' === provider.toLocaleLowerCase()) {
    return new CookieFeatureFlagProvider(feature);
  } else if ('http-header' === provider.toLocaleLowerCase()) {
    return new HttpHeaderFeatureFlagProvider(feature);
  } else if (provider.startsWith('openfeature|')) {
    return createOpenFeatureProviderInstance(feature, provider, options || '');
  }
  return new BaseFeatureFlagProvider();
}

export * from './drivers/base'