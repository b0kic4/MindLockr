import React from "react";
import { useToast } from "../use-toast";
import usePubPrivStore from "@/lib/store/useMsgKeysStore";
import usePgpKeysStore from "@/lib/store/usePgpKeysStore";

export function usePgpKeys() {
  const { pgpKeys } = usePgpKeysStore();
  const { toast } = useToast();

  return { pgpKeys };
}
