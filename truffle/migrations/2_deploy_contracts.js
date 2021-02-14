var RTOK = artifacts.require("./RTOK.sol");
var STOK = artifacts.require("./STOK.sol");
var TTOK = artifacts.require("./TTOK.sol");
var UTOK = artifacts.require("./UTOK.sol");
var VTOK = artifacts.require("./VTOK.sol");
var DEX = artifacts.require("./DEX.sol");
var faucet = artifacts.require("./faucet.sol");

module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(RTOK, "10000000000000000000000000");
  deployer.deploy(STOK, "10000000000000000000000000");
  deployer.deploy(TTOK, "10000000000000000000000000");
  deployer.deploy(UTOK, "10000000000000000000000000");
  deployer.deploy(VTOK, "10000000000000000000000000");
  deployer.deploy(DEX);
  deployer.deploy(faucet);
};

