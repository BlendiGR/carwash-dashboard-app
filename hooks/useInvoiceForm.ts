"use client";

import { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { receiptSchema, ReceiptFormData, InvoiceItem } from "@/lib/schemas/receiptSchema";

/** VAT rate in Finland (25.5%) */
const VAT_RATE = 0.255;

/** Type: Calculated invoice totals */
type InvoiceTotals = {
  validItems: InvoiceItem[];
  subtotal: number;
  vatAmount: number;
  vatRate: number;
  total: number;
  itemCount: number;
};

/**
 * Generates a unique ID for invoice items.
 *
 * @returns Random alphanumeric string
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Creates an empty invoice item with a unique ID.
 *
 * @returns New invoice item with empty service and price
 */
function createEmptyItem(): InvoiceItem {
  return { id: generateId(), service: "", price: "" };
}

/**
 * Calculates invoice totals from a list of items.
 * Filters out invalid items and computes subtotal, VAT, and total.
 * Pure function that can be used on client or server.
 *
 * @param items - Array of invoice items to calculate totals for
 * @returns Object containing valid items, subtotal, VAT amount, and total
 */
export function calculateInvoiceTotals(items: InvoiceItem[]): InvoiceTotals {
  const validItems = items.filter(
    (item) => item.service && item.price && !isNaN(parseFloat(item.price))
  );

  const total = validItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const vatAmount = total * (VAT_RATE / (1 + VAT_RATE));
  const subtotal = total - vatAmount;

  return {
    validItems,
    subtotal,
    vatAmount,
    vatRate: VAT_RATE,
    total,
    itemCount: validItems.length,
  };
}

/**
 * Manages invoice form state with validation, field arrays, and calculations.
 * Uses react-hook-form with Zod validation for type-safe form handling.
 *
 * @returns Object containing form instance, field array controls, watched values, totals, and utility functions
 */
export function useInvoiceForm() {
  const form = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      email: "",
      customerName: "",
      plate: "",
      items: [createEmptyItem()],
    },
  });

  const { control, watch, reset, register } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedValues = watch();

  /**
   * Adds a new empty invoice item to the form.
   */
  const addItem = useCallback(() => {
    append(createEmptyItem());
  }, [append]);

  /**
   * Removes an invoice item by index. Requires at least one item to remain.
   *
   * @param index - Index of the item to remove
   */
  const removeItem = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove]
  );

  /**
   * Resets the form to its initial empty state.
   */
  const resetForm = useCallback(() => {
    reset({
      email: "",
      customerName: "",
      plate: "",
      items: [createEmptyItem()],
    });
  }, [reset]);

  /** Memoized invoice totals calculated from current items */
  const totals = useMemo(
    () => calculateInvoiceTotals(watchedValues.items || []),
    [watchedValues.items]
  );

  return {
    form,
    register,
    fields,
    watchedValues,
    totals,
    addItem,
    removeItem,
    resetForm,
    canRemoveItem: fields.length > 1,
  };
}
