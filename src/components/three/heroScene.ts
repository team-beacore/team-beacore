import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  EdgesGeometry,
  Euler,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  Quaternion,
  Raycaster,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * Cena 3D do Hero — "o núcleo".
 *
 * Conceito: um ponto de luz (a IDEIA) no centro. Fragmentos dispersos se
 * organizam ao redor dele (ESTRATÉGIA), ganham forma e ordem (DESIGN), módulos
 * se acendem e dados passam a circular (TECNOLOGIA) e uma moldura fecha a
 * estrutura (RESULTADO). Nada literal — só geometria, luz e movimento.
 *
 * Este módulo não conhece React: recebe um canvas, devolve um controlador.
 * É carregado via `import()` depois da primeira pintura, então nada aqui pesa
 * no bundle inicial nem no LCP (o headline do Hero).
 */

export type HeroSceneOptions = {
  canvas: HTMLCanvasElement;
  /** Telas compactas: menos peças, sem antialias, DPR menor. */
  compact: boolean;
  /** prefers-reduced-motion: renderiza um quadro montado e para. */
  reducedMotion: boolean;
  /** Avisado quando a narrativa muda de etapa (0–4). */
  onStage?: (stage: number) => void;
  /** Arte oficial do Core para integrar à cena (imagem com transparência). */
  coreSrc?: string;
  /** Core carregado e visível na cena (o HTML pode sair). */
  onCoreReady?: () => void;
  /** Posição (px, relativa ao canvas) acima da cabeça do Core, quando muda. */
  onCoreAnchor?: (x: number, y: number, opacity: number) => void;
};

export type HeroSceneController = {
  /** Ponteiro normalizado, -1..1 nos dois eixos. */
  setPointer: (x: number, y: number) => void;
  /** Progresso do scroll dentro do Hero, 0..1. */
  setScroll: (progress: number) => void;
  setActive: (active: boolean) => void;
  /** Ponteiro sobre o canvas em coordenadas NDC (-1..1), ou null ao sair. */
  setHover: (x: number | null, y?: number) => void;
  /** Onda que atravessa a estrutura a partir do módulo sob o cursor. */
  pulse: () => void;
  resize: () => void;
  dispose: () => void;
};

/** Limiares de progresso de cada etapa narrativa. */
export const STAGE_THRESHOLDS = [0, 0.18, 0.42, 0.66, 0.9] as const;

const BRAND = new Color("#2f72ff");
const BRAND_SOFT = new Color("#8ebcff");

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Brilho radial reutilizado no "piso" e no halo do núcleo. */
function radialTexture(inner: string, outer: string): CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, outer);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

type Piece = {
  target: Vector3;
  scatter: Vector3;
  scatterRotation: Quaternion;
  delay: number;
  phase: number;
  accent: boolean;
  /** 0..1 — realce quando o cursor está sobre o módulo. */
  hover: number;
};

