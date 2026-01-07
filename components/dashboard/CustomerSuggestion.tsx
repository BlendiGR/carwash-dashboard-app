"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { User, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormField } from "../ui/form";
import { findCustomerByPhone } from "@/app/actions/tyrehotel";
import { PHONE_REGEX } from "@/lib/constants";

type CustomerMatch = { id: number; name: string } | null;

/** Inline customer creation schema */
const inlineCustomerSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.email().optional().or(z.literal("")),
  customerCompany: z.string().optional().or(z.literal("")),
});

type InlineCustomerData = z.infer<typeof inlineCustomerSchema>;

interface CustomerSuggestionProps {
  phone: string;
  onLinkCustomer: (customerId: number) => void;
  onCreateCustomer: (data: { name: string; email?: string; company?: string }) => void;
  onSkip: () => void;
}

export default function CustomerSuggestion({
  phone,
  onLinkCustomer,
  onCreateCustomer,
  onSkip,
}: CustomerSuggestionProps) {
  const t = useTranslations("AddTyreModal");

  // Lookup state
  const [customerMatch, setCustomerMatch] = useState<CustomerMatch>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Check if phone is valid
  const isPhoneValid = PHONE_REGEX.test(phone);

  // Debounced lookup
  const lookupCustomer = useDebouncedCallback(async (phoneValue: string) => {
    if (!PHONE_REGEX.test(phoneValue)) {
      setCustomerMatch(null);
      setHasSearched(false);
      return;
    }

    setIsLookingUp(true);
    const result = await findCustomerByPhone(phoneValue);
    setIsLookingUp(false);
    setHasSearched(true);

    if (result.success) {
      setCustomerMatch(result.data);
    }
  }, 1500);

  // Trigger lookup when phone changes and is valid
  useEffect(() => {
    if (isPhoneValid) {
      lookupCustomer(phone);
    } else {
      setCustomerMatch(null);
      setHasSearched(false);
      setShowCreateForm(false);
    }
  }, [phone, isPhoneValid, lookupCustomer]);

  // Form for inline customer creation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InlineCustomerData>({
    resolver: zodResolver(inlineCustomerSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerCompany: "",
    },
  });

  const handleCreateSubmit = (data: InlineCustomerData) => {
    onCreateCustomer({
      name: data.customerName,
      email: data.customerEmail || undefined,
      company: data.customerCompany || undefined,
    });
  };

  // Don't show anything until phone is valid
  if (!isPhoneValid) {
    return null;
  }

  // Loading state
  if (isLookingUp) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("lookingUp")}...
      </div>
    );
  }

  // No search yet
  if (!hasSearched) {
    return null;
  }

  // Customer found
  if (customerMatch) {
    return (
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-700">
            {t("foundCustomer")}: <strong>{customerMatch.name}</strong>
          </span>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={() => onLinkCustomer(customerMatch.id)}>
            {t("linkToCustomer")}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onSkip}>
            {t("skip")}
          </Button>
        </div>
      </div>
    );
  }

  // No customer found, offer to create
  if (!showCreateForm) {
    return (
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-700 mb-2">{t("noCustomerFound")}</p>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => setShowCreateForm(true)}>
            {t("createCustomer")}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onSkip}>
            {t("skip")}
          </Button>
        </div>
      </div>
    );
  }

  // Create customer form
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-sm font-medium text-green-700 mb-3">{t("createCustomer")}</p>

      <div className="space-y-3">
        <FormField label={t("customerName")} error={errors.customerName?.message}>
          <Input {...register("customerName")} error={!!errors.customerName} />
        </FormField>

        <FormField label={t("customerEmail")} error={errors.customerEmail?.message}>
          <Input {...register("customerEmail")} error={!!errors.customerEmail} />
        </FormField>

        <FormField label={t("customerCompany")} error={errors.customerCompany?.message}>
          <Input {...register("customerCompany")} error={!!errors.customerCompany} />
        </FormField>
      </div>

      <div className="flex gap-2 mt-3">
        <Button type="button" size="sm" onClick={handleSubmit(handleCreateSubmit)}>
          {t("confirmCreate")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setShowCreateForm(false);
            onSkip();
          }}
        >
          {t("skip")}
        </Button>
      </div>
    </div>
  );
}
