import { OpenFeature, ProviderEvents } from '@openfeature/web-sdk';
import { FlagdWebProvider } from '@openfeature/flagd-web-provider';
import { BaseFeatureFlagProvider, EventCallback } from '../base';

const OPENFEATURE_CLIENT_NAME_PREFIX = `feature-flags-flagd`

type Providers = { [x: string]: FlagdWebProvider };
export class OpenFeatureFlagdFeatureFlagProvider extends BaseFeatureFlagProvider {
  static providers: Providers = {};
  private feature: string = '';
  private options: string = '';
  private clientName: string = '';

  constructor(feature: string, options: string) {
    super();
    if (options !== '') {
      const uri = new URL(options || '');
      this.clientName = `${OPENFEATURE_CLIENT_NAME_PREFIX}-${uri.protocol}-${uri.hostname}-${uri.port}`;
    } else {
      this.clientName = OPENFEATURE_CLIENT_NAME_PREFIX;
    }
    this.feature = feature;
    this.options = options;
    this.updateOpenfeatureProvider();
  }

  private updateOpenfeatureProvider(): void {
    if ((this.options !== '') && (!OpenFeatureFlagdFeatureFlagProvider.providers[this.clientName])) {
      const uri = new URL(this.options || '');
      const openfeatureProviderFlagd = new FlagdWebProvider({
        host: uri.hostname,
        port: Number(uri.port),
        tls: uri.protocol === 'https',
        maxRetries: 3
      });
      OpenFeatureFlagdFeatureFlagProvider.providers[this.clientName] = openfeatureProviderFlagd;
      OpenFeature.setProvider(this.clientName, openfeatureProviderFlagd);
    }
  }

  getFlag(): boolean {
    const client = OpenFeature.getClient(this.clientName);
    const featureFlagValue = client.getBooleanValue(this.feature, false);
    return featureFlagValue;
  }

  componentMountCallback(providerReadyCallback: EventCallback): void {
    OpenFeature.addHandler(ProviderEvents.Ready, providerReadyCallback);
    this.updateOpenfeatureProvider();
    return;
  }

  componentUnmountCallback(providerReadyCallback: EventCallback): void {
    OpenFeature.removeHandler(ProviderEvents.Ready, providerReadyCallback)
    return;
  }

}