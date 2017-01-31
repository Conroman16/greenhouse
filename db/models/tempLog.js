module.exports = (sequelize, DataTypes) => {

	var TemperatureLog = sequelize.define('TemperatureLog', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		deviceId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true
		},
		temperature_f: {
			type: DataTypes.STRING,
			allowNull: false
		},
		humidity: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		classMethods: {
			associate: (models) => {
				TemperatureLog.belongsTo(models.Device, {
					onDelete: 'CASCADE',
					foreignKey: 'deviceId'
				});
			}
		}
	});

	return TemperatureLog;
}
