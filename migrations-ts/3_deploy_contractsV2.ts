const ConvertLib = artifacts.require('ConvertLib')
const ElectionV2 = artifacts.require('ElectionV2')

module.exports = function(deployer) {
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, ElectionV2)
  deployer.deploy(ElectionV2)
} as Truffle.Migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}