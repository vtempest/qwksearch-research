const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className=" bg-light-primary dark:bg-dark-primary min-h-screen pb-32 lg:pb-40">
      <div className="max-w-screen-lg lg:mx-auto ">{children}</div>

    </main>
  );
};

export default Layout;
