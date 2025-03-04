export enum CryptoSymbolEnum {
  ETH = 'ETH',
  BTC = 'BTC',
  SOL = 'SOL',
}

export enum CryptoNameEnum {
  ETHER = 'Ether',
  BITCOIN = 'Bitcoin',
  SOLANA = 'Solana',
}

export const CryptoSymbolNameMap = {
  [CryptoSymbolEnum.ETH]: CryptoNameEnum.ETHER,
  [CryptoSymbolEnum.SOL]: CryptoNameEnum.SOLANA,
  [CryptoSymbolEnum.BTC]: CryptoNameEnum.BITCOIN,
};
