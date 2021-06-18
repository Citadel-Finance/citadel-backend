import Web3 from 'web3';
import { Graph } from '../models/Graph';
import { Pool } from './abis';
import config from '../config/config';

let web3Base: any;
const options = {
  reconnect: {
    auto: true,
    delay: 5000, //ms
    maxAttempts: 5,
    onTimeout: false,
  },
};

export const initListener = async () => {
  const WSProvider = new Web3.providers.WebsocketProvider(config.providerURL, options);
  web3Base = new Web3(WSProvider);

  WSProvider.on('connect', async () => {
    console.log(`[WS]\tProvider connected!\n[WS]\tStarting listener...`);
  });

  function retry() {
    console.log(`[WS]\tProvider disconnected!\n[WS]\tRestarting listener...`);
    const newProviderConnection = new Web3.providers.WebsocketProvider(config.providerURL);
    web3Base = new Web3(newProviderConnection);
  }

  WSProvider.on('end', async () => {
    retry();
  });

  WSProvider.on('close', async () => {
    retry();
  });

  WSProvider.on('error', async () => {
    retry();
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
      const {
        totalDeposited: deposited,
        totalBorrowed: borrowed,
        totalProfit: profit,
      } = r.returnValues;

      const { address: pool } = r;

      console.log('deposited:\t', deposited);
      console.log('borrowed:\t', borrowed);
      console.log('profit:\t\t', profit);
      console.log('pool:\t\t', pool, '\tlength = ', pool.length, '\n');

      await Graph.create({
        deposited,
        borrowed,
        profit,
        pool,
      });
      if (e) {
        throw e;
      }
    }
  );
};
