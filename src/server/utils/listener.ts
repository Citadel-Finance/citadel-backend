import Web3 from 'web3';
import { Graph } from '../models/Graph';
import { Pool } from './abis';
import config from '../config/config';

let web3Base: any;

export const initListener = async () => {
  const WSProvider = new Web3.providers.WebsocketProvider(config.providerURL);
  web3Base = new Web3(WSProvider);

  WSProvider.on('connect', async () => {
    console.log(`[WS]\tProvider connected!\n[WS]\tStarting listener...`);
  });

  WSProvider.on('end', async () => {
    console.log(`[WS]\tProvider disconnected!\n[WS]\tRestarting listener...`);
    const newProviderConnection = new Web3.providers.WebsocketProvider(config.providerURL);
    web3Base = new Web3(newProviderConnection);
  });

  web3Base.eth.subscribe('newBlockHeaders', (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data.number);
  });
};

export const fetchContractData = async (
  _method: string,
  _abi: any,
  _address: string,
  _params: any
) => {
  try {
    const contract = new web3Base.eth.Contract(_abi, _address);
    return await contract.methods[_method].apply(this, _params).call();
  } catch (e) {
    console.log(e);
  }
};

export const getTransactionInfo = async (address) => {
  //                                     Abi   Pool
  const inst = new web3Base.eth.Contract(Pool, address);
  inst.events.totalHistory(
    {
      fromBlock: 'latest',
      filter: {},
    },
    async (e, r) => {
      const { totalDeposited, totalBorrowed, totalProfit } = r.returnValues;

      console.log('totalDeposited:\t', totalDeposited);
      console.log('totalBorrowed:\t', totalBorrowed);
      console.log('totalProfit:\t', totalProfit, '\n');

      await Graph.create({
        totalDeposited,
        totalBorrowed,
        totalProfit,
      });
      console.log(e);
    }
  );
};
