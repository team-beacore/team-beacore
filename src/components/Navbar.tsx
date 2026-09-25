import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { siteConfig } from "../config/site";
import { services, servicePath } from "../content/services";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useScrolled } from "../hooks/useScrolled";
import { cn } from "../lib/utils";
import { ChevronRightIcon, CloseIcon, MenuIcon } from "../lib/icons";
import { serviceIcon } from "./service/serviceIcon";
import { Button } from "./Button";
import { Logo } from "./Logo";

const MENU_ID = "menu-mobile";
const SERVICES_MENU_ID = "menu-servicos";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Âncora interna (/#x) precisa de <a>; rota real precisa de <Link>. */
function NavItemLink({
  href,
  children,
  className,
  onClick,
  tabIndex,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
}) {
  const isHash = href.includes("#");

  if (isHash) {
    return (
      <a href={href} className={className} onClick={onClick} tabIndex={tabIndex}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className} onClick={onClick} tabIndex={tabIndex}>
      {children}
    </Link>
  );
}

/** Dropdown de serviços no desktop, acessível por mouse e por teclado. */
function ServicesDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<number | null>(null);
  const reduced = useReducedMotion();

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // Pequeno atraso ao sair evita que o menu feche enquanto o ponteiro
  // atravessa o vão entre o gatilho e o painel.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onFocusOut = () => {
      window.setTimeout(() => {
        if (!containerRef.current?.contains(document.activeElement)) setOpen(false);
      }, 0);
    };

    window.addEventListener("keydown", onKeyDown);
    containerRef.current?.addEventListener("focusout", onFocusOut);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      containerRef.current?.removeEventListener("focusout", onFocusOut);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <Link
        to="/servicos"
        aria-expanded={open}
        aria-controls={SERVICES_MENU_ID}
        onFocus={() => setOpen(true)}
        className="group relative flex items-center gap-1.5 text-sm font-medium text-ink-600 transition-colors hover:text-ink-950"
      >
        Serviços
        <ChevronRightIcon
          aria-hidden="true"
          className={cn(
            "h-3.5 w-3.5 text-ink-400 transition-transform duration-200",
            open ? "rotate-90" : "rotate-0",
          )}
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-600 transition-transform duration-300 group-hover:scale-x-100"
        />
      </Link>

      <AnimatePresence>
        {open && (
          <m.div
            id={SERVICES_MENU_ID}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-50 w-[30rem] -translate-x-1/2 pt-4"
          >
            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white p-2 shadow-xl shadow-ink-950/8">
              <ul className="grid grid-cols-2 gap-1">
                {services.map((service) => {
                  const Icon = serviceIcon(service.icon);
                  const href = servicePath(service);
                  const isRoute = href.startsWith("/servicos");

                  const inner = (
                    <>
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink-100 bg-ink-50 text-ink-600 transition-colors group-hover/item:border-brand-500/30 group-hover/item:bg-brand-50 group-hover/item:text-brand-600">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-semibold text-ink-950">
                          {service.title}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-ink-500">
                          {service.summary}
                        </span>
                      </span>
                    </>
                  );

                  const itemClass =
                    "group/item flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-ink-50";

                  return (
                    <li key={service.id}>
                      {isRoute ? (
                        <Link to={href} onClick={() => setOpen(false)} className={itemClass}>
                          {inner}
                        </Link>
                      ) : (
                        <a href={href} onClick={() => setOpen(false)} className={itemClass}>
                          {inner}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>

              <Link
                to="/servicos"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center justify-between rounded-xl border-t border-ink-100 px-3 py-3 text-[13px] font-semibold text-ink-900 transition-colors hover:text-brand-700"
              >
                Ver todos os serviços
                <ChevronRightIcon aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const scrolled = useScrolled(8);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { pathname } = useLocation();
  const reduced = useReducedMotion();

  useLockBodyScroll(open);

  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  // Fecha o menu ao trocar de rota.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    toggleRef.current?.focus();

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

  const tab = open ? 0 : -1;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-ink-100 bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-white/50 backdrop-blur-sm",
      )}
    >
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-6 lg:h-[72px] lg:px-8"
      >
        <Link to="/" aria-label="Beacore — Início" className="inline-flex items-center">
          <Logo className="w-18 lg:w-20" />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {siteConfig.nav.map((item) =>
            item.href === "/servicos" ? (
              <li key={item.href}>
                <ServicesDropdown />
              </li>
            ) : (
              <li key={item.href}>
                <NavItemLink
                  href={item.href}
                  className="group relative text-sm font-medium text-ink-600 transition-colors hover:text-ink-950"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-600 transition-transform duration-300 group-hover:scale-x-100"
                  />
                </NavItemLink>
              </li>
            ),
          )}
        </ul>

        <div className="hidden lg:block">
          <Button href={siteConfig.cta.href} size="sm">
            {siteConfig.cta.label}
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls={MENU_ID}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink-800 transition-colors hover:bg-ink-100 lg:hidden"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      {/*
        `inert` remove a subárvore do teclado E da árvore de acessibilidade
        enquanto o menu está fechado. O tabIndex={-1} explícito nos filhos é o
        fallback para navegadores sem suporte a `inert`.
      */}
      <div
        id={MENU_ID}
        ref={menuRef}
        inert={!open}
        className={cn(
          "border-ink-100 bg-white transition-all duration-300 ease-out lg:hidden",
          open
            ? "max-h-[calc(100dvh-4rem)] overflow-y-auto border-t"
            : "max-h-0 overflow-hidden",
        )}
      >
        <div className="px-5 pb-8 pt-4 sm:px-6">
          <ul className="divide-y divide-ink-100">
            {siteConfig.nav.map((item) =>
              item.href === "/servicos" ? (
                <li key={item.href}>
                  <button
                    type="button"
                    tabIndex={tab}
                    aria-expanded={servicesOpen}
                    aria-controls="menu-servicos-mobile"
                    onClick={() => setServicesOpen((current) => !current)}
                    className="flex w-full items-center justify-between py-4 text-base font-medium text-ink-800 transition-colors hover:text-brand-700"
                  >
                    Serviços
                    <ChevronRightIcon
                      aria-hidden="true"
                      className={cn(
                        "h-4 w-4 text-ink-400 transition-transform duration-200",
                        servicesOpen ? "rotate-90" : "rotate-0",
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {servicesOpen && (
                      <m.div
                        id="menu-servicos-mobile"
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-1 pb-4 pl-1">
                          {services.map((service) => {
                            const href = servicePath(service);
                            const isRoute = href.startsWith("/servicos");
                            const itemClass =
                              "block rounded-lg px-3 py-2.5 text-[15px] text-ink-600 transition-colors hover:bg-ink-50 hover:text-brand-700";

                            return (
                              <li key={service.id}>
                                {isRoute ? (
                                  <Link
                                    to={href}
                                    tabIndex={tab}
                                    onClick={close}
                                    className={itemClass}
                                  >
                                    {service.title}
                                  </Link>
                                ) : (
                                  <a
                                    href={href}
                                    tabIndex={tab}
                                    onClick={close}
                                    className={itemClass}
                                  >
                                    {service.title}
                                  </a>
                                )}
                              </li>
                            );
                          })}
                          <li>
                            <Link
                              to="/servicos"
                              tabIndex={tab}
                              onClick={close}
                              className="block rounded-lg px-3 py-2.5 text-[15px] font-semibold text-ink-900 transition-colors hover:bg-ink-50 hover:text-brand-700"
                            >
                              Ver todos os serviços
                            </Link>
                          </li>
                        </ul>
                      </m.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={item.href}>
                  <NavItemLink
                    href={item.href}
                    onClick={close}
                    tabIndex={tab}
                    className="flex items-center justify-between py-4 text-base font-medium text-ink-800 transition-colors hover:text-brand-700"
                  >
                    {item.label}
                    <span aria-hidden="true" className="text-ink-300">
                      →
                    </span>
                  </NavItemLink>
                </li>
              ),
            )}
          </ul>

          <div className="mt-6">
            <Button
              href={siteConfig.cta.href}
              onClick={close}
              tabIndex={tab}
              className="w-full"
              size="lg"
            >
              {siteConfig.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
