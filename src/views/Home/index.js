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
import { useCallback, useEffect, useState, useRef } from "react";
import BgAnimation from "../../components/bg-animation";

const Home = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [maxSupply, setMaxSupply] = useState("...loading");
  const [totalSupply, setTotalSupply] = useState("...loading");
  const [loading, setLoading] = useState(true);
  const { active, account } = useWeb3React();
  const toroNft = useToroNft();
  const toast = useToast();

  const counter = useRef(0);

  const imageLoaded = () => {
    counter.current += 1;
    if (counter.current >= 1) {
      setLoading(false);
    }
  };

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
      py={{ base: 20, md: 20 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={800}
          fontSize={{ base: "6xl", sm: "6xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            fontSize="7xl"
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "linear-gradient(90deg, rgba(255,143,189,1) 0%, rgba(94,252,231,1) 100%)",
              zIndex: -1,
            }}
          >
            Toro NFT
          </Text>
          <br />
        </Heading>
        <Text color={"gray.600"} fontSize="xl">
          Toro NFTs es una colección de Avatares randomizados cuya metadata es
          almacenada on-chain. Poseen características únicas y sólo hay 10000 en
          existencia.
        </Text>
        <Text color={"gray.600"} fontSize="xl">
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
            colorScheme={"turquoise"}
            bg={"turquoise"}
            _hover={{ bg: "violet" }}
            disabled={!toroNft}
            onClick={mint}
            isLoading={isMinting}
          >
            Obtén tu NFT
          </Button>
          <Link to="/toros">
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              _hover={{ bgColor: "PaleTurquoise" }}
            >
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
          onLoad={imageLoaded}
        />

        {active ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="cyan">
                  {totalSupply !== "...loading"
                    ? Number(totalSupply) + 1
                    : "...loading"}
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="cyan">
                  0x0000...0000
                </Badge>
              </Badge>
            </Flex>
            <Flex mt={2}>
              <Badge>
                Max Supply:
                <Badge ml={1} colorScheme={"cyan"}>
                  {maxSupply ? maxSupply : "...loading"}
                </Badge>
              </Badge>
              <Badge>
                Minted:
                <Badge ml={2} colorScheme={"cyan"}>
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
              colorScheme="cyan"
            >
              Actualizar
            </Button>
            {!loading && (
              <div className="svg-bg-wrapper">
                <BgAnimation />
              </div>
            )}
          </>
        ) : (
          <Badge mt={2}>Wallet desconectado</Badge>
        )}
      </Flex>
    </Stack>
  );
};

export default Home;
