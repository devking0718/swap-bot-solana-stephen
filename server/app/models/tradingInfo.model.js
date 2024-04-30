module.exports = (sequelize, Sequelize) => {
    const TradingInfo = sequelize.define("tradingInfo", {
        token: {
            type: Sequelize.STRING
        },
        buyAmount: {
            type: Sequelize.STRING
        },
        sellAmount: {
            type: Sequelize.STRING
        },
        frequency: {
            type: Sequelize.INTEGER
        },
        slippage: {
            type: Sequelize.STRING
        },
        walletId: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        },
    });

    return TradingInfo;
};
