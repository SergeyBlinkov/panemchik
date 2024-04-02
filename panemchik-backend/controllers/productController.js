const uuid = require("uuid");
const path = require("path");
const { Product, ProductPrice } = require("../models/models");
const ApiError = require("../error/ApiError");
const ProductDTO = require("../DataTransferObject/productDTO");

class productController {
  async create(req, res, next) {
    try {
      const { name, description, price } = req.body;
      const { img } = req.files;
      if (!price) {
        return next(ApiError.BadRequest("Вы не ввели цену товара", "price"));
      }
      const priceJson = JSON.parse(price);
      console.log(typeof priceJson);
      let fileName = uuid.v4() + ".jpg";
      await img.mv(path.resolve(__dirname, "..", "static", fileName));
      const productItem = await Product.create(
        {
          name,
          description,
          img: fileName,
        },
        { include: [{ model: ProductPrice, as: "price" }] }
      );
      priceJson.forEach((item) => {
        return ProductPrice.create({
          name: item.name,
          price: item.price,
          productId: productItem.id,
        });
      });
      const product = new ProductDTO(productItem);
      return res.json(product);
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res) {
    try {
      const product = await Product.findAll({
        include: [{ model: ProductPrice, as: "price" }],
      });
      const productDto = product.map((item) => new ProductDTO(item));
      return res.json(productDto);
    } catch (e) {
      return ApiError.BadRequest("не удалось получить список", e.message);
    }
  }
  async getCurrent(req, res) {
    try {
      const id = req.url.match(/[0-9]/g).join('')
      const product = await Product.findOne({where: {id},include:[{model:ProductPrice, as: 'price'}]})
      const productDto = new ProductDTO(product)
      console.log(productDto)
      return res.json(productDto)
    } catch(e) {
      return ApiError.BadRequest('Пользователь с этим ID не найден, либо произошла непредвиденная ошибка',e.message)
    }
  }
}

module.exports = new productController();
