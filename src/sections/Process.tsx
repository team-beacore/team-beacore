import { Core, type CorePose } from "../components/core/Core";
import { SectionIntro } from "../components/experience/SectionIntro";
import { useGsapScene } from "../components/motion/useGsapScene";
import { processSteps } from "../content/home";

/**
 * Pose do Core parado em cada etapa — ele vive o processo junto com o
 * cliente: recebe o contato, pensa, prepara a proposta, constrói e comemora.
 */
const POSES: CorePose[] = ["waving", "thinking", "working", "laptop", "celebrating"];

const LAST = processSteps.length - 1;

/** Sprite strips oficiais (quadros alinhados pelos pés, células uniformes). */
const RUN = { src: "/core/core-run.webp", frames: 10, ratio: 248 / 284 };
const CELEBRATE = { src: "/core/core-celebrate.webp", frames: 10, ratio: 332 / 344 };
/** Passadas ao longo da trilha inteira (define o ritmo da corrida). */
const STRIDES = 9;

/**
 * Processo em 5 etapas, do ponto de vista do cliente.
 *
 * DESKTOP — o Core corre com o scroll:
 *  - a seção é mais alta que a tela e o palco usa `position: sticky` (nativo):
 *    a rolagem nunca é capturada nem bloqueada, e não existe pin-spacer;
 *  - o progresso (0 → 100%) é o scroll real dentro da seção (ScrollTrigger
 *    com scrub). Ele move o Core pela trilha, preenche a linha e acende a etapa;
 *  - os quadros da corrida avançam com a DISTÂNCIA percorrida (rolar para
 *    trás anima ao contrário). Parou de rolar → o Core mostra a pose da etapa
 *    atual. Chegou a 100% → toca a comemoração uma vez e fica comemorando.
 *
 * TABLET/MOBILE — trilha vertical: o Core desce ao lado das etapas, trocando
 * de pose; cinco etapas nunca são espremidas numa linha.
 *
 * SEM JS / MOVIMENTO REDUZIDO — estado final completo: todas as etapas
 * acesas e o Core comemorando na entrega.
 *
 * Um timeline com scrub por breakpoint; um único delayedCall reutilizado para
 * detectar a parada. Tudo é revertido no unmount (gsap.context + matchMedia).
 */
