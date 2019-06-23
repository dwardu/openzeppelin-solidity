const { LegacyMerkleTreeLibrary } = require('../helpers/merkleTree');
const MerkleProofMock = artifacts.require('MerkleProofMock');
const { shouldBehaveLikeMerkleTreesVerifyProof } = require('./MerkleTrees.behavior');

contract('MerkleProof', () => {
  before(async function () {
    this.MerkleTrees = await MerkleProofMock.new();
    this.jsLib = LegacyMerkleTreeLibrary;
  });
  shouldBehaveLikeMerkleTreesVerifyProof();
});
