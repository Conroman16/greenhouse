module.exports = (sequelize, DataTypes) => {

	var Device = sequelize.define('Device', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		outletId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false
		},
		defaultSetting: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		isPaused: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},{
		classMethods: {
			associate: (models) => {
				Device.hasMany(models.DeviceAgenda, {
					foreignKey: 'deviceId'
				});
			}
		}
	});

	return Device;
};
