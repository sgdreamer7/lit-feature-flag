import { h, render } from 'preact';
import { createProviderInstance, BaseFeatureFlagProvider } from './providers';
import { NoSlot, Slot } from './preact-components';


enum Attributes {
  feature = 'feature',
  provider = 'provider',
  options = 'options'
}
type AttributePropsType = {
  feature: string;
  provider: string;
  options?: string;
};

type AttributeKeyType = keyof AttributePropsType;

type AttributeValueType = AttributePropsType[AttributeKeyType];

const cebabToCamelCase = (name: string): AttributeKeyType => name
  .split('-')
  .map((word, index) => index ? word.charAt(0).toUpperCase() + word.slice(1) : word)
  .join('') as AttributeKeyType;

customElements.define(
  'feature-flag',
  class extends HTMLElement {
    private readonly attributeProps: AttributePropsType;
    private readonly mainEl: HTMLElementTagNameMap['main'];

    private dependencyLoading: Promise<unknown>;

    private featureFlagProvider: BaseFeatureFlagProvider = createProviderInstance('', '');



    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.mainEl = document.createElement('main');
      this.shadowRoot?.appendChild(this.mainEl);


      this.dependencyLoading = Promise.all([
        this.waitInteractiveState()
      ]);

      this.attributeProps = {
        feature: this.getAttribute(Attributes.feature) as string,
        provider: this.getAttribute(Attributes.provider) as string,
        options: this.getAttribute(Attributes.options) as string,
      };
      this.featureFlagProvider = createProviderInstance(this.attributeProps.feature, this.attributeProps.provider, this.attributeProps.options);
      this.render();
    }

    private waitInteractiveState() {
      return new Promise<void>((resolve) => {
        if (document.readyState === 'loading') {
          document.addEventListener('readystatechange', () => {
            if (document.readyState === 'interactive') {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    }

    private providerReady() {
      this.requestUpdate();
    }

    private requestUpdate() {
      this.render();
    }

    private render() {
      this.dependencyLoading
        .then(() => this.getFeatureFlag())
        .then(
          (featureEnabled) => {
            render(
              h(
                featureEnabled
                  ? Slot
                  : NoSlot,
                {}),
              this.mainEl);
          },
        );
    }

    private async getFeatureFlag(): Promise<boolean> {
      return this.featureFlagProvider.getFlag();
    }

    setFeatureFlag(enabled: boolean): void {
      this.featureFlagProvider.setFeatureFlag(enabled);
      this.requestUpdate();
      return;
    }

    attributeChangedCallback(
      name: string,
      _oldValue: AttributeValueType,
      newValue: AttributeValueType,
    ) {
      const modifiedName = cebabToCamelCase(name);
      (this.attributeProps[modifiedName] as AttributeValueType) = String(newValue);
      this.featureFlagProvider = createProviderInstance(this.attributeProps.feature, this.attributeProps.provider, this.attributeProps.options);
      this.render();
    }

    connectedCallback() {
      this.featureFlagProvider.componentMountCallback(this.providerReady.bind(this));
      this.render();
    }

    disconnectedCallback() {
      this.featureFlagProvider.componentUnmountCallback(this.providerReady.bind(this));
      render(null, this.mainEl);
    }
  }
);