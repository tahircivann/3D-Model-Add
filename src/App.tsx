import { useRef, useState } from 'react';
import { Canvas as R3FCanvas } from '@react-three/fiber';
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";
import { EffectComposer, N8AO, SMAA } from '@react-three/postprocessing';
import { useFrame, useThree,extend } from '@react-three/fiber';
import * as leva from 'leva';
import { GLTF } from 'three-stdlib';
import { useDrag } from '@use-gesture/react';
import styled from 'styled-components';

type ModelProps ={
  models: GLTF[];
}
const Model = ({ model, position, setPosition, modelControl }: { model: string; position: number[]; setPosition: (pos: number[]) => void; modelControl: any }) => {
  const { scene } = useLoader(GLTFLoader, model);
  const bind = useDrag(({ offset: [x, y] }) => setPosition([x / 100, 0, y / 100]));

  return <primitive {...bind()} object={scene} position={[modelControl.x, modelControl.y, modelControl.z]} />;
};
declare global {
  interface Performance {
    memory?: any;
  }
}
function PerformanceLogger({ models, loadtime }: { models: ModelProps['models'], loadtime: number }) {

  const { gl } = useThree();
  gl.info.autoReset = false;

  const previousTime = useRef(performance.now());
  const frameCount = useRef(0);

  useFrame(() => {
    const currentTime = performance.now();
    frameCount.current += 1;
    const rendererInfo = gl.info;


    if (currentTime > previousTime.current + 1000) { // One second has passed since last update
      const memory = performance.memory ? (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) : "N/A"; // Memory used by JS objects in MB, if available

      const log = {
        FPS: frameCount.current,
        drawcalls: { // Add drawcalls to the log
          total: rendererInfo.render.calls,
          triangles: rendererInfo.render.triangles
        },
        memory: memory + " MB",
        loadtime: loadtime.toFixed(3) + "s"  // Add loadtime to the log
      };

      console.log(log);
      frameCount.current = 0; // Reset the frame counter
      previousTime.current = currentTime; // Update the last time value
    }
    gl.info.reset();
  });

  return null;
}

export default function App() {
  const [models, setModels] = useState<string[]>([]);
  const [positions, setPositions] = useState<Array<Array<number>>>([]);

  const addModel = () => {
    setModels((current) => [...current, "./scan.gltf"]);
    setPositions((current) => [...current, [0, 0, 0]]);
  };

  const removeModel = (index: number) => {
    setModels((current) => {
      const updatedModels = [...current];
      updatedModels.splice(index, 1);
      return updatedModels;
    });
    setPositions((current) => {
      const updatedPositions = [...current];
      updatedPositions.splice(index, 1);
      return updatedPositions;
    });
  };

  const config = leva.useControls('AO Controls', {
    intensity: { value: 5, min: 0, max: 20 },
    color: '#7d7d7d',
    aoRadius: { value: 2, min: 0, max: 10 },
    aoSamples: { value: 6, min: 1, max: 64, step: 1 },
    denoiseSamples: { value: 4, min: 1, max: 12, step: 1 },
    denoiseRadius: { value: 12, min: 1, max: 12, step: 1 },
    distanceFalloff: { value: 1.0, min: 0, max: 10 },
  });
  const modelControl = leva.useControls('Model Controls', {
    x: { value: 0, min: -10, max: 10 },
    y: { value: 0, min: -10, max: 10 },
    z: { value: 0, min: -10, max: 10 },
  });

  const StyledButton = styled.button`
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const StyledRemoveButton = styled.button<{ index: number }>`
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  top: ${(props: { index: number; }) => props.index * 40 + 10}px;
  left: 100px;
`;


  return (
    <div className="App">
      <StyledButton onClick={addModel}>Add Model</StyledButton>
      <R3FCanvas style={{ height: "100vh" }} camera={{ position: [10, 5, 5] }}>
        <EffectComposer disableNormalPass multisampling={0}>
            <N8AO {...config} />
            <SMAA />
        </EffectComposer>
        <Suspense fallback={null}>
          <pointLight position={[10, 10, 10]} />
          {models.map((model, i) => (
                 <Model
                 key={i}
                 model={model}
                 position={positions[i]}
                 setPosition={(pos: number[]) => setPositions((current) => current.map((c, ci) => (ci === i ? pos : c)))}
                 modelControl={modelControl}
               />       ))}
          <gridHelper args={[100, 100]} />
          <axesHelper args={[5]} />
          <OrbitControls />
          <Environment preset="warehouse" />
        </Suspense>
        <PerformanceLogger models={[]} loadtime={0} />
      </R3FCanvas>
      {models.map((_, i) => (
        <StyledRemoveButton
          key={i}
          onClick={() => removeModel(i)}
          index={i}
        >
          Remove Model {i + 1}
        </StyledRemoveButton>
      ))}
    </div>
  );
}