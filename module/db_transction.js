const pool = require('../config/db_pool');

module.exports = {
    queryParamNone: async (...args) => {
            const query = args[0];
            let result;
            let connection;
            try {
                connection = await pool.getConnection();
                result = await connection.query(query) || null;
            } catch (err) {
                next(err);
            } finally {
                pool.releaseConnection(connection);
                return result;
            }
        },

        queryParamArr: async (...args) => {
            const query = args[0];
            const value = args[1];
            let result;
            let connection;

            try {
                connection = await pool.getConnection();
                result = await connection.query(query, value) || null;
            } catch (err) {
                console.log(err);
                next(err);

            } finally {
                pool.releaseConnection(connection);
                return result;
            }
        },

    transactionControll: async (...args) => {
        const cnt = args[0];
        const arr = args[1];
        let result = [];
        let connection;

        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            for (let i = 0; i<cnt; i++) {
                result[i] = await connection.query(arr[i], arr[i+1]) || null;
            }
            await connection.commit();
            console.log(arr[1]);
            console.log(arr.length);
        }
        catch (err) {
            console.log(err);
            next(err);
        }
        finally {
            pool.releaseConnection(connection);
            return result;
        }
    }
};
