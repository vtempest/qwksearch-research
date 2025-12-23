const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className=" bg-light-primary dark:bg-dark-primary min-h-screen">
      {children}

    </main>
  );
};

export default Layout;
