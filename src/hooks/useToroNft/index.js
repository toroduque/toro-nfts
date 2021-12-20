import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import ToroNftArtifact from "../../config/artifacts/ToroNFT";

const { address, abi } = ToroNftArtifact;

export default function useToroNft() {
  const { active, library, chainId } = useWeb3React();

  const toroNft = useMemo(() => {
      if (active) {
          return new library.eth.Contract(abi, address[chainId]);
      }
  }, [active, chainId, library?.eth?.Contract]);

  return toroNft;
}
