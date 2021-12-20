import { useEffect, useCallback, useState } from "react";
import {
  Flex,
  Button,
  Tag,
  TagLabel,
  Badge,
  TagCloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { connector } from "../../../config/web3";

const WalletData = () => {
  const [ balance, setBalance ] = useState(0);
  const { active, activate, deactivate, account, error, library } = useWeb3React();

  const isUnsupportedChain = error instanceof UnsupportedChainIdError;
  const PREVIOUSLY_CONNECTED = "previouslyConnected";

  const connect = useCallback(() => {
    activate(connector)
    localStorage.setItem(PREVIOUSLY_CONNECTED, "true");
  }, [activate]);

  useEffect(() => {
    if (localStorage.getItem(PREVIOUSLY_CONNECTED) === "true") {
      connect()
    }
  }, [connect]);

  const disconnect = () => {
    deactivate();
    localStorage.removeItem(PREVIOUSLY_CONNECTED)
  };

  const getBalance = useCallback(async () => {
    const currentBalance = await library.eth.getBalance(account);
    setBalance((currentBalance / 1e18).toFixed(2));
  }, [library?.eth, account])

  useEffect(() => {
    if (active) getBalance();
  }, [active, getBalance])

  const truncateAccount = (account) => {
    const initialDigits = account?.substr(0,5);
    const lastDigits = account?.substr(-4);
    return `${initialDigits}...${lastDigits}`;
  };

  const truncatedAccount = truncateAccount(account)

  return (
    <Flex alignItems={"center"}>
      {active ? (
        <Tag colorScheme="cyan" borderRadius="full">
          <TagLabel>
            <Link to="/punks">{truncatedAccount}</Link>
          </TagLabel>
          <Badge
            d={{
              base: "none",
              md: "block",
            }}
            variant="solid"
            fontSize="0.8rem"
            ml={1}
          >
            {balance} Ξ
          </Badge>
          <TagCloseButton onClick={disconnect} />
        </Tag>
      ) : (
        <Button
          variant={"solid"}
          colorScheme={"cyan"}
          size={"sm"}
          leftIcon={<AddIcon />}
          onClick={connect}
          disabled={isUnsupportedChain}
        >
          {isUnsupportedChain ? "Red no soportada" : "Conectar wallet"}
        </Button>
      )}
    </Flex>
  );
};

export default WalletData;
