import { RadioCard } from "@chakra-ui/react";
import { CSSProperties, FC, use, useEffect, useMemo, useState } from "react";
import {
  addProof,
  fetchProfile,
  fetchTaskDetail,
  fetchVoteBalance,
  fetchVoteResult,
  fetchXGenerateLink,
  submitVote,
  sumbitVoteResult,
  uploadJson,
} from "@/shared/api";
import { useAccount, usePublicClient, useSignMessage } from "wagmi";
import { formatDecimalNumber, formatVotes, sliceAddress } from "@/shared/utils";
import {
  CardContainer,
  CardTitle,
  CardTitleTip,
  SubmitButton,
} from "@/components/Task/Layout";
import styled from "@emotion/styled";
import { VoteItem, VoteResult } from "@/shared/types/vote";
import Avatar from "boring-avatars";
import VotedIcon from "@/components/icons/voted";
import { toaster } from "@/components/ui/toaster";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { getVoteSignatureMessage } from "@/shared/vote";
import TimerCountDown from "@/components/Common/Timer-CountDown";
import clsx from "clsx";
import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useTaskDetailsCtx } from "@/hooks/useTaskDetails";
import { useGlobalCtx } from "@/hooks/useGlobal";
import { useI18n } from "@/components/ui/I18nProvider";

interface VotesViewProps {
  tokenId: string;
  admin?: boolean;
}

