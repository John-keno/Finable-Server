import { RegisterType } from "../common/types";
import { AccountModel, CardModel } from "../models";

export default class AuthService {

    async register(data: RegisterType): Promise<any> {
        const account = await AccountModel.create({
            firstName: data.firstName,
            surname: data.surname,
            dateOfBirth: data.dateOfBirth,
            email: data.email,
            password: data.password,
            phoneNumber: data.phoneNumber,
        });

        if (!account) {
            throw new Error("Account creation failed");
        }

        const card = await CardModel.create({
            accountNumber: account.accountNumber,
        });

        const user = await AccountModel.find({}).populate('VirtualCard').lean();
        // console.log(user);
        if (!user) {
            throw new Error("Account not found");
        }

        return user;

    }

    async getAccount(accountId?: string): Promise<any> {
         const user = await AccountModel.find({}).populate("VirtualCard", "cardId accountNumber isActive cardNumber expiryDate cvv").lean();
        // console.log(user);
        if (!user) {
            throw new Error("Account not found");
        }

        return user;
    }

    async login(email: string, password: string): Promise<string> {
        return 'login_token';
    }


	


}






