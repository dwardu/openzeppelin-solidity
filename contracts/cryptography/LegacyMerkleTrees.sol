pragma solidity ^0.5.0;

import "./MerkleTrees.sol";


/**
 * @title LegacyMerkleTree library
 * @dev Computation of Merkle root and verification of Merkle proof based on
 * https://github.com/ameensol/merkle-tree-solidity/blob/master/src/MerkleProof.sol
 */
library LegacyMerkleTrees {

  using MerkleTrees for MerkleTrees.TreeConfig;

  function _keccak256Leaf(bytes memory leafDataBlock)
    internal
    pure
    returns (bytes32)
  {
    return keccak256(leafDataBlock);
  }

  function _keccak256SortNodePair(bytes32 h1, bytes32 h2)
    internal
    pure
    returns (bytes32)
  {
    return keccak256(
      h1 < h2 ? abi.encodePacked(h1, h2) : abi.encodePacked(h2, h1)
    );
  }

  function _config() internal pure returns (MerkleTrees.TreeConfig memory config) {
    config._hashLeafData = _keccak256Leaf;
    config._hashNodePair = _keccak256SortNodePair;
  }

  function newTree(uint256 size)
    internal
    pure
    returns (MerkleTrees.Tree memory tree)
  {
    return _config().newTree(size);
  }

  function verifyProof(bytes32 root, bytes memory leafDataBlock, bytes32[] memory proof)
    internal
    pure
    returns (bool)
  {
    return _config().verifyProof(root, leafDataBlock, proof);
  }

}
