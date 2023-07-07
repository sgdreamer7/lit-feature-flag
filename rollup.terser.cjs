const { Worker } = require('jest-worker');
const serialize = require('serialize-javascript');

const normalizeOptions = (userOptions, outputOptions) => {
  const defaultOptions = {
    sourceMap: outputOptions.sourcemap === true || typeof outputOptions.sourcemap === 'string',
  };
  if (outputOptions.format === 'es' || outputOptions.format === 'esm') {
    defaultOptions.module = true;
  }
  if (outputOptions.format === 'cjs') {
    defaultOptions.toplevel = true;
  }

  // remove plugin specific options
  const normalizedOptions = { ...defaultOptions, ...userOptions };
  delete normalizedOptions.numWorkers;

  return normalizedOptions;
};

const handleNameCache = (result, userOptions) => {
  if (!result.nameCache) {
    return;
  }

  let { vars, props } = userOptions.nameCache || {};

  if (vars) {
    const resultVars = result.nameCache.vars;
    const newVars = resultVars && resultVars.props;
    if (newVars) {
      vars.props = vars.props || {};
      Object.assign(vars.props, newVars);
    }
  }

  const resultProps = result.nameCache.props;
  const newProps = resultProps && resultProps.props;
  if (newProps) {
    props = props || (userOptions.nameCache = {});
    props.props = props.props || {};
    Object.assign(props.props, newProps);
  }
};

const handleWorkerError = (error) => {
  const { message, line, col: column } = error;
  console.error(`${message}: (line: ${line}, column: ${column})`);
  throw error;
};

exports.terser = function terser(userOptions = {}) {
  if ('sourceMap' in userOptions) {
    throw Error(
      'sourceMap option is removed. Now it is inferred from rollup options.',
    );
  }
  if ('sourcemap' in userOptions) {
    throw Error(
      'sourcemap option is removed. Now it is inferred from rollup options.',
    );
  }

  return {
    name: 'terser',

    async renderChunk(code, _chunk, outputOptions) {
      if (!this.worker) {
        this.worker = new Worker(require.resolve('./rollup.terser.transform.cjs'), {
          numWorkers: userOptions.numWorkers,
        });
        this.numOfBundles = 0;
      }

      this.numOfBundles++;

      const normalizedOptions = normalizeOptions(userOptions, outputOptions);

      const serializedOptions = serialize(normalizedOptions);

      try {
        const result = await this.worker.transform(code, serializedOptions);

        handleNameCache(result, userOptions);

        return result.result;
      } catch (error) {
        handleWorkerError(error);
      } finally {
        this.numOfBundles--;

        if (this.numOfBundles === 0) {
          this.worker.end();
          this.worker = 0;
        }
      }

      return undefined;
    },
  };
};
