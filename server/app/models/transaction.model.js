module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
        hash: {
            type: Sequelize.STRING
        },
        sol: {
            type: Sequelize.INTEGER
        },
        token: {
            type: Sequelize.INTEGER
        },
        address: {
            type: Sequelize.STRING
        },
        action: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        },
    });

    return Transaction;
};
