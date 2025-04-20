import { HelpRequest2, NFTMetaData2 } from "../types/help";
import {
  HelpRequest,
  NFTMetaData,
  RescueNFTMetaData,
  RescueRequest,
} from "@/shared/types/rescue";
import { Task } from "@/shared/types/task";

const BaseURI = "";

export const fetchXGenerateLink = async (referral_from?: string) => {
  const res = await fetch(`${BaseURI}/api/xoauth/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ referral_from }),
  });
  return res.json();
};

export const fetchProfile = async () => {
  const res = await fetch(`${BaseURI}/api/profile`);
  return res.json();
};

export const uploadJson = async (
  data:
    | HelpRequest
    | NFTMetaData
    | HelpRequest2
    | NFTMetaData2
    | RescueRequest
    | RescueNFTMetaData
    | string[]
) => {
  const res = await fetch(`${BaseURI}/api/ipfs/json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const createTask = async (tokenURI: string) => {
  const res = await fetch(`${BaseURI}/api/createTask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenURI }),
  });
  return res.json();
};

export const createTaskV1 = async (tokenURI: string) => {
  const res = await fetch(`${BaseURI}/api/createTask/v1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenURI }),
  });
  return res.json();
};

export const syncMultilang = async () => {
  const res = await fetch(`${BaseURI}/api/cron/multilang`, {
    method: "GET",
  });
  return res.json();
};

export const createHumanTask = async (tokenURI: string, pics: string[]) => {
  const res = await fetch(`${BaseURI}/api/createTask/human`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenURI, pics }),
  });
  return res.json();
};

export const approveTask = async (
  tokenId: string,
  start_date: number,
  end_date: number
) => {
  const res = await fetch(`${BaseURI}/api/action/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenId, start_date, end_date }),
  });
  return res.json();
};

export const sumbitVoteResult = async (tokenId: string) => {
  const res = await fetch(`${BaseURI}/api/action/sumbit-vote-result`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenId }),
  });
  return res.json();
};

export const addFundRecord = async (tokenId: string, url: string) => {
  const res = await fetch(`${BaseURI}/api/action/fund-records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenId, url }),
  });
  return res.json();
};

export const addProof = async (tokenId: string, url: string) => {
  const res = await fetch(`${BaseURI}/api/action/proof`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenId, url }),
  });
  return res.json();
};

export const submitVote = async (
  address: string,
  nftId: string | number,
  result: boolean,
  signature: string
) => {
  const res = await fetch(`${BaseURI}/api/vote/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
      nftId,
      result,
      signature,
    }),
  });
  return res.json();
};

export const fetchTaskDetail = async (
  id: string,
  lang = "en"
): Promise<{
  code: number;
  data: Task;
}> => {
  const res = await fetch(`${BaseURI}/api/task/${id}?lang=${lang}`);
  return res.json();
};

export const fetchProofs = async (id: string) => {
  const res = await fetch(`${BaseURI}/api/proofs/${id}`);
  return res.json();
};

export const fetchFundRecords = async (id: string) => {
  const res = await fetch(`${BaseURI}/api/fundRecords/${id}`);
  return res.json();
};

export const fetchVotes = async (id: string, page = 1, pageSize = 10) => {
  const res = await fetch(
    `${BaseURI}/api/vote/list?nftId=${id}&page=${page}&pageSize=${pageSize}`
  );
  return res.json();
};

export const fetchVoteBalance = async (address: string, tokenId: string) => {
  const res = await fetch(
    `${BaseURI}/api/vote/balance?address=${address}&tokenId=${tokenId}`
  );
  return res.json();
};

export const fetchVoteResult = async (id: string) => {
  const res = await fetch(`${BaseURI}/api/vote/result?nftId=${id}`);
  return res.json();
};
