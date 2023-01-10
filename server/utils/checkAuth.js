import jwt from 'jsonwebtoken';

//пишем функцию middleware котрая проверяет токен
export const checkAuth = (req, res, next) => {
    //получаем токен из хэдэра запроса при помощи регулярных выражений из хэдэров (Bearer kdhfkajsdf.....)
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

     if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) //расшифровываем токен

            req.userId = decoded.id //вшиваем токен отправляет токен в запросе чем подтверждает что мы залогинены

            next() //выполняем последующую функцию getMe в auth/routers 
        } catch (error) {
            return res.json({
                message: "Нет доступа",
            })
        }
     } else {
        return res.json({
            message: "Нет доступа",
        })
     }
}