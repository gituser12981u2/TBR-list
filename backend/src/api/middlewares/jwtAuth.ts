// middleware/jwtAuth.ts
import passport from "passport";
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import User from "../models/user";

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

const jwtStrategy = new JwtStrategy(options, async (jwtPayload, done) => {
	try {
		const user = await User.findById(jwtPayload.id);

		if (user) {
			return done(null, user);
		}

		// If user is not found
		return done(null, false, {message: "Token not valid"});
	} catch (error) {
		return done(error, false);
	}
});

passport.use(jwtStrategy);

export default passport.authenticate("jwt", {session: false});
