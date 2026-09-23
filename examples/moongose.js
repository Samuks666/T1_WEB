import mongoose from "mongoose";

// Conexão com o MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/database")
  .then(() => {
    console.log("mongodb conectado");
  })
  .catch((err) => {
    console.log("erro de conexão: ", err);
  });

// Schema e Model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model("User", userSchema);

// CREATE - criar um novo usuário
async function createUser({ name, age, email }) {
  const newUser = new User({ name, age, email });
  return await newUser.save();
}

// READ - listar todos os usuários
async function getUsers() {
  return await User.find();
}

// READ - buscar um usuário pelo id
async function getUserById(id) {
  return await User.findById(id);
}

// UPDATE - atualizar um usuário existente
async function updateUser(id, data) {
  return await User.findByIdAndUpdate(id, data, {
    new: true, // retorna o documento já atualizado
    runValidators: true, // aplica as validações do schema no update
  });
}

// DELETE - remover um usuário
async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

export { User, createUser, getUsers, getUserById, updateUser, deleteUser };

// Exemplo de uso:
// const user = await createUser({ name: "Samuel", age: 22, email: "meuemail@email.com" });
// console.log(user);
