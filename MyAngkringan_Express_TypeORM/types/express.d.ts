declare namespace Express {
    interface Request {
        user: {
            id?: number;
            username: string;
            password: string;
            role: UserRoleType;
            createdAt?: Date;
            updatedAt?: Date;
            restaurant?: {};
            profile?: {};
        }
        params: {
            id: string | number;
        }
    }
}

type UserRoleType = "admin" | "manager" | "customer"