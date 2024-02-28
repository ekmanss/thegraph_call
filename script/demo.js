const {ethers} = require("ethers");
const HypervisorAbi = require('../abis/Hypervisor.json');
const RoxPosnPoolAbi = require("../abis/Pool.json");

const rpcUrl = "https://sepolia.blast.io"
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const test_hypervisor = "0x10fe38d97a47887806ba54038c57fd15c734a851"
const test_pool = "0x920261f982555a1770c76dafbdc4150771650b8b"
const hypervisor = new ethers.Contract(test_hypervisor, HypervisorAbi, provider);
const pool = new ethers.Contract(test_pool, RoxPosnPoolAbi, provider);

async function run() {
    let limitLower = await hypervisor.limitLower();
    let limitUpper = await hypervisor.limitUpper();
    // console.log("limitLower::", limitLower.toString())
    // console.log("limitUpper::", limitUpper.toString())
    let key = ethers.utils.solidityKeccak256(["address", "int24", "int24"],
        [hypervisor.address, limitLower, limitUpper]);
    console.log("key::", key)
    // let result = await pool.positionsSum(key)
    // console.log("result::", result)
}

run()
