const jwt = requrie('jsonwebtoken')

exports.generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expriesin: '1y' });

};