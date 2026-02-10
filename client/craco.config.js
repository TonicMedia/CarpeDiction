/**
 * CRACO config: use webpack-dev-server 5.x (patched 5.2.1 for security). React-scripts
 * passes deprecated top-level `https`; convert it to the `server` option for v5.
 */
module.exports = {
  devServer: (devServerConfig) => {
    const onBefore = devServerConfig.onBeforeSetupMiddleware;
    const onAfter = devServerConfig.onAfterSetupMiddleware;
    delete devServerConfig.onBeforeSetupMiddleware;
    delete devServerConfig.onAfterSetupMiddleware;
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      if (typeof onBefore === 'function') onBefore(devServer);
      if (typeof onAfter === 'function') onAfter(devServer);
      return middlewares;
    };
    const https = devServerConfig.https;
    delete devServerConfig.https;
    if (https) {
      devServerConfig.server =
        typeof https === 'object' && (https.key || https.cert)
          ? { type: 'https', options: https }
          : 'https';
    }
    return devServerConfig;
  },
};