export function Process() {
  const ref = useGsapScene<HTMLElement>(({ q, gsap }) => {
    const steps = q("[data-process='step']");
    const nodes = q("[data-process='node']");
    const percent = q("[data-process='percent']");
    const caption = q("[data-process='caption']");
    let current = -1;

    const markSteps = (index: number) => {
      if (index === current) return false;
      current = index;
      steps.forEach((step, i) => {
        step.setAttribute("data-active", String(i <= index));
        step.setAttribute("data-current", String(i === index));
      });
      caption.forEach((node) => (node.textContent = processSteps[index].title));
      return true;
    };

    const writePercent = (progress: number) => {
      const value = `${Math.round(progress * 100)}%`;
      percent.forEach((node) => (node.textContent = value));
    };

    const showPose = (poses: HTMLElement[], index: number | null) =>
      poses.forEach((pose) =>
        gsap.set(pose, { autoAlpha: pose.dataset.poseIndex === String(index) ? 1 : 0 }),
      );

    const mm = gsap.matchMedia();

    // ------------------------------------------------- desktop: corrida
    mm.add("(min-width: 1024px)", () => {
      const stage = q("[data-process='stage']")[0];
      const track = q("[data-process='track']")[0];
      const runner = q("[data-process='runner-x']")[0];
      const fill = q("[data-process='fill-x']")[0];
      if (!stage || !track || !runner || !fill) return;

      const poses = Array.from(runner.querySelectorAll<HTMLElement>("[data-pose-index]"));
      const run = runner.querySelector<HTMLElement>("[data-process='run']");
      const party = runner.querySelector<HTMLElement>("[data-process='party']");
      if (!run || !party) return;

      // Centros dos nós medidos no refresh: o grid tem gap, fração fixa erraria.
      const geometry = { start: 0, end: 0, width: 1 };
      const measure = () => {
        const base = track.getBoundingClientRect();
        const center = (node: HTMLElement) => {
          const rect = node.getBoundingClientRect();
          return rect.left + rect.width / 2 - base.left;
        };
        geometry.start = center(nodes[0]);
        geometry.end = center(nodes[nodes.length - 1]);
        geometry.width = base.width || 1;
      };

      type Mode = "idle" | "run" | "party" | "done";
      let mode: Mode | null = null;
      const setFrame = (el: HTMLElement, frame: number, total: number) =>
        gsap.set(el, { backgroundPositionX: `${(frame / (total - 1)) * 100}%` });

      const show = (next: Mode) => {
        if (next === mode) return;
        mode = next;
        gsap.set(run, { autoAlpha: next === "run" ? 1 : 0 });
        gsap.set(party, { autoAlpha: next === "party" ? 1 : 0 });
        if (next === "idle") showPose(poses, current);
        else if (next === "done") showPose(poses, LAST);
        else showPose(poses, null);
      };

      // Comemoração: duas voltas pelos quadros, depois a pose final.
      const partyState = { f: 0 };
      const partyTween = gsap.to(partyState, {
        f: CELEBRATE.frames * 2 - 1,
        duration: 1.4,
        ease: "none",
        paused: true,
        onUpdate: () =>
          setFrame(party, Math.floor(partyState.f) % CELEBRATE.frames, CELEBRATE.frames),
        onComplete: () => show("done"),
      });

      // Parou de rolar: um único delayedCall, reiniciado a cada atualização.
      const settle = gsap
        .delayedCall(0.18, () => {
          if (mode === "run") show("idle");
        })
        .pause();

      const state = { p: 0 };
      let lastP = 0;
      const apply = (moving: boolean) => {
        const p = state.p;
        const x = geometry.start + p * (geometry.end - geometry.start);
        gsap.set(runner, { x });
        gsap.set(fill, { scaleX: x / geometry.width });
        writePercent(p);
        const changed = markSteps(Math.min(LAST, Math.floor(p * LAST + 0.18)));

        if (p >= 0.995) {
          if (mode !== "party" && mode !== "done") {
            show("party");
            partyTween.restart();
          }
          settle.pause();
          return;
        }
        if (mode === "party" || mode === "done") partyTween.pause();
        if (moving) {
          show("run");
          setFrame(run, Math.floor(p * STRIDES * RUN.frames) % RUN.frames, RUN.frames);
          settle.restart(true);
        } else if (mode !== "run") {
          // Parado (ou acabou de voltar da comemoração): pose da etapa.
          mode = null;
          show("idle");
        } else if (changed) {
          showPose(poses, null);
        }
      };

      gsap.set(runner, { left: 0 });
      gsap.set(fill, { transformOrigin: "left center" });
      measure();
      current = -1;
      apply(false);

      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => {
          const moving = Math.abs(state.p - lastP) > 0.0004;
          lastP = state.p;
          apply(moving);
        },
        scrollTrigger: {
          trigger: stage.parentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            apply(false);
          },
        },
      });

      return () => {
        partyTween.kill();
        settle.kill();
        current = -1;
      };
    });

    // ------------------------------------- tablet/mobile: trilha vertical
    mm.add("(max-width: 1023px)", () => {
      const runner = q("[data-process='runner-y']")[0];
      const fill = q("[data-process='fill-y']")[0];
      const list = q("[data-process='list']")[0];
      if (!runner || !fill || !list) return;
      const poses = Array.from(runner.querySelectorAll<HTMLElement>("[data-pose-index]"));
      const bounce = runner.querySelector<HTMLElement>("[data-process='bounce']");

      // Posições relativas à lista (offsetTop seria relativo a cada <li>).
      const geometry = { first: 0, span: 1, line: 1 };
      const measure = () => {
        const base = list.getBoundingClientRect().top;
        const center = (node: HTMLElement) => {
          const rect = node.getBoundingClientRect();
          return rect.top + rect.height / 2 - base;
        };
        geometry.first = center(nodes[0]);
        geometry.span = center(nodes[nodes.length - 1]) - geometry.first || 1;
        geometry.line = fill.parentElement?.offsetHeight || 1;
        gsap.set(runner, { top: geometry.first });
      };

      const state = { p: 0 };
      const apply = () => {
        gsap.set(runner, { y: state.p * geometry.span });
        gsap.set(fill, { scaleY: (state.p * geometry.span) / geometry.line });
        writePercent(state.p);
        const before = current;
        if (markSteps(Math.min(LAST, Math.floor(state.p * LAST + 0.12)))) {
          showPose(poses, current);
          if (current === LAST && before !== -1 && bounce) {
            gsap.fromTo(
              bounce,
              { y: 0 },
              { y: -10, duration: 0.24, yoyo: true, repeat: 3, ease: "power2.out" },
            );
          }
        }
      };

      // Sai da posição estática (junto à "Entrega") para o nó 01.
      gsap.set(runner, { bottom: "auto", yPercent: -92 });
      gsap.set(fill, { transformOrigin: "top center" });
      measure();
      current = -1;
      apply();

      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: apply,
        scrollTrigger: {
          trigger: list,
          start: "top 62%",
          end: "bottom 70%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            apply();
          },
        },
      });

      return () => {
        current = -1;
      };
    });

    return () => mm.revert();
  });

  const poseStack = () =>
    POSES.map((pose, index) => (
      <span
        key={pose}
        data-pose-index={index}
        className="absolute inset-0 flex items-end justify-center"
        style={{ opacity: index === LAST ? 1 : 0 }}
      >
        <Core pose={pose} className="max-h-full w-auto max-w-full object-contain object-bottom" />
      </span>
    ));

  const sprite = (kind: "run" | "party", sheet: typeof RUN) => (
    <span
      data-process={kind}
      aria-hidden="true"
      className="absolute bottom-0 left-1/2 h-full -translate-x-1/2 bg-no-repeat"
      style={{
        opacity: 0,
        visibility: "hidden",
        aspectRatio: String(sheet.ratio),
        backgroundImage: `url(${sheet.src})`,
        backgroundSize: `${sheet.frames * 100}% 100%`,
        backgroundPosition: "0% 0%",
      }}
    />
  );

  return (
    <section
      ref={ref}
      id="processo"
      aria-labelledby="process-title"
      className="relative scroll-mt-24 bg-night-900"
    >
      <div aria-hidden="true" className="hairline absolute inset-x-0 top-0 h-px" />

      {/* Altura extra = percurso da corrida no desktop. O palco é sticky. */}
      <div className="relative lg:h-[230svh] motion-reduce:lg:h-auto">
        <div
          data-process="stage"
          className="relative overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center motion-reduce:lg:static motion-reduce:lg:h-auto"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute bottom-0 left-1/2 h-[28rem] w-[70rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-brand-700/[0.14] blur-[120px]" />
            <div className="absolute inset-0 bg-grid-dark opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_100%,black,transparent)]" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <SectionIntro
                index="07"
                eyebrow="Processo"
                id="process-title"
                title="Como um projeto acontece."
                description="Cinco etapas, do primeiro contato até a solução no ar."
              />

              <div aria-hidden="true" className="hidden text-right lg:block">
                <p
                  data-process="percent"
                  className="font-display text-7xl font-semibold tabular-nums tracking-[-0.06em] text-white"
                >
                  100%
                </p>
                <p className="label-mono mt-2 text-[10px] text-brand-400">
                  <span data-process="caption">{processSteps[LAST].title}</span>
                </p>
              </div>
            </div>

            {/* Trilha horizontal (desktop): linha, preenchimento e o Core. */}
            <div data-process="track" aria-hidden="true" className="relative mt-10 hidden h-44 lg:block">
              <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
              <div
                data-process="fill-x"
                className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-brand-500 to-brand-300 shadow-[0_0_12px_rgb(47_114_255/0.8)]"
                style={{ transform: "scaleX(0.81)", transformOrigin: "left center" }}
              />
              <div
                data-process="runner-x"
                className="absolute bottom-0 left-[81%] w-36 -translate-x-1/2"
              >
                {/* Os pés tocam a linha: base do palco do Core = base da trilha. */}
                <div className="relative mx-auto h-40 w-36">
                  {poseStack()}
                  {sprite("run", RUN)}
                  {sprite("party", CELEBRATE)}
                </div>
                <div className="absolute -bottom-1.5 left-1/2 h-3 w-20 -translate-x-1/2 rounded-[100%] bg-brand-500/50 blur-md" />
              </div>
            </div>

            <div data-process="list" className="relative mt-16 lg:mt-0">
              {/* Trilha vertical (tablet/mobile), alinhada aos nós. */}
              <div aria-hidden="true" className="absolute bottom-0 left-[0.6rem] top-2 w-px bg-white/10 lg:hidden">
                <div
                  data-process="fill-y"
                  className="h-full w-px origin-top bg-gradient-to-b from-brand-500 to-brand-300 shadow-[0_0_10px_rgb(47_114_255/0.8)]"
                />
              </div>

              <ol className="space-y-12 pl-12 sm:pl-14 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-y-0 lg:pl-0">
                {processSteps.map((step, index) => (
                  <li
                    key={step.number}
                    data-process="step"
                    data-active="true"
                    data-current={index === LAST ? "true" : "false"}
                    className="group relative lg:pt-8"
                  >
                    <span
                      data-process="node"
                      aria-hidden="true"
                      className="absolute -left-12 top-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-night-900 transition-colors duration-500 group-data-[active=true]:border-brand-400 sm:-left-14 lg:-top-2.5 lg:left-0"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20 transition-all duration-500 group-data-[active=true]:bg-brand-300 group-data-[current=true]:shadow-[0_0_12px_3px_rgb(47_114_255/0.8)]" />
                    </span>
                    <p className="font-mono text-xs text-ink-600 transition-colors duration-500 group-data-[active=true]:text-brand-400">
                      {step.number}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-[-0.02em] text-ink-400 transition-colors duration-500 group-data-[active=true]:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-500 transition-colors duration-500 group-data-[active=true]:text-ink-300">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>

              {/* Core na trilha vertical: começa no nó 01 e desce até a entrega. */}
              <div
                data-process="runner-y"
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-3 -left-3 z-10 w-11 lg:hidden"
              >
                <div data-process="bounce" className="relative h-16 w-11">
                  {poseStack()}
                </div>
              </div>

              <p className="mt-12 flex items-center gap-3 pl-12 sm:pl-14 lg:pl-0" aria-hidden="true">
                <span className="hidden h-px w-10 bg-brand-400 lg:block" />
                <span className="label-mono text-[10px] text-ink-400">
                  <span data-process="percent" className="text-white lg:hidden">
                    100%
                  </span>
                  <span className="lg:hidden"> · </span>
                  Entrega — solução no ar
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
