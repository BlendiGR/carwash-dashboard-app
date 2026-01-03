import { z } from "zod";
import { TranslationFunction } from "../utils";
import { PHONE_REGEX } from "../constants";

export const customerSchema = (t: TranslationFunction) =>
  z.object({
    customerName: z.string().min(3, t("customerNameMin")),
    customerEmail: z.email(t("customerEmailInvalid")).optional().or(z.literal("")),
    customerPhone: z.string().regex(PHONE_REGEX, t("customerPhoneInvalid")),
    customerPlate: z.string().min(3, t("customerPlateInvalid")),
    customerCompany: z.string().min(3, t("customerCompanyInvalid")).optional().or(z.literal("")),
  });

export type Customer = z.infer<ReturnType<typeof customerSchema>>;
