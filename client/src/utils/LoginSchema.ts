import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const validationSchema = toTypedSchema(
    z.object({
        email: z.string({message: "Email is required!"}).email(),
        password: z.string({message: "Password is required!"})
    })
)