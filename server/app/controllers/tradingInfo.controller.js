const db = require("../models/index.js");
const web3 = require("@solana/web3.js");
const TradingInfo = db.tradnigInfos;
const WalletTable = db.wallets;
const TransactionInfo = db.transactions;
const Op = db.Sequelize.Op;
const { Wallet } = require('@project-serum/anchor');
// import {fetch} from "node-fetch";
// const fetch = require('node-fetch')
const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
// import { Connection, Keypair, VersionedTransaction, PublicKey } from '@solana/web3.js';
// import bs58 from 'bs58';

module.exports = {
  async startTrading(req, res) {
    try {
      const { token, buyAmount, sellAmount, frequency, walletId, status, slippage } = req.body;

      const staredTrading = await TradingInfo.findAll({
        where: {
          status: true
        }
      });

      if (staredTrading.length !== 0) {
        return res.status(401).json({ message: 'Trading already started', error: 'Trading already started', staredTrading: staredTrading });
      }

      await WalletTable.update({ active: false }, {
        where: {
          active: true
        }
      });
      await WalletTable.update({ active: true }, {
        where: {
          id: walletId
        }
      });



      const newTradingInfo = {
        token: token,
        buyAmount: buyAmount,
        sellAmount: sellAmount,
        frequency: frequency,
        slippage: slippage,
        walletId: walletId,
        status: status
      }

      console.log("newTradingInfo", newTradingInfo);

      await TradingInfo.create(newTradingInfo);

      const currentTrading = await TradingInfo.findOne({
        where: {
          status: true
        }
      })

      res.status(200).json({ message: 'Trading Started!', currentTrading: currentTrading });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': error });
    }
  },
  async getTradingStatus(req, res) {
    try {
      const staredTrading = await TradingInfo.findOne({
        order: [['createdAt', 'DESC']], // Replace 'createdAt' with your desired column
      });

      if (staredTrading === null) {
        res.status(300).json({ message: 'Started trading does not exist', currentTrading: staredTrading });
        return
      }

      const wallet = await WalletTable.findOne(
        {
          where: {
            id: parseInt(staredTrading.walletId)
          }
        });

      const connection = new web3.Connection(process.env.RPC_ENDPOINT);

      const publicKey = new web3.PublicKey(JSON.parse(wallet.address));
      console.log("publicKey", publicKey)

      const balance = await connection.getBalance(publicKey);

      res.status(200).json({ message: 'Trading Started!', currentTrading: staredTrading, selectedWallet: btoa(JSON.stringify(wallet)), balance: balance });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': error });
    }
  },
  async stopTrading(req, res) {
    try {
      await TradingInfo.update({ status: false }, {
        where: {
          status: true
        }
      });

      const latestInfo = await TradingInfo.findOne(
        {
          order: [['createdAt', 'DESC']],
        }
      )

      res.status(200).json({ message: 'Trading Stopd!', latestInfo: latestInfo });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': error });
    }
  },
}