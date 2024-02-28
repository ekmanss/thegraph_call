import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll
} from "matchstick-as/assembly/index"
import {Address, BigInt, crypto, ethereum, log, ByteArray, Bytes} from "@graphprotocol/graph-ts"
import {Transfer} from "../generated/schema"
import {Approval as ApprovalEvent} from "../generated/TokenContract/TokenContract"
import {handleTransfer} from "../src/token-contract"
import {createTransferEvent} from "./token-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
    beforeAll(() => {
        let owner = Address.fromString("0x0000000000000000000000000000000000000001")
        let spender = Address.fromString(
            "0x0000000000000000000000000000000000000001"
        )
        let value = BigInt.fromI32(234)
        let newTransferEvent = createTransferEvent(owner, spender, value)

        log.info("newTransferEvent: {}", [value.toString()])

        const test_hypervisor = "0x10fe38d97a47887806ba54038c57fd15c734a851"

        let address_bytes = ethereum.encode(ethereum.Value.fromAddress(Address.fromString(test_hypervisor)))!;
        let int1_bytes = ethereum.encode(ethereum.Value.fromSignedBigInt(BigInt.fromI32(6000)))!;
        let int2_bytes = ethereum.encode(ethereum.Value.fromSignedBigInt(BigInt.fromI32(8400)))!;
        log.info("address_bytes: {}", [address_bytes.toHexString()])
        let address_packed = changetype<ByteArray>(address_bytes.subarray(12, 32));
        let int24_packed1 = changetype<ByteArray>(int1_bytes.subarray(29, 32));
        let int24_packed2 = changetype<ByteArray>(int2_bytes.subarray(29, 32));

        log.info("address_packed: {}", [address_packed.toHexString()])
        log.info("int24_packed1: {}", [int24_packed1.toHexString()])
        log.info("int24_packed2: {}", [int24_packed2.toHexString()])

        let packed = address_packed.concat(int24_packed1).concat(int24_packed2);
        let keccak256_done = crypto.keccak256(packed);

        log.info("keccak256_done: {}", [keccak256_done.toHexString()])

        assert.stringEquals(keccak256_done.toHexString(), "0xd97aa3426c2dd1df4581adf215f4adb67a49b04624681046b5b6bdedc63979a5")

        handleTransfer(newTransferEvent)
    })

    afterAll(() => {
        clearStore()
    })

    // For more test scenarios, see:
    // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

    test("Transfer created and stored", () => {
        assert.entityCount("Transfer", 1)

        // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
        assert.fieldEquals(
            "Transfer",
            "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
            "from",
            "0x0000000000000000000000000000000000000001"
        )
        assert.fieldEquals(
            "Transfer",
            "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
            "to",
            "0x0000000000000000000000000000000000000001"
        )
        assert.fieldEquals(
            "Transfer",
            "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
            "value",
            "234"
        )

        // More assert options:
        // https://thegraph.com/docs/en/developer/matchstick/#asserts
    })
})
