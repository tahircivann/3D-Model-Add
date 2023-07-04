
Site is live at https://tahircivann.github.io/3D-Model-Add/

Code Documentation
The code you provided is a React component that renders a 3D scene using the @react-three/fiber library. It allows you to add and remove 3D models to the scene and provides performance logging functionality.
![image](https://github.com/tahircivann/3D-Model-Add/assets/69795597/8f3ea6c4-30ab-4279-8bac-ab57c6822b73)

Dependencies
The code relies on several external dependencies, which need to be installed for the code to work properly:

react: React library for building user interfaces.
react-dom: React library for rendering components to the DOM.
@react-three/fiber: A React renderer for Three.js, used to create and manipulate 3D scenes.
@react-three/drei: A collection of useful helpers and abstractions for @react-three/fiber.
three: JavaScript 3D library (required by @react-three/fiber and other dependencies).
styled-components: Library for styling React components using CSS-in-JS.
leva: A library for creating interactive controls for tweaking values in your React components.
@use-gesture/react: A library for handling gestures in React components.
three-stdlib: A collection of utility functions and classes for Three.js.
Make sure to install these dependencies before running the code.

Component Structure
The code defines a React functional component named App, which represents the main entry point for the application. It renders a 3D scene using the R3FCanvas component from @react-three/fiber.

State
The component uses React's useState hook to manage the state of the application. It maintains two arrays in the state: models and positions. The models array stores the paths to the 3D models to be rendered, while the positions array stores the positions of each model in the scene.

Adding and Removing Models
The addModel function is called when the "Add Model" button is clicked. It adds a new model path to the models array and initializes its position to [0, 0, 0] in the positions array.

The removeModel function is called when one of the "Remove Model" buttons is clicked. It removes the corresponding model path and position from the models and positions arrays.

Rendering Models
The models.map function is used to render each model in the scene. It iterates over the models array and creates a Model component for each model. The Model component loads the 3D model using the GLTFLoader from Three.js and renders it as a primitive in the scene.

Performance Logging
The PerformanceLogger component is used to log performance information about the rendering. It uses the useFrame hook from @react-three/fiber to update the performance metrics every second. It logs information such as frames per second (FPS), drawcalls, memory usage, and load time.

User Interface
The component renders an "Add Model" button that triggers the addModel function when clicked. It also renders a list of "Remove Model" buttons for each model, allowing users to remove specific models from the scene.

Styling
The code uses the styled-components library to apply custom styles to the buttons. It defines two styled components: StyledButton and StyledRemoveButton. These components define the styles for the "Add Model" button and "Remove Model" buttons, respectively.

Leva Controls
The code uses the leva library to create interactive controls for adjusting the ambient occlusion (AO) settings and model positions. The config object defines controls for AO intensity, color, radius, samples
