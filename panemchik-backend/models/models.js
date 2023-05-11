const sequelize = require("../database");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});
const TokenModel = sequelize.define("token", {
  refreshToken: { type: DataTypes.STRING },
});

const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define("basketProduct", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
});

const Product = sequelize.define("product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
});

const ProductPrice = sequelize.define("product_price", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  price: { type: DataTypes.INTEGER },
});

User.hasOne(TokenModel);

User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(Product);
Product.belongsToMany(Basket, { through: BasketProduct });

Product.hasMany(ProductPrice, { as: "price" });
ProductPrice.belongsTo(Product);

module.exports = {
  User,
  TokenModel,
  Basket,
  Product,
  ProductPrice,
};