export const VotesView: FC<VotesViewProps> = ({ tokenId, admin }) => {
  const { trans } = useI18n();
  const { profile } = useGlobalCtx();
  const {
    task,
    isVoteEnded,
    voteResult,
    onchainVoteResultURL,
    onchainVoteMetadata,
    refreshFundRecords,
    refreshTask,
  } = useTaskDetailsCtx();

  const publicClient = usePublicClient();

  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { signMessageAsync } = useSignMessage();

  const [votes, setVotes] = useState<VoteItem[]>([]);
  const [balance, setBalance] = useState(0);
  const [votesParams, setVotesParams] = useState<{
    pn: number;
    ps: number;
    total: number;
  }>({
    pn: 1,
    ps: 10,
    total: 0,
  });
  const [choose, setChoose] = useState("-1");
  const [isVoted, setIsVoted] = useState(false);
  const [manualVotes, setManualVotes] = useState(0);
  const [voteResultUploading, setVoteResultUploading] = useState(false);
  const [voteSubmitting, setVoteSubmitting] = useState(false);

  const totalVotes = useMemo(() => {
    if (!voteResult) return 0;
    return voteResult[0] + voteResult[1] + manualVotes;
  }, [voteResult, manualVotes]);

  const items = useMemo(() => {
    return [
      {
        value: "1",
        title: trans(_TL_("Yes")),
        num: voteResult[1] + (choose === "1" ? manualVotes : 0),
        winner: isVoteEnded && voteResult[1] > voteResult[0],
        winnerText: voteResult[1] > voteResult[0] ? "✌️" : "",
        winnerColor: "#21B66F",
      },
      {
        value: "0",
        title: trans(_TL_("No")),
        num: voteResult[0] + (choose === "0" ? manualVotes : 0),
        winner: isVoteEnded && voteResult[0] > voteResult[1],
        winnerText: voteResult[0] > voteResult[1] ? "☹️" : "",
        winnerColor: "#FF4D82",
      },
    ];
  }, [voteResult, isVoteEnded, manualVotes, choose]);

  const getPercent = (num: number) => {
    if (!totalVotes) return 0;
    return ((num / totalVotes) * 100).toFixed(2);
  };

  const handleUploadVoteResult = async () => {
    if (voteResultUploading) return;
    setVoteResultUploading(true);
    const res = await sumbitVoteResult(tokenId);
    if (res.code === 0) {
      toaster.create({
        title: trans(_TL_("Vote result uploaded")),
        description: trans(_TL_("Vote result has been uploaded successfully.")),
        type: "success",
      });
    } else {
      toaster.create({
        title: trans(_TL_("Failed to upload vote result")),
        description: res.message,
        type: "error",
      });
    }
    refreshFundRecords();
    setVoteResultUploading(false);
  };

  const handleVote = async () => {
    if (choose === "-1") {
      toaster.create({
        title: trans(_TL_("Please select an option")),
        type: "error",
      });
      return;
    }

    if (!address) {
      openConnectModal?.();
      return;
    }

    setVoteSubmitting(true);
    const signature = await signMessageAsync({
      account: address,
      message: getVoteSignatureMessage(tokenId, choose === "1"),
    });

    const res = await submitVote(address, tokenId, choose === "1", signature);
    setVoteSubmitting(false);

    if (res.code === 0) {
      toaster.create({
        title: trans(_TL_("Vote success")),
        type: "success",
      });
      getVotes(1, votesParams.ps);
      setIsVoted(true);
    } else {
      toaster.create({
        title: trans(_TL_("Vote failed")),
        description: res.message,
        type: "error",
      });
    }
  };

  async function getBalance(address: string, tokenId: string) {
    if (!address) return;
    const res = await fetchVoteBalance(address, tokenId);
    if (res.code === 0) {
      setBalance(res.data.balance);
      setChoose(String(res.data.result));
      setIsVoted(res.data.result !== -1);
    }
  }

  async function getVotes(pn = 1, ps = 10) {
    const res = await fetch(
      `/api/vote/list?nftId=${tokenId}&page=${pn}&pageSize=${ps}`
    );
    const data = await res.json();
    if (data.code === 0) {
      setVotes(data.data.list);
      setVotesParams((prev) => ({
        ...prev,
        pn,
        ps,
        total: data.data.total,
      }));
    }
  }

  useEffect(() => {
    if (!tokenId) return;
    getVotes(1, 10);
  }, [tokenId]);

  useEffect(() => {
    if (!tokenId || !address) return;
    getBalance(address, tokenId);
  }, [tokenId, address]);

  return (
    <CardContainer>
      {isVoteEnded ? (
        <>
          <CardTitle>
            {trans(_TL_("Voting ended"))}:{" "}
            <CardTitleTip color={items.find((i) => i.winner)?.winnerColor}>
              {trans(_TL_("Result is"))} {"{"}
              {items.find((i) => i.winner)?.title}
              {"}"}
            </CardTitleTip>
          </CardTitle>
        </>
      ) : admin ? (
        <CardTitle>{trans(_TL_("Voting Status"))}</CardTitle>
      ) : (
        <CardTitle>
          {trans(_TL_("Cast your vote"))}:{" "}
          <CardTitleTip>
            {trans(_TL_("You have #{{balance}} votes in total"), {
              balance: formatVotes(balance),
            })}
            {/* You have {formatVotes(balance)} votes in total */}
          </CardTitleTip>
        </CardTitle>
      )}
      <VotesBox>
        <RadioCard.Root
          width="full"
          display="flex"
          flexDirection="column"
          defaultValue={choose}
          value={choose}
          onValueChange={(value) => {
            if (isVoted) return;
            setChoose(value.value);
            setManualVotes(balance);
          }}
        >
          {items.map((item) => (
            <RadioCard.Item
              width="full"
              className={clsx("vote-item", {
                choosed: item.value === choose,
                voted: isVoted,
                ended: isVoteEnded || admin,
              })}
              style={
                {
                  "--percent-width": `${item.num ? getPercent(item.num) : 0}%`,
                  "--percent-color": item.winner
                    ? item.winnerColor
                    : "rgba(50, 47, 44, 0.05)",
                } as CSSProperties
              }
              key={item.value}
              value={item.value}
            >
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl>
                <RadioCard.ItemText>
                  <VoteItemText lose={isVoteEnded && !item.winner}>
                    {(item.winner && item.winnerText) ||
                      (item.value === choose && !admin ? (
                        <VotedIcon className="voted-icon" />
                      ) : null)}
                    <span>{item.title}</span>
                  </VoteItemText>
                </RadioCard.ItemText>
                <VoteItemPercent lose={isVoteEnded && !item.winner}>
                  <span>
                    {formatVotes(item.num)} {trans(_TL_("VOTES"))}
                  </span>
                  <span>{getPercent(item.num)}%</span>
                </VoteItemPercent>
                {/* <RadioCard.ItemIndicator /> */}
              </RadioCard.ItemControl>
            </RadioCard.Item>
          ))}
        </RadioCard.Root>

        {isVoteEnded || admin ? null : (
          <SubmitButton
            loading={voteSubmitting}
            disabled={voteSubmitting || isVoted || (address && !balance)}
            onClick={handleVote}
          >
            {address && !balance
              ? trans(_TL_("No votes"))
              : isVoted
              ? trans(_TL_("Voted"))
              : trans(_TL_("Vote"))}
          </SubmitButton>
        )}

        {task?.voteLeftTime ? (
          <VoteEndTime>
            {trans(_TL_("Voting ends in"))}{" "}
            <b>
              <TimerCountDown
                leftTime={task?.voteLeftTime || 0}
                onFinished={() => refreshTask()}
              />
            </b>
          </VoteEndTime>
        ) : null}
      </VotesBox>
      <VotesListContainer>
        {onchainVoteResultURL && isVoteEnded ? (
          <StyledVoteResultLink>
            <a href={onchainVoteResultURL} target="_blank">
              <b>{trans(_TL_("Result OnChain"))}:</b>{" "}
              <span>{onchainVoteResultURL}</span>
            </a>
          </StyledVoteResultLink>
        ) : null}

        <VotesListTit>{trans(_TL_("Number of votes"))}</VotesListTit>
        <VotesListContent>
          {votes.length ? (
            <VotesListContentContainer>
              <VotesList>
                {votes.map((item, idx) => (
                  <VotesListItem key={item.id}>
                    <VotesListItemLeft>
                      <Avatar
                        className="vote-avatar"
                        name={item.address}
                        variant="beam"
                      />
                      <VoterAddress>
                        {sliceAddress(item.address, 9, -10)}{" "}
                        {isVoted &&
                        item.address.toLowerCase() ===
                          address?.toLowerCase() ? (
                          <span>(me)</span>
                        ) : (
                          <span></span>
                        )}
                      </VoterAddress>
                    </VotesListItemLeft>
                    <VotesListItemRight>
                      <VotesListItemResult>
                        {item.result === 0
                          ? trans(_TL_("NO"))
                          : trans(_TL_("YES"))}
                      </VotesListItemResult>
                      <VotesListItemNum>
                        {formatVotes(item.balance)} {trans(_TL_("Votes"))}
                      </VotesListItemNum>
                    </VotesListItemRight>
                  </VotesListItem>
                ))}
              </VotesList>
              <VotesPaginationBox>
                <Pagination.Root
                  count={votesParams.total}
                  pageSize={votesParams.ps}
                  defaultPage={votesParams.pn}
                  onPageChange={(page) => {
                    getVotes(page.page, votesParams.ps);
                  }}
                >
                  <ButtonGroup variant="ghost" size="sm">
                    <Pagination.PrevTrigger asChild>
                      <IconButton>
                        <LuChevronLeft className="pagination-icon" />
                      </IconButton>
                    </Pagination.PrevTrigger>

                    <Pagination.Items
                      render={(page) => (
                        <IconButton
                          className="pagination-item"
                          variant={{ base: "ghost", _selected: "outline" }}
                        >
                          {page.value}
                        </IconButton>
                      )}
                    />

                    <Pagination.NextTrigger asChild>
                      <IconButton>
                        <LuChevronRight className="pagination-icon" />
                      </IconButton>
                    </Pagination.NextTrigger>
                  </ButtonGroup>
                </Pagination.Root>
              </VotesPaginationBox>
            </VotesListContentContainer>
          ) : (
            <span>No Data.</span>
          )}
        </VotesListContent>
      </VotesListContainer>
      {admin && profile?.admin && isVoteEnded ? (
        <SubmitButton
          loading={voteResultUploading}
          disabled={
            voteResultUploading || !isVoteEnded || !!onchainVoteMetadata
          }
          onClick={handleUploadVoteResult}
        >
          {onchainVoteMetadata
            ? trans(_TL_("Upload complete"))
            : !isVoteEnded
            ? trans(_TL_("Voting hasn't ended yet"))
            : trans(_TL_("Upload Vote Result onchain"))}
        </SubmitButton>
      ) : null}
    </CardContainer>
  );
};

