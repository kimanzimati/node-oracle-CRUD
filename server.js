var oracledb = require('oracledb');

(async function() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: 'SYSTEM',
      password: 'Admin.2022',
      connectString: 'localhost:1521/xe'
    });
    console.log("Successfully connected to Oracle!");

    const sqlQuery = `INSERT INTO employees (id, name, email) VALUES (:1, :2, :3)`;

    const binds = [
      [1, "test001", "test001@email.com"],
      [2, "test002", "test002@email.com"],
      [3, "test003", "test003@email.com"]
    ];

    const options = {
      autoCommit: true,
      bindDefs: [
        { type: oracledb.NUMBER },
        { type: oracledb.STRING, maxSize: 50 },
        { type: oracledb.STRING, maxSize: 100 }
      ]
    };

    const result = await connection.executeMany(sqlQuery, binds, options);


    await connection.execute(
        'DELETE FROM employees where id = :1', [1]
      );
    console.log("Number of inserted rows:", result.rowsAffected);
    await connection.execute('UPDATE employees SET email = :1 where ID = :2', ['new@email.com', 1]);

    connection.execute(
      `SELECT *
       FROM employees`,
      [],
      async function(err, result) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log(result.rows);

        try {
          await connection.close();
          console.log("Connection closed.");
        } catch(err) {
          console.log("Error when closing the database connection: ", err);
        }
      }
    );
  } catch(err) {
    console.log("Error: ", err);
  }
})();
