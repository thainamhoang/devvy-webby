import Link from "next/link";

const socials = [
    { label: "GitHub", href: "https://github.com/thainamhoang" },
    { label: "LinkedIn", href: "https://linkedin.com/in/thainamhoang" },
    { label: "Behance", href: "https://behance.net/thainamhoang" },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-[var(--color-border)] py-10 px-10 md:px-16">
            <div className="max-w-6xl mx-auto px-10 md:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Left — name + year */}
                <div>
                    <p className="font-[family-name:var(--font-fraunces)] text-sm text-[var(--color-ink)]">
                        Thai-Nam Hoang
                    </p>
                    <p className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-muted)] mt-1">
                        © {year} 
                    </p>
                </div>

                {/* Right — social links */}
                <ul className="flex flex-wrap gap-6">
                    {socials.map(({ label, href }) => (
                        <li key={href}>
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200"
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    );
}