const StyledVoteResultLink = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  overflow: hidden;
  color: #322f2c;
  text-overflow: ellipsis;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 22.4px */
  letter-spacing: 0.14px;
`;

const VotesBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(50, 47, 44, 0.05);
  @media screen and (max-width: 768px) {
    gap: 12px;
    padding-bottom: 24px;
  }

  .vote-item {
    position: relative;
    display: flex;
    height: 50px;
    padding: 0 20px;
    gap: 15px;
    align-self: stretch;
    border-radius: 12px;
    border: 1px solid rgba(50, 47, 44, 0.1);
    box-shadow: none;
    overflow: hidden;

    @media screen and (max-width: 768px) {
      height: 40px;
    }

    &.choosed {
    }
    &.voted {
      border: 1px solid rgba(50, 47, 44, 0.1);
      cursor: not-allowed;
      pointer-events: none;
      &::after {
        background: linear-gradient(
          90deg,
          var(--percent-color) 0%,
          var(--percent-color) 100%
        );
      }
    }

    > div {
      position: relative;
      padding-left: 0;
      padding-right: 0;
      z-index: 1;
    }

    &:not(.voted)[data-state="checked"] {
      border: 1px solid #322f2c;
      background: linear-gradient(
        90deg,
        var(--percent-color) 0%,
        var(--percent-color) 100%
      );
    }

    &:not(.voted):hover {
      border: 1px solid #322f2c;
      background: linear-gradient(
        90deg,
        rgba(50, 47, 44, 0.05) 0%,
        rgba(50, 47, 44, 0.05) 100%
      );
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: var(--percent-width);
      height: 100%;
      background-color: var(--percent-color);
      transition: all 0.3s ease;
    }
  }
`;

