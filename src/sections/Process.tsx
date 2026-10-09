import { Core, type CorePose } from "../components/core/Core";
import { SectionIntro } from "../components/experience/SectionIntro";
import { useGsapScene } from "../components/motion/useGsapScene";
import { processSteps } from "../content/home";

/**
 * Pose do Core parado em cada etapa — ele vive o processo junto com o
 * cliente: recebe o contato, pensa, prepara a proposta, constrói e comemora.
 */
const POSES: CorePose[] = ["waving", "thinking", "working", "chart", "celebrating"];

const LAST = processSteps.length - 1;

/**
 * Processo em 5 etapas, do ponto de vista do cliente.
 *
 * DESKTOP — o Core passa de um ponto ao outro com o scroll:
 *  - a seção é mais alta que a tela e o palco usa `position: sticky` (nativo):
 *    a rolagem nunca é capturada nem bloqueada, e não existe pin-spacer;
 *  - o progresso do scroll dentro da seção define a etapa atual. Ao mudar de
 *    etapa, o Core desliza até o ponto seguinte num arco curto, a pose antiga
 *    sai e a da nova etapa entra na chegada, e a linha acompanha — rolar para
 *    trás faz o caminho de volta. Em cada ponto o Core fica parado na pose
 *    daquela etapa; o rótulo "Etapa X de 5" diz o mesmo em texto.
 *
 * TABLET/MOBILE — trilha vertical: o Core desce ao lado das etapas, trocando
 * de pose; cinco etapas nunca são espremidas numa linha.
 *
 * SEM JS / MOVIMENTO REDUZIDO — estado final completo: todas as etapas
 * acesas e o Core comemorando na entrega.
 *
 * Um ScrollTrigger por breakpoint. Tudo é revertido no unmount
 * (gsap.context + matchMedia).
 */
