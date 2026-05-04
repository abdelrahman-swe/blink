export default function Loading() {
  return (
    <div className="bg-primary! min-h-screen flex flex-col gap-5 items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      <h3 className="text-xl font-semibold text-background">Loading ...</h3>
    </div>
  );
}
