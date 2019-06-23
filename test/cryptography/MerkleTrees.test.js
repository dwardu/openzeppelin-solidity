const { MerkleTreeLibrary } = require('../helpers/merkleTree');
const MerkleTreesMock = artifacts.require('MerkleTreesMock');
const {
  shouldBehaveLikeMerkleTreesVerifyProof,
  shouldBehaveLikeMerkleTreesComputeRoot,
} = require('./MerkleTrees.behavior');

contract('MerkleTrees', () => {
  before(async function() {
    this.MerkleTrees = await MerkleTreesMock.new();
    this.jsLib = MerkleTreeLibrary;
  });
  shouldBehaveLikeMerkleTreesVerifyProof();
  shouldBehaveLikeMerkleTreesComputeRoot();
});
