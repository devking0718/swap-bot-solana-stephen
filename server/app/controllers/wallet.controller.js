const { btoa } = require("buffer");
const db = require("../models");
const web3 = require("@solana/web3.js");
const Wallet = db.wallets;
const Op = db.Sequelize.Op;

module.exports = {
  async createWallet(req, res) {
    try {
      const keypair = web3.Keypair.generate();

      // Create a Wallet
      const wallet = {
        address: JSON.stringify(keypair.publicKey),
        privateKey: JSON.stringify(keypair.secretKey),
        balance: 0,
        active: false
      };

      await Wallet.create(wallet);

      const wallets = await Wallet.findAll();

      
      res.status(200).json({ message: 'Wallet Created!', wallets: btoa(JSON.stringify(wallets)) });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': error });
    }
  },
  async walletLists(req, res) {
    try {
      const wallets = await Wallet.findAll();

      res.status(200).json({ message: 'Wallet List!', wallets: btoa(JSON.stringify(wallets)) });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': error });
    }
  },
  async getBalance(req, res) {
    try {
      const {walletAddress} = req.body;
      console.log("walletAddress", walletAddress)

      const connection = new web3.Connection(process.env.RPC_ENDPOINT);

      const publicKey = new web3.PublicKey(JSON.parse(walletAddress));
      console.log("publicKey", publicKey)

      const balance = await connection.getBalance(publicKey);
      res.status(200).json({ message: 'Balance', balance: balance });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': error });
    }
  }
}