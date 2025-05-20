import fluidCSS from "@jeff-aporta/fluidcss";
import { useLayoutEffect } from "react";

const PUBLIC_URL = process.env.PUBLIC_URL;

var THREE = window["THREE"];

let size = {
  width: window.innerWidth,
  height: window.innerHeight - 50,
};

async function loadShaderFile(url) {
  const response = await fetch(`${PUBLIC_URL}/${url}`);
  return await response.text();
}

function parseShader(source) {
  const [vertexShader, fragmentShader] = source
    .replace("// --- VERTEX SHADER ---", "")
    .split("// --- FRAGMENT SHADER ---");

  return { vertexShader, fragmentShader };
}

async function init() {
  let shaderSource = await loadShaderFile(urlShader_);
  const { vertexShader, fragmentShader } = parseShader(shaderSource);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( size.width, size.height);
  Object.assign(document.querySelector(".three-js").style, {
    height: size.height + "px",
  });
  const element = document.querySelector(".three-js");
  element.appendChild(renderer.domElement);

  const uniforms = {
    iTime: { value: 0.0 },
    iResolution: {
      value: new THREE.Vector2(Math.max(900, size.width), size.height),
    },
    iMouse: { value: new THREE.Vector4(0.0, 0.0, 0.0, 0.0) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  window.addEventListener("resize", () => {
    const width = document.documentElement.scrollWidth;
    const height = document.documentElement.scrollHeight - 50;
    Object.assign(size, {
      width,
      height,
    });
    Object.assign(document.querySelector(".three-js").style, {
      height: size.height + "px",
    });
    renderer.setSize(size.width, size.height);
    material.uniforms.iResolution.value.set(Math.max(900, size.width), size.height);
  });

  window.addEventListener("mousemove", (event) => {
    uniforms.iMouse.value.x = event.clientX;
    uniforms.iMouse.value.y = event.clientY;
  });

  window.addEventListener("mousedown", () => {
    uniforms.iMouse.value.z = 1.0;
  });

  window.addEventListener("mouseup", () => {
    uniforms.iMouse.value.z = 0.0;
  });

  function animate() {
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 50);
    uniforms.iTime.value = performance.now() / 1000;
    renderer.render(scene, camera);
  }

  animate();
}

function waitToThree() {
  const element = document.querySelector(".three-js");
  if (!window["THREE"]) {
    return setTimeout(waitToThree);
  }
  if(!element || !urlShader_){
    return;
  }
  size = {
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight - 50,
  };
  Object.assign(element.style, {
    height: size.height + "px",
  });
  init();
}

let urlShader_;

function ThreeBackground({urlShader}) {
  urlShader_ = urlShader;

  useLayoutEffect(() => {
    waitToThree();
  }, []);

  if (!urlShader){
    return <></>;
  }

  return (
    <div
      className={fluidCSS()
        .btwX(550, 800, {
          opacity: ["0.5", "0.6", "1"],
        })
        .end()}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: -1,
        pointerEvents: "none",
        userSelect: "none",
        overflow: "hidden",
        mixBlendMode: "soft-light",
      }}
    >
      <div className="three-js" style={{opacity: "0.4"}}></div>
    </div>
  );
}

export { ThreeBackground };
