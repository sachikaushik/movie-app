import Image from "next/image";

export default function Layout({ children }) {
  return (
    <div className="bg-[#093545] flex items-center justify-center min-h-screen">
      <div className="relative z-10">{children}</div>
      <div>
        <Image
          src="/assets/Vectors.png"
          alt="img"
          layout="responsive"
          width={1920}
          height={1080}
          className="absolute bottom-0 left-0 w-full"
        />
      </div>
    </div>
  );
}
