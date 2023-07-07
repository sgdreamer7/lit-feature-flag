import { BaseFeatureFlagProvider } from '../base';
import { OpenFeatureFlagdFeatureFlagProvider } from './open-feature-flagd';

const PROVIDER_TYPE_FLAGD = 'flagd';

export const createOpenFeatureProviderInstance = (feature: string, provider: string, options: string): BaseFeatureFlagProvider => {
  const [, providerTypeString] = provider.split('|');
  const providerType = providerTypeString.toLocaleLowerCase();
  if (PROVIDER_TYPE_FLAGD === providerType) {
    return new OpenFeatureFlagdFeatureFlagProvider(feature, options);
  }
  return new BaseFeatureFlagProvider();
}

