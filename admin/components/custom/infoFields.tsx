import { Spinner } from "@/components/ui/spinner";

interface InfoField {
  label: string;
  value: React.ReactNode;
  onClick?: () => void;
}

interface InfoFieldsProps {
  fields: InfoField[];
  isLoading?: boolean;
}

export function InfoFields({ fields, isLoading = false }: InfoFieldsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!fields.length) {
    return <div className="text-center"> No data available </div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div
          key={index}
          className={`flex items-start justify-between text-sm ${
            field.onClick ? "cursor-pointer hover:underline" : ""
          }`}
          onClick={field.onClick}
        >
          <span className="font-medium text-muted-foreground">
            {field.label}:
          </span>
          <span className="text-right break-all max-w-[70%] whitespace-pre-wrap">
            {field.value ?? "N/A"}
          </span>
        </div>
      ))}
    </div>
  );
}
