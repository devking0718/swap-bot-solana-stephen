const db = require("../models");
const web3 = require("@solana/web3.js");
const Transaction = db.transactions;
const Op = db.Sequelize.Op;

module.exports = {
  async getTransactionList(req, res) {
    try {
      const transactions = await Transaction.findAll(
        {
          limit: 100,
          order: [['createdAt', 'DESC']],
        }
      );

      res.status(200).json({ message: 'TransactionList Data', transactionList: transactions });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': error });
    }
  },
}