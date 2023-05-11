module.exports = class UserDTO {
  email;
  id;
  name;
  role;

  constructor(credentials) {
    const name = credentials.name ? credentials.name : "Unknown";
    this.email = credentials.email;
    this.id = credentials.id;
    this.name = name;
    this.role = credentials.role;
  }
};
