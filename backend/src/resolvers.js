const { User } = require("./models");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const beersData = require("./products");
const resolvers = {
    Query: {
        async current(_, args, { user }) {
            if (user) {
                return await User.findOne({ where: { id: user.id } });
            }
            throw new Error("Sorry, you're not an authenticated user!");
        },
        async product(_, { id }, { user }) {
            if (user) {
                return beersData.filter((beer) => beer.id === id)[0];
            }
            throw new Error("Sorry, you're not an authenticated user!");
        },

        async products(_, { brand }, { user }) {
            if (user) {
                return beersData.filter((beer) => beer.brand === brand);
            }
            throw new Error("Sorry, you're not an authenticated user!");
        }
    },

    Mutation: {
        async register(_, { login, password }) {
            const user = await User.create({
                login,
                password: await bcrypt.hash(password, 10),
            });

            return jsonwebtoken.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, {
                expiresIn: "3m",
            });
        },

        async login(_, { login, password }) {
            const user = await User.findOne({ where: { login } });

            if (!user) {
                throw new Error(
                    "This user doesn't exist. Please, make sure to type the right login."
                );
            }

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                throw new Error("You password is incorrect!");
            }

            return jsonwebtoken.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
        },


    },
};

module.exports = resolvers;