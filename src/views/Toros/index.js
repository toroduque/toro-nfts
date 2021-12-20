import { useWeb3React } from "@web3-react/core";
import ToroCard from "../../components/toro-card";
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";
import { useAllTorosData } from "../../hooks/useTorosData";
import { Grid } from "@chakra-ui/react";

export default function Toros() {
  const { active } = useWeb3React();
  const { toros, isLoading } = useAllTorosData();

  if (!active) return <RequestAccess />;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {toros.map(({ image, name, tokenId }) => (
            <ToroCard
              image={image}
              name={name}
              key={tokenId}
              tokenId={tokenId}
            />
          ))}
        </Grid>
      )}
    </>
  );
}