const VoteItemPercent = styled.div<{ lose?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  color: #322f2c;
  text-align: right;
  text-overflow: ellipsis;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 142.857% */
  text-transform: uppercase;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;

  opacity: ${(props) => (props.lose ? 0.5 : 1)};
`;

const VoteItemText = styled.div<{ lose?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  color: #322f2c;
  text-overflow: ellipsis;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 142.857% */
  opacity: ${(props) => (props.lose ? 0.5 : 1)};
  .voted-icon {
    width: 16px;
    height: 16px;
    color: #322f2c;
  }
`;

const VoteEndTime = styled.div`
  margin-top: 10px;
  color: #322f2c;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 14px */
  text-transform: capitalize;

  > b {
    color: #feb602;
    font-size: 14px;
    font-style: normal;
    font-weight: 800;
    line-height: 100%;
    text-transform: capitalize;
  }
`;

const VotesListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  margin-top: 40px;
  @media screen and (max-width: 768px) {
    margin-top: 20px;
  }
`;

const VotesListTit = styled.h3`
  display: flex;
  align-items: center;
  gap: 5px;

  color: #322f2c;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const VotesListContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;

  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const VotesListContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const VotesPaginationBox = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  .pagination-icon {
    width: 16px;
    height: 16px;
    color: #322f2c;
  }
  .pagination-item {
    display: flex;
    width: 32px;
    min-width: 32px;
    height: 32px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 6px;
    // border: 1px solid rgba(50, 47, 44, 0.1);

    color: #322f2c;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    @media screen and (max-width: 768px) {
      width: 24px;
      min-width: 24px;
      height: 24px;
      font-size: 12px;
    }
  }
`;

const VotesList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  overflow-x: scroll;
`;

const VotesListItem = styled.div`
  display: flex;
  height: 40px;
  padding: 0px 4px;

  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  min-width: 360px;

  @media screen and (max-width: 768px) {
    height: 32px;
    font-size: 12px;
  }
`;

const VotesListItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  .vote-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;

    @media screen and (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }
`;

const VotesListItemRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const VoterAddress = styled.span`
  > span {
    display: inline-block;
    width: 50px;
    color: rgba(50, 47, 44, 0.5);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    @media screen and (max-width: 768px) {
      width: 40px;
      font-size: 12px;
    }
  }
`;

const VotesListItemResult = styled.span`
  flex: 1;
  display: inline-flex;
  justify-content: flex-end;
  @media screen and (max-width: 768px) {
    justify-content: flex-start;
  }
`;
const VotesListItemNum = styled.span`
  flex: 1;
  display: inline-flex;
  justify-content: flex-end;
  white-space: nowrap;
`;
