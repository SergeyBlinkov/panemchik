module.exports = class ProductDTO {
  id;
  name;
  img;
  description;
  basketId;
  price;
  constructor(credentials) {
    this.id = credentials.id;
    this.name = credentials.name;
    this.img = credentials.img;
    this.description = credentials.description;
    this.basketId = credentials.basketId;
    this.price = credentials.price;
  }
};
