module.exports = (sequelize, DataTypes) => {

	var DeviceAgenda = sequelize.define('DeviceAgenda', {
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
		agendaJobName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		timeString: {
			type: DataTypes.STRING,
			allowNull: false
		},
		isPaused: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}, {
		classMethods: {
			associate: (models) => {
				DeviceAgenda.belongsTo(models.Device, {
					onDelete: 'CASCADE',
					foreignKey: 'deviceId'
				});
			}
		}
	});

	return DeviceAgenda;
}
