import {Canvas, Artboard} from 'visual-editor';

const testData = {
  john: {
    name: 'John Doe',
    userid: 'planejoedoe@gmail.com',
  },

  blake: {
    name: 'Blake Wilcox',
    userid: 'blacox@hotmail.net',
  },
};

const Storyboard = () => (
  <Canvas>
    <Comment x={0} y={333} width={100}>
      Let's compare how this page looks with different users. I'm not sure if
      it's going to work great with the scroll we've been doing!
    </Comment>
    <Artboard x={123} y={333} width={232} x-canvas-name="User Page with John">
      <App user={testData.john} />
    </Artboard>
    <Artboard x={123} y={633} width={232} x-canvas-name="User Page with Brake">
      <App user={testData.blake} />
    </Artboard>
  </Canvas>
);
