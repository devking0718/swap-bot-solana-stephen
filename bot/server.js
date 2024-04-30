const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const app = express();
const web3 = require("@solana/web3.js");
dotenv.config();
const { Connection, Keypair, VersionedTransaction, sendAndConfirmRawTransaction } = require('@solana/web3.js');
const bs58 = require('bs58')
const { Wallet } = require('@project-serum/anchor');

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("../server/app/models/index");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

const WalletDB = db.wallets;
const TransactionDB = db.transactions;
const TradingInfoDB = db.tradnigInfos;
const TradingLogDB = db.tradingLogs;

let selectedAddress = "So11111111111111111111111111111111111111112";

let slipTarget = 5;
const usdcMintAddress_pub = "4vqYQTjmKjxrWGtbL2tVkbAU1EVAz9JwcYtd2VE3PbVU";

const connection = new Connection(process.env.RPC_ENDPOINT, 'confirmed', {
  commitment: 'confirmed',
  timeout: 10000
});

async function getTradingInfo() {
  try {
    const staredTrading = await TradingInfoDB.findOne({
      order: [['createdAt', 'DESC']], // Replace 'createdAt' with your desired column
    });

    if (staredTrading === null) {
      res.status(300).json({ message: 'Started trading does not exist', currentTrading: staredTrading });
      return
    }

    const walletInfo = await WalletDB.findOne(
      {
        where: {
          id: parseInt(staredTrading.walletId)
        }
      });

    const connection = new web3.Connection(process.env.RPC_ENDPOINT);

    const publicKey = new web3.PublicKey(JSON.parse(walletInfo.address));
    const balance = await connection.getBalance(publicKey);

    return { walletInfo, staredTrading, balance };
  } catch (error) {

  }
}

async function stopTrading() {
  await TradingInfoDB.update({ status: false }, {
    where: {
      status: true
    }
  })
  console.log("Trading Stoped")
  return;
}

async function saveTransaction(hash, sol, token, address, action, status) {
  const newTransaction = {
    hash: hash,
    sol: sol,
    token: token,
    address: address,
    action: action,
    status: status,
  }
  await TransactionDB.create(newTransaction);
}

async function createLog(content) {
  const newLog = {
    logContent: content
  }

  await TradingLogDB.create(newLog);
}


async function makeTransaction(wallet, staredTrading, balance, type) {
  let fixedSwapValLamports;
  if (type == "BUY") {
    fixedSwapValLamports = Math.floor(staredTrading.buyAmount * 1000000000);
  } else {
    fixedSwapValLamports = Math.floor(staredTrading.sellAmount * 1000000000);
  }

  if (balance < fixedSwapValLamports) {
    createLog("Insufficient Balance!");
    stopTrading();
    return;
  }

  const slipBPS = staredTrading.slippage * 100;
  let response;
  if (type == "BUY") {
    response = await fetch('https://quote-api.jup.ag/v6/quote?inputMint=' + selectedAddress + '&outputMint=' + usdcMintAddress_pub + '&amount=' + fixedSwapValLamports + '&onlyDirectRoutes=true' + '&slippageBps=' + slipBPS);
  } else {
    response = await fetch('https://quote-api.jup.ag/v6/quote?inputMint=' + usdcMintAddress_pub + '&outputMint=' + selectedAddress + '&amount=' + fixedSwapValLamports + '&swapMode=ExactOut' + '&onlyDirectRoutes=true' + '&slippageBps=' + slipBPS);
  }
  const routes = await response.json();
  console.log('----routes------', routes);
  const transaction_response = await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quoteResponse: routes,
      userPublicKey: wallet.publicKey.toString(),
      wrapUnwrapSOL: true,
      prioritizationFeeLamports: "auto",
      dynamicComputeUnitLimit: true,
    })
  });
  // console.log('-----------swaps-----------', transaction_response);
  const transactions = await transaction_response.json();
  const { swapTransaction } = transactions;
  // deserialize the transaction
  const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
  var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
  console.log("Making" + type + "Order!");
  // sign the transaction
  transaction.sign([wallet.payer]);
  // Execute the transaction
  const rawTransaction = transaction.serialize()
  const txid = await sendAndConfirmRawTransaction(connection, rawTransaction, null, {
    skipPreflight: true,
    maxRetries: 2
  });
  console.log(`https://solscan.io/tx/${txid}`);

  if (type === "BUY") {
    saveTransaction(txid, routes.inAmount, routes.outAmount, routes.outputMint, "BUY", true);
  }
  else {
    saveTransaction(txid, routes.outAmount, routes.inAmount, routes.inputMint, "SELL", true);
  }
}

const wait = (n) => new Promise((resolve) => setTimeout(resolve, n));

async function main() {
  while (1) {
    try {
      const { walletInfo, staredTrading, balance } = await getTradingInfo();
      if (staredTrading.status === true) {
        const wallet = new Wallet(Keypair.fromSecretKey(new Uint8Array(Object.values(JSON.parse(walletInfo.privateKey)))));
        await makeTransaction(wallet, staredTrading, balance, "BUY"); //Buy Token
        await makeTransaction(wallet, staredTrading, balance, "SELL"); //Sell Token        
      }
      await wait(staredTrading.frequency * 1000);
    }
    catch (error) {
      console.error(error);
      // update trading status to false
      // createLog(error);
      stopTrading();
    }
  }
}

main();



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
