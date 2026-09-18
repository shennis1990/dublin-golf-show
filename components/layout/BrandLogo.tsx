import Image from "next/image";

export function BrandLogo() {
  return (
    <Image
      src="/images/logo-wordmark-light.png"
      alt="Dublin Golf Show 2027"
      width={1024}
      height={257}
      priority
      quality={100}
      className="h-9 w-auto md:h-10 lg:h-11"
    />
  );
}