export function createHeroScene({
  canvas,
  compact,
  reducedMotion,
  onStage,
  coreSrc,
  onCoreReady,
  onCoreAnchor,
}: HeroSceneOptions): HeroSceneController {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: !compact,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  pmrem.dispose();

  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.35, compact ? 11.5 : 10.2);

  // ---------------------------------------------------------------- estrutura
  const root = new Group();
  const structure = new Group();
  root.add(structure);
  scene.add(root);

  const grid = compact ? 3 : 4;
  const cubeSize = compact ? 0.56 : 0.44;
  const spacing = cubeSize * 1.18;
  const half = ((grid - 1) * spacing) / 2;

  const pieces: Piece[] = [];
  for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
      for (let z = 0; z < grid; z++) {
        const target = new Vector3(x * spacing - half, y * spacing - half, z * spacing - half);
        const direction = target.clone().add(new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5));
        if (direction.lengthSq() < 0.01) direction.set(0, 1, 0);
        direction.normalize();
        const scatter = direction.multiplyScalar(3.2 + Math.random() * 2.8);
        scatter.y *= 0.7;
        const scatterRotation = new Quaternion().setFromEuler(
          new Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        );
        // Do centro para fora: a ideia cresce até virar estrutura.
        const delay = target.length() / (half * Math.sqrt(3) || 1);
        pieces.push({
          target,
          scatter,
          scatterRotation,
          delay,
          phase: Math.random() * Math.PI * 2,
          accent: false,
          hover: 0,
        });
      }
    }
  }

  // Poucas peças acesas — o azul como ponto de luz, não como cor da cena.
  const accentCount = compact ? 3 : 6;
  const shuffled = [...pieces].sort(() => Math.random() - 0.5);
  shuffled.slice(0, accentCount).forEach((piece) => (piece.accent = true));

  const darkPieces = pieces.filter((piece) => !piece.accent);
  const accentPieces = pieces.filter((piece) => piece.accent);

  const cubeGeometry = new RoundedBoxGeometry(cubeSize, cubeSize, cubeSize, compact ? 2 : 3, cubeSize * 0.16);

  const darkMaterial = new MeshPhysicalMaterial({
    color: new Color("#11141d"),
    metalness: 0.35,
    roughness: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    envMapIntensity: 0.9,
  });
  const accentMaterial = new MeshStandardMaterial({
    color: new Color("#0a1022"),
    emissive: BRAND,
    emissiveIntensity: 0,
    metalness: 0.2,
    roughness: 0.3,
  });

  const darkMesh = new InstancedMesh(cubeGeometry, darkMaterial, darkPieces.length);
  const accentMesh = new InstancedMesh(cubeGeometry, accentMaterial, accentPieces.length);
  structure.add(darkMesh, accentMesh);

  // Núcleo: a ideia.
  const coreGeometry = new IcosahedronGeometry(compact ? 0.3 : 0.26, 3);
  const coreMaterial = new MeshBasicMaterial({ color: new Color("#dbe8ff") });
  const core = new Mesh(coreGeometry, coreMaterial);
  structure.add(core);

  const haloTexture = radialTexture("rgba(120,165,255,0.85)", "rgba(47,114,255,0)");
  const haloMaterial = new MeshBasicMaterial({
    map: haloTexture,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const halo = new Mesh(new PlaneGeometry(2.6, 2.6), haloMaterial);
  structure.add(halo);

  const coreLight = new PointLight(BRAND_SOFT, 18, 9, 1.6);
  structure.add(coreLight);

  // Luz que acompanha o cursor.
  const cursorLight = new PointLight(new Color("#cfe0ff"), 22, 14, 1.4);
  cursorLight.position.set(2.5, 2, 4);
  scene.add(cursorLight);

  // Moldura: o resultado fecha a estrutura.
  const cageSize = grid * spacing + cubeSize * 0.9;
  const cageGeometry = new EdgesGeometry(new BoxGeometry(cageSize, cageSize, cageSize));
  const cageMaterial = new LineBasicMaterial({ color: BRAND_SOFT, transparent: true, opacity: 0 });
  const cage = new LineSegments(cageGeometry, cageMaterial);
  structure.add(cage);

  // Órbita de dados: tecnologia em circulação.
  const orbitRadius = cageSize * 0.95;
  const orbitPoints: number[] = [];
  const ORBIT_SEGMENTS = 128;
  for (let i = 0; i < ORBIT_SEGMENTS; i++) {
    const a = (i / ORBIT_SEGMENTS) * Math.PI * 2;
    orbitPoints.push(Math.cos(a) * orbitRadius, 0, Math.sin(a) * orbitRadius);
  }
  const orbitGeometry = new BufferGeometry();
  orbitGeometry.setAttribute("position", new BufferAttribute(new Float32Array(orbitPoints), 3));
  const orbitMaterial = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
  const orbit = new LineLoop(orbitGeometry, orbitMaterial);
  const orbitGroup = new Group();
  orbitGroup.rotation.set(0.42, 0, -0.18);
  orbitGroup.add(orbit);

  const packetCount = 3;
  const packetGeometry = new BufferGeometry();
  packetGeometry.setAttribute("position", new BufferAttribute(new Float32Array(packetCount * 3), 3));
  const packetMaterial = new PointsMaterial({
    color: BRAND_SOFT,
    size: compact ? 0.14 : 0.11,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: AdditiveBlending,
    map: haloTexture,
  });
  const packets = new Points(packetGeometry, packetMaterial);
  orbitGroup.add(packets);
  root.add(orbitGroup);

  // Partículas de ambiente: poucas, lentas, discretas.
  const dustCount = compact ? 70 : 180;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustSpeed = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 12;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 7;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    dustSpeed[i] = 0.05 + Math.random() * 0.12;
  }
  const dustGeometry = new BufferGeometry();
  dustGeometry.setAttribute("position", new BufferAttribute(dustPositions, 3));
  const dustMaterial = new PointsMaterial({
    color: BRAND_SOFT,
    size: 0.03,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const dust = new Points(dustGeometry, dustMaterial);
  scene.add(dust);

  // Piso de luz sob a estrutura (é onde o Core "pisa" no layout).
  const floorTexture = radialTexture("rgba(47,114,255,0.55)", "rgba(10,20,60,0)");
  const floorMaterial = new MeshBasicMaterial({
    map: floorTexture,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    opacity: 0.6,
  });
  const floor = new Mesh(new PlaneGeometry(7, 7), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -cageSize * 0.95;
  root.add(floor);

  // ------------------------------------------------------- Core na cena
  // A arte oficial vira um plano dentro da cena: ganha paralaxe real com a
  // câmera e profundidade em relação à estrutura. MeshBasic + toneMapped:false
  // preservam as cores exatas do personagem (nenhuma luz o altera).
  const coreGroup = new Group();
  const coreHeight = compact ? 1.45 : 1.7;
  // x: fora da faixa em que o canvas esmaece à esquerda — o Core de moletom
  // preto sumia no fundo quando ficava dentro dela.
  coreGroup.position.set(compact ? -1.35 : -2.1, floor.position.y + 0.35, 1.6);
  root.add(coreGroup);
  const coreShadowMaterial = new MeshBasicMaterial({
    map: floorTexture,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    opacity: 0,
  });
  const coreShadow = new Mesh(new PlaneGeometry(1.7, 1.7), coreShadowMaterial);
  coreShadow.rotation.x = -Math.PI / 2;
  coreShadow.position.y = 0.01;
  coreGroup.add(coreShadow);
  let coreMesh: Mesh<PlaneGeometry, MeshBasicMaterial> | null = null;
  const coreAnchor = new Vector3();
  let anchorX = -1;
  let anchorY = -1;
  let anchorOpacity = -1;
  if (coreSrc) {
    new TextureLoader().load(
      coreSrc,
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        const image = texture.image as { width: number; height: number };
        const geometry = new PlaneGeometry((coreHeight * image.width) / image.height, coreHeight);
        geometry.translate(0, coreHeight / 2, 0);
        coreMesh = new Mesh(
          geometry,
          new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }),
        );
        coreMesh.renderOrder = 10;
        coreGroup.add(coreMesh);
        coreShadowMaterial.opacity = 0.75;
        onCoreReady?.();
        if (!running) render(performance.now());
      },
      undefined,
      () => {
        // Sem a arte, o Core continua no HTML (quem usa a cena decide).
      },
    );
  }

  // ---------------------------------------------------- interação 3D
  const raycaster = new Raycaster();
  const hoverNdc = new Vector2();
  let hovering = false;
  let hoverDirty = false;
  let hoveredPiece: Piece | null = null;
  let rippleStart = -1;
  let rippleOrigin = new Vector3();

  // ------------------------------------------------------------------ estado
  const dummy = new Object3D();
  const identity = new Quaternion();
  const tmpQuat = new Quaternion();
  const tmpVec = new Vector3();
  const pointerWorld = new Vector3();
  const matrix = new Matrix4();

  let width = 1;
  let height = 1;
  let progress = reducedMotion ? 1 : 0;
  const introStart = performance.now();
  const INTRO_MS = 3600;
  let scrollTarget = 0;
  let scroll = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };
  let stage = -1;
  let running = false;
  let frame = 0;
  let disposed = false;
  let last = performance.now();
  let elapsed = 0;
  let degraded = false;
  let sampleFrames = 0;
  let sampleTime = 0;

  function emitStage(next: number) {
    if (next !== stage) {
      stage = next;
      onStage?.(next);
    }
  }

  function stageFor(p: number): number {
    let s = 0;
    STAGE_THRESHOLDS.forEach((threshold, index) => {
      if (p >= threshold) s = index;
    });
    return s;
  }

  function layout(time: number) {
    const spread = 1 + scroll * 0.35;
    // Transição para a próxima seção: a estrutura se desmonta com o scroll.
    const explode = scroll * scroll * 0.55;
    const rippleTime = rippleStart < 0 ? -1 : (time - rippleStart) / 1000;
    if (rippleTime > 2.5) rippleStart = -1;
    const assembleWindow = 0.55;

    let darkIndex = 0;
    let accentIndex = 0;

    for (const piece of pieces) {
      // Cada peça chega em seu tempo: centro primeiro, bordas por último.
      const start = 0.12 + piece.delay * 0.4;
      const local = easeInOut(clamp01((progress - start) / assembleWindow));

      tmpVec.copy(piece.target).multiplyScalar(spread).lerp(piece.scatter, explode);
      dummy.position.lerpVectors(piece.scatter, tmpVec, local);

      // Realce do módulo sob o cursor e onda do clique: deslocam para fora.
      piece.hover += ((piece === hoveredPiece ? 1 : 0) - piece.hover) * 0.18;
      let outward = piece.hover * 0.34;
      if (rippleTime >= 0) {
        const distance = piece.target.distanceTo(rippleOrigin);
        const front = rippleTime * 4.2;
        outward += Math.exp(-((distance - front) ** 2) / 0.18) * Math.exp(-rippleTime * 1.3) * 0.45;
      }
      if (outward > 0.001) {
        tmpVec.copy(piece.target);
        if (tmpVec.lengthSq() < 0.0001) tmpVec.set(0, 0, 1);
        dummy.position.addScaledVector(tmpVec.normalize(), outward * local);
      }

      // Respiração sutil depois de montado.
      const breathe = reducedMotion ? 0 : Math.sin(time * 0.0011 + piece.phase) * 0.025 * local;
      dummy.position.y += breathe;

      // Atração magnética discreta em direção oposta ao cursor.
      if (pointer.active && !reducedMotion) {
        const dx = dummy.position.x - pointerWorld.x;
        const dy = dummy.position.y - pointerWorld.y;
        const distance = Math.hypot(dx, dy);
        const reach = 1.6;
        if (distance < reach) {
          const push = (1 - distance / reach) * 0.22 * local;
          dummy.position.x += (dx / (distance || 1)) * push;
          dummy.position.y += (dy / (distance || 1)) * push;
          dummy.position.z += push * 0.6;
        }
      }

      tmpQuat.copy(piece.scatterRotation).slerp(identity, local);
      dummy.quaternion.copy(tmpQuat);
      dummy.scale.setScalar((0.35 + 0.65 * local) * (1 + piece.hover * 0.1));
      dummy.updateMatrix();
      matrix.copy(dummy.matrix);

      if (piece.accent) accentMesh.setMatrixAt(accentIndex++, matrix);
      else darkMesh.setMatrixAt(darkIndex++, matrix);
    }

    darkMesh.instanceMatrix.needsUpdate = true;
    accentMesh.instanceMatrix.needsUpdate = true;
    // Bounding spheres desatualizadas fariam o raycast ignorar os módulos.
    darkMesh.boundingSphere = null;
    accentMesh.boundingSphere = null;

    // Core: respira levemente e sai de cena junto com a estrutura.
    if (coreMesh) {
      coreGroup.position.y = floor.position.y + 0.35 + (reducedMotion ? 0 : Math.sin(time * 0.0021) * 0.035);
      coreMesh.quaternion.copy(camera.quaternion);
      const fade = clamp01(1 - scroll * 2.2);
      coreMesh.material.opacity = fade;
      coreShadowMaterial.opacity = 0.75 * fade;
      if (onCoreAnchor) {
        coreAnchor.set(0, coreHeight * 1.02, 0);
        coreMesh.localToWorld(coreAnchor);
        coreAnchor.project(camera);
        const x = (coreAnchor.x * 0.5 + 0.5) * width;
        const y = (-coreAnchor.y * 0.5 + 0.5) * height;
        if (Math.abs(x - anchorX) > 0.5 || Math.abs(y - anchorY) > 0.5 || Math.abs(fade - anchorOpacity) > 0.01) {
          anchorX = x;
          anchorY = y;
          anchorOpacity = fade;
          onCoreAnchor(x, y, fade);
        }
      }
    }

    // Tecnologia: módulos acendem.
    const tech = easeOut(clamp01((progress - STAGE_THRESHOLDS[3]) / 0.2));
    const rippleGlow = rippleTime >= 0 ? Math.exp(-rippleTime * 2) * 0.9 : 0;
    accentMaterial.emissiveIntensity =
      tech * (0.75 + (reducedMotion ? 0 : Math.sin(time * 0.002) * 0.18)) + rippleGlow;
    orbitMaterial.opacity = tech * 0.14;
    packetMaterial.opacity = tech * 0.95;

    // Resultado: a moldura se fecha.
    const result = easeOut(clamp01((progress - STAGE_THRESHOLDS[4]) / 0.1));
    cageMaterial.opacity = result * 0.22;
    cage.scale.setScalar((1 + (1 - result) * 0.25) * spread);

    // Ideia: forte quando sozinha, recolhida quando a estrutura a envolve.
    const ideaPulse = reducedMotion ? 1 : 1 + Math.sin(time * 0.003) * 0.06;
    core.scale.setScalar((1.25 - 0.45 * clamp01(progress * 1.4)) * ideaPulse);
    haloMaterial.opacity = 0.95 - progress * 0.45;
    halo.quaternion.copy(camera.quaternion);
    coreLight.intensity = 10 + tech * 14;

    // Pacotes de dados na órbita.
    const positions = packetGeometry.attributes.position as BufferAttribute;
    for (let i = 0; i < packetCount; i++) {
      const a = time * 0.0006 + (i / packetCount) * Math.PI * 2;
      positions.setXYZ(i, Math.cos(a) * orbitRadius, 0, Math.sin(a) * orbitRadius);
    }
    positions.needsUpdate = true;
  }

  function render(time: number) {
    layout(time);
    renderer.render(scene, camera);
  }

  function tick(now: number) {
    if (!running || disposed) return;
    frame = requestAnimationFrame(tick);

    const rawDelta = now - last;
    const delta = Math.min(64, rawDelta);
    last = now;
    elapsed += delta;

    // Qualidade adaptativa: se o aparelho não sustenta a cena nos primeiros
    // segundos, cai para DPR 1 e congela as partículas — uma vez só.
    if (!degraded) {
      sampleFrames++;
      sampleTime += rawDelta;
      if (sampleFrames === 90) {
        if (sampleTime / sampleFrames > 30) {
          degraded = true;
          renderer.setPixelRatio(1);
          resize();
        }
        sampleFrames = 0;
        sampleTime = 0;
      }
    }

    if (!reducedMotion) {
      progress = clamp01((now - introStart) / INTRO_MS);
    }
    emitStage(stageFor(progress));

    // Amortecimentos: nada salta, tudo chega.
    const damp = 1 - Math.pow(0.0025, delta / 1000);
    pointer.x += (pointer.tx - pointer.x) * damp;
    pointer.y += (pointer.ty - pointer.y) * damp;
    scroll += (scrollTarget - scroll) * damp;

    const idle = elapsed * 0.00012;
    structure.rotation.y = idle + pointer.x * 0.45 + scroll * 0.9 + 0.62;
    structure.rotation.x = 0.32 - pointer.y * 0.22 + scroll * 0.25;
    root.position.y = scroll * 1.1;
    orbitGroup.rotation.y = elapsed * 0.00009;

    // Câmera discreta: acompanha o cursor e dá paralaxe entre Core e estrutura.
    camera.position.x = pointer.x * 0.75;
    camera.position.y = 0.35 - pointer.y * 0.4;
    camera.lookAt(0, -0.15 + root.position.y * 0.5, 0);

    if (hoverDirty) {
      hoverDirty = false;
      hoveredPiece = null;
      if (hovering && progress > 0.6 && scroll < 0.4) {
        raycaster.setFromCamera(hoverNdc, camera);
        const hit = raycaster.intersectObjects([darkMesh, accentMesh], false)[0];
        if (hit && hit.instanceId !== undefined) {
          hoveredPiece = (hit.object === accentMesh ? accentPieces : darkPieces)[hit.instanceId] ?? null;
        }
      }
      canvas.style.cursor = hoveredPiece ? "pointer" : "";
    }

    cursorLight.position.set(pointer.x * 4.2, -pointer.y * 3 + 0.6, 3.6);
    pointerWorld.set(pointer.x * 3.2, -pointer.y * 2.2, 0);

    if (!degraded) {
      const dust = dustGeometry.attributes.position as BufferAttribute;
      for (let i = 0; i < dustCount; i++) {
        let y = dust.getY(i) + dustSpeed[i] * (delta / 1000);
        if (y > 3.5) y = -3.5;
        dust.setY(i, y);
      }
      dust.needsUpdate = true;
    }

    render(now);
  }

  function start() {
    if (running || disposed || reducedMotion) return;
    running = true;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frame);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Em telas estreitas a estrutura recua para caber inteira.
    camera.position.z = (compact ? 11.5 : 10.2) * Math.max(1, 1.1 / camera.aspect);
    camera.updateProjectionMatrix();
    if (!running) {
      emitStage(stageFor(progress));
      render(performance.now());
    }
  }

  resize();
  if (reducedMotion) {
    structure.rotation.set(0.32, 0.62, 0);
    render(performance.now());
  }

  return {
    setPointer(x, y) {
      pointer.tx = MathUtils.clamp(x, -1, 1);
      pointer.ty = MathUtils.clamp(y, -1, 1);
      pointer.active = true;
    },
    setScroll(value) {
      scrollTarget = clamp01(value);
    },
    setActive(active) {
      if (active) start();
      else stop();
    },
    setHover(x, y = 0) {
      if (reducedMotion) return;
      hovering = x !== null;
      if (x !== null) hoverNdc.set(x, y);
      hoverDirty = true;
    },
    pulse() {
      if (reducedMotion) return;
      rippleOrigin = hoveredPiece ? hoveredPiece.target.clone() : new Vector3();
      rippleStart = performance.now();
    },
    resize,
    dispose() {
      disposed = true;
      stop();
      cubeGeometry.dispose();
      darkMaterial.dispose();
      accentMaterial.dispose();
      darkMesh.dispose();
      accentMesh.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      haloTexture.dispose();
      haloMaterial.dispose();
      halo.geometry.dispose();
      cageGeometry.dispose();
      cageMaterial.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
      packetGeometry.dispose();
      packetMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      floorTexture.dispose();
      floorMaterial.dispose();
      floor.geometry.dispose();
      environment.dispose();
      coreShadowMaterial.dispose();
      coreShadow.geometry.dispose();
      if (coreMesh) {
        coreMesh.geometry.dispose();
        coreMesh.material.map?.dispose();
        coreMesh.material.dispose();
      }
      renderer.dispose();
    },
  };
}
