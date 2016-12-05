module.exports = (sequelize, DataTypes) => {

	var User = sequelize.define('User', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		hash: {
			type: DataTypes.STRING,
			allowNull: false
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null
		},
		lastLogin: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null
		}
	});

	return User;
};
