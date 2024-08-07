import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import titleLogo from "@/public/exchange.png";

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="flex items-center justify-center gap-x-2">
        <Image
          src={titleLogo}
          alt="logo-img"
          className="h-5 w-5 sm:h-8 sm:w-8"
        />
        <p
          className={cn(
            "text-xl sm:text-2xl font-semibold drop-shadow-sm whitespace-nowrap cursor-pointer",
            font.className
          )}
        >
          Avocarbo
        </p>
      </div>
    </Link>
  );
};

export default Logo;
