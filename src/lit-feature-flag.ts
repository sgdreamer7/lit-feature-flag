import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { createProviderInstance, BaseFeatureFlagProvider } from './providers';
@customElement('feature-flag')
export class FeatureFlag extends LitElement {

  @property()
  feature = '';

  @property()
  provider = '';

  @property()
  options?= '';

  private featureFlagProvider: BaseFeatureFlagProvider = createProviderInstance('', '');

  private providerReady() {
    this.requestUpdate();
  }

  private async getFeatureFlag(): Promise<boolean> {
    return this.featureFlagProvider.getFlag();
  }

  setFeatureFlag(enabled: boolean): void {
    this.featureFlagProvider.setFeatureFlag(enabled);
    this.requestUpdate();
    return;
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value);
    this.featureFlagProvider = createProviderInstance(this.feature, this.provider, this.options);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.featureFlagProvider.componentMountCallback(this.providerReady.bind(this));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.featureFlagProvider.componentUnmountCallback(this.providerReady.bind(this));
  }

  render() {
    return until(
      this.getFeatureFlag()
        .then((res) => res
          ? html`<slot></slot>`
          : html``),
      html``
    )
  }
}
