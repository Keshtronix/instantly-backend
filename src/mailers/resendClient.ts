import { Resend } from "resend";
//import { config } from "../config/app.config";
import { envConfig } from "../config/env.config";

export const resend = new Resend(envConfig.RESEND_API_KEY);