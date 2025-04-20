"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addProof,
  fetchFundRecords,
  fetchProfile,
  fetchTaskDetail,
  fetchVoteResult,
  fetchXGenerateLink,
  uploadJson,
} from "@/shared/api";
import { usePublicClient } from "wagmi";
import { ABI, CONTRACT_ADDRESS } from "@/shared/constant";
import { Task } from "@/shared/types/task";
import {
  HelpRequest,
  NFTMetaData,
  RescueNFTMetaData,
  RescueRequest,
} from "@/shared/types/rescue";
import { HelpRequest2, NFTMetaData2 } from "@/shared/types/help";
import {
  checkIsVoteOnchainMetadata,
  formatNFTMetadataToTaskRequest,
  nftMetaDataToHelpRequest,
  nftMetaDataToHelpRequest2,
  NFTMetaDataToRescueRequestForms,
  VoteOnchainMetadata,
} from "@/shared/task";
import { VoteResult } from "@/shared/types/vote";
import { Profile } from "@/shared/types/profile";
import { useGlobalCtx } from "./useGlobal";
import { useI18n } from "@/components/ui/I18nProvider";

interface TaskDetailsContextType {
  isAuthor: boolean;
  tokenId: string;
  task: Task | null;
  isApproved: boolean;
  loading: boolean;
  taskMetaData: HelpRequest | HelpRequest2 | RescueRequest | null;
  voteResult: VoteResult;
  isVoteEnded: boolean;
  taskStatus: "Pending" | "Approved" | "Rejected" | "";
  voteFinalResult: "Approved" | "Rejected" | "";
  parsedFundRecords: string[];
  onchainVoteMetadata: VoteOnchainMetadata | null;
  onchainVoteResultURL: string;
  uploadedFundRecords: string[];
  refreshFundRecords: () => void;
  error?: string;
  refreshTask: () => void;
}

const TaskDetailsContext = createContext<TaskDetailsContextType | undefined>(
  undefined
);

