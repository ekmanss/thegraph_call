import {
    Transfer as TransferEvent
} from "../generated/TokenContract/TokenContract"
import {MyTestAbi, MyTestAbi__myfuncInputTStruct} from "../generated/TokenContract/MyTestAbi";
import {Transfer} from "../generated/schema"
import {
    Address,
    Bytes, ethereum, BigInt
} from "@graphprotocol/graph-ts";

const MyTestAddr = "0x92f533e12923d453b0e1f6020759929a3e3d02cb"

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

    entity.save()

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
    let rs_1 = MyTest_contract.myfunc(tuple as MyTestAbi__myfuncInputTStruct, encoded)
}
