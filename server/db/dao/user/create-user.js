import connection from '../../connection.js';
import { v4 } from 'uuid';

function createUser(name, email, password, initialAmount, createAccount) {
	return new Promise((resolve, reject) => {
		connection.beginTransaction((err) => {
			if (err) return reject(err);
			// create user
			const userId = v4();
			const statement1 = `
				INSERT INTO 
				Users(id, name, email, password, created_at) 
				VALUES (?,?,?,?,?);`;
			const inserts1 = [userId, name, email, password, new Date()];
			connection.execute(statement1, inserts1, (err, result, fields) => {
				if (err) return reject(err);
				console.log(`--- INSERT // insertId=${userId} // ${result.affectedRows} ROWS INSERTED ---`);

				// create account
				if (createAccount) {
					const statement2 = `
						INSERT INTO 
						Accounts(account_holder, balance, created_at) 
						VALUES (?,?,?);`;
					const inserts2 = [userId, initialAmount, new Date()];
					connection.execute(statement2, inserts2, (err, result, fields) => {
						if (err) return reject(err);
						console.log(`--- INSERT // insertId=${result.insertId} // ${result.affectedRows} ROWS INSERTED ---`);
					});
				}

				connection.commit(function (err) {
					if (err) return reject(err);
					resolve(userId);
				});
			});
		});
	});
}

export default createUser;
