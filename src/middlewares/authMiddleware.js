import db from "../config/db.js";

export const validateAuth = async (req, res, next) => {
  const authorizationInfo = req.headers.authorization;

  if (!authorizationInfo) return res.status(401).send('Informe o token de autorização');

  const token = authorizationInfo.replace('Bearer ', '');

  const session = await db.collection('sessions').findOne({ token });

  if (!session) return res.sendStatus(401);

  res.locals.session = session;

  next();
};