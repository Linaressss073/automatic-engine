import Logo from "@/components/ui/Logo";

export default function AuthLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <>
        <div className="lg:grid lg:grid-cols-2 lg:min-h-screen lg:items-center lg:gap-x-20 lg:gap-y-0 bg-white">
            <div className="p-10 lg:py-28">
                <div className="max-w-3xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
      </>
    );
  }