import { useState } from "react";
import { Upload, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface AddressFormProps {
  onSubmit: (data: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    proofDocument?: string;
  }) => void;
  onClose: () => void;
  onCancel?: () => void;
}

interface FormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const AddressForm = ({ onSubmit, onClose, onCancel }: AddressFormProps) => {
  const [proofDocument, setProofDocument] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const onFormSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      proofDocument: proofDocument || undefined,
    });
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-gray-900">
              Address Verification
            </DialogTitle>
            <DialogClose
              className="h-6 w-6 text-gray-500 hover:text-gray-700"
              onClick={handleClose}
            />
          </div>
          <DialogDescription className="text-gray-600">
            Please provide your current residential address and upload a proof
            of address document (utility bill, bank statement, etc.)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Street Address
            </label>
            <Input
              {...register("street", {
                required: "Street address is required",
                minLength: {
                  value: 5,
                  message: "Please enter a valid street address",
                },
              })}
              placeholder="Enter your street address (e.g., 123 Main St)"
              className="border-gray-300 focus:border-mrcooper-blue focus:ring-mrcooper-blue"
            />
            {errors.street && (
              <p className="text-sm text-red-500">{errors.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">City</label>
              <Input
                {...register("city", {
                  required: "City is required",
                  pattern: {
                    value: /^[a-zA-Z\s-]+$/,
                    message: "Please enter a valid city name",
                  },
                })}
                placeholder="Enter your city"
                className="border-gray-300 focus:border-mrcooper-blue focus:ring-mrcooper-blue"
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">State</label>
              <Input
                {...register("state", {
                  required: "State is required",
                  pattern: {
                    value: /^[A-Z]{2}$/,
                    message: "Please enter a valid state code (e.g., CA)",
                  },
                })}
                placeholder="(e.g., CA)"
                className="border-gray-300 focus:border-mrcooper-blue focus:ring-mrcooper-blue"
                maxLength={2}
                style={{ textTransform: "uppercase" }}
              />
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              ZIP Code
            </label>
            <Input
              {...register("zipCode", {
                required: "ZIP code is required",
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message:
                    "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)",
                },
              })}
              placeholder="Enter ZIP code (e.g., 12345)"
              className="border-gray-300 focus:border-mrcooper-blue focus:ring-mrcooper-blue"
            />
            {errors.zipCode && (
              <p className="text-sm text-red-500">{errors.zipCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Proof of Address
            </label>
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-mrcooper-blue transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProofDocument(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id="proof-upload"
              />
              <label
                htmlFor="proof-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-mrcooper-blue mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG
                </span>
              </label>
            </div>
            {proofDocument ? (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Document uploaded successfully
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Please upload a recent utility bill, bank statement, or other
                official document showing your address
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-mrcooper-blue hover:bg-mrcooper-blue-dark text-white"
              disabled={!proofDocument}
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressForm;
