const jwt = requrie('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expriesin: '1y' });

};
module.exports = { generateToken };