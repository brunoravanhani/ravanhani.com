export default function Footer() {
  return (
    <footer className="border-t border-[#1e293b] py-8 px-6 text-center text-[#475569] text-sm">
      <p>
        Desenvolvido com{" "}
        <span className="text-[#6366f1] font-medium">Next.js</span> &amp;{" "}
        <span className="text-[#6366f1] font-medium">Tailwind CSS</span>
      </p>
      <p className="mt-1">
        &copy; {new Date().getFullYear()} Bruno Ravanhani. Todos os direitos reservados.
      </p>
    </footer>
  );
}
