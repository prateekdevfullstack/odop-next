"use client";

import { Skeleton } from "boneyard-js/react";
import { type ReactNode } from "react";

interface BoneyardSkeletonProps {
  name: string;
  loading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  animate?: "pulse" | "shimmer" | "solid" | boolean;
}

export default function BoneyardSkeleton({
  name,
  loading,
  children,
  fallback,
  animate = "shimmer"
}: BoneyardSkeletonProps) {
  return (
    <Skeleton
      name={name}
      loading={loading}
      fallback={fallback}
      animate={animate}
      color="#f0f0f0"
      transition={true}
    >
      {children}
    </Skeleton>
  );
}
