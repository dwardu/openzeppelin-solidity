pragma solidity ^0.5.0;

import { MerkleProof } from "../cryptography/MerkleProof.sol";

contract MerkleProofMock {

    /**
     * @dev Presents the legacy MerkleProof.verifyProof()
     * with the same interface as the newer MerkleTrees.verifyProof(),
     * to facilitate testing both libraries with the same testing functions.
     */
    function verifyProof(
        bytes32 root,
        bytes memory leafData,
        bytes32[] memory proof
    )
        public
        pure
        returns (bool)
    {
        return MerkleProof.verify(proof, root, keccak256(leafData));
    }

}
