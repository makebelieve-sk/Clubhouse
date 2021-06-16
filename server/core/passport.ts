// Паспорт гитхаба
import passport from "passport";
import {Strategy as GithubStrategy} from "passport-github";
import {Strategy as JwtStrategy, ExtractJwt, StrategyOptions} from "passport-jwt";
import {User} from "../../models";
import {createJwToken} from "../utils/createJwToken";
import {UserData} from "../../pages";

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY_JWT
};

// Дешифратор токена
passport.use("jwt", new JwtStrategy(opts, (jwt_payload, done) => {
    done(null, jwt_payload.data);
}));

// Паспорт гитхаба (вход через гитхаб)
passport.use(
    "github",
    new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/auth/github/callback"
    },
    async (_: unknown, __: unknown, profile, done) => {
        try {
            let userData: UserData;

            // Создаем объект пользователя (Omit<Schema, field> - исключаем поле field из схемы Schema)
            const objUser: Omit<UserData, "id"> = {
                fullname: profile.displayName,
                avatarUrl: profile.photos?.[0].value,
                isActive: 0,
                username: profile.username,
                phone: "",
            };

            // Находим пользователя по полю username
            const findUser = await User.findOne({where: {username: objUser.username}});

            // Если нет пользователя, создаем его
            // Иначе найденного пользователя превращаем в строку
            if (!findUser) {
                const user = await User.create(objUser);    // Создаем нового пользователя в базе данных

                userData = user.toJSON();   // Если пользователь не нашелся, создаем его
            } else {
                userData = findUser.toJSON();
            }

            done(null, {
                ...userData,
                token: createJwToken(userData)
            });
        } catch (e) {
            done(e);  // Пробрасываем в коллбек возникшую ошибку
            console.log("Проблема авторизации: ", e);
            throw new Error(e);
        }
    }
));

// Сериализуем объект пользователя
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Десериализуем объект пользователя
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        err ? done(err) : done(null, user);
    })
});

export {passport};