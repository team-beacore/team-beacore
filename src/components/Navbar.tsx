import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "../config/site";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useScrolled } from "../hooks/useScrolled";
import { cn } from "../lib/utils";
import { CloseIcon, MenuIcon } from "../lib/icons";
import { Button } from "./Button";
import { Logo } from "./Logo";

const MENU_ID = "menu-mobile";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const scrolled = useScrolled(8);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !menuRef.current) return;

      const focusables = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.offsetParent !== null);

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, close]);

  const toggle = () => setOpen((current) => !current);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-ink-100 bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-white/40 backdrop-blur-sm",
      )}
    >
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-6 lg:h-[72px] lg:px-8"
      >
        <Logo href="#inicio" className="w-18 lg:w-20" />

        <ul className="hidden items-center gap-8 lg:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group relative text-sm font-medium text-ink-600 transition-colors hover:text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-600 transition-transform duration-300 group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href={siteConfig.cta.href} size="sm">
            {siteConfig.cta.label}
          </Button>
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={MENU_ID}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink-800 transition-colors hover:bg-ink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:hidden"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      <div
        id={MENU_ID}
        ref={menuRef}
        aria-hidden={!open}
        className={cn(
          "border-ink-100 bg-white transition-all duration-300 ease-out lg:hidden",
          open
            ? "max-h-[calc(100vh-4rem)] max-h-[calc(100dvh-4rem)] overflow-y-auto border-t"
            : "max-h-0 overflow-hidden",
        )}
      >
        <div className="px-5 pb-8 pt-4 sm:px-6">
          <ul className="divide-y divide-ink-100">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={close}
                  tabIndex={open ? 0 : -1}
                  className="flex items-center justify-between py-4 text-base font-medium text-ink-800 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  {item.label}
                  <span aria-hidden="true" className="text-ink-300">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button href={siteConfig.cta.href} onClick={close} className="w-full" size="lg">
              {siteConfig.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}