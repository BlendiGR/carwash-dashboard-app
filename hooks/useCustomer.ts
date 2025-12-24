import { useState, useEffect } from "react";
import { customerCount } from "@/app/actions/tyrehotel";
import { useLoading } from "./useLoading";

/**
 * Fetches the total number of customers in the system.
 *
 * @returns Customer count and loading state
 */
export function useCustomerCount() {
  const [count, setCount] = useState(0);
  const { loading, withLoading } = useLoading(true);

  useEffect(() => {
    withLoading(async () => {
      const result = await customerCount();
      setCount(result);
    });
  }, [withLoading]);

  return { count, loading };
}