export const TaskDetailsProvider = ({
  tokenId,
  children,
}: {
  tokenId: string;
  children: ReactNode;
}) => {
  const { lang } = useI18n();
  const { profile } = useGlobalCtx();
  const publicClient = usePublicClient();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskMetaData, setTaskMetaData] = useState<
    HelpRequest | HelpRequest2 | RescueRequest | null
  >(null);
  const [taskVersion, setTaskVersion] = useState("");
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState("");
  const [voteResult, setVoteResult] = useState<VoteResult>({
    0: 0,
    1: 0,
  });

  const [fetchingFundRecords, setFetchingFundRecords] = useState(false);
  const [parsingFundRecords, setParsingFundRecords] = useState(false);
  const [uploadedFundRecords, setUploadedFundRecords] = useState<string[]>([]);
  const [parsedFundRecords, setParsedFundRecords] = useState<string[]>([]);
  const [onchainVoteResultURL, setOnchainVoteResultURL] = useState("");
  const [onchainVoteMetadata, setOnchainVoteMetadata] =
    useState<VoteOnchainMetadata | null>(null);

  const voteFinalResult = useMemo(() => {
    if (!voteResult || !task?.isVoteEnded) return "";
    if (voteResult[0] > voteResult[1]) return "Rejected";
    if (voteResult[1] > voteResult[0]) return "Approved";
    return "";
  }, [task?.isVoteEnded, voteResult]);

  const taskStatus = useMemo(() => {
    if (!task) return "";
    if (task.status === 2 && voteFinalResult === "Approved") return "Approved";
    if (task.status === 2 && voteFinalResult === "Rejected") return "Rejected";
    if (task.status === 2) return "Approved";
    if ((task.status === 1 || isApproved) && voteFinalResult === "Approved")
      return "Approved";
    if ((task.status === 1 || isApproved) && voteFinalResult === "Rejected")
      return "Rejected";
    if (task.status === 0 || !voteFinalResult) return "Pending";
    return "";
  }, [task, voteFinalResult, isApproved]);

  async function getTaskData(id: string, lang = "en") {
    const res = await fetchTaskDetail(id, lang);
    if (res.code === 0) {
      setTask(res.data);
      return res.data;
    }
    return null;
  }

  async function getVoteResult(tokenId: string) {
    const res = await fetchVoteResult(tokenId);
    if (res.code === 0) {
      setVoteResult({
        0: res.data[0] || 0,
        1: res.data[1] || 0,
      });
    }
    return res.data;
  }

  const checkIsApproved = async (tokenId: string) => {
    const res = await publicClient?.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "approval",
      args: [BigInt(tokenId)],
    });
    return !!res;
  };

  async function loadTaskMetaData(
    tokenUri?: string,
    metadata?: NFTMetaData | NFTMetaData2 | RescueNFTMetaData
  ) {
    const parsed = await formatNFTMetadataToTaskRequest({
      tokenUri,
      metadata,
    });
    if (!parsed) return null;
    setTaskVersion(parsed.v);
    switch (parsed.v) {
      case "1.0": {
        const { NFTMetaData, formatedData } = parsed;
        if (!formatedData) return null;
        setMetadataLoading(false);
        return NFTMetaDataToRescueRequestForms(NFTMetaData as RescueNFTMetaData)
          .request;
      }
      case "0.2": {
        const { NFTMetaData, formatedData } = parsed;
        if (!formatedData) return null;
        setMetadataLoading(false);
        return nftMetaDataToHelpRequest2(NFTMetaData as NFTMetaData2);
      }
      case "0.1": {
        const { NFTMetaData, formatedData } = parsed;
        if (!formatedData) return null;
        setMetadataLoading(false);
        return nftMetaDataToHelpRequest(NFTMetaData as NFTMetaData);
      }
      default:
        setMetadataLoading(false);
        return null;
    }
  }

  const getUploadedFundRecords = async (tokenId: string) => {
    setFetchingFundRecords(true);
    const res = await fetchFundRecords(tokenId);
    if (res.code === 0) {
      setUploadedFundRecords(res.data.map(({ URI }: any) => URI));
    }
    setFetchingFundRecords(false);
    // const res = await publicClient?.readContract({
    //   address: CONTRACT_ADDRESS,
    //   abi: ABI,
    //   functionName: "fundRecord",
    //   args: [BigInt(tokenId), BigInt(0)],
    // });
    // setUploadedFundRecords((prev) => [...prev, res || ""]);
    // setUploadedFundRecordsLoading(false);
    console.log("func records", res);
  };

  useEffect(() => {
    if (!tokenId) return;
    getTaskData(tokenId, lang)
      .then((data) => {
        loadTaskMetaData(data?.URI, data?.metadata!).then(async (metadata) => {
          setTaskMetaData(metadata);
        });
        getVoteResult(tokenId);
        checkIsApproved(tokenId).then((bool) => {
          setIsApproved(bool);
        });
        getUploadedFundRecords(tokenId);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tokenId, lang]);

  useEffect(() => {
    if (!uploadedFundRecords.length) return;
    async function loadFundRecords() {
      setParsingFundRecords(true);
      await Promise.all(
        uploadedFundRecords.map(async (record) => {
          return await fetch(record)
            .then((res) => res.json())
            .then((data: any) => {
              if (checkIsVoteOnchainMetadata(data)) {
                setOnchainVoteResultURL(record);
                setOnchainVoteMetadata(data);
              } else {
                setParsedFundRecords((prev) => [...prev, ...data]);
              }
            });
        })
      );
      setParsingFundRecords(false);
    }
    loadFundRecords();
    return () => {
      setParsedFundRecords([]);
      setOnchainVoteResultURL("");
      setOnchainVoteMetadata(null);
    };
  }, [uploadedFundRecords]);

  return (
    <TaskDetailsContext.Provider
      value={{
        isAuthor: task?.isAuthor || false,
        tokenId,
        task,
        isApproved,
        loading:
          loading ||
          metadataLoading ||
          fetchingFundRecords ||
          parsingFundRecords,
        taskMetaData,
        voteResult,
        isVoteEnded: task?.isVoteEnded || false,
        taskStatus,
        voteFinalResult,
        parsedFundRecords,
        onchainVoteResultURL,
        onchainVoteMetadata,
        uploadedFundRecords,
        error,
        refreshFundRecords: () => {
          getUploadedFundRecords(tokenId);
        },
        refreshTask: () => {
          getTaskData(tokenId);
        },
      }}
    >
      {children}
    </TaskDetailsContext.Provider>
  );
};

export const useTaskDetailsCtx = () => {
  const context = useContext(TaskDetailsContext);
  if (context === undefined) {
    throw new Error(
      "useTaskDetailsCtx must be used within a TaskDetailsProvider"
    );
  }
  return context;
};
