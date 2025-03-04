export enum CryptoSymbolEnum {
  ETH = 'ETH',
  SOL = 'SOL',
}

export enum CryptoNameEnum {
  ETHER = 'Ether',
  SOLANA = 'Solana',
}

export const CryptoSymbolNameMap = {
  [CryptoSymbolEnum.ETH]: CryptoNameEnum.ETHER,
  [CryptoSymbolEnum.SOL]: CryptoNameEnum.SOLANA,
};
