import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace("", '');
  console.log(token)

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123');

      req.userId = decoded.id;
      next();
    } catch (e) {
      console.log(e)
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};
