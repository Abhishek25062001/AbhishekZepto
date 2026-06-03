const path = require('node:path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = {
  // Watch the project root, workspace root (for hoisted node_modules), and shared packages
  watchFolders: [
    workspaceRoot,
    projectRoot,
    path.resolve(workspaceRoot, 'packages/shared'),
    path.resolve(workspaceRoot, 'packages/shared-ui'),
  ],
  resolver: {
    // Point resolver to both local and hoisted node_modules
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    // Force single instances of react and react-native to prevent duplicate module caching
    extraNodeModules: {
      'react': path.resolve(workspaceRoot, 'node_modules/react'),
      'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
    },
    // Exclude other workspaces and backend to prevent Metro from indexing them (prevents OOM)
    blockList: [
      /node_modules\/.*\/node_modules\/react\//,
      new RegExp(path.resolve(workspaceRoot, 'backend').replace(/[/\\\+]/g, '\\$&')),
      new RegExp(path.resolve(workspaceRoot, 'apps/vendor-panel').replace(/[/\\\+]/g, '\\$&')),
      new RegExp(path.resolve(workspaceRoot, 'apps/admin-dashboard').replace(/[/\\\+]/g, '\\$&')),
      new RegExp(path.resolve(workspaceRoot, 'apps/delivery-agent-app').replace(/[/\\\+]/g, '\\$&')),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
