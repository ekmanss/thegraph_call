import {
    Transfer as TransferEvent
} from "../generated/TokenContract/TokenContract"
import {MyTestAbi, MyTestAbi__myfuncInputTStruct} from "../generated/TokenContract/MyTestAbi";
import {Transfer} from "../generated/schema"
import {
    Address,
    Bytes, ethereum, BigInt, log, ByteArray
} from "@graphprotocol/graph-ts";
import {HypervisorAbi} from "../generated/TokenContract/HypervisorAbi";
import {PoolAbi} from "../generated/TokenContract/PoolAbi";

const MyTestAddr = "0x92f533e12923d453b0e1f6020759929a3e3d02cb"
import {crypto} from '@graphprotocol/graph-ts'

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

    let tupleArray: Array<ethereum.Value> = [
        ethereum.Value.fromAddress(Address.fromString('0x0000000000000000000000000000000000000420')),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(62)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(62)),
    ]
    let tuple = changetype<ethereum.Tuple>(tupleArray);
    let MyTest_contract = MyTestAbi.bind(Address.fromString(MyTestAddr))

    let changed = changetype<MyTestAbi__myfuncInputTStruct>(tuple)
    let rs_1 = MyTest_contract.myfunc(changed, Bytes.empty())

    entity.blockNumber = rs_1
    entity.save()

    let hypervisorContract = HypervisorAbi.bind(Address.fromString(test_hypervisor))
    let poolContract = PoolAbi.bind(Address.fromString(test_pool))

    let limitLower = hypervisorContract.limitLower()
    let limitUpper = hypervisorContract.limitUpper()

    let address_bytes = ethereum.encode(ethereum.Value.fromAddress(Address.fromString(test_hypervisor)))!;
    let int1_bytes = ethereum.encode(ethereum.Value.fromSignedBigInt(BigInt.fromI32(limitLower)))!;
    let int2_bytes = ethereum.encode(ethereum.Value.fromSignedBigInt(BigInt.fromI32(limitUpper)))!;
    let address_packed = changetype<ByteArray>(address_bytes.subarray(12, 32));
    let int24_packed1 = changetype<ByteArray>(int1_bytes.subarray(29, 32));
    let int24_packed2 = changetype<ByteArray>(int2_bytes.subarray(29, 32));

    let packed = address_packed.concat(int24_packed1).concat(int24_packed2);
    let keccak256_done = crypto.keccak256(packed);

    // let key = ethers.utils.solidityKeccak256(["address", "int24", "int24"],[hypervisor.address, limitLower, limitUpper]);
    let info = poolContract.positionsSum(Bytes.fromByteArray(keccak256_done))

    entity.blockTimestamp = info.getValue0().plus(info.getValue1()).plus(info.getValue2()).plus(info.getValue3()).plus(info.getValue4())
    entity.save()

}
