const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const UserRole = sequelize.define('userRole', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    role: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    timestamps: false
})

const User = sequelize.define('user', {
    login: {
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
})

const Passenger = sequelize.define('passenger', {
    passport: {
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    fio: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
})

const AirportCity = sequelize.define('airportCity', {
    airport: {
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
})

const Flight = sequelize.define('flight', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departureDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    seatsAmount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: false
})

const Ticket = sequelize.define('ticket', {}, { timestamps: false })

UserRole.hasMany(User)
User.belongsTo(UserRole)

AirportCity.hasMany(Flight, {foreignKey: 'departureAirport'})
AirportCity.hasMany(Flight, {foreignKey: 'destinationAirport'})
Flight.belongsTo(AirportCity, {foreignKey: 'departureAirport'})
Flight.belongsTo(AirportCity, {foreignKey: 'destinationAirport'})

Passenger.hasOne(User)
User.belongsTo(Passenger)

Flight.belongsToMany(Passenger, {through: Ticket})
Passenger.belongsToMany(Flight, {through: Ticket})

module.exports = {
    User,
    UserRole,
    Passenger,
    AirportCity,
    Flight,
    Ticket
}
