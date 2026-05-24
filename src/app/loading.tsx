export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white gap-4">
      <div
        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 
                   border-[16px] sm:border-[14px] md:border-[16px] lg:border-[20px] 
                   border-gray-200 rounded-full animate-spin" //framer-motion 쓰면 안 돌아감
        style={{ borderTopColor: "#0000FE" }}
      />
      <p className="text-2xl sm:text-base md:text-lg lg:text-xl text-black">
        Loading...
      </p>
    </div>
  );
}
