import { HelpRequest2, NFTMetaData2 } from "./help";
import { HelpRequest, NFTMetaData, RescueNFTMetaData, RescueRequest } from "./rescue";

export interface Task {
  URI: string;
  txHash: string;
  nftId: string;
  created_at: string;
  address?: string;
  status: number;
  isVoteEnabled: boolean;
  isVoteEnded: boolean;
  voteLeftTime: number;
  vote_start_date: number;
  vote_end_date: number;
  isAuthor: boolean;
  email: string;
  metadata: NFTMetaData | NFTMetaData2 | RescueNFTMetaData | null;
}