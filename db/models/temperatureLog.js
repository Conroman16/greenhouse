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
			allowNull: false
		},
		temperature_f: {
			type: DataTypes.REAL,
			allowNull: true,
			defaultValue: null
		},
		humidity: {
			type: DataTypes.REAL,
			allowNull: true,
			defaultValue: null
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
