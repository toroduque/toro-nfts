import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import useToroNft from "../../hooks/useToroNft";
import { useCallback, useEffect, useState } from "react";
import BgAnimation from "../../components/bg-animation";

const Home = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [maxSupply, setMaxSupply] = useState("...loading");
  const [totalSupply, setTotalSupply] = useState("...loading");
  const { active, account } = useWeb3React();
  const toroNft = useToroNft();
  const toast = useToast();

  const getToroNftData = useCallback(async () => {
    if (toroNft) {
      const currentMaxSupply = await toroNft.methods.maxSupply().call();
      const currentSupply = await toroNft.methods.totalSupply().call();
      const dnaPreview = await toroNft.methods
        .deterministicPseudoRandomDNA(currentSupply, account)
        .call();

      const image = await toroNft.methods.imageByDNA(dnaPreview).call();
      setImageSrc(image);
      setMaxSupply(currentMaxSupply);
      setTotalSupply(currentSupply);
    }
  }, [toroNft, account]);

  useEffect(() => {
    getToroNftData();
  }, [getToroNftData]);

  const mint = () => {
    setIsMinting(true);

    toroNft.methods
      .mint()
      .send({
        from: account,
      })
      .on("transactionHash", (txHash) => {
        toast({
          title: "Transacción enviada",
          description: txHash,
          status: "info",
        });
      })
      .on("receipt", () => {
        setIsMinting(false);
        toast({
          title: "Transacción confirmada",
          description: "Nunca pares de aprender",
          status: "success",
        });
      })
      .on("error", (error) => {
        setIsMinting(false);
        toast({
          title: "Transacción fallida",
          description: error.message,
          status: "error",
        });
      });
  };

  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "blue.500",
              zIndex: -1,
            }}
          >
            Un Toro NFT
          </Text>
          <br />
          <Text as={"span"} color={"blue.500"}>
            nunca para de aprender
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          Toro NFTs es una colección de Avatares randomizados cuya metadata es
          almacenada on-chain. Poseen características únicas y sólo hay 10000 en
          existencia.
        </Text>
        <Text color={"purple.500"}>
          Cada Toro NFT se genera de forma secuencial basado en tu address, usa
          el previsualizador para averiguar cuál sería tu Toro NFT si minteas en
          este momento
        </Text>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >
          <Button
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            px={6}
            colorScheme={"green"}
            bg={"blue.500"}
            _hover={{ bg: "purple.500" }}
            disabled={!toroNft}
            onClick={mint}
            isLoading={isMinting}
          >
            Obtén tu NFT
          </Button>
          <Link to="/toros">
            <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
              Galería
            </Button>
          </Link>
        </Stack>
      </Stack>

      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
        style={{
          border: "solid 1px #f1f1f1",
          borderRadius: "8px",
          boxShadow: "0 12px 24px #f1f1f1",
          padding: "60px 0",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          {active && (
            <Heading as="h3" fontSize="lg" color={"blue.900"}>
              Próximo NFT
            </Heading>
          )}
        </div>
        <Image
          src={active ? imageSrc : "https://avataaars.io/"}
          className="next-nft-image-wrapper"
        />
        {active ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="green">
                  {totalSupply !== "...loading"
                    ? Number(totalSupply) + 1
                    : "...loading"}
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="green">
                  0x0000...0000
                </Badge>
              </Badge>
            </Flex>
            <Flex mt={2}>
              <Badge>
                Max Supply:
                <Badge ml={1} colorScheme={"green"}>
                  {maxSupply ? maxSupply : "...loading"}
                </Badge>
              </Badge>
              <Badge>
                Minted:
                <Badge ml={2} colorScheme={"green"}>
                  {totalSupply === "...loading" && maxSupply === "...loading"
                    ? "...loading"
                    : `${(totalSupply / maxSupply) * 100}%`}
                </Badge>
              </Badge>
            </Flex>
            <Button
              onClick={getToroNftData}
              mt={4}
              size="xs"
              colorScheme="green"
            >
              Actualizar
            </Button>
            <div className="svg-bg-wrapper">
          <BgAnimation />
        </div>
          </>
        ) : (
          <Badge mt={2}>Wallet desconectado</Badge>
        )}
     
      </Flex>
    </Stack>
  );
};

export default Home;
