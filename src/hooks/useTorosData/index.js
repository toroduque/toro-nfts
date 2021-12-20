import { useEffect, useState, useCallback } from "react";
import useToroNft from "../useToroNft";

async function getToroData({ toroNfts, tokenId }) {
  const [
    tokenURI,
    dna,
    owner,
    accesoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    toroNfts.methods.tokenURI(tokenId).call(),
    toroNfts.methods.tokenDNA(tokenId).call(),
    toroNfts.methods.ownerOf(tokenId).call(),
    toroNfts.methods.getAccessoriesType(tokenId).call(),
    toroNfts.methods.getClotheColor(tokenId).call(),
    toroNfts.methods.getClotheType(tokenId).call(),
    toroNfts.methods.getEyeType(tokenId).call(),
    toroNfts.methods.getEyeBrowType(tokenId).call(),
    toroNfts.methods.getFacialHairColor(tokenId).call(),
    toroNfts.methods.getFacialHairType(tokenId).call(),
    toroNfts.methods.getHairColor(tokenId).call(),
    toroNfts.methods.getHatColor(tokenId).call(),
    toroNfts.methods.getGraphicType(tokenId).call(),
    toroNfts.methods.getMouthType(tokenId).call(),
    toroNfts.methods.getSkinColor(tokenId).call(),
    toroNfts.methods.getTopType(tokenId).call(),
  ]);

  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();

  return {
    tokenId,
    attributes: {
      accesoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  };
}

export function useAllTorosData() {
  const [toros, setToros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toroNfts = useToroNft();

  const update = useCallback(async () => {
    if (toroNfts) {
      setIsLoading(true);

      const totalSupply = await toroNfts.methods.totalSupply().call();
      const tokenIds = new Array(Number(totalSupply))
        .fill()
        .map((_, index) => index);

      const torosPromise = tokenIds.map((tokenId) =>
        getToroData({ tokenId, toroNfts })
      );

      const toros = await Promise.all(torosPromise);
      setToros(toros);

      setIsLoading(false);
    }
  }, [toroNfts]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    isLoading,
    toros,
    update,
  };
}

export function useSingleToroData(tokenId) {
  const [toro, setToro] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toroNfts = useToroNft();

  const update = useCallback(async () => {
    if (toroNfts) {
      setIsLoading(true);

      const results = await getToroData({ tokenId, toroNfts });
      setToro(results);

      setIsLoading(false);
    }
  }, [toroNfts, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    isLoading,
    toro,
    update,
  };
}
