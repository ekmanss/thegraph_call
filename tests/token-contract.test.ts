import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll
} from "matchstick-as/assembly/index"
import {Address, BigInt, crypto, ethereum, log} from "@graphprotocol/graph-ts"
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

        let new_tupleArray: Array<ethereum.Value> = [
            ethereum.Value.fromAddress(Address.fromString(test_hypervisor)),
            ethereum.Value.fromSignedBigInt(BigInt.fromI32(6000)),
            ethereum.Value.fromSignedBigInt(BigInt.fromI32(8400)),
        ]
        let new_tuple = changetype<ethereum.Tuple>(new_tupleArray);
        let new_valueFromTuple = ethereum.Value.fromTuple(new_tuple)
        let new_encoded = ethereum.encode(new_valueFromTuple)!
        let keccak256_done = crypto.keccak256(new_encoded)

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
