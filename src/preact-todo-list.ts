import { h, render } from 'preact';
import { TodoList } from './preact-components';

customElements.define(
  'todo-list',
  class extends HTMLElement {
    private readonly mainEl: HTMLElementTagNameMap['main'];
    private styleEl: HTMLElementTagNameMap['link'];

    private dependencyLoading: Promise<unknown>;

    constructor() {
      super();
      this.mainEl = document.createElement('main');
      this.styleEl = document.createElement('link');


      this.dependencyLoading = Promise.all([
        this.loadStyles(),
        this.waitInteractiveState(),
      ]);

      this.attachShadow({ mode: 'open' }).append(
        this.styleEl,
        this.mainEl,
      );

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

    private loadStyles(): Promise<void> {
      return new Promise((resolve) => {
        this.styleEl = document.createElement('link');
        this.styleEl.setAttribute('rel', 'stylesheet');
        this.styleEl.setAttribute('href', `styles.css`);
        this.styleEl.onload = () => resolve();
      });
    }

    private render() {
      this.dependencyLoading.then(() => { render(h(TodoList, {}), this.mainEl); });
    }

    attributeChangedCallback() {
      this.render();
    }

    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {
      render(null, this.mainEl);
    }
  }
);