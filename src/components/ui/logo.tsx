import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "logo" | "chat";
}

const Logo = ({ className, size = "md", variant = "logo" }: LogoProps) => {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
  };

  const logoSizes = {
    sm: "h-6 w-auto",
    md: "h-8 w-auto",
    lg: "h-10 w-auto",
  };

  if (variant === "logo") {
    return (
      <img
        src="https://res.cloudinary.com/dbtapyfau/image/upload/v1758446693/google_cloud_x_mr_cooper.max-2500x2500_y8raun.jpg"
        alt="Mr. Cooper Logo"
        className={cn("object-contain", logoSizes[size], className)}
      />
    );
  }

  return (
    <MessageSquare
      className={cn("text-[#0066CC]", sizes[size], className)}
      strokeWidth={2.5}
    />
  );
};

export default Logo;
