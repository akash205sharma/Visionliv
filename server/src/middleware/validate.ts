import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const signupInput = z.object({
    ishost:z.boolean(),
    username: z.string(),
    password: z.string(),                     
    email: z.string().email().optional(),
    name : z.string().nullable().optional(),
    tokens: z.array(z.string()).optional()
})

export type SignupParams = z.infer<typeof signupInput>;

export const ValidateSignup = (req: Request, res: Response, next: NextFunction) => {
    const data = signupInput.safeParse(req.body);

    if (!data.success)
        return res.status(404).json({ errors: data.error.format() });
    
    next();
}

