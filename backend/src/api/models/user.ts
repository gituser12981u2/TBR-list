// ./api/models/user.ts
import mongoose, {Schema, Document} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
	username: string;
	password: string;
	validatePassword: (password: string) => boolean;
}

const UserSchema: Schema = new Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
});

UserSchema.pre<IUser>("save", function (next) {
	const user = this;
	if (this.isModified("password") || this.isNew) {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) {
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

UserSchema.methods.validatePassword = function (password: string): boolean {
	return bcrypt.compareSync(password, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
``;
