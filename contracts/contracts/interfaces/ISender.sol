// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface ISender {
    function sendViaCall(address payable _to) external payable;
}