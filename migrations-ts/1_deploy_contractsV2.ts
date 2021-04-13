const Election = artifacts.require('Election')

module.exports = function(deployer) {
  deployer.deploy(Election)
} as Truffle.Migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}