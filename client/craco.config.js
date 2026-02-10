/**
 * CRACO config: use webpack-dev-server 5 API (setupMiddlewares) so we can
 * run patched webpack-dev-server@5.2.1 and fix moderate security advisories.
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
    return devServerConfig;
  },
};
