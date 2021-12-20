import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import RequestAccess from "../../components/request-access";
import ToroCard from "../../components/toro-card";
import { useParams } from "react-router-dom";
import Loading from "../../components/loading";
import { useSingleToroData } from "../../hooks/useTorosData";
import { useState } from "react";
import useToroNft from "../../hooks/useToroNft";

const Toro = () => {
  const { active, account, library } = useWeb3React();
  const { tokenId } = useParams();
  const { isLoading, toro, update } = useSingleToroData(tokenId);
  const toast = useToast();
  const [ isTransfering, setIsTransfering] = useState(false);
  const toroNft = useToroNft();

  const transfer = () => {
    setIsTransfering(true)
    const address = prompt("Ingresa la dirección");
    const isAddress = library.utils.isAddress(address);

    if (!isAddress) {
      toast({
        title: "Dirección inválida",
        description: "La dirección no es una dirección de Etherium",
        status: "error"
      })
    } else {
      toroNft.methods.safeTransferFrom(
        toro.owner,
        address,
        toro.tokenId,
      ).send({
        from: account
      })
      .on('error', (error) => {
        setIsTransfering(false);
        toast({
          title: "Transacción enviada",
          description: error,
          status: "error"
        })
      })
      .on('transactionHash', (txHash) => {
        toast({
          title: "Transacción enviada",
          description: txHash,
          status: "info"
        })
      })
      .on('receipt', () => {
        setIsTransfering(false);
        toast({
          title: "Transacción confirmada",
          description: "El Toro NFT ahora pertenece a " + address,
          status: "success"
        });
        update();
      })
    }

    setIsTransfering(false)
  }

  if (!active) return <RequestAccess />;

  if (isLoading) return <Loading />;

  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack>
        <ToroCard
          mx={{
            base: "auto",
            md: 0,
          }}
          name={toro.name}
          image={toro.image}
        />
        <Button
         onClick={transfer}
         isLoading={isTransfering}
         disabled={account !== toro.owner} colorScheme="green">
          {account !== toro.owner ? "No eres el dueño" : "Transferir"}
        </Button>
      </Stack>
      <Stack width="100%" spacing={5}>
        <Heading>{toro.name}</Heading>
        <Text fontSize="xl">{toro.description}</Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="green">
            {toro.dna}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="green">
            {toro.owner}
          </Tag>
        </Text>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(toro.attributes).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default Toro;
