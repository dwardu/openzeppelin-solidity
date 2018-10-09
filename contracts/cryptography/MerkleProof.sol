pragma solidity ^0.5.0;

import "./LegacyMerkleTrees.sol";


/**
 * @dev These functions deal with verification of Merkle trees (hash trees),
 */
library MerkleProof {
    /**
     * @dev Returns true if a `leaf` can be proved to be a part of a Merkle tree
     * defined by `root`. For this, a `proof` must be provided, containing
     * sibling hashes on the branch from the leaf to the root of the tree. Each
     * pair of leaves and each pair of pre-images are assumed to be sorted.
     * @param proof Merkle proof
     * @param root Merkle root
     * @param leafDataBlock Leaf data block of Merkle tree, before hashing
     */
    function verify(bytes32[] memory proof, bytes32 root, bytes memory leafDataBlock) internal pure returns (bool) {
        return LegacyMerkleTrees.verifyProof(root, leafDataBlock, proof);
    }
}
