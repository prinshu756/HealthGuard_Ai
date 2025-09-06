import * as THREE from "three";
import { useEffect, useRef } from "react";
// import GUI from "lil-gui";

const Globe_Animation = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Sphere geometry with wireframe material
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.005; // slow rotation
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const resize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(mountRef.current);
    resize();

    return () => {
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "150px",
        height: "150px",
        margin: "0 auto",
      }}
    />
  );
};

const Heart_Animation = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Heart shape
    const heartShape = new THREE.Shape();
    heartShape.moveTo(5, 5);
    heartShape.bezierCurveTo(5, 5, 4, 0, 0, 0);
    heartShape.bezierCurveTo(-6, 0, -6, 7, -6, 7);
    heartShape.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
    heartShape.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
    heartShape.bezierCurveTo(16, 7, 16, 0, 10, 0);
    heartShape.bezierCurveTo(7, 0, 5, 5, 5, 5);

    const geometry = new THREE.ExtrudeGeometry(heartShape, {
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 0.3,
      bevelSize: 0.3,
      bevelSegments: 2,
    });
    geometry.center();

    // Material
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 100,
      specular: 0xffffff,
    });

    const heart = new THREE.Mesh(geometry, material);
    heart.scale.set(0.05, 0.05, 0.05);

    // Upright orientation
    heart.rotation.z = Math.PI;
    scene.add(heart);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 🔧 lil-gui (hidden in UI but useful for dev)
    // const gui = new GUI({ autoPlace: false }); // don't inject into DOM
    const settings = {
      color: "#ff0000",
      rotationSpeed: 0.01,
      beating: true,
      beatIntensity: 0.005,
      scale: 0.05,
    };

    // Apply settings (acts like optimization, no visible controls)
    material.color.set(settings.color);

    // Clock for beating
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      heart.rotation.y += settings.rotationSpeed;

      if (settings.beating) {
        const t = clock.getElapsedTime();
        const scale = settings.scale + Math.sin(t * 3) * settings.beatIntensity;
        heart.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handling
    const resize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(mountRef.current);
    resize();

    return () => {
      ro.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      // gui.destroy();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100px",
        height: "100px",
        margin: "0 auto",
      }}
    />
  );
};

// const HeartbeatIcon = () => {
//   const mountRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!mountRef.current) return;

//     // Scene + Camera
//     const scene = new THREE.Scene();
//     const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 10);
//     camera.position.z = 5;

//     // Renderer
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     mountRef.current.appendChild(renderer.domElement);

//     // Heartbeat line geometry
//     const points: THREE.Vector3[] = [];
//     const segments = 200;
//     for (let i = 0; i < segments; i++) {
//       points.push(new THREE.Vector3(i * 0.02, 0, 0));
//     }

//     const geometry = new THREE.BufferGeometry().setFromPoints(points);
//     const material = new THREE.LineBasicMaterial({
//       color: "red",
//       linewidth: 2,
//     });

//     const line = new THREE.Line(geometry, material);
//     line.position.x = -2; // Center nicely
//     scene.add(line);

//     let t = 0;

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);

//       const positions = geometry.attributes.position.array as Float32Array;
//       for (let i = 0; i < segments; i++) {
//         const x = i * 0.02 - 2;
//         let y = 0;

//         // Create ECG spike every cycle
//         const phase = (i + t * 30) % 100;
//         if (phase > 45 && phase < 55) {
//           y = phase === 50 ? 1.2 : 0.4; // sudden spike up
//         }

//         positions[i * 3] = x;
//         positions[i * 3 + 1] = y;
//         positions[i * 3 + 2] = 0;
//       }

//       geometry.attributes.position.needsUpdate = true;

//       renderer.render(scene, camera);
//       t += 0.02;
//     };
//     animate();
//     camera.lookAt(line.position);

//     // Resize
//     const resize = () => {
//       if (!mountRef.current) return;
//       const { clientWidth, clientHeight } = mountRef.current;
//       renderer.setSize(clientWidth, clientHeight);
//     };
//     const ro = new ResizeObserver(resize);
//     ro.observe(mountRef.current);
//     resize();

//     return () => {
//       ro.disconnect();
//       renderer.dispose();
//       geometry.dispose();
//       material.dispose();
//       if (renderer.domElement.parentNode) {
//         renderer.domElement.removeChild(renderer.domElement);
//       }
//     };
//   }, []);

//   return (
//     <div
//       ref={mountRef}
//       style={{
//         width: "80px",
//         height: "80px",
//         margin: "0 auto",
//         background: "linear-gradient(135deg, #4facfe, #00f2fe)",
//         borderRadius: "20px",
//       }}
//     />
//   );
// };

export {  Globe_Animation, Heart_Animation };
