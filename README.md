# lit-preact-feature-flag
_This is the [Lit](https://lit.dev/) and [Preact](https://preactjs.com/) web [components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) for the feature flags rendering options_

## Get started:

```bash
# Install dependencies
npm ci


# Create local environment variables setup
cp .env.example .env

# Build
npm run build

# Run development setup
npm run dev

# Clean development setup
npm run dev:clean
```

## Usage:

```html
<!-- For the Lit component -->
<script type="module" src="./lit-feature-flag-1.0.0.js"></script>

<!-- For the Preact component -->
<script type="module" src="./preact-feature-flag-1.0.0.js"></script>

<!-- provider = "local storage" | "cookie" | "http-header" | "openfeature|flagd" -->
<!-- options = URL of the flagd server for the provider = "openfeature|flagd" -->
<feature-flag feature="Awesome feature" provider="local storage" options="" id="featureFlag1">
  <p>This is an awesome feature</p>
</feature-flag>
```

