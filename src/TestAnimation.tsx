import * as THREE from "three";
import { useEffect, useRef } from "react";

function HeartbeatLine() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-2, 2, 1, -1, 0.1, 10);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Line geometry (straight line baseline)
    const segments = 200;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < segments; i++) {
      points.push(new THREE.Vector3(i * 0.02 - 2, 0, 0));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x000000, // black line
      linewidth: 2,
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    let t = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < segments; i++) {
        const x = i * 0.02 - 2;

        // phase shift so line scrolls left to right
        const phase = (i + Math.floor(t * 60)) % segments;

        let y = 0;
        if (phase === 100) y = 0.3;   // small bump
        else if (phase === 101) y = 1; // main spike
        else if (phase === 102) y = -0.4; // quick drop

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = 0;
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);

      t += 0.02;
    };
    animate();

    return () => {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "150px",
        height: "80px",
        margin: "0 auto",
      }}
    />
  );
}

export default HeartbeatLine;
