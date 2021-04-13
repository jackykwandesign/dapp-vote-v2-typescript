const ElectionV2 = artifacts.require('ElectionV2')

module.exports = function(deployer) {
  deployer.deploy(ElectionV2)
} as Truffle.Migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}