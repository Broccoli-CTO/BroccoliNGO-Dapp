import * as dotenv from "dotenv";
dotenv.config();
import { getBalanceOfDate, getConfig, updateConfig } from "@/shared/server/model";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { getPrivyUserInfoByAccessToken } from "@/shared/server/privy";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const BASE_URI = 'http://localhost:3000';
const testBody = {}

async function testDuneWebhook() {
  const req = await fetch(`${BASE_URI}/api/webhook/dune`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testBody)
  })
  const res = await req.json()
  console.log(res)
}

async function testGetBalance() {
  const res = await getBalanceOfDate('0x016d26e90eca6c56b9411134f752e2a021cd93bf', '2025-04-02')
  console.log(res)
}

async function testVoteSubmit() {
  const privateKey = generatePrivateKey()
  const wallet = privateKeyToAccount(privateKey)
  const nftId = 1
  const result = false
  const signature = await wallet.signMessage({
    message: JSON.stringify({
      nftId,
      result
    })
  })
  const req = await fetch(`${BASE_URI}/api/vote/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: wallet.address,
      nftId,
      result,
      signature
    })
  })
  const res = await req.json()
  console.log(res)
}

async function testVoteResult() {
  const req = await fetch(`${BASE_URI}/api/vote/result?nftId=1`)
  const res = await req.json()
  console.log(res)
}

async function testVoteList() {
  const req = await fetch(`${BASE_URI}/api/vote/list?nftId=1&page=1&pageSize=20`)
  const res = await req.json()
  console.log(JSON.stringify(res))
}

async function testPrivy() {
  const accessToken = ''
  const userInfo = await getPrivyUserInfoByAccessToken(accessToken)
  console.log(userInfo)
}

async function main() {
  // await testGetBalance()
  // await testVoteSubmit()
  // await testVoteResult()
  // await testVoteList()
  await testPrivy()
}

main();
