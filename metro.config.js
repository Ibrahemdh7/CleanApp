const { getDefaultConfig } = require('expo/metro-config');

const defaultConfing = getDefaultConfig(__dirname)
defaultConfing.resolver.assetExts.push('cjs')


module.exports = defaultConfing
