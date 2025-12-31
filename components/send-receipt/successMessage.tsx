import { Check } from "lucide-react";

interface SuccessMessageProps {
  title: string;
  description: string;
}

/**
 * SuccessMessage - Displays a success confirmation with icon and message.
 * Used after successful form submissions.
 */
export default function SuccessMessage({ title, description }: SuccessMessageProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-lg font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
