import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizes = {
    sm: "h-6 w-auto",
    md: "h-8 w-auto",
    lg: "h-10 w-auto",
  };

  return (
    <img
      src="https://res.cloudinary.com/dbtapyfau/image/upload/v1758446693/google_cloud_x_mr_cooper.max-2500x2500_y8raun.jpg"
      alt="Mr. Cooper Logo"
      className={cn("object-contain", sizes[size], className)}
    />
  );
};

export default Logo;
