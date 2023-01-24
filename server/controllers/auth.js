import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//register user

export const register = async (req, res) => {
    try {
        const {username, password} = req.body //получаем тело запроса имя пол. и пароль

        const inUsed = await User.findOne({username}) //находим в базе данных пользователя

        if (inUsed) {//если пользователь есть возвращаем сообщение 
            return res.json({
                message: "Данный пользователь уже есть"
            })
        }

        const salt = bcrypt.genSaltSync(10) //сложность хэширования пароля
        const hash = bcrypt.hashSync(password, salt); //хэшируем пароль

        const newUser = new User({ //создаем нового пользователя с именем и хэшированным паролем
            username,
            password: hash,
        })

        const token = jwt.sign(
            {
            id: newUser._id, //айди пользователя в базе данных
            }, 
            process.env.JWT_SECRET,
            {expiresIn: '30d'},
        )

        await newUser.save() //сохраняем пользователя в базе данных

        res.json({ //отправляем ответ на фронтэнд об успехе регистрации
            newUser,
            token,
            message: "Регистрация прошла успешно",
        })

    } catch (error) {
            res.json({message: "Ошибка при создании пользователя"})
    }
}
//login user
export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username})

        if (!user) {
            return res.json({
                message: "Такого пользователя не существует"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect) {
            return res.json({
                message: "Неверный пароль"
            })
        }

        const token = jwt.sign(
            {
            id: user._id, //айди пользователя в базе данных
            }, 
            process.env.JWT_SECRET,
            {expiresIn: '30d'},
        )

        res.json({
            token,
            user,
            message: "Вы вошли в систему",
        })

    } catch (error) {
        res.json({message: "Ошибка при автоизации"})
    }
}
//get me
export const getMe = async (req, res) => { //этот роут будет обрабатывать всегда при обновлении страницы
    try {
        const user = await User.findById(req.userId) //находим пользователя по вшитому токену

        if (!user) {
            return res.json({
                message: "Такого пользователя не существует"
            })
        }

        const token = jwt.sign( //создаем токен
            {
            id: user._id, //айди пользователя в базе данных
            }, 
            process.env.JWT_SECRET,
            {expiresIn: '30d'},
        )

        res.json({
            user,
            token
        })


    } catch (error) {
        res.json({message: "Нет доступа"})
    }
}