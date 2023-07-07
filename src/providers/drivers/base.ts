import { EventDetails } from '@openfeature/web-sdk';

export type EventCallback = (eventDetails?: EventDetails) => void;

export class BaseFeatureFlagProvider {

  getFlag(): boolean {
    return false;
  }

  setFeatureFlag(enabled: boolean): void {
    return;
  }

  componentMountCallback(providerReadyCallback: EventCallback): void {
    return;
  }

  componentUnmountCallback(providerReadyCallback: EventCallback): void {
    return;
  }

}