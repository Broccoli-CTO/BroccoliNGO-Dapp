import { Container, DataList, Spinner } from "@chakra-ui/react";
import { FC, useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import { flattenObject, obfuscateEmail } from "@/shared/utils";
import { CardContainer, CardTitle } from "@/components/Task/Layout";
import { useTaskDetailsCtx } from "@/hooks/useTaskDetails";
import AttachmentView from "./AttachmentView";
import styled from "@emotion/styled";
import PendingIcon from "@/components/icons/pending";
import ApprovedIcon from "@/components/icons/approved";
import RejectedIcon from "@/components/icons/rejected";
import { useI18n } from "@/components/ui/I18nProvider";

interface DatasViewProps {
  email?: string;
}

export const DatasView: FC<DatasViewProps> = ({ email }) => {
  const { loading, taskMetaData, taskStatus } = useTaskDetailsCtx();
  const publicClient = usePublicClient();
  const { trans, lang } = useI18n();

  const detectKeys = [
    _TL_("v"),
    _TL_("organization"),
    _TL_("email"),
    _TL_("country"),
    _TL_("city"),
    _TL_("context"),
    _TL_("attachment"),
    _TL_("suppliesRequest"),
    _TL_("additionalInfo"),
    _TL_("canProvideInvoices"),
    _TL_("canProvidePublicAcknowledgments"),
    // v 0.1
    _TL_("twitter"),
    _TL_("helpPostLink"),
    _TL_("assistanceRequired"),
    _TL_("totalAmount"),
    _TL_("budgetPlan"),
    _TL_("breakdown"),
    _TL_("impactAfterAssistance"),
    _TL_("canProvideInvoice"),
    _TL_("canProvidePublicThankYouLetter"),
  ];

  const datalist = useMemo(() => {
    if (!taskMetaData) return [];
    return flattenObject(taskMetaData, detectKeys);
  }, [taskMetaData, detectKeys]);

  const TaskStatusIcon = useMemo(() => {
    if (taskStatus === "Pending") return <PendingIcon />;
    if (taskStatus === "Approved") return <ApprovedIcon />;
    if (taskStatus === "Rejected") return <RejectedIcon />;
    return null;
  }, [taskStatus]);

  const transLabel = (label: string) => {
    return lang === "zh"
      ? trans(label)
      : label.charAt(0).toUpperCase() +
          label.slice(1).replace(/([A-Z])/g, " $1");
  };

  return loading ? (
    <CardContainer>
      <Spinner />
    </CardContainer>
  ) : (
    <CardContainer head>
      <CardTitle>{trans(_TL_("Task Details"))}</CardTitle>
      <StyledTaskStatus>{TaskStatusIcon}</StyledTaskStatus>
      <StyledDataList>
        {datalist.map((item) => (
          <StyledDataListItem key={item.key}>
            <StyledDataListItemLabel>
              {transLabel(item.label)}
            </StyledDataListItemLabel>
            {item.label === "attachment" ? (
              <StyledDataListItemValue>
                <AttachmentView attachment={item.value} />
              </StyledDataListItemValue>
            ) : (
              <StyledDataListItemValue>
                {item.label === "email" ? email : item.value}
              </StyledDataListItemValue>
            )}
          </StyledDataListItem>
        ))}
      </StyledDataList>
    </CardContainer>
  );
};

const StyledTaskStatus = styled.div`
  position: absolute;
  top: 18px;
  right: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
  > svg {
    height: 130px;
    @media screen and (max-width: 768px) {
      height: 100px;
    }
  }
`;

const StyledDataList = styled.dl`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const StyledDataListItem = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(50, 47, 44, 0.05);
  &:last-child {
    border-bottom: none;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
const StyledDataListItemLabel = styled.dt`
  width: 240px;
  padding: 12px 40px 12px 0;

  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 22.4px */
  letter-spacing: 0.14px;
  @media screen and (max-width: 768px) {
    width: 100%;
    font-size: 14px;
    font-weight: 700;
  }
`;
const StyledDataListItemValue = styled.dd`
  flex: 1;
  padding: 12px 0;
  word-break: break-all;

  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 22.4px */
  letter-spacing: 0.14px;
`;
