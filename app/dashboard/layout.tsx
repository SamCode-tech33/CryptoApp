export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div style={{ height: "100px", background: "green" }}></div>
      {children}
    </section>
  );
}