export function Process() {
  const ref = useGsapScene<HTMLElement>(({ q, gsap }) => {
    const steps = q("[data-process='step']");
    const nodes = q("[data-process='node']");
    const caption = q("[data-process='caption']");
    const counter = q("[data-process='counter']");
    let current = -1;

    const markSteps = (index: number) => {
      if (index === current) return false;
      current = index;
      steps.forEach((step, i) => {
        step.setAttribute("data-active", String(i <= index));
        step.setAttribute("data-current", String(i === index));
      });
      caption.forEach((node) => (node.textContent = processSteps[index].title));
      counter.forEach((node) => (node.textContent = `Etapa ${index + 1} de ${processSteps.length}`));
      return true;
    };

    const showPose = (poses: HTMLElement[], index: number | null) =>
      poses.forEach((pose) =>
        gsap.set(pose, { autoAlpha: pose.dataset.poseIndex === String(index) ? 1 : 0 }),
      );

    const mm = gsap.matchMedia();

    // ------------------------------------------- desktop: ponto a ponto
    mm.add("(min-width: 1024px)", () => {
      const stage = q("[data-process='stage']")[0];
      const track = q("[data-process='track']")[0];
      const runner = q("[data-process='runner-x']")[0];
      const hop = q("[data-process='hop']")[0];
      const fill = q("[data-process='fill-x']")[0];
      if (!stage || !track || !runner || !hop || !fill) return;

      const poses = Array.from(runner.querySelectorAll<HTMLElement>("[data-pose-index]"));

      // Centros dos nós medidos no refresh: o grid tem gap, fração fixa erraria.
      const geometry = { centers: [] as number[], width: 1 };
      const measure = () => {
        const base = track.getBoundingClientRect();
        geometry.centers = nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return rect.left + rect.width / 2 - base.left;
        });
        geometry.width = base.width || 1;
      };

      let at = -1;
      const goTo = (index: number, instant = false) => {
        if (index === at && !instant) return;
        at = index;
        const x = geometry.centers[index] ?? 0;
        const scaleX = x / geometry.width;
        if (instant) {
          gsap.set(runner, { x });
          gsap.set(fill, { scaleX });
          gsap.set(hop, { y: 0 });
          showPose(poses, index);
          return;
        }
        const move = { duration: 0.7, ease: "power2.inOut", overwrite: true } as const;
        gsap.to(runner, { x, ...move });
        gsap.to(fill, { scaleX, ...move });
        // Arco: sobe na saída e pousa no ponto.
        gsap.timeline({ overwrite: true } as gsap.TimelineVars)
          .to(hop, { y: -22, duration: 0.35, ease: "power2.out" })
          .to(hop, { y: 0, duration: 0.35, ease: "power2.in" });
        // Troca cruzada durante o arco: a pose antiga se desfaz enquanto a da
        // nova etapa aparece — sempre há um Core visível no caminho.
        poses.forEach((pose) => {
          const isNext = pose.dataset.poseIndex === String(index);
          gsap.to(pose, {
            autoAlpha: isNext ? 1 : 0,
            duration: 0.45,
            delay: isNext ? 0.2 : 0,
            ease: "power1.inOut",
            overwrite: true,
          });
        });
      };

      const stepAt = (p: number) => Math.min(LAST, Math.round(p * LAST));

      gsap.set(runner, { left: 0 });
      gsap.set(fill, { transformOrigin: "left center" });
      measure();
      current = -1;
      markSteps(0);
      goTo(0, true);

      const trigger = gsap.to({}, {
        scrollTrigger: {
          trigger: stage.parentElement,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = stepAt(self.progress);
            markSteps(index);
            goTo(index);
          },
          onRefresh: (self) => {
            measure();
            const index = stepAt(self.progress);
            markSteps(index);
            goTo(index, true);
          },
        },
      });

      return () => {
        trigger.kill();
        current = -1;
        at = -1;
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

  return (
    <section
      ref={ref}
      id="processo"
      aria-labelledby="process-title"
      className="relative scroll-mt-24 bg-night-900"
    >
      {/* Altura extra = percurso da corrida no desktop. O palco é sticky. */}
      <div className="relative lg:h-[230svh] motion-reduce:lg:h-auto">
        <div
          data-process="stage"
          className="relative overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center motion-reduce:lg:static motion-reduce:lg:h-auto"
        >
          {/* Única luz da seção: o chão por onde o Core corre. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute bottom-0 left-1/2 h-[24rem] w-[70rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-brand-700/[0.12] blur-[120px]" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <SectionIntro
                id="process-title"
                title="Como um projeto acontece."
                description="Cinco etapas, do primeiro contato até a solução no ar."
              />

              {/* Estado da corrida em texto: em que etapa o Core está. */}
              <div aria-hidden="true" className="hidden w-80 shrink-0 text-right lg:block">
                <p data-process="counter" className="text-sm tabular-nums text-brand-300">
                  Etapa {processSteps.length} de {processSteps.length}
                </p>
                <p data-process="caption" className="mt-1.5 font-display text-xl font-semibold tracking-[-0.02em] text-white">
                  {processSteps[LAST].title}
                </p>
              </div>
            </div>

            {/* Trilha horizontal (desktop): linha, preenchimento e o Core. */}
            <div data-process="track" aria-hidden="true" className="relative mt-10 hidden h-44 lg:block">
              <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
              <div
                data-process="fill-x"
                className="absolute bottom-0 left-0 h-px w-full bg-brand-400"
                style={{ transform: "scaleX(0.81)", transformOrigin: "left center" }}
              />
              <div
                data-process="runner-x"
                className="absolute bottom-0 left-[81%] w-44 -translate-x-1/2"
              >
                {/* Os pés tocam a linha: base do palco do Core = base da trilha. */}
                <div data-process="hop" className="relative mx-auto h-40 w-44">
                  {poseStack()}
                </div>
                <div className="absolute -bottom-1.5 left-1/2 h-3 w-20 -translate-x-1/2 rounded-[100%] bg-brand-500/50 blur-md" />
              </div>
            </div>

            <div data-process="list" className="relative mt-16 lg:mt-0">
              {/* Trilha vertical (tablet/mobile), alinhada aos nós. */}
              <div aria-hidden="true" className="absolute bottom-0 left-[0.6rem] top-2 w-px bg-white/10 lg:hidden">
                <div
                  data-process="fill-y"
                  className="h-full w-px origin-top bg-brand-400"
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
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20 transition-all duration-500 group-data-[active=true]:bg-brand-300 group-data-[current=true]:scale-150" />
                    </span>
                    <p className="font-mono text-xs text-ink-500 transition-colors duration-500 group-data-[active=true]:text-brand-400">
                      {step.number}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-[-0.02em] text-ink-400 transition-colors duration-500 group-data-[active=true]:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-400 transition-colors duration-500 group-data-[active=true]:text-ink-300">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
