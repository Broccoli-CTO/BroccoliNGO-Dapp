"use client";

import styled from "@emotion/styled";
import { Box, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { TaskNavbar } from "@/components/Task/Navbar";
import { FundRecordsView } from "@/components/Task/FundRecordsView";
import { ProofView } from "@/components/Task/ProofView";
import { DatasView } from "@/components/Task/DatasView";
import { VotesView } from "@/components/Task/VotesView";
import { useTaskDetailsCtx } from "@/hooks/useTaskDetails";

export default function TaskDetailPageContent({ id }: { id: string }) {
  const { task, taskStatus, loading, error } = useTaskDetailsCtx();

  if (loading) {
    return (
      <Container className="flex flex-col items-center justify-center min-h-screen">
        <Spinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-white-500">{error || "Task not found"}</h1>
      </Container>
    );
  }

  return (
    <Container>

      <DatasView email={task?.email} />

      {task?.isVoteEnabled && <VotesView tokenId={id} />}

      {taskStatus === "Approved" && <FundRecordsView tokenId={id} />}

      {taskStatus === "Approved" && <ProofView tokenId={id} />}
    </Container>
  );
}

const Container = styled.div`
  padding-top: 100px;
  padding-bottom: 60px;
  max-width: 720px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 20px;
  @media screen and (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;
