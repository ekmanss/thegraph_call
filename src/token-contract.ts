import {
    Transfer as TransferEvent
} from "../generated/TokenContract/TokenContract"
import {MyTestAbi, MyTestAbi__myfuncInputTStruct} from "../generated/TokenContract/MyTestAbi";
import {Transfer} from "../generated/schema"
import {
    Address,
    Bytes, ethereum, BigInt
} from "@graphprotocol/graph-ts";
import {HypervisorAbi} from "../generated/TokenContract/HypervisorAbi";
import {PoolAbi} from "../generated/TokenContract/PoolAbi";

const MyTestAddr = "0x92f533e12923d453b0e1f6020759929a3e3d02cb"

const test_hypervisor = "0x10fe38d97a47887806ba54038c57fd15c734a851"
const test_pool = "0x920261f982555a1770c76dafbdc4150771650b8b"

export function handleTransfer(event: TransferEvent): void {
    let entity = new Transfer(
        Bytes.fromHexString(event.transaction.hash.toHexString())
    )
    entity.from = event.params.from
    entity.to = event.params.to
    entity.value = event.params.value

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash


    // let tupleArray: Array<ethereum.Value> = [
    //     ethereum.Value.fromAddress(Address.fromString('0x0000000000000000000000000000000000000420')),
    //     ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(62)),
    //     ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(62)),
    // ]
    // let tuple = tupleArray as ethereum.Tuple
    // let valueFromTuple = ethereum.Value.fromTuple(tuple)
    // let encoded = ethereum.encode(valueFromTuple)!
    // let decoded = ethereum.decode('(address,uint256)', encoded)
    // let MyTest_contract = MyTestAbi.bind(Address.fromString(MyTestAddr))

    let tupleArray: Array<ethereum.Value> = [
        ethereum.Value.fromAddress(Address.fromString('0x0000000000000000000000000000000000000420')),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(62)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(62)),
    ]
    let tuple = changetype<ethereum.Tuple>(tupleArray);
    let valueFromTuple = ethereum.Value.fromTuple(tuple)
    let encoded = ethereum.encode(valueFromTuple)!
    let decoded = ethereum.decode('(address,uint256)', encoded)
    let MyTest_contract = MyTestAbi.bind(Address.fromString(MyTestAddr))

    let changed = changetype<MyTestAbi__myfuncInputTStruct>(tuple)
    let rs_1 = MyTest_contract.myfunc(changed, encoded)

    entity.blockNumber = rs_1
    entity.save()

    let hypervisorContract = HypervisorAbi.bind(Address.fromString(test_hypervisor))
    let poolContract = PoolAbi.bind(Address.fromString(test_pool))

    let limitLower = hypervisorContract.limitLower()
    let limitUpper = hypervisorContract.limitUpper()

    let new_tupleArray: Array<ethereum.Value> = [
        ethereum.Value.fromAddress(event.address),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(limitLower)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(limitUpper)),
    ]
    let new_tuple = changetype<ethereum.Tuple>(new_tupleArray);
    let new_valueFromTuple = ethereum.Value.fromTuple(new_tuple)
    let new_encoded = ethereum.encode(new_valueFromTuple)!

    let info = poolContract.positionsSum(new_encoded)

}
