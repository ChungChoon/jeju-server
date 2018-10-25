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
                next(err);
            } finally {
                pool.releaseConnection(connection);
                return result;
            }
        }
